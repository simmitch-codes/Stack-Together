import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Plus, X, Check } from 'lucide-react'
import { useClub } from '../hooks/useClub'
import { useAuth } from '../context/AuthContext'

const demoVotes = [
  { id: 1, title: 'Buy $300 of AMZN', description: 'Amazon is undervalued after the last earnings dip. Good time to add.', proposer: 'Jordan', days: 3, yes: 5, no: 2, total: 7, status: 'live', myVote: null },
  { id: 2, title: 'Sell half of COIN', description: 'Crypto is overheated. Lock in profits before next correction.', proposer: 'Marcus', days: 5, yes: 3, no: 4, total: 7, status: 'live', myVote: null },
  { id: 3, title: 'Buy $500 of NVDA', description: 'AI chips demand is only going up. Strong buy.', proposer: 'Simeon', days: 0, yes: 6, no: 1, total: 7, status: 'passed', myVote: 'yes' },
  { id: 4, title: 'Buy $200 of TSLA', description: 'Wait for the stock to stabilize first.', proposer: 'Keisha', days: 0, yes: 2, no: 5, total: 7, status: 'failed', myVote: 'no' },
]

export default function Votes() {
  const { user } = useAuth()
  const { proposals, members, submitProposal, castVote } = useClub()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', desc: '' })
  const [localVotes, setLocalVotes] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [demoLocal, setDemoLocal] = useState(demoVotes)

  const hasRealData = proposals.length > 0

  const processedProposals = hasRealData ? proposals.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    days: Math.max(0, Math.ceil((new Date(p.deadline) - new Date()) / 86400000)),
    yes: p.votes?.filter(v => v.vote === 'yes').length || 0,
    no: p.votes?.filter(v => v.vote === 'no').length || 0,
    total: members.length || 7,
    status: p.status,
    myVote: localVotes[p.id] || p.votes?.find(v => v.user_id === user?.id)?.vote || null,
  })) : demoLocal

  const live = processedProposals.filter(v => v.status === 'live')
  const closed = processedProposals.filter(v => v.status !== 'live')

  const handleVote = async (id, vote) => {
    if (hasRealData) {
      setLocalVotes(prev => ({ ...prev, [id]: vote }))
      await castVote(id, vote)
    } else {
      setDemoLocal(prev => prev.map(v => v.id === id ? {
        ...v, myVote: vote,
        yes: vote === 'yes' ? v.yes + 1 : v.yes,
        no: vote === 'no' ? v.no + 1 : v.no,
      } : v))
    }
  }

  const handleSubmit = async () => {
    if (!form.title) return
    setSubmitting(true)
    if (hasRealData) {
      await submitProposal(form.title, form.desc)
    } else {
      setDemoLocal(prev => [{
        id: Date.now(), title: form.title, description: form.desc,
        proposer: 'You', days: 7, yes: 0, no: 0, total: 7, status: 'live', myVote: null
      }, ...prev])
    }
    setForm({ title: '', desc: '' })
    setShowForm(false)
    setSubmitting(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar activeVotes={live.length} />
      <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Votes</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Your club decides every move together</p>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} /> New proposal
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20, border: '1.5px solid var(--green)' }}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 14 }}>New proposal</div>
            <input
              placeholder="e.g. Buy $200 of AAPL" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--bg)', marginBottom: 10 }}
            />
            <textarea
              placeholder="Why should the club do this? (optional)" value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })} rows={3}
              style={{ width: '100%', padding: '10px 14px', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--bg)', resize: 'none', marginBottom: 14, fontFamily: 'var(--font-body)' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit proposal'}
              </button>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Live */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Live — {live.length} open</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {live.map(v => (
              <div key={v.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{v.title}</div>
                  <span className="badge badge-green">Live</span>
                </div>
                {v.description && <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, lineHeight: 1.5 }}>{v.description}</p>}
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>{v.days} days left</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--green-dark)', minWidth: 32 }}>Yes {v.yes}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${v.total > 0 ? (v.yes / v.total) * 100 : 0}%`, background: 'var(--green)', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--coral)', minWidth: 32, textAlign: 'right' }}>No {v.no}</span>
                </div>
                {!v.myVote ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleVote(v.id, 'yes')} className="btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>
                      <Check size={13} /> Vote yes
                    </button>
                    <button onClick={() => handleVote(v.id, 'no')} style={{ fontSize: 13, padding: '7px 16px', borderRadius: 8, border: '0.5px solid var(--border-strong)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)' }}>
                      <X size={13} /> Vote no
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                    You voted <span style={{ fontWeight: 500, color: v.myVote === 'yes' ? 'var(--green-dark)' : 'var(--coral)' }}>{v.myVote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Closed */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Closed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {closed.map(v => (
              <div key={v.id} className="card" style={{ opacity: 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{v.title}</div>
                  <span className={`badge ${v.status === 'passed' ? 'badge-green' : 'badge-gray'}`}>
                    {v.status === 'passed' ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{v.yes}/{v.total} voted yes</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
