'use client'

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  date: string
  value: number
}

interface Props {
  data: DataPoint[]
  color?: string
  height?: number
  showAxes?: boolean
}

export function AreaChart({ data, color = '#1a1a2e', height = 200, showAxes = true }: Props) {
  const gradientId = `gradient-${color.replace(/[#()]/g, '')}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {showAxes && (
          <>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fontFamily: 'var(--font-jetbrains)', fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: 'var(--font-jetbrains)', fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              width={55}
              tickFormatter={(v) => v.toLocaleString()}
            />
          </>
        )}

        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          labelStyle={{ color: '#6B7280', marginBottom: 4 }}
          itemStyle={{ color: '#111827' }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  )
}
