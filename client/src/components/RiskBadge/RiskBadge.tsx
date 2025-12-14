import { RISK_BADGE_LABELS, RISK_BADGE_STYLES, RISK_DOT_STYLES } from '../../config/constants'
import type { RiskStatus } from '../../types/asset'

export function RiskBadge({ status }: { status: RiskStatus }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-xs font-semibold border ring-1 ${RISK_BADGE_STYLES[status]} flex items-center gap-1.5 w-fit`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${RISK_DOT_STYLES[status]}`} />
      {RISK_BADGE_LABELS[status]}
    </span>
  )
}


