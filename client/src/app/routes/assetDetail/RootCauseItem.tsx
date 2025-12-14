/**
 * Single "root cause" bullet in the diagnostic panel.
 * Kept small to ensure consistent layout and easy future mapping from real model outputs.
 */
export function RootCauseItem({
  dotClassName,
  title,
  description,
}: {
  dotClassName: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${dotClassName}`} />
      <p className="text-slate-700">
        <span className="font-semibold">{title}</span> {description}
      </p>
    </div>
  )
}


