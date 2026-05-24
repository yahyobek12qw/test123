'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface Props {
  data: number[]
  color?: string
  height?: number
}

export function MiniSparkline({ data, color = '#1a1a2e', height = 40 }: Props) {
  const chartData = data.map((value, i) => ({ i, value }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
