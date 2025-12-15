import { ArrowLeft, BarChart2, Clock, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { RiskHistoryChart } from '../../components/Chart/RiskHistoryChart'
import { MetricCard } from '../../components/MetricCard/MetricCard'
import { fetchAssetDetail } from '../../lib/api'
import type { AssetDetailResponse, RiskLevel } from '../../types/api'
import type { RiskHistoryPoint } from '../../types/chart'
import { useWorkflow } from '../../stores/WorkflowContext'
import { AssetDetailHeader } from './assetDetail/AssetDetailHeader'
import { DiagnosticPanel } from './assetDetail/DiagnosticPanel'

export function AssetDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { assets, selectedAsset, setSelectedAsset, workflowStep } = useWorkflow()

  const asset = useMemo(() => {
    if (!id) return null
    return assets.find((a) => a.id === id) ?? (selectedAsset?.id === id ? selectedAsset : null)
  }, [assets, id, selectedAsset])

  useEffect(() => {
    // Keep context in sync with URL-based navigation so other pages (and future widgets)
    // can read the currently selected asset without refetching.
    if (asset && selectedAsset?.id !== asset.id) {
      setSelectedAsset(asset)
    }
  }, [asset, selectedAsset, setSelectedAsset])

  const [detail, setDetail] = useState<AssetDetailResponse | null>(null)

  useEffect(() => {
    let cancelled = false
    if (asset) {
      fetchAssetDetail(asset.id)
        .then((d) => {
          if (!cancelled) setDetail(d)
        })
        .catch((e) => {
          console.error('Failed to load asset detail:', e)
        })
    }
    return () => {
      cancelled = true
    }
  }, [asset])

  // Build chart data from prediction history showing failure probability percentage
  const riskHistoryData = useMemo((): RiskHistoryPoint[] => {
    const hist = detail?.history ?? []
    if (!hist.length) return []
    return hist.map((p) => ({
      time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      failureProbability: Math.round(p.failure_probability * 100),
      riskLevel: p.risk_level as RiskLevel,
    }))
  }, [detail?.history])

  if (workflowStep < 3) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Asset Detail</h2>
        <p className="text-slate-500 text-sm mt-1">Run the assessment first.</p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/assets"
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Go to Assets
          </Link>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Asset not found</h2>
        <p className="text-slate-500 text-sm mt-1">We couldn’t find an asset with id: {id}</p>
        <div className="mt-4">
          <Link
            to="/assets"
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Back to Fleet Overview
          </Link>
        </div>
      </div>
    )
  }

  const isCritical = asset.status === 'critical'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header is extracted to keep the route focused on routing + data orchestration */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/assets')}
          className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-slate-900"
          type="button"
          aria-label="Back to fleet overview"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <AssetDetailHeader
            asset={asset}
            onPrimaryAction={() => {
              // Placeholder action hook. Later: create work order, open modal, etc.
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-400" />
                Failure Risk Trend
              </h3>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-3 h-0.5 bg-amber-500" />
                  <span>Warning (50%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-3 h-0.5 bg-red-500" />
                  <span>Critical (80%)</span>
                </div>
              </div>
            </div>

            {riskHistoryData.length > 0 ? (
              <RiskHistoryChart data={riskHistoryData} isCritical={isCritical} />
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                <p>No prediction history available yet</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Temperature" value={`${(detail?.metrics?.temperature ?? asset.temp).toFixed(1)}°C`} Icon={Zap} />
            <MetricCard label="Efficiency" value={`${asset.efficiency.toFixed(1)}%`} Icon={BarChart2} />
            <MetricCard label="Runtime" value="412 Hrs" Icon={Clock} />
          </div>
        </div>

        <DiagnosticPanel asset={asset} />
      </div>
    </div>
  )
}

