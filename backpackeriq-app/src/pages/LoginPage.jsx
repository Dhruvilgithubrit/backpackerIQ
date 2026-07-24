import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]         = useState('signin') // 'signin' | 'signup'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState('')

  // Already logged in → go home
  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const fn = mode === 'signin' ? signIn : signUp
    const { error: authError } = await fn(email, password)

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'signup') {
      // With email confirmation disabled in Supabase, the user is signed in
      // immediately and the useEffect above will redirect automatically.
      setSuccess('Account created! Taking you in...')
    }
    // signin success → useEffect handles redirect via user state
  }

  function toggleMode() {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError('')
    setSuccess('')
  }

  return (
    <div className="login-page">
      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="login-brand">
        <div className="login-brand-inner">
          <p className="login-brand-kicker t-label">India travel, planned by AI</p>
          <h1 className="login-brand-headline t-display-xl">
            Every trail.<br />
            Every budget.<br />
            Every pace.
          </h1>
          <p className="login-brand-sub">
            From Hampi to Turtuk — BackpackerIQ builds real itineraries
            with real travel times, and your actual budget.
          </p>
          <div className="login-brand-tags">
            {['500+ destinations', '28 states', 'AI itineraries', 'Tour packages'].map(tag => (
              <span key={tag} className="login-tag t-label">{tag}</span>
            ))}
          </div>
        </div>
        <div className="login-brand-accent-bar" />
      </div>

      {/* ── Right panel ─────────────────────────────────────── */}
      <div className="login-form-panel">
        <div className="login-form-wrap fade-up">
          <a href="/" className="login-wordmark">
            Backpacker<span>IQ</span>
          </a>

          <h2 className="login-form-title t-display-md">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="login-form-sub">
            {mode === 'signin'
              ? 'Sign in to access your itineraries.'
              : 'Free to join. No credit card.'}
          </p>

          {error   && <div className="login-banner login-banner--error">{error}</div>}
          {success && <div className="login-banner login-banner--success">{success}</div>}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email" className="login-label t-label">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="login-field">
              <label htmlFor="login-password" className="login-label t-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder={mode === 'signup' ? 'Minimum 6 characters' : '••••••••'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-accent login-submit"
              disabled={loading}
            >
              {loading
                ? <span className="login-spinner" />
                : mode === 'signin' ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <p className="login-toggle">
            {mode === 'signin'
              ? <>Don't have an account?{' '}<button id="login-toggle-btn" type="button" onClick={toggleMode}>Sign up free</button></>
              : <>Already have an account?{' '}<button id="login-toggle-btn" type="button" onClick={toggleMode}>Sign in</button></>
            }
          </p>
        </div>
      </div>
    </div>
  )
}
