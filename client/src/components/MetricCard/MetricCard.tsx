import type { ComponentType } from 'react'

type IconProps = { size?: number; className?: string }

export function MetricCard({
  label,
  value,
  Icon,
}: {
  label: string
  value: string
  Icon: ComponentType<IconProps>
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <Icon size={16} className="text-slate-400" />
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  )
}


