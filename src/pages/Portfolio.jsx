import Sidebar from '../components/Sidebar'
import { TrendingUp, TrendingDown } from 'lucide-react'

const holdings = [
  { ticker: 'NVDA', name: 'NVIDIA Corp', shares: 12, avgCost: 101.2, value: 1648, gain: 62.4, alloc: 28, color: '#E6F1FB', text: '#185FA5' },
  { ticker: 'MSFT', name: 'Microsoft Corp', shares: 8, avgCost: 320, value: 3312, gain: 29.1, alloc: 57, color: '#E1F5EE', text: '#0F6E56' },
  { ticker: 'COIN', name: 'Coinbase Global', shares: 5, avgCost: 185.4, value: 852, gain: -8.3, alloc: 15, color: '#FAEEDA', text: '#854F0B' },
]

const allocColors = ['#1D9E75', '#185FA5', '#BA7517']

export default function Portfolio() {
  const total = holdings.reduce((s, h) => s + h.value, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar activeVotes={2} />
      <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Portfolio</h1>
        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>ATL Money Moves · paper trading</p>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total value', value: `$${total.toLocaleString()}` },
            { label: 'Total gain', value: '+38.4%', green: true },
            { label: 'Cash available', value: '$200' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: c.green ? 'var(--green)' : 'var(--text)' }}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          {/* Holdings table */}
          <div className="card">
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16 }}>All holdings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, padding: '6px 0', borderBottom: '0.5px solid var(--border)', marginBottom: 8 }}>
                {['Asset', 'Shares', 'Value', 'Return'].map(h => (
                  <div key={h} style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                ))}
              </div>
              {holdings.map(h => (
                <div key={h.ticker} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, padding: '12px 0', borderBottom: '0.5px solid var(--border)', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: h.color, color: h.text, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h.ticker}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{h.ticker}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{h.name}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13 }}>{h.shares}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>${h.value.toLocaleString()}</div>
                  <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 3, color: h.gain > 0 ? 'var(--green-dark)' : 'var(--coral)' }}>
                    {h.gain > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {h.gain > 0 ? '+' : ''}{h.gain}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation */}
          <div className="card">
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16 }}>Allocation</div>
            {/* Simple visual allocation bars */}
            <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
              {holdings.map((h, i) => (
                <div key={i} style={{ width: `${h.alloc}%`, background: allocColors[i] }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {holdings.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: allocColors[i] }} />
                    <span style={{ fontSize: 13 }}>{h.ticker}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{h.alloc}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
