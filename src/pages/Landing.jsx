import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, Users, Vote, BarChart2, Shield } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const handleWaitlist = (e) => {
    e.preventDefault()
    if (email) setJoined(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', background: 'var(--card)',
        borderBottom: '0.5px solid var(--border)', position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>StackTogether</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-primary" onClick={() => navigate('/onboarding')}>
            Start your club <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 48px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--green-light)', color: 'var(--green-dark)', fontSize: 13, padding: '6px 14px', borderRadius: 20, marginBottom: 28, fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          2,400+ people already stacking with their circle
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 62, fontWeight: 700,
          lineHeight: 1.08, color: 'var(--text)', marginBottom: 22, letterSpacing: '-0.02em'
        }}>
          Your circle is your<br />
          <span style={{ color: 'var(--green)' }}>greatest investment.</span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.65 }}>
          StackTogether lets you and your people pool money, vote on moves, and build real wealth — together.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <button className="btn-primary" style={{ padding: '13px 28px', fontSize: 15 }} onClick={() => navigate('/onboarding')}>
            Start your club <ArrowRight size={15} />
          </button>
          <button className="btn-secondary" style={{ padding: '13px 28px', fontSize: 15 }} onClick={() => navigate('/login')}>
            Join an existing club
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Free to start · No credit card required</p>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: <Users size={20} color="var(--green)" />, title: 'Build your club', desc: 'Invite your circle, set a monthly contribution, and start pooling together in minutes.' },
            { icon: <Vote size={20} color="var(--green)" />, title: 'Vote on every move', desc: 'Anyone can propose a buy or sell. The club votes and the best ideas win democratically.' },
            { icon: <BarChart2 size={20} color="var(--green)" />, title: 'Track it all together', desc: 'Watch your shared portfolio grow in real time. Every member sees the same scoreboard.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <div style={{ width: 40, height: 40, background: 'var(--green-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                {f.icon}
              </div>
              <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist */}
      <div style={{ background: 'var(--text)', padding: '64px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#fff', marginBottom: 12, fontWeight: 600 }}>
          Your circle deserves more than a group chat.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 28, fontSize: 16 }}>
          Drop your email and be first to build with your people.
        </p>
        {!joined ? (
          <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: 10, justifyContent: 'center', maxWidth: 420, margin: '0 auto' }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required
              style={{
                flex: 1, padding: '11px 16px', borderRadius: 8, border: 'none',
                fontSize: 14, background: 'rgba(255,255,255,0.1)', color: '#fff',
                outline: 'none'
              }}
            />
            <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>
              I'm in →
            </button>
          </form>
        ) : (
          <div style={{ color: 'var(--green-mid)', fontSize: 16, fontWeight: 500 }}>
            ✓ You're on the list. We'll be in touch soon.
          </div>
        )}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>No spam. Just your spot in line.</p>
      </div>
    </div>
  )
}
