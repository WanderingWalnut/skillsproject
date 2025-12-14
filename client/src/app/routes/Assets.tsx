import { Filter, Search, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { RiskBadge } from '../../components/RiskBadge/RiskBadge'
import { useWorkflow } from '../../stores/WorkflowContext'

export function Assets() {
  const navigate = useNavigate()
  const { assets, workflowStep, setSelectedAsset } = useWorkflow()

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fleet Overview</h2>
          <p className="text-slate-500 text-sm">Last updated: Just now</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600" type="button">
            <Filter size={20} />
          </button>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600" type="button">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Asset ID</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Temperature</th>
                <th className="px-6 py-4">Vibration</th>
                <th className="px-6 py-4">Prediction</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset)
                    navigate(`/assets/${asset.id}`)
                  }}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{asset.id}</div>
                    <div className="text-xs text-slate-500">{asset.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{asset.temp.toFixed(1)}°C</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{asset.vibration.toFixed(2)} mm/s</td>
                  <td className="px-6 py-4 max-w-xs truncate text-sm text-slate-600">{asset.prediction}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                      tabIndex={-1}
                    >
                      View Details &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


