import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-xl text-primary">FIP</span>
            </div>
            <p className="text-sm text-muted font-body max-w-xs leading-relaxed">
              Shaxsiy moliya va global iqtisodiy razvedka — barchasi bitta platformada.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4 font-body">
              Platforma
            </p>
            <div className="space-y-2.5">
              {['Dashboard', 'Global Bozorlar', "O'zbekiston", 'AI Maslahat'].map((item) => (
                <div key={item}>
                  <Link
                    href="/dashboard"
                    className="text-sm text-muted hover:text-dark-secondary transition-colors font-body"
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Data sources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4 font-body">
              Ma&apos;lumot manbalari
            </p>
            <div className="space-y-2.5">
              {['CBU.uz', 'CoinGecko', 'Alpha Vantage', 'NewsAPI'].map((src) => (
                <p key={src} className="text-sm text-muted font-body">
                  {src}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted font-body">
            © 2026 Financial Intelligence Platform. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-muted font-mono">
            Ma&apos;lumotlar faqat ma&apos;lumot maqsadida. Moliyaviy maslahat emas.
          </p>
        </div>
      </div>
    </footer>
  )
}
