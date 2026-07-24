import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import UserPreferences from '../UserPreferences/UserPreferences'
import './Topbar.css'

export default function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const avatarRef = useRef(null)

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '??'

  const navLinks = [
    { label: 'Explore Destinations', href: '/plan' },
    { label: 'Seasonal Getaways', href: '/#seasonal' },
    { label: 'How It Works', href: '/#how' },
    { label: 'About Us', href: '/#about' },
  ]

  async function handleSignOut() {
    setAvatarOpen(false)
    await signOut()
    navigate('/login', { replace: true })
  }

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="tb-root">
      <div className="tb-inner">
        {/* ── Left: Logo ──────────────────────────────── */}
        <a href="/" className="tb-logo" onClick={e => { e.preventDefault(); navigate('/') }}>
          <svg className="tb-logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#FF3B1F"/>
            <path d="M8 20L14 8l6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 16h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="tb-logo-text">Backpacker<em>IQ</em></span>
        </a>

        {/* ── Center: Nav links ────────────────────── */}
        <nav className={`tb-nav ${menuOpen ? 'tb-nav--open' : ''}`}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`tb-nav-link ${location.pathname === link.href ? 'tb-nav-link--active' : ''}`}
              onClick={e => {
                e.preventDefault()
                setMenuOpen(false)
                if (link.href.startsWith('/#')) {
                  navigate('/')
                  setTimeout(() => {
                    const el = document.querySelector(link.href.replace('/', ''))
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                } else {
                  navigate(link.href)
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right: Search + Auth ─────────────────── */}
        <div className="tb-right">
          {/* Plan CTA button */}
          <button
            className="tb-cta-btn"
            onClick={() => navigate('/plan')}
            id="topbar-plan-btn"
          >
            Plan Your Trip
          </button>

          {/* Auth area */}
          {user ? (
            <div className="tb-avatar-wrap" ref={avatarRef}>
              <button
                className="tb-avatar"
                onClick={() => setAvatarOpen(v => !v)}
                id="topbar-avatar-btn"
                title={user.email}
              >
                {initials}
              </button>
              {avatarOpen && (
                <div className="tb-avatar-dropdown">
                  <div className="tb-avatar-email">{user.email}</div>
                  <button className="tb-avatar-item" onClick={() => { setAvatarOpen(false); navigate('/plan') }}>
                    🗺️ Plan a Trip
                  </button>
                  <button className="tb-avatar-item" onClick={() => { setAvatarOpen(false); navigate('/saved') }} id="topbar-saved-btn">
                    🔖 Saved Trips
                  </button>
                  <button className="tb-avatar-item" onClick={() => { setAvatarOpen(false); setPrefsOpen(true) }} id="topbar-prefs-btn">
                    ⚙️ Preferences
                  </button>
                  <button className="tb-avatar-item tb-avatar-item--danger" onClick={handleSignOut}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="tb-auth-links">
              <button className="tb-auth-login" onClick={() => navigate('/login')}>Log in</button>
              <button className="tb-auth-signup btn btn-accent" onClick={() => navigate('/login')}>Sign up free</button>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`tb-hamburger ${menuOpen ? 'tb-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            id="topbar-hamburger-btn"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {prefsOpen && <UserPreferences onClose={() => setPrefsOpen(false)} />}
    </header>
  )
}
