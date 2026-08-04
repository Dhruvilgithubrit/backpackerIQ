import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar/Topbar'
import IndiaMap from '../components/Map/IndiaMap'
import SeasonalSuggestions from '../components/SeasonalSuggestions/SeasonalSuggestions'
import DestinationCard from '../components/DestinationCard/DestinationCard'
import DestinationModal from '../components/DestinationModal/DestinationModal'
import { getPopularDestinations } from '../data/destinationsData'
import './HomePage.css'

// ── CountUp hook ──────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])
  return count
}

// ── StatCard with individual counter ─────────────────────────────────────────
function StatCard({ icon, target, suffix, label, desc, started }) {
  const count = useCountUp(target, 1800, started)
  return (
    <div className="home-stat-card">
      <span className="home-stat-icon">{icon}</span>
      <span className="home-stat-num">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="home-stat-label">{label}</span>
      <span className="home-stat-desc">{desc}</span>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [modalDest, setModalDest] = useState(null)
  const popularDests = getPopularDestinations(6)
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
          {/* Badge */}
          <div className="home-hero-badge">
            <span className="home-hero-badge-dot" />
            <span>AI-Powered · Built for Backpackers</span>
          </div>

          {/* Title */}
          <h1 className="home-hero-title">
            <span className="hero-line hero-line-1">Your Next</span>
            <span className="hero-line hero-line-2">
              Indian <em className="hero-highlight">Adventure</em>
            </span>
            <span className="hero-line hero-line-3">Starts Here.</span>
          </h1>

          {/* Subtitle */}
          <p className="home-hero-sub">
            Drop a destination. Set a budget. Get a full itinerary —
            real places, real costs, zero guesswork.
            <br />
            <span className="hero-sub-accent">Built for those who travel light and dream big.</span>
          </p>

          {/* Actions */}
          <div className="home-hero-actions">
            <button
              className="home-hero-cta"
              onClick={() => navigate('/plan')}
              id="home-start-planning-btn"
            >
              Plan My Trip — It's Free
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
              Browse Destinations
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
      <section className="home-stats" id="home-stats" ref={statsRef}>
        <div className="home-stats-inner">
          <StatCard icon="01" target={5000} suffix="+" label="Itineraries Generated" desc="AI-crafted adventures" started={statsStarted} />
          <StatCard icon="02" target={2000} suffix="+" label="Happy Backpackers" desc="Across India" started={statsStarted} />
          <StatCard icon="03" target={500} suffix="+" label="Destinations" desc="From Ladakh to Andaman" started={statsStarted} />
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
        <div className="home-map-cta">
          <button className="home-hero-cta" onClick={() => navigate('/plan')}>
            Plan your next trip
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Popular Destinations ───────────────────────────── */}
      <section className="home-popular-section" id="seasonal">
        <div className="home-section-header">
          <p className="home-section-eyebrow">Handpicked for you</p>
          <h2 className="home-section-title">Most Loved Destinations</h2>
          <p className="home-section-sub">Curated by traveller ratings and review count</p>
        </div>
        <div className="home-popular-grid">
          {popularDests.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onOpenModal={setModalDest}
            />
          ))}
        </div>
        <div className="home-popular-cta">
          <button className="btn btn-outline" onClick={() => navigate('/plan')} id="home-view-all-btn">
            View all 500+ destinations →
          </button>
        </div>
      </section>

      {/* ── Seasonal Suggestions ──────────────────────────── */}
      <SeasonalSuggestions />

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
                icon: 'A1',
                title: 'AI-Powered Planning',
                desc: 'Llama 3.3 AI generates day-by-day itineraries specific to your budget, interests and travel style.',
              },
              {
                icon: 'B2',
                title: 'Budget-First Design',
                desc: 'Every recommendation is priced for backpackers — from ₹5,000 shoestring to ₹30,000 comfort trips.',
              },
              {
                icon: 'C3',
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
      {/* Modal */}
      {modalDest && (
        <DestinationModal destination={modalDest} onClose={() => setModalDest(null)} />
      )}
    </div>
  )
}
