import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar/Topbar'
import IndiaMap from '../components/Map/IndiaMap'
import SeasonalDestinations from '../components/SeasonalDestinations/SeasonalDestinations'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()


  return (
    <div className="home-page">
      <Topbar />

      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80"
            alt="Adventure in India mountains"
          />
          <div className="home-hero-overlay" />
        </div>
        <div className="home-hero-content">
          <p className="home-hero-eyebrow">AI-Powered Travel Planning</p>
          <h1 className="home-hero-title">
            Explore India<br />Like Never Before
          </h1>
          <p className="home-hero-sub">
            AI-powered budget itineraries tailored for backpackers.<br />
            Real places, real costs, real adventures.
          </p>
          <div className="home-hero-actions">
            <button
              className="home-hero-cta"
              onClick={() => navigate('/plan')}
              id="home-start-planning-btn"
            >
              Start Planning Free
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="home-hero-secondary"
              onClick={() => {
                document.getElementById('home-map-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore Destinations
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="home-hero-scroll">
          <div className="home-hero-scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── Stats Section ─────────────────────────────────── */}
      <section className="home-stats" id="home-stats">
        <div className="home-stats-inner">
          {[
            { icon: '🗺️', num: '5,000+', label: 'Itineraries Generated', desc: 'AI-crafted adventures' },
            { icon: '🎒', num: '2,000+', label: 'Happy Backpackers', desc: 'Across India' },
            { icon: '📍', num: '50+', label: 'Destinations', desc: 'From Ladakh to Kanyakumari' },
          ].map(stat => (
            <div key={stat.label} className="home-stat-card">
              <span className="home-stat-icon">{stat.icon}</span>
              <span className="home-stat-num">{stat.num}</span>
              <span className="home-stat-label">{stat.label}</span>
              <span className="home-stat-desc">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map Section ───────────────────────────────────── */}
      <section className="home-map-section" id="home-map-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">Interactive Map</p>
          <h2 className="home-section-title">Popular Destinations</h2>
          <p className="home-section-sub">Click any pin to explore a destination</p>
        </div>
        <div className="home-map-wrap">
          <IndiaMap />
        </div>
        <div className="home-legend">
          <div className="home-legend-item">
            <span className="home-legend-dot home-legend-dot--solid" />
            <span>Destination</span>
          </div>
          <div className="home-legend-item">
            <span className="home-legend-dot home-legend-dot--ring" />
            <span>Package recommended</span>
          </div>
        </div>
        <div className="home-map-cta">
          <button className="home-hero-cta" onClick={() => navigate('/plan')}>
            Plan your next trip
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Seasonal Destinations ─────────────────────────── */}
      <section id="seasonal">
        <SeasonalDestinations />
      </section>

      {/* ── Features Section ──────────────────────────────── */}
      <section className="home-features" id="how">
        <div className="home-features-inner">
          <div className="home-section-header">
            <p className="home-section-eyebrow">Why BackpackerIQ</p>
            <h2 className="home-section-title">Built for Real Backpackers</h2>
          </div>
          <div className="home-features-grid">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Planning',
                desc: 'Llama 3.3 AI generates day-by-day itineraries specific to your budget, interests and travel style.',
              },
              {
                icon: '💰',
                title: 'Budget-First Design',
                desc: 'Every recommendation is priced for backpackers — from ₹5,000 shoestring to ₹30,000 comfort trips.',
              },
              {
                icon: '🏔️',
                title: 'Local Insider Tips',
                desc: 'Real advice on local transport, street food spots, permits, and hidden gems most tourists miss.',
              },
            ].map(feat => (
              <div key={feat.title} className="home-feature-card">
                <span className="home-feature-icon">{feat.icon}</span>
                <h3 className="home-feature-title">{feat.title}</h3>
                <p className="home-feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ─────────────────────────────────────── */}
      <section className="home-cta-strip">
        <div className="home-cta-strip-inner">
          <h2 className="home-cta-strip-title">Ready to Explore?</h2>
          <p className="home-cta-strip-sub">Plan your next India adventure in minutes. Free, AI-powered, tailored for you.</p>
          <button
            className="home-cta-strip-btn"
            onClick={() => navigate('/plan')}
            id="home-cta-strip-btn"
          >
            Start Planning Now
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="home-footer" id="about">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <span className="home-footer-logo">Backpacker<em>IQ</em></span>
            <p className="home-footer-tagline">Plan smarter. Travel further.</p>
          </div>
          <div className="home-footer-links">
            <div className="home-footer-col">
              <span className="home-footer-col-title">Explore</span>
              <a href="/plan" onClick={e => { e.preventDefault(); navigate('/plan') }}>Destinations</a>
              <a href="/plan" onClick={e => { e.preventDefault(); navigate('/plan') }}>Plan a Trip</a>
              <a href="/#seasonal">Seasonal Getaways</a>
            </div>
            <div className="home-footer-col">
              <span className="home-footer-col-title">Company</span>
              <a href="/#about">About Us</a>
              <a href="/#how">How It Works</a>
              <a href="/#about">Contact</a>
            </div>
          </div>
        </div>
        <div className="home-footer-bottom">
          <span>© 2025 BackpackerIQ. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
