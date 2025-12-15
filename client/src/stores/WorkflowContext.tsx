import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { fetchAssets, predictRisk, trainModel } from '../lib/api'
import type { Asset, WorkflowStep } from '../types/asset'
import type { AssetAssessment, AssetsResponse, PredictResponse, TrainResponse } from '../types/api'

function actionForRisk(status: Asset['status']): string {
  switch (status) {
    case 'critical':
      return 'Urgent inspection recommended'
    case 'warning':
      return 'Schedule maintenance soon'
    case 'normal':
    default:
      return 'Continue monitoring'
  }
}

function mapAssessmentToAsset(a: AssetAssessment): Asset {
  const failurePct = Math.round(a.failure_probability * 100)
  return {
    id: a.asset_id,
    name: a.asset_id,
    status: a.risk_level,
    temp: a.temperature,
    vibration: a.vibration,
    efficiency: Math.max(0, Math.min(100, Math.round((1 - a.failure_probability) * 100))),
    lastReading: new Date(a.timestamp).toLocaleString(),
    prediction: `${failurePct}% failure probability`,
    action: actionForRisk(a.risk_level),
  }
}

/**
 * Deduplicate assets by id, keeping the entry with the most recent lastReading.
 * This ensures we only show one row per asset in the fleet overview.
 */
function deduplicateAssets(assets: Asset[]): Asset[] {
  const byId = new Map<string, Asset>()
  for (const asset of assets) {
    const existing = byId.get(asset.id)
    if (!existing) {
      byId.set(asset.id, asset)
    } else {
      // Keep the asset with the more recent lastReading
      const existingTime = new Date(existing.lastReading).getTime()
      const currentTime = new Date(asset.lastReading).getTime()
      if (currentTime > existingTime || isNaN(existingTime)) {
        byId.set(asset.id, asset)
      }
    }
  }
  return Array.from(byId.values())
}

export interface WorkflowContextType {
  // Workflow state
  workflowStep: WorkflowStep
  isProcessing: boolean
  uploadedFile: File | null
  modelId: string | null
  trainResult: TrainResponse | null
  assets: Asset[]
  selectedAsset: Asset | null

  // Actions
  setUploadedFile: (file: File | null) => void
  setSelectedAsset: (asset: Asset | null) => void
  advanceToStep: (step: WorkflowStep) => void
  runTraining: () => Promise<void>
  runAssessment: () => Promise<void>
  refreshAssets: () => Promise<void>
  resetWorkflow: () => void
}

const WorkflowContext = createContext<WorkflowContextType | null>(null)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [modelId, setModelId] = useState<string | null>(null)
  const [trainResult, setTrainResult] = useState<TrainResponse | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const advanceToStep = useCallback((step: WorkflowStep) => {
    setWorkflowStep(step)
  }, [])

  const runTraining = useCallback(async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    try {
      const result = await trainModel(uploadedFile)
      setModelId(result.model_id)
      setTrainResult(result)
      setWorkflowStep(2)
    } catch (error) {
      console.error('Training failed:', error)
      // TODO: Add error state for UI feedback
    } finally {
      setIsProcessing(false)
    }
  }, [uploadedFile])

  const runAssessment = useCallback(async () => {
    if (!uploadedFile || !modelId) return

    setIsProcessing(true)
    try {
      const result: PredictResponse = await predictRisk(uploadedFile, modelId)
      // Deduplicate to ensure one entry per asset with the latest reading
      const newAssets = deduplicateAssets(result.assessments.map(mapAssessmentToAsset))
      setAssets(newAssets)
      setWorkflowStep(3)
    } catch (error) {
      console.error('Assessment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [uploadedFile, modelId])

  const resetWorkflow = useCallback(() => {
    setIsProcessing(false)
    setWorkflowStep(0)
    setUploadedFile(null)
    setModelId(null)
    setTrainResult(null)
    setAssets([])
    setSelectedAsset(null)
  }, [])

  const refreshAssets = useCallback(async () => {
    try {
      const resp: AssetsResponse = await fetchAssets()
      // Merge server statuses into existing assets; create placeholders for new ones.
      setAssets((prev) => {
        const byId = new Map(prev.map((a) => [a.id, a]))
        const updated: Asset[] = []
        for (const s of resp.assets) {
          const existing = byId.get(s.asset_id)
          const failurePct = s.failure_probability != null ? Math.round(s.failure_probability * 100) : null
          if (existing) {
            const status = (s.risk_level ?? existing.status) as Asset['status']
            updated.push({
              ...existing,
              status,
              efficiency: s.failure_probability != null
                ? Math.max(0, Math.min(100, Math.round((1 - s.failure_probability) * 100)))
                : existing.efficiency,
              lastReading: s.timestamp ? new Date(s.timestamp).toLocaleString() : existing.lastReading,
              prediction: failurePct != null ? `${failurePct}% failure probability` : existing.prediction,
              action: s.risk_level ? actionForRisk(s.risk_level) : existing.action,
            })
          } else {
            // Placeholder temps when we only have risk summary; will be refined by detail route later.
            const status = (s.risk_level ?? 'normal') as Asset['status']
            updated.push({
              id: s.asset_id,
              name: s.asset_id,
              status,
              temp: 0,
              vibration: 0,
              efficiency: s.failure_probability != null
                ? Math.max(0, Math.min(100, Math.round((1 - s.failure_probability) * 100)))
                : 100,
              lastReading: s.timestamp ? new Date(s.timestamp).toLocaleString() : '—',
              prediction: failurePct != null ? `${failurePct}% failure probability` : 'No prediction yet',
              action: actionForRisk(status),
            })
          }
        }
        // Preserve any local-only assets not present on server
        const serverIds = new Set(resp.assets.map((s) => s.asset_id))
        for (const a of prev) {
          if (!serverIds.has(a.id)) updated.push(a)
        }
        // Deduplicate and sort to ensure one entry per asset
        return deduplicateAssets(updated).sort((a, b) => a.id.localeCompare(b.id))
      })
    } catch (err) {
      console.error('Failed to refresh assets:', err)
    }
  }, [])

  const value = useMemo<WorkflowContextType>(
    () => ({
      workflowStep,
      isProcessing,
      uploadedFile,
      modelId,
      trainResult,
      assets,
      selectedAsset,
      setUploadedFile,
      setSelectedAsset,
      advanceToStep,
      runTraining,
      runAssessment,
      refreshAssets,
      resetWorkflow,
    }),
    [
      workflowStep,
      isProcessing,
      uploadedFile,
      modelId,
      trainResult,
      assets,
      selectedAsset,
      advanceToStep,
      runTraining,
      runAssessment,
      refreshAssets,
      resetWorkflow,
    ],
  )

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow(): WorkflowContextType {
  const ctx = useContext(WorkflowContext)
  if (!ctx) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return ctx
}
