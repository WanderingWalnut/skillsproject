import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { CHART_COLORS } from '../../config/constants'
import type { RiskHistoryPoint } from '../../types/chart'

interface RiskHistoryChartProps {
  data: RiskHistoryPoint[]
  isCritical: boolean
}

export function RiskHistoryChart({ data, isCritical }: RiskHistoryChartProps) {
  const accent = isCritical ? CHART_COLORS.critical : CHART_COLORS.primary

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.2} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Failure Risk']}
            labelFormatter={(label) => `Time: ${label}`}
          />

          {/* Warning threshold line at 50% */}
          <ReferenceLine
            y={50}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{ value: 'Warning', fill: '#f59e0b', fontSize: 11, position: 'right' }}
          />

          {/* Critical threshold line at 80% */}
          <ReferenceLine
            y={80}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={1}
            label={{ value: 'Critical', fill: '#ef4444', fontSize: 11, position: 'right' }}
          />

          <Area
            type="monotone"
            dataKey="failureProbability"
            stroke={accent}
            fillOpacity={1}
            fill="url(#colorRisk)"
            strokeWidth={2}
            dot={data.length <= 20}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

