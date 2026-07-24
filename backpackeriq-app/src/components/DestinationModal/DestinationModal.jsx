import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './DestinationModal.css'

const categoryLabel = {
  beach: '🏖️ Beach', mountain: '⛰️ Mountain', culture: '🏛️ Culture',
  heritage: '🏰 Heritage', adventure: '🧗 Adventure', food: '🍛 Food',
  wildlife: '🐅 Wildlife', spiritual: '🕌 Spiritual',
}
const seasonLabel = {
  winter: '❄️ Winter', summer: '☀️ Summer', monsoon: '🌧️ Monsoon', 'all-year': '🗓️ All Year',
}

export default function DestinationModal({ destination, onClose }) {
  const navigate = useNavigate()
  const overlayRef = useRef(null)

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!destination) return null

  const {
    id, name, state, category = [], season_best = [], budget_range,
    image_url, description, popular_activities = [], best_months,
    rating, review_count,
  } = destination

  function handlePlanTrip() {
    onClose()
    navigate(`/plan?dest=${encodeURIComponent(name)}`)
  }

  return (
    <div
      className="dmodal-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${name}`}
    >
      <div className="dmodal fade-up">
        {/* ── Close ──────────────────────────────────────── */}
        <button className="dmodal-close" onClick={onClose} aria-label="Close modal" id="dest-modal-close">×</button>

        {/* ── Hero image ─────────────────────────────────── */}
        <div className="dmodal-hero">
          {image_url ? (
            <img src={image_url} alt={name} className="dmodal-hero-img" />
          ) : (
            <div className="dmodal-hero-fallback">📍</div>
          )}
          <div className="dmodal-hero-overlay" />
          <div className="dmodal-hero-content">
            <h2 className="dmodal-name">{name}</h2>
            <p className="dmodal-state">📍 {state}</p>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="dmodal-body">
          {/* Tags row */}
          <div className="dmodal-tags">
            {category.map(c => (
              <span key={c} className="dmodal-tag dmodal-tag--cat">{categoryLabel[c] || c}</span>
            ))}
            {season_best.map(s => (
              <span key={s} className="dmodal-tag dmodal-tag--season">{seasonLabel[s] || s}</span>
            ))}
          </div>

          {/* Rating */}
          {rating && (
            <div className="dmodal-rating-row">
              <span className="dmodal-stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
              <span className="dmodal-rating-num">{rating.toFixed(1)}</span>
              {review_count > 0 && <span className="dmodal-review-count">({review_count.toLocaleString()} reviews)</span>}
            </div>
          )}

          {/* Description */}
          {description && <p className="dmodal-desc">{description}</p>}

          {/* Info grid */}
          <div className="dmodal-info-grid">
            {budget_range && (
              <div className="dmodal-info-card">
                <span className="dmodal-info-icon">💰</span>
                <div>
                  <p className="dmodal-info-label">Budget Range</p>
                  <p className="dmodal-info-val">{budget_range}</p>
                </div>
              </div>
            )}
            {best_months && (
              <div className="dmodal-info-card">
                <span className="dmodal-info-icon">📅</span>
                <div>
                  <p className="dmodal-info-label">Best Time</p>
                  <p className="dmodal-info-val">{best_months}</p>
                </div>
              </div>
            )}
          </div>

          {/* Activities */}
          {popular_activities.length > 0 && (
            <div className="dmodal-section">
              <h3 className="dmodal-section-title">Top Activities</h3>
              <div className="dmodal-activities">
                {popular_activities.map(act => (
                  <span key={act} className="dmodal-activity">{act}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            className="btn btn-accent dmodal-cta"
            onClick={handlePlanTrip}
            id={`dest-modal-plan-btn-${id}`}
          >
            ✈️ Plan Itinerary for {name}
          </button>
        </div>
      </div>
    </div>
  )
}
