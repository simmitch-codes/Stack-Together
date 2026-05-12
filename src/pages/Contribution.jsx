import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { CreditCard, Check, Clock, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { STRIPE_PAYMENT_LINK } from '../lib/stripe'

export default function Contribution() {
  const { user } = useAuth()
  const [contributions, setContributions] = useState([])
  const [stats, setStats] = useState({ total: 0, ownership: 0, portfolioValue: 0 })
  const [loading, setLoading] = useState(true)

  // Fallback demo data if Supabase not connected yet
  const demoHistory = [
    { month: 'May 2025', amount: 50, status: 'paid', paid_at: '2025-05-01' },
    { month: 'Apr 2025', amount: 50, status: 'paid', paid_at: '2025-04-01' },
    { month: 'Mar 2025', amount: 50, status: 'paid', paid_at: '2025-03-02' },
    { month: 'Feb 2025', amount: 50, status: 'paid', paid_at: '2025-02-01' },
    { month: 'Jan 2025', amount: 50, status: 'paid', paid_at: '2025-01-03' },
  ]

  useEffect(() => {
    if (!user) return
    fetchContributions()
  }, [user])

  const fetchContributions = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('paid_at', { ascending: false })

      if (data && data.length > 0) {
        setContributions(data)
        const total = data.reduce((s, c) => s + c.amount, 0)
        setStats({ total, ownership: 14.3, portfolioValue: Math.round(total * 3.32) })
      } else {
        setContributions(demoHistory)
        setStats({ total: 250, ownership: 14.3, portfolioValue: 830 })
      }
    } catch {
      setContributions(demoHistory)
      setStats({ total: 250, ownership: 14.3, portfolioValue: 830 })
    }
    setLoading(false)
  }

  const handlePay = () => {
    if (STRIPE_PAYMENT_LINK && STRIPE_PAYMENT_LINK !== '#') {
      window.open(STRIPE_PAYMENT_LINK, '_blank')
    } else {
      alert('Add your Stripe Payment Link to VITE_STRIPE_PAYMENT_LINK in your .env file.')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatMonth = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar activeVotes={2} />
      <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>My Contribution</h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>Track your club payments and ownership</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 760 }}>
          {/* Next payment card */}
          <div className="card" style={{ border: '1.5px solid var(--green)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Next contribution due</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>$50</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20 }}>Due June 1, 2025 · 12 days away</div>
            <button
              className="btn-primary"
              onClick={handlePay}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              <CreditCard size={15} />
              Pay now — $50/mo
              <ExternalLink size={12} />
            </button>
            <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 8 }}>
              Secure payment via Stripe
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Total contributed', value: `$${stats.total}` },
              { label: 'My ownership', value: `${stats.ownership}%` },
              { label: 'My portfolio value', value: `$${stats.portfolioValue.toLocaleString()}` },
              { label: 'Net gain on my share', value: `+$${(stats.portfolioValue - stats.total).toLocaleString()}`, green: true },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.label}</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: s.green ? 'var(--green)' : 'var(--text)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div className="card" style={{ marginTop: 16, maxWidth: 760 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16 }}>Payment history</div>
          {loading ? (
            <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '12px 0' }}>Loading...</div>
          ) : (
            <div>
              {contributions.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < contributions.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={15} color="var(--green)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.month || formatMonth(c.paid_at)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Paid {formatDate(c.paid_at)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>${c.amount}</span>
                    <span className="badge badge-green">Paid</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
