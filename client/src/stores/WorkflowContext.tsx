import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { API_BASE_URL } from '../config/constants'
import { generateMockAssets } from '../lib/mockData'
import type { Asset, WorkflowStep } from '../types/asset'
import type { TrainResponse } from '../types/api'

export interface WorkflowContextType {
  workflowStep: WorkflowStep
  setWorkflowStep: (step: WorkflowStep) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
  selectedAsset: Asset | null
  setSelectedAsset: (asset: Asset | null) => void
  handleWorkflowAction: (nextStep: WorkflowStep) => Promise<void>
  resetWorkflow: () => void
  modelId: string | null
  trainResult: TrainResponse | null
  uploadedFile: File | null
  setUploadedFile: (file: File | null) => void
}

const WorkflowContext = createContext<WorkflowContextType | null>(null)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [modelId, setModelId] = useState<string | null>(null)
  const [trainResult, setTrainResult] = useState<TrainResponse | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleWorkflowAction = useCallback(
    async (nextStep: WorkflowStep) => {
      setIsProcessing(true)

      try {
        // Step 0 → 1: File has been selected, advance to training step
        if (nextStep === 1) {
          setWorkflowStep(nextStep)
        }

        // Step 1 → 2: Train the ML model with uploaded file
        if (nextStep === 2) {
          let fileToUpload: File

          if (uploadedFile) {
            // Use the user-uploaded file
            fileToUpload = uploadedFile
          } else {
            // Fallback: fetch sample CSV from public folder
            const csvResponse = await fetch('/sample_maintenance_data.csv')
            const csvBlob = await csvResponse.blob()
            fileToUpload = new File([csvBlob], 'sample_maintenance_data.csv', {
              type: 'text/csv',
            })
          }

          // Upload to training endpoint
          const formData = new FormData()
          formData.append('file', fileToUpload)

          const response = await fetch(`${API_BASE_URL}/train`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Training failed')
          }

          const result: TrainResponse = await response.json()
          setModelId(result.model_id)
          setTrainResult(result)
          setWorkflowStep(nextStep)
        }

        // Step 2 → 3: Assess fleet risk (uses mock data for MVP until predict endpoint is ready)
        if (nextStep === 3) {
          // TODO: Replace with real /predict API call when endpoint is implemented
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setAssets((prev) => (prev.length > 0 ? prev : generateMockAssets()))
          setWorkflowStep(nextStep)
        }
      } catch (error) {
        console.error('Workflow action failed:', error)
        // TODO: Add proper error state/toast for user feedback
      } finally {
        setIsProcessing(false)
      }
    },
    [uploadedFile, setAssets],
  )

  const resetWorkflow = useCallback(() => {
    // Used by the Navbar logo click + Reset button to return to a clean demo state.
    setIsProcessing(false)
    setWorkflowStep(0)
    setAssets([])
    setSelectedAsset(null)
    setModelId(null)
    setTrainResult(null)
    setUploadedFile(null)
  }, [])

  const value = useMemo<WorkflowContextType>(
    () => ({
      workflowStep,
      setWorkflowStep,
      isProcessing,
      setIsProcessing,
      assets,
      setAssets,
      selectedAsset,
      setSelectedAsset,
      handleWorkflowAction,
      resetWorkflow,
      modelId,
      trainResult,
      uploadedFile,
      setUploadedFile,
    }),
    [
      workflowStep,
      isProcessing,
      assets,
      selectedAsset,
      handleWorkflowAction,
      resetWorkflow,
      modelId,
      trainResult,
      uploadedFile,
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


