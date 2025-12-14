import type { ReactNode } from 'react'

/**
 * Shared header for the 3-step workflow cards.
 * We keep this extracted to avoid repeating icon + title markup across steps.
 */
export function StepHeader({
  icon,
  title,
}: {
  icon: ReactNode
  title: string
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    </div>
  )
}


