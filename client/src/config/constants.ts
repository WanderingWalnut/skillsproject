import type { RiskStatus } from '../types/asset'

export const API_BASE_URL = 'http://localhost:8000/api/v1'

export const VIBRATION_THRESHOLD = 6.0

export const RISK_BADGE_LABELS: Record<RiskStatus, string> = {
  critical: 'High Risk',
  warning: 'Attention',
  normal: 'Normal',
}

export const RISK_BADGE_STYLES: Record<RiskStatus, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200 ring-red-500/20',
  warning: 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/20',
  normal: 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/20',
}

export const RISK_DOT_STYLES: Record<RiskStatus, string> = {
  critical: 'bg-red-600',
  warning: 'bg-amber-600',
  normal: 'bg-emerald-600',
}

export const CHART_COLORS = {
  critical: '#ef4444', // red-500
  primary: '#3b82f6', // blue-500
  muted: '#94a3b8', // slate-400
  grid: '#f1f5f9', // slate-100
} as const


