import { RiskBadge } from '../../../components/RiskBadge/RiskBadge'
import type { Asset } from '../../../types/asset'
import { RootCauseItem } from './RootCauseItem'

/**
 * Right-side diagnostic report panel.
 * Currently static content + mock confidence, later fed by backend explainability outputs.
 */
export function DiagnosticPanel({ asset }: { asset: Asset }) {
  const dotClassName =
    asset.status === 'critical'
      ? 'bg-red-500'
      : asset.status === 'warning'
        ? 'bg-amber-500'
        : 'bg-slate-300'

  return (
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
            <RootCauseItem
              dotClassName={dotClassName}
              title="Vibration Spike:"
              description="Exceeded safety threshold of 6.0mm/s for >30 minutes."
            />
            <RootCauseItem
              dotClassName={dotClassName}
              title="Thermal Gradient:"
              description="Rapid heating detected in bearing housing #2."
            />
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
  )
}


