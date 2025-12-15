import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { useWorkflow } from '../../stores/WorkflowContext'
import type { Asset } from '../../types/asset'
import { AssetsHeaderControls } from './assets/AssetsHeaderControls'
import { AssetsTable } from './assets/AssetsTable'

export function Assets() {
  const navigate = useNavigate()
  const { assets, workflowStep, setSelectedAsset, refreshAssets } = useWorkflow()

  // Guard the route until the dashboard workflow has produced an assessment.
  if (workflowStep < 3) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Fleet Overview</h2>
        <p className="text-slate-500 text-sm mt-1">
          Run the workflow first to generate an assessment.
        </p>
        <div className="mt-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const handleSelectAsset = (asset: Asset) => {
    // We store selectedAsset in context to make the transition feel instant,
    // but the detail page is still URL-driven via `/assets/:id`.
    setSelectedAsset(asset)
    navigate(`/assets/${asset.id}`)
  }

  // On first render after assessments exist, refresh from server to ensure
  // the table reflects the latest persisted predictions.
  useEffect(() => {
    if (workflowStep >= 3) {
      void refreshAssets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowStep])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AssetsHeaderControls />
      <AssetsTable assets={assets} onSelectAsset={handleSelectAsset} />
    </div>
  )
}

