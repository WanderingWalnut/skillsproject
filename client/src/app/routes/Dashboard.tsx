import { Activity, CheckCircle, ChevronRight, Cpu, FileText, UploadCloud, X, Zap } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useWorkflow } from '../../stores/WorkflowContext'
import { StepHeader } from './dashboard/StepHeader'
import { WorkflowStepCard } from './dashboard/WorkflowStepCard'

export function Dashboard() {
  const navigate = useNavigate()
  const { workflowStep, isProcessing, handleWorkflowAction, uploadedFile, setUploadedFile } = useWorkflow()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setUploadedFile(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUseSampleData = async () => {
    // Fetch sample CSV and set it as the uploaded file
    const csvResponse = await fetch('/sample_maintenance_data.csv')
    const csvBlob = await csvResponse.blob()
    const sampleFile = new File([csvBlob], 'sample_maintenance_data.csv', { type: 'text/csv' })
    setUploadedFile(sampleFile)
  }

  // The dashboard is intentionally "dumb": it orchestrates the 3-step UI and navigation,
  // while business state (step/progress/assets) lives in WorkflowContext.
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">AI Maintenance Predictor</h2>
        <p className="text-lg text-slate-500">Predict failures before they impact production.</p>
      </div>

      <div className="grid gap-6">
        <WorkflowStepCard variant={workflowStep >= 1 ? 'complete' : 'active'}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <StepHeader
                title="1. Upload Sensor Data"
                icon={
                  <div
                    className={`p-2 rounded-lg ${workflowStep >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {workflowStep >= 1 ? <CheckCircle size={24} /> : <UploadCloud size={24} />}
                  </div>
                }
              />

              <p className="text-slate-500 max-w-md">
                Import CSV or connect to historians. We'll automatically map sensor IDs to asset tags.
              </p>

              {workflowStep === 0 && (
                <div className="mt-4 space-y-4">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* File selection UI */}
                  {!uploadedFile ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleUploadClick}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        type="button"
                      >
                        <UploadCloud size={18} />
                        Choose CSV File
                      </button>
                      <button
                        onClick={handleUseSampleData}
                        disabled={isProcessing}
                        className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                        type="button"
                      >
                        <FileText size={18} />
                        Use Sample Dataset
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {/* Selected file display */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <FileText size={18} className="text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">{uploadedFile.name}</span>
                        <button
                          onClick={handleRemoveFile}
                          className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
                          type="button"
                        >
                          <X size={14} className="text-emerald-600" />
                        </button>
                      </div>

                      {/* Continue button */}
                      <button
                        onClick={() => handleWorkflowAction(1)}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        type="button"
                      >
                        {isProcessing ? 'Processing...' : 'Continue'}
                        {!isProcessing && <ChevronRight size={16} />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {workflowStep >= 1 && uploadedFile && (
                <div className="flex gap-6 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" /> {uploadedFile.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </WorkflowStepCard>

        <WorkflowStepCard isDisabled={workflowStep < 1} variant={workflowStep >= 2 ? 'complete' : 'active'}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <StepHeader
                title="2. Train Model"
                icon={
                  <div
                    className={`p-2 rounded-lg ${workflowStep >= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {workflowStep >= 2 ? <CheckCircle size={24} /> : <Cpu size={24} />}
                  </div>
                }
              />

              <p className="text-slate-500 max-w-md">
                Run the anomaly detection engine. This creates a baseline for normal operation.
              </p>

              {workflowStep === 1 && (
                <button
                  onClick={() => handleWorkflowAction(2)}
                  disabled={isProcessing}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-200"
                  type="button"
                >
                  {isProcessing ? 'Training Model...' : 'Train Anomaly Detector'}
                  {!isProcessing && <Zap size={16} />}
                </button>
              )}
            </div>
          </div>

          {isProcessing && workflowStep === 1 && (
            <div className="absolute bottom-0 left-0 h-1 bg-blue-600 animate-pulse w-full"></div>
          )}
        </WorkflowStepCard>

        <WorkflowStepCard isDisabled={workflowStep < 2} variant={workflowStep >= 3 ? 'complete' : 'active'}>
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <StepHeader
                title="3. Run Risk Assessment"
                icon={
                  <div
                    className={`p-2 rounded-lg ${workflowStep >= 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {workflowStep >= 3 ? <CheckCircle size={24} /> : <Activity size={24} />}
                  </div>
                }
              />

              <p className="text-slate-500 max-w-md">
                Compare recent telemetry against the trained model to identify deviations.
              </p>

              {workflowStep === 2 && (
                <button
                  onClick={() => handleWorkflowAction(3)}
                  disabled={isProcessing}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-200"
                  type="button"
                >
                  {isProcessing ? 'Analyzing...' : 'Run Assessment'}
                  {!isProcessing && <Activity size={16} />}
                </button>
              )}

              {workflowStep === 3 && (
                <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-900">Assessment Complete</p>
                    <p className="text-sm text-slate-500">2 Critical Risks Found</p>
                  </div>
                  <button
                    onClick={() => navigate('/assets')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
                    type="button"
                  >
                    View Assets
                  </button>
                </div>
              )}
            </div>
          </div>
        </WorkflowStepCard>
      </div>
    </div>
  )
}


