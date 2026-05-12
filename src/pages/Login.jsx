import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await signUp(form.email, form.password, form.name)
      if (error) { setError(error.message); setLoading(false); return }
      navigate('/onboarding')
    } else {
      const { error } = await signIn(form.email, form.password)
      if (error) { setError('Invalid email or password'); setLoading(false); return }
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 36 }}>
          <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>StackTogether</span>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>
            {mode === 'login' ? 'Sign in to your club dashboard' : 'Start building wealth with your circle'}
          </p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '0.5px solid #FCA5A5', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
              <AlertCircle size={14} color="#DC2626" />
              <span style={{ fontSize: 13, color: '#DC2626' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handle}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Full name</label>
                <input
                  type="text" placeholder="Simeon Jackson" value={form.name} required
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--bg)' }}
                />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email" placeholder="you@email.com" value={form.email} required
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--bg)' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password" placeholder="••••••••" value={form.password} required minLength={6}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '0.5px solid var(--border-strong)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--bg)' }}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-2)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: 'var(--green)', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-3)', cursor: 'pointer' }} onClick={() => navigate('/')}>
          ← Back to home
        </p>
      </div>
    </div>
  )
}
