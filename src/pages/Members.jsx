import Sidebar from '../components/Sidebar'
import { Crown, Check, Clock } from 'lucide-react'

const members = [
  { name: 'Simeon Jackson', role: 'Admin', initial: 'S', color: '#E1F5EE', text: '#0F6E56', contribution: 600, ownership: 14.3, paid: true, joined: 'Jan 2025' },
  { name: 'Jordan Williams', role: 'Member', initial: 'J', color: '#E6F1FB', text: '#185FA5', contribution: 600, ownership: 14.3, paid: true, joined: 'Jan 2025' },
  { name: 'Marcus Davis', role: 'Member', initial: 'M', color: '#FAEEDA', text: '#854F0B', contribution: 600, ownership: 14.3, paid: false, joined: 'Feb 2025' },
  { name: 'Keisha Thompson', role: 'Member', initial: 'K', color: '#FBEAF0', text: '#993556', contribution: 600, ownership: 14.3, paid: true, joined: 'Feb 2025' },
  { name: 'Andre Brown', role: 'Member', initial: 'A', color: '#EEEDFE', text: '#3C3489', contribution: 600, ownership: 14.3, paid: true, joined: 'Mar 2025' },
  { name: 'Tanya Moore', role: 'Member', initial: 'T', color: '#EAF3DE', text: '#3B6D11', contribution: 300, ownership: 7.1, paid: true, joined: 'Apr 2025' },
  { name: 'Devon Harris', role: 'Member', initial: 'D', color: '#F1EFE8', text: '#444441', contribution: 300, ownership: 7.1, paid: false, joined: 'Apr 2025' },
]

export default function Members() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar activeVotes={2} />
      <div style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Members</h1>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>7 members · $50/mo contribution</p>
          </div>
          <button className="btn-primary">
            + Invite member
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total members', value: '7' },
            { label: 'Paid this month', value: '5/7', green: true },
            { label: 'Monthly pool', value: '$350' },
          ].map((c, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: c.green ? 'var(--green)' : 'var(--text)' }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Members list */}
        <div className="card">
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16 }}>All members</div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 8, padding: '6px 0', borderBottom: '0.5px solid var(--border)', marginBottom: 4 }}>
              {['Member', 'Joined', 'Ownership', 'Contributed', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {members.map((m, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px', gap: 8, padding: '12px 0', borderBottom: '0.5px solid var(--border)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.color, color: m.text, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.initial}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {m.name}
                      {m.role === 'Admin' && <Crown size={12} color="#BA7517" />}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{m.joined}</div>
                <div style={{ fontSize: 13 }}>{m.ownership}%</div>
                <div style={{ fontSize: 13 }}>${m.contribution}</div>
                <div>
                  {m.paid ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green-dark)', background: 'var(--green-light)', padding: '3px 8px', borderRadius: 20 }}>
                      <Check size={11} /> Paid
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--amber)', background: 'var(--amber-light)', padding: '3px 8px', borderRadius: 20 }}>
                      <Clock size={11} /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
