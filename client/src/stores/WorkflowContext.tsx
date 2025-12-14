import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { generateMockAssets } from '../lib/mockData'
import type { Asset, WorkflowStep } from '../types/asset'

export interface WorkflowContextType {
  workflowStep: WorkflowStep
  setWorkflowStep: (step: WorkflowStep) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
  selectedAsset: Asset | null
  setSelectedAsset: (asset: Asset | null) => void
  handleWorkflowAction: (nextStep: WorkflowStep) => void
  resetWorkflow: () => void
}

const WorkflowContext = createContext<WorkflowContextType | null>(null)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const pendingTimeoutRef = useRef<number | null>(null)

  const handleWorkflowAction = useCallback(
    (nextStep: WorkflowStep) => {
      setIsProcessing(true)

      if (pendingTimeoutRef.current !== null) {
        window.clearTimeout(pendingTimeoutRef.current)
      }

      pendingTimeoutRef.current = window.setTimeout(() => {
        setIsProcessing(false)
        setWorkflowStep(nextStep)

        if (nextStep === 3) {
          setAssets((prev) => (prev.length > 0 ? prev : generateMockAssets()))
        }
      }, 1500)
    },
    [setAssets],
  )

  const resetWorkflow = useCallback(() => {
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current)
      pendingTimeoutRef.current = null
    }

    setIsProcessing(false)
    setWorkflowStep(0)
    setAssets([])
    setSelectedAsset(null)
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
    }),
    [
      workflowStep,
      isProcessing,
      assets,
      selectedAsset,
      handleWorkflowAction,
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


