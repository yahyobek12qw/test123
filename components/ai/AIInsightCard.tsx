'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Bot, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, fadeUpItem } from '@/lib/animations'
import type { AIImpactItem } from '@/types'

interface AIResponse {
  type: string
  result: string
}

interface ParsedResult {
  summary: string
  impacts: AIImpactItem[]
  recommendations: string[]
  riskScore: number
}

async function fetchAIInsight(): Promise<ParsedResult> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'impact_analysis', context: {} }),
  })
  const data: AIResponse = await res.json()
  try {
    return JSON.parse(data.result)
  } catch {
    return {
      summary: data.result,
      impacts: [],
      recommendations: [],
      riskScore: 50,
    }
  }
}

const DIR_STYLES = {
  positive: { color: 'text-positive', bg: 'bg-positive/8', icon: TrendingUp },
  negative: { color: 'text-negative', bg: 'bg-negative/8', icon: TrendingDown },
  neutral:  { color: 'text-muted', bg: 'bg-muted/8', icon: Minus },
}

export function AIInsightCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-insight'],
    queryFn: fetchAIInsight,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return (
    <Card variant="dark" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/3 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-white">AI Tahlil</p>
            <p className="font-mono text-xs text-white/40">Menga ta&apos;siri qanday?</p>
          </div>
          {data?.riskScore != null && (
            <div className="ml-auto text-right">
              <p className="font-mono text-xs text-white/40">Xavf darajasi</p>
              <p
                className={`font-mono text-sm font-bold ${
                  (data.riskScore ?? 0) < 30
                    ? 'text-positive'
                    : (data.riskScore ?? 0) < 60
                      ? 'text-gold'
                      : 'text-negative'
                }`}
              >
                {data.riskScore}/100
              </p>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[80, 65, 90].map((w, i) => (
              <div key={i} className="h-4 bg-white/10 rounded animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <>
            {/* Summary */}
            {data?.summary && (
              <p className="font-body text-sm text-white/70 leading-relaxed mb-6">
                {data.summary}
              </p>
            )}

            {/* Impacts */}
            {(data?.impacts?.length ?? 0) > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-2.5 mb-6"
              >
                {(data?.impacts ?? []).map((item, i) => {
                  const style = DIR_STYLES[item.direction] ?? DIR_STYLES.neutral
                  const Icon = style.icon
                  return (
                    <motion.div
                      key={i}
                      variants={fadeUpItem}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8"
                    >
                      <Icon size={14} className={`${style.color} mt-0.5 shrink-0`} />
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-white/50 mb-0.5 uppercase tracking-wide">
                          {item.event}
                        </p>
                        <p className="font-body text-xs text-white/80 leading-snug">{item.impact}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* Recommendations */}
            {(data?.recommendations?.length ?? 0) > 0 && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-3">
                  Tavsiyalar
                </p>
                <div className="space-y-1.5">
                  {(data?.recommendations ?? []).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle size={11} className="text-gold mt-0.5 shrink-0" />
                      <p className="font-body text-xs text-white/60 leading-snug">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
