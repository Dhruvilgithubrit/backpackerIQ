import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './DestinationCard.css'

export default function DestinationCard({ destination, onOpenModal }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const { id, name, state, category = [], season_best = [], budget_range,
          image_url, popular_activities = [], rating, review_count } = destination

  const primaryCategory = category[0] || 'culture'
  const primarySeason   = season_best[0] || 'all-year'

  const seasonLabel = { winter: 'Winter', summer: 'Summer', monsoon: 'Monsoon', 'all-year': 'All year' }
  const categoryLabel = { beach: 'Beach', mountain: 'Mountain', culture: 'Culture',
    heritage: 'Heritage', adventure: 'Adventure', food: 'Food',
    wildlife: 'Wildlife', spiritual: 'Spiritual' }

  function handlePlanTrip(e) {
    e.stopPropagation()
    navigate(`/plan?dest=${encodeURIComponent(id)}`)
  }

  return (
    <article className="dcard" id={`dest-card-${id}`} onClick={() => onOpenModal?.(destination)}>
      {/* ── Image ─────────────────────────────────────────── */}
      <div className="dcard-img-wrap">
        {!imgError && image_url ? (
          <img
            src={image_url}
            alt={name}
            className="dcard-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="dcard-img-fallback">{categoryLabel[primaryCategory] || 'Trip'}</div>
        )}
        {/* Season badge */}
        <span className="dcard-season-badge">{seasonLabel[primarySeason] || '🗓️ All Year'}</span>
        {/* Category tag */}
        <span className={`dcard-cat-tag dcard-cat--${primaryCategory}`}>
          {categoryLabel[primaryCategory] || primaryCategory}
        </span>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="dcard-body">
        <div className="dcard-header">
          <div>
            <h3 className="dcard-name">{name}</h3>
            <p className="dcard-state">{state}</p>
          </div>
          {rating && (
            <div className="dcard-rating">
              <span className="dcard-star">★</span>
              <span className="dcard-rating-num">{rating.toFixed(1)}</span>
              {review_count > 0 && <span className="dcard-reviews">({review_count.toLocaleString()})</span>}
            </div>
          )}
        </div>

        {/* Budget */}
        {budget_range && (
          <p className="dcard-budget">
            <span className="dcard-budget-label">Budget</span>
            {budget_range}
          </p>
        )}

        {/* Activity pills */}
        {popular_activities.length > 0 && (
          <div className="dcard-activities">
            {popular_activities.slice(0, 3).map(act => (
              <span key={act} className="dcard-activity-pill">{act}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          className="dcard-plan-btn"
          id={`dest-plan-btn-${id}`}
          onClick={handlePlanTrip}
        >
          Plan Trip →
        </button>
      </div>
    </article>
  )
}
