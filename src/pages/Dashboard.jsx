import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { TrendingUp, TrendingDown, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useClub } from '../hooks/useClub'

const demoHoldings = [
  { ticker: 'NVDA', name: 'NVIDIA', shares: 12, value: 1648, gain: 62.4, color: '#E6F1FB', text: '#185FA5' },
  { ticker: 'MSFT', name: 'Microsoft', shares: 8, value: 3312, gain: 29.1, color: '#E1F5EE', text: '#0F6E56' },
  { ticker: 'COIN', name: 'Coinbase', shares: 5, value: 852, gain: -8.3, color: '#FAEEDA', text: '#854F0B' },
]

const demoVotes = [
  { id: 1, title: 'Buy $300 of AMZN', proposed_by_name: 'Jordan', days: 3, yes: 5, no: 2, total: 7 },
  { id: 2, title: 'Sell half of COIN', proposed_by_name: 'Marcus', days: 5, yes: 3, no: 4, total: 7 },
]

const demoActivity = [
  { name: 'Simeon', action: 'contributed $50', time: '2 hours ago', color: '#1D9E75' },
  { name: 'Jordan', action: 'proposed buying AMZN', time: 'Yesterday', color: '#185FA5' },
  { name: 'Club', action: 'voted to buy NVIDIA · passed 6/7', time: '3 days ago', color: '#BA7517' },
]

const barHeights = [30, 45, 35, 60, 50, 70, 85]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { club, holdings, proposals, members, loading } = useClub()

  const displayHoldings = holdings.length > 0 ? holdings : demoHoldings
  const liveProposals = proposals.filter(p => p.status === 'live')
  const displayVotes = liveProposals.length > 0 ? liveProposals.map(p => ({
    ...p,
    yes: p.votes?.filter(v => v.vote === 'yes').length || 0,
    no: p.votes?.filter(v => v.vote === 'no').length || 0,
    total: members.length || 7,
    days: Math.max(0, Math.ceil((new Date(p.deadline) - new Date()) / 86400000))
  })) : demoVotes

  const clubName = club?.name || 'ATL Money Moves'
  const memberCount = members.length || 7
  const totalValue = displayHoldings.reduce((s, h) => s + h.value, 0)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar activeVotes={displayVotes.length} />

      <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{clubName}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {memberCount} members · ${(club?.monthly_contribution || 50) * memberCount} pooled/mo ·
              <span style={{ color: 'var(--text-3)', marginLeft: 4 }}>
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={() => navigate('/votes')}>
              <Plus size={14} /> Propose a pick
            </button>
            <button className="btn-secondary" onClick={handleSignOut} style={{ padding: '10px 12px' }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total portfolio', value: `$${totalValue.toLocaleString()}`, sub: '+$382 this month', up: true },
            { label: 'Total gain', value: '+38.4%', sub: 'vs. S&P +18.2%', up: true },
            { label: 'Your share', value: '$830', sub: '14.3% of club', up: null },
            { label: 'Next contribution', value: '$50', sub: 'Due in 12 days', up: null },
          ].map((m, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, color: m.up === true ? 'var(--green-dark)' : 'var(--text-3)' }}>
                {m.up === true && <TrendingUp size={12} />}
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Two col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Holdings */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>Holdings</span>
              <span style={{ fontSize: 13, color: 'var(--green)', cursor: 'pointer' }} onClick={() => navigate('/portfolio')}>View all →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {displayHoldings.slice(0, 3).map(h => (
                <div key={h.ticker} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: h.color, color: h.text, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h.ticker}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{h.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{h.shares} shares</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>${h.value.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: h.gain > 0 ? 'var(--green-dark)' : 'var(--coral)' }}>
                      {h.gain > 0 ? '+' : ''}{h.gain}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, borderTop: '0.5px solid var(--border)', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Monthly returns</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 52 }}>
                {barHeights.map((h, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: i === barHeights.length - 1 ? 'var(--green)' : 'var(--green-mid)', height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Votes */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>Active votes</span>
                <span style={{ fontSize: 10, background: 'var(--green-light)', color: 'var(--green-dark)', padding: '2px 8px', borderRadius: 20 }}>{displayVotes.length} open</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {displayVotes.slice(0, 2).map((v, i) => {
                  const passing = v.yes >= v.no
                  return (
                    <div key={v.id || i} style={{ border: '0.5px solid var(--border)', borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{v.title}</span>
                        <span className="badge badge-green" style={{ flexShrink: 0, marginLeft: 8 }}>Live</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>
                        {v.days} days left
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: passing ? 'var(--green-dark)' : 'var(--coral)', minWidth: 24 }}>{passing ? 'Yes' : 'No'}</span>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 3, width: `${(v.yes / v.total) * 100}%`, background: passing ? 'var(--green)' : 'var(--coral)' }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{v.yes}/{v.total}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity */}
            <div className="card">
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 14 }}>Recent activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {demoActivity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
                        <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{a.name}</strong> {a.action}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
