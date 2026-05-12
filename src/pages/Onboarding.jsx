import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Plane, Briefcase, TrendingUp, Users, Search, ArrowRight, Check } from 'lucide-react'

const goals = [
  { icon: <Home size={22} />, label: 'Buy a home', desc: 'Save and invest toward a down payment' },
  { icon: <Plane size={22} />, label: 'Travel & experiences', desc: 'Grow a fund for the trips you\'ve been putting off' },
  { icon: <Briefcase size={22} />, label: 'Build generational wealth', desc: 'Invest so your family benefits long-term' },
  { icon: <TrendingUp size={22} />, label: 'Grow my money faster', desc: 'Put idle cash to work smarter than savings' },
]

function ProgressDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 36 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 20 : 6, height: 6, borderRadius: 3,
          background: i <= step ? 'var(--green)' : 'var(--border-strong)',
          transition: 'all 0.3s'
        }} />
      ))}
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState([])
  const [contribution, setContribution] = useState(50)
  const [clubOption, setClubOption] = useState('create')
  const [clubName, setClubName] = useState('')

  const MEMBERS = 6

  const toggleGoal = (label) => {
    setSelectedGoals(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    )
  }

  const wrapper = (children, canContinue, onContinue) => (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <ProgressDots step={step} total={4} />
        <div className="card" style={{ padding: 36 }}>
          {children}
          <button
            className="btn-primary"
            disabled={!canContinue}
            onClick={onContinue}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 28, opacity: canContinue ? 1 : 0.4, cursor: canContinue ? 'pointer' : 'default' }}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  // Page 1 - Goals
  if (step === 0) return wrapper(
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, marginBottom: 8 }}>What are you building toward?</h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>We'll personalize your StackTogether experience around what matters most to you.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {goals.map(g => {
          const active = selectedGoals.includes(g.label)
          return (
            <div
              key={g.label} onClick={() => toggleGoal(g.label)}
              style={{
                padding: 16, borderRadius: 10, cursor: 'pointer',
                border: `${active ? '2px' : '0.5px'} solid ${active ? 'var(--green)' : 'var(--border-strong)'}`,
                background: active ? 'var(--green-light)' : 'var(--bg)',
                transition: 'all 0.15s', position: 'relative'
              }}
            >
              {active && (
                <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={11} color="#fff" />
                </div>
              )}
              <div style={{ color: active ? 'var(--green)' : 'var(--text-2)', marginBottom: 8 }}>{g.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, color: active ? 'var(--green-dark)' : 'var(--text)' }}>{g.label}</div>
              <div style={{ fontSize: 12, color: active ? 'var(--green-dark)' : 'var(--text-2)', lineHeight: 1.5 }}>{g.desc}</div>
            </div>
          )
        })}
      </div>
    </>,
    selectedGoals.length > 0,
    () => setStep(1)
  )

  // Page 2 - Contribution
  if (step === 1) {
    const pooledYear = contribution * MEMBERS * 12
    return wrapper(
      <>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, marginBottom: 8 }}>What can you commit each month?</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 32 }}>There's no wrong answer — even $25 compounds over time. Your club sets the minimum together.</p>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700, color: 'var(--green)' }}>${contribution}</span>
          <span style={{ fontSize: 16, color: 'var(--text-2)' }}>/mo</span>
        </div>

        <input
          type="range" min={10} max={500} step={5} value={contribution}
          onChange={e => setContribution(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 16, accentColor: 'var(--green)' }}
        />

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[25, 50, 100].map(v => (
            <button
              key={v} onClick={() => setContribution(v)}
              style={{
                flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: `0.5px solid ${contribution === v ? 'var(--green)' : 'var(--border-strong)'}`,
                background: contribution === v ? 'var(--green-light)' : 'transparent',
                color: contribution === v ? 'var(--green-dark)' : 'var(--text-2)',
                cursor: 'pointer', transition: 'all 0.15s'
              }}
            >${v}/mo</button>
          ))}
        </div>

        <div style={{ background: 'var(--green-light)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--green-dark)', marginBottom: 4 }}>
            If your club of {MEMBERS} each contributes <strong>${contribution}/mo</strong>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--green)', fontWeight: 700 }}>
            ${pooledYear.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: 'var(--green-dark)' }}>pooled in your first year</div>
        </div>
      </>,
      true,
      () => setStep(2)
    )
  }

  // Page 3 - Who
  if (step === 2) return wrapper(
    <>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Who's in your circle?</h2>
      <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24 }}>The best investment clubs are built on trust. Think friends, family, coworkers — people you'd actually talk money with.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { id: 'create', icon: <Users size={20} />, label: 'I have people in mind', desc: "You'll invite them after setup.", badge: 'Most common' },
          { id: 'join', icon: <Search size={20} />, label: 'I want to find a club', desc: 'Browse open clubs and request to join.' },
        ].map(o => {
          const active = clubOption === o.id
          return (
            <div
              key={o.id} onClick={() => setClubOption(o.id)}
              style={{
                padding: 16, borderRadius: 10, cursor: 'pointer', position: 'relative',
                border: `${active ? '2px' : '0.5px'} solid ${active ? 'var(--green)' : 'var(--border-strong)'}`,
                background: active ? 'var(--green-light)' : 'var(--bg)',
                transition: 'all 0.15s'
              }}
            >
              {o.badge && (
                <span style={{ position: 'absolute', top: -10, left: 12, fontSize: 10, background: 'var(--green)', color: '#fff', padding: '2px 8px', borderRadius: 20 }}>{o.badge}</span>
              )}
              <div style={{ color: active ? 'var(--green)' : 'var(--text-2)', marginBottom: 8 }}>{o.icon}</div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, color: active ? 'var(--green-dark)' : 'var(--text)' }}>{o.label}</div>
              <div style={{ fontSize: 12, color: active ? 'var(--green-dark)' : 'var(--text-2)', lineHeight: 1.5 }}>{o.desc}</div>
            </div>
          )
        })}
      </div>

      <div>
        <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Give your club a name (you can change this later)</label>
        <input
          type="text" placeholder="e.g. ATL Money Moves" value={clubName}
          onChange={e => setClubName(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--bg)' }}
        />
      </div>
    </>,
    true,
    () => setStep(3)
  )

  // Page 4 - Ready
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <ProgressDots step={3} total={4} />
        <div className="card" style={{ padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <TrendingUp size={26} color="var(--green)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, marginBottom: 8 }}>You're ready to stack.</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Here's what happens next.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
            {[
              { n: 1, title: 'Invite your circle', desc: 'Share your unique club link. Members join and confirm their monthly commitment.' },
              { n: 2, title: 'Make your first move', desc: 'Propose a stock, ETF, or crypto pick. Your club votes and the best ideas win.' },
              { n: 3, title: 'Watch it grow', desc: 'Track your shared portfolio, celebrate wins, and build wealth as a unit.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green)', color: '#fff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--green-light)', borderRadius: 10, padding: 14, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 500 }}>
              🎉 Your club "{clubName || 'ATL Money Moves'}" is live. Time to invite your people.
            </div>
          </div>

          <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
            Go to my dashboard <ArrowRight size={15} />
          </button>
          <button
            onClick={() => {}}
            style={{ width: '100%', marginTop: 10, padding: '11px', background: 'transparent', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, color: 'var(--text-2)', cursor: 'pointer' }}
          >
            Copy my invite link
          </button>
        </div>
      </div>
    </div>
  )
}
