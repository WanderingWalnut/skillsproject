import type { Asset } from '../../../types/asset'

/**
 * Header area for the Asset Detail page.
 * The route owns navigation; this component stays presentational (title + actions).
 */
export function AssetDetailHeader({
  asset,
  onPrimaryAction,
}: {
  asset: Asset
  onPrimaryAction: () => void
}) {
  const isCritical = asset.status === 'critical'

  return (
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
        {asset.name}
        <span className="text-slate-400 font-normal text-lg">#{asset.id}</span>
      </h1>

      <div className="ml-auto flex gap-3">
        <button
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          type="button"
        >
          Download Report
        </button>
        <button
          onClick={onPrimaryAction}
          className={`px-4 py-2 text-white font-medium rounded-lg transition-colors shadow-sm ${
            isCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'
          }`}
          type="button"
        >
          {asset.action}
        </button>
      </div>
    </div>
  )
}


