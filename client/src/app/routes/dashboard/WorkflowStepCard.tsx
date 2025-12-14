import type { ReactNode } from 'react'

/**
 * Presentational wrapper for a single workflow step on the Dashboard.
 * Keeps step layout consistent while the route decides behavior (button click, loading state).
 */
export function WorkflowStepCard({
  isDisabled,
  variant,
  children,
}: {
  isDisabled?: boolean
  variant: 'active' | 'complete' | 'default'
  children: ReactNode
}) {
  const base = 'relative overflow-hidden transition-all duration-300 border rounded-xl p-8'
  const disabled = isDisabled ? 'opacity-40 grayscale pointer-events-none' : ''
  const styles =
    variant === 'complete'
      ? 'bg-slate-50 border-slate-200'
      : variant === 'active'
        ? 'bg-white border-slate-300 shadow-lg'
        : 'bg-white border-slate-300 shadow-lg'

  return <div className={`${base} ${disabled} ${styles}`}>{children}</div>
}


