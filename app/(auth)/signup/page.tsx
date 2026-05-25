'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState<'UZS' | 'USD' | 'EUR'>('UZS')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, currency_preference: currency },
        },
      })
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
          Hisob yarating
        </h1>
        <p className="font-body text-sm text-muted">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Kirish
          </Link>
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          label="To'liq ism"
          type="text"
          placeholder="Abdulloh Karimov"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          placeholder="siz@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Parol"
          type="password"
          placeholder="Kamida 8 ta belgi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        {/* Currency preference */}
        <div>
          <p className="block text-sm font-medium text-dark-secondary mb-1.5 font-body">
            Asosiy valyuta
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['UZS', 'USD', 'EUR'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`py-2.5 rounded-lg border text-sm font-mono font-medium transition-all ${
                  currency === c
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface border-border text-muted hover:border-primary/40 hover:text-dark-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-negative font-body bg-negative/8 border border-negative/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
          Hisob yaratish
        </Button>
      </form>

      <p className="mt-6 text-xs text-center text-muted font-body">
        Ro&apos;yxatdan o&apos;tish orqali{' '}
        <Link href="#" className="underline">Foydalanish shartlari</Link>
        {' '}va{' '}
        <Link href="#" className="underline">Maxfiylik siyosati</Link>
        ga rozilik bildirasiz.
      </p>
    </div>
  )
}
