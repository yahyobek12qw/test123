'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, TrendingUp, TrendingDown, Minus, AlertTriangle, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeUpItem } from '@/lib/animations'
import type { AIImpactItem, ChatMessage } from '@/types'

interface ParsedResult {
  summary: string
  impacts: AIImpactItem[]
  recommendations: string[]
  riskScore: number
}

async function fetchImpactAnalysis(): Promise<ParsedResult> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'impact_analysis', context: {} }),
  })
  const data = await res.json()
  try {
    return JSON.parse(data.result)
  } catch {
    return { summary: data.result, impacts: [], recommendations: [], riskScore: 50 }
  }
}

async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'chat', context: { message } }),
  })
  const data = await res.json()
  return data.result ?? ''
}

const DIR_ICONS = {
  positive: { icon: TrendingUp, color: 'text-positive', bg: 'bg-positive/10' },
  negative: { icon: TrendingDown, color: 'text-negative', bg: 'bg-negative/10' },
  neutral: { icon: Minus, color: 'text-muted', bg: 'bg-muted/10' },
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "Salom! Men sizning moliyaviy AI maslahatchangizman. Xarajatlar, investitsiyalar, iqtisodiy vaziyat yoki moliyaviy maqsadlar haqida savollaringizni bering — yordam berishga tayyorman.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: impact, isLoading: impactLoading } = useQuery({
    queryKey: ['ai-impact-full'],
    queryFn: fetchImpactAnalysis,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function handleSend() {
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const reply = await sendChatMessage(userMsg.content)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Kechirasiz, hozirda xizmat ishlamayapti. Keyinroq urinib ko'ring.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-sm font-semibold text-dark-secondary">
          AI Moliya Maslahat
        </h1>
        <p className="font-body text-sm text-muted mt-1">
          Iqtisodiy o&apos;zgarishlarning sizga ta&apos;siri va AI chatbot
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Analysis Panel */}
        <div className="space-y-4">
          <Card variant="dark" padding="lg" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/3 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-body text-base font-semibold text-white">
                    Menga ta&apos;siri qanday?
                  </p>
                  <p className="font-mono text-xs text-white/40">
                    Joriy iqtisodiy sharoit tahlili
                  </p>
                </div>
                {!impactLoading && impact?.riskScore != null && (
                  <div className="ml-auto text-center">
                    <p className="font-mono text-xs text-white/30">Xavf</p>
                    <p className={`font-mono text-xl font-bold ${
                      impact.riskScore < 30 ? 'text-positive' :
                      impact.riskScore < 60 ? 'text-gold' : 'text-negative'
                    }`}>
                      {impact.riskScore}
                    </p>
                  </div>
                )}
              </div>

              {impactLoading ? (
                <div className="space-y-3">
                  {[70, 85, 60, 90].map((w, i) => (
                    <div key={i} className="h-4 bg-white/10 rounded animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </div>
              ) : (
                <>
                  {impact?.summary && (
                    <p className="font-body text-sm text-white/70 leading-relaxed mb-5">
                      {impact.summary}
                    </p>
                  )}

                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="space-y-2.5"
                  >
                    {(impact?.impacts ?? []).map((item, i) => {
                      const style = DIR_ICONS[item.direction] ?? DIR_ICONS.neutral
                      const Icon = style.icon
                      return (
                        <motion.div
                          key={i}
                          variants={fadeUpItem}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/6 border border-white/8"
                        >
                          <div className={`w-7 h-7 rounded-lg ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon size={13} className={style.color} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-wide mb-0.5">
                              {item.event}
                            </p>
                            <p className="font-body text-sm text-white/80 leading-snug">
                              {item.impact}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </>
              )}
            </div>
          </Card>

          {/* Recommendations */}
          {(impact?.recommendations?.length ?? 0) > 0 && (
            <Card variant="elevated">
              <Card.Header>
                <Card.Title>AI tavsiyalar</Card.Title>
              </Card.Header>
              <div className="space-y-3">
                {impact?.recommendations?.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <AlertTriangle size={13} className="text-gold shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-dark-secondary leading-snug">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Chat Panel */}
        <Card variant="elevated" padding="none" className="flex flex-col h-[600px]">
          {/* Chat header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot size={17} className="text-primary" />
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-dark-secondary">AI Chatbot</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-dot" />
                <span className="font-mono text-[10px] text-muted">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant' ? 'bg-primary/10' : 'bg-dark-secondary'
                  }`}>
                    {msg.role === 'assistant'
                      ? <Bot size={13} className="text-primary" />
                      : <User size={13} className="text-white" />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-background border border-border text-dark-secondary rounded-tl-sm'
                  }`}>
                    <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={13} className="text-primary" />
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {["Xarajatlarni qanday kamaytiraman?", "Investitsiya bo'yicha maslahat", "Valyuta xavfi qanday?"].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="shrink-0 px-3 py-1.5 bg-background border border-border rounded-full text-xs font-body text-muted hover:text-primary hover:border-primary/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Savolingizni yozing..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm font-body text-dark-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                size="md"
                className="px-3.5"
              >
                <Send size={15} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
