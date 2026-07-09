import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode]       = useState('signin') // 'signin' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

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
      setSuccess('Check your email to confirm your account, then sign in.')
      setMode('signin')
    }
    // signin success → useEffect above handles redirect via user state
  }

  function toggleMode() {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError('')
    setSuccess('')
  }

  return (
    <div className="login-page">
      {/* ── Left panel — brand statement ─────────────────── */}
      <div className="login-brand">
        <div className="login-brand-inner">
          <p className="login-brand-kicker t-label">India travel, planned by AI</p>
          <h1 className="login-brand-headline t-display-xl">
            Every trail.<br />
            Every budget.<br />
            Every pace.
          </h1>
          <p className="login-brand-sub">
            From Hampi to Turtuk — BackpackerIQ builds
            real itineraries with real opening hours,
            real travel times, and your actual budget.
          </p>
          <div className="login-brand-tags">
            {['38 destinations', '8 states', 'AI itineraries', 'Tour packages'].map(tag => (
              <span key={tag} className="login-tag t-label">{tag}</span>
            ))}
          </div>
        </div>
        <div className="login-brand-accent-bar" />
      </div>

      {/* ── Right panel — form ────────────────────────────── */}
      <div className="login-form-panel">
        <div className="login-form-wrap fade-up">
          {/* Wordmark */}
          <a href="/" className="login-wordmark">
            Backpacker<span>IQ</span>
          </a>

          {/* Mode heading */}
          <h2 className="login-form-title t-display-md">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="login-form-sub">
            {mode === 'signin'
              ? 'Sign in to access your itineraries.'
              : 'Free to join. No credit card.'}
          </p>

          {/* Error / success banners */}
          {error   && <div className="login-banner login-banner--error">{error}</div>}
          {success && <div className="login-banner login-banner--success">{success}</div>}

          {/* Form */}
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

          {/* Divider */}
          <div className="login-divider">
            <span>or</span>
          </div>

          {/* Google */}
          <button
            id="login-google-btn"
            className="btn login-google-btn"
            onClick={async () => {
              setLoading(true);
              const { error: authError } = await signInWithGoogle();
              if (authError) {
                setError(authError.message);
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.773 17.64 9.2z" fill="#ccc"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#ccc"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#ccc"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#ccc"/>
            </svg>
            Continue with Google
          </button>

          {/* Toggle mode */}
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
