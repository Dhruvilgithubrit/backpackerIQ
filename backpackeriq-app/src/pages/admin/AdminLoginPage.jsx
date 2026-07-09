import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLoginPage.css'

const ADMIN_CREDENTIALS = {
  email: 'admin@backpackeriq.com',
  password: 'biq_admin_2024',
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate async check
    await new Promise(r => setTimeout(r, 600))

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      sessionStorage.setItem('biq_admin_token', 'admin-session-ok')
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid credentials. Admin access only.')
    }
    setLoading(false)
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-wordmark">Backpacker<span>IQ</span></span>
          <span className="admin-login-badge t-label">Admin</span>
        </div>

        <h1 className="admin-login-title">Dashboard access</h1>
        <p className="admin-login-sub">Restricted to administrators only</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-email" className="admin-login-label t-label">Email</label>
            <input
              id="admin-email"
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@backpackeriq.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password" className="admin-login-label t-label">Password</label>
            <div className="admin-login-pw-wrap">
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-login-toggle"
                onClick={() => setShowPw(v => !v)}
                aria-label="Toggle password visibility"
              >
                {showPw ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button
            id="admin-login-submit"
            type="submit"
            className="btn btn-accent admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Verifying…' : 'Sign in to dashboard'}
          </button>
        </form>

        <p className="admin-login-note">
          This page is not linked from the public app. Bookmark it directly.
        </p>
      </div>
    </div>
  )
}
