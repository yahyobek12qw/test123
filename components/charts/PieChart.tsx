'use client'

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface Slice {
  name: string
  value: number
  color: string
}

interface Props {
  data: Slice[]
  height?: number
  showLegend?: boolean
}

export function PieChart({ data, height = 220, showLegend = true }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          innerRadius="58%"
          outerRadius="78%"
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            fontSize: 12,
            fontFamily: 'var(--font-jetbrains)',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
          formatter={(value) => [(value as number).toLocaleString(), '']}
        />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={7}
            formatter={(value) => (
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-inter)',
                  color: '#6B7280',
                }}
              >
                {value}
              </span>
            )}
          />
        )}
      </RePieChart>
    </ResponsiveContainer>
  )
}
