import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — decorative (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-white font-bold text-xl">FIP</span>
        </div>

        {/* Quote */}
        <blockquote className="relative z-10">
          <p className="font-display text-white/90 text-2xl leading-relaxed mb-4 italic">
            &ldquo;Moliyaviy aql — bu shunchaki raqamlar emas,
            bu o&apos;z kelajagingizni tushunishdir.&rdquo;
          </p>
          <footer className="font-mono text-white/40 text-xs uppercase tracking-wider">
            Financial Intelligence Platform
          </footer>
        </blockquote>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { n: '12+', l: 'Manbalar' },
            { n: '∞', l: 'Real-time' },
            { n: 'AI', l: 'Tahlil' },
          ].map(({ n, l }) => (
            <div key={l} className="border border-white/15 rounded-xl p-3 text-center">
              <p className="font-mono text-white font-bold text-xl">{n}</p>
              <p className="font-body text-white/50 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-primary">FIP</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
