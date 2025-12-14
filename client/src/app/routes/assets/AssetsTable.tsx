import { RiskBadge } from '../../../components/RiskBadge/RiskBadge'
import type { Asset } from '../../../types/asset'

/**
 * Fleet overview table.
 * Emits click events upward so the route can decide navigation + state updates.
 */
export function AssetsTable({
  assets,
  onSelectAsset,
}: {
  assets: Asset[]
  onSelectAsset: (asset: Asset) => void
}) {
  return (
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
                onClick={() => onSelectAsset(asset)}
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
  )
}


