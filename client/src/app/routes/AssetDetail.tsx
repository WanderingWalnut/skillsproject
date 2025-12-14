import { Activity, ArrowLeft, BarChart2, Clock, Zap } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { VibrationChart } from '../../components/Chart/VibrationChart'
import { MetricCard } from '../../components/MetricCard/MetricCard'
import { RiskBadge } from '../../components/RiskBadge/RiskBadge'
import { generateMockChartData } from '../../lib/mockData'
import { useWorkflow } from '../../stores/WorkflowContext'

export function AssetDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { assets, selectedAsset, setSelectedAsset, workflowStep } = useWorkflow()

  const asset = useMemo(() => {
    if (!id) return null
    return assets.find((a) => a.id === id) ?? (selectedAsset?.id === id ? selectedAsset : null)
  }, [assets, id, selectedAsset])

  useEffect(() => {
    if (asset && selectedAsset?.id !== asset.id) {
      setSelectedAsset(asset)
    }
  }, [asset, selectedAsset, setSelectedAsset])

  const chartData = useMemo(() => generateMockChartData(), [])

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
  const isWarning = asset.status === 'warning'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/assets')}
          className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-slate-900"
          type="button"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {asset.name}
            <span className="text-slate-400 font-normal text-lg">#{asset.id}</span>
          </h1>
        </div>

        <div className="ml-auto flex gap-3">
          <button
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            type="button"
          >
            Download Report
          </button>
          <button
            className={`px-4 py-2 text-white font-medium rounded-lg transition-colors shadow-sm ${
              isCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'
            }`}
            type="button"
          >
            {asset.action}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" />
                Real-time Vibration Analysis
              </h3>

              <div className="flex gap-2">
                {['1H', '24H', '7D'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 text-xs font-medium rounded-md ${
                      period === '24H' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                    type="button"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <VibrationChart data={chartData} isCritical={isCritical} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Temperature" value={`${asset.temp.toFixed(1)}°C`} Icon={Zap} />
            <MetricCard label="Efficiency" value={`${asset.efficiency.toFixed(1)}%`} Icon={BarChart2} />
            <MetricCard label="Runtime" value="412 Hrs" Icon={Clock} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Diagnostic Report</h3>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</span>
              <div className="mt-2">
                <RiskBadge status={asset.status} />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Root Cause Analysis</span>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  />
                  <p className="text-slate-700">
                    <span className="font-semibold">Vibration Spike:</span> Exceeded safety threshold of 6.0mm/s for
                    &gt;30 minutes.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  />
                  <p className="text-slate-700">
                    <span className="font-semibold">Thermal Gradient:</span> Rapid heating detected in bearing housing
                    #2.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommendation</span>
              <p className="mt-2 text-lg font-medium text-slate-900 leading-snug">{asset.action} within next 48 hours.</p>
              <p className="mt-1 text-sm text-slate-500">
                Model confidence: <span className="text-slate-900 font-semibold">98.4%</span>
              </p>
            </div>

            <button
              className="w-full py-2.5 bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-sm"
              type="button"
            >
              Ignore Alert (Log Reason)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


