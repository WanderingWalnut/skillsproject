import { Filter, Search, Settings } from 'lucide-react'

/**
 * Header controls for the Fleet Overview page.
 * Search/filter are currently UI-only for the MVP (no data source yet).
 */
export function AssetsHeaderControls() {
  return (
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
  )
}


