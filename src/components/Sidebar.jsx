import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, BarChart2, CheckCircle, Users, Wallet, Bell, Settings, TrendingUp } from 'lucide-react'

const members = [
  { initial: 'S', color: '#E1F5EE', text: '#0F6E56' },
  { initial: 'J', color: '#E6F1FB', text: '#185FA5' },
  { initial: 'M', color: '#FAEEDA', text: '#854F0B' },
  { initial: 'K', color: '#FBEAF0', text: '#993556' },
]

export default function Sidebar({ activeVotes = 2 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const navItem = (icon, label, route, badge) => {
    const active = path === route
    return (
      <div
        key={route}
        onClick={() => navigate(route)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
          fontSize: 14, fontWeight: active ? 500 : 400,
          color: active ? 'var(--green-dark)' : 'var(--text-2)',
          background: active ? 'var(--green-light)' : 'transparent',
          transition: 'all 0.15s', marginBottom: 2,
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F0F0EC' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
      >
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
        {badge && (
          <span style={{ fontSize: 10, background: 'var(--green-light)', color: 'var(--green-dark)', padding: '1px 7px', borderRadius: 20 }}>
            {badge}
          </span>
        )}
      </div>
    )
  }

  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: 'var(--card)',
      borderRight: '0.5px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 24px' }}>
        <div style={{
          width: 30, height: 30, background: 'var(--green)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <TrendingUp size={16} color="#fff" />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
          StackTogether
        </span>
      </div>

      {/* Club nav */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 10px', marginBottom: 6 }}>Club</div>
        {navItem(<LayoutDashboard size={15} />, 'Dashboard', '/dashboard')}
        {navItem(<BarChart2 size={15} />, 'Portfolio', '/portfolio')}
        {navItem(<CheckCircle size={15} />, 'Votes', '/votes', activeVotes > 0 ? `${activeVotes} live` : null)}
        {navItem(<Users size={15} />, 'Members', '/members')}
      </div>

      {/* Personal nav */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 10px', marginBottom: 6 }}>Personal</div>
        {navItem(<Wallet size={15} />, 'My Contribution', '/contribution')}
        {navItem(<Bell size={15} />, 'Notifications', '/notifications')}
        {navItem(<Settings size={15} />, 'Settings', '/settings')}
      </div>

      {/* Club footer */}
      <div style={{ marginTop: 'auto', borderTop: '0.5px solid var(--border)', paddingTop: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>ATL Money Moves</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex' }}>
            {members.map((m, i) => (
              <div key={i} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: m.color, color: m.text,
                fontSize: 9, fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--card)',
                marginLeft: i === 0 ? 0 : -6
              }}>{m.initial}</div>
            ))}
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: '#EFEFEB', color: 'var(--text-3)',
              fontSize: 8, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--card)', marginLeft: -6
            }}>+3</div>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>7 members</span>
        </div>
      </div>
    </div>
  )
}
