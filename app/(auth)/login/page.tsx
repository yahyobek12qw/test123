'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'
import type { Metadata } from 'next'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-sm font-bold text-dark-secondary mb-2">
          Xush kelibsiz
        </h1>
        <p className="font-body text-sm text-muted">
          Hisob yo&apos;qmi?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="siz@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <div>
          <Input
            label="Parol"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="text-right mt-1.5">
            <Link href="#" className="text-xs text-muted hover:text-primary font-body">
              Parolni unutdingizmi?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-sm text-negative font-body bg-negative/8 border border-negative/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
          Kirish
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted font-body">yoki demo kirish</span>
        </div>
      </div>

      <Link href="/dashboard">
        <Button variant="secondary" size="md" className="w-full">
          Demo rejimida kirish
        </Button>
      </Link>
    </div>
  )
}
