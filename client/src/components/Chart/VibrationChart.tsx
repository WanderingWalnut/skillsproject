import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { CHART_COLORS } from '../../config/constants'
import type { ChartDataPoint } from '../../types/chart'

export function VibrationChart({
  data,
  isCritical,
}: {
  data: ChartDataPoint[]
  isCritical: boolean
}) {
  const accent = isCritical ? CHART_COLORS.critical : CHART_COLORS.primary

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.1} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 10]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="threshold"
            stroke={CHART_COLORS.muted}
            strokeDasharray="5 5"
            dot={false}
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="vibration"
            stroke={accent}
            fillOpacity={1}
            fill="url(#colorVib)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}


