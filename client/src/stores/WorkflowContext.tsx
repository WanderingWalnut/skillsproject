import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { predictRisk, trainModel } from '../lib/api'
import type { Asset, WorkflowStep } from '../types/asset'
import type { AssetAssessment, PredictResponse, TrainResponse } from '../types/api'

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
      setAssets(result.assessments.map(mapAssessmentToAsset))
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
