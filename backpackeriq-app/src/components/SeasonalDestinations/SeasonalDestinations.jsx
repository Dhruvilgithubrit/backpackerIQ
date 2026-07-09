import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './SeasonalDestinations.css'

export default function SeasonalDestinations() {
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('seasonal_destinations')
        .select('*')
        .eq('is_featured', true)
        .order('order_index', { ascending: true })

      if (!error && data?.length) setDestinations(data)
      setLoading(false)
    }
    load()
  }, [])

  // Don't render the section at all if nothing to show
  if (loading || destinations.length === 0) return null

  return (
    <section className="seasonal-section" aria-label="Featured seasonal destinations">
      <div className="seasonal-inner">

        {/* ── Section header ─────────────────────────────── */}
        <div className="seasonal-header">
          <p className="seasonal-eyebrow">Curated by season</p>
          <h2 className="seasonal-title">Featured right now</h2>
          <p className="seasonal-sub">
            Hand-picked by our team — best conditions, best value, right now.
          </p>
        </div>

        {/* ── Card grid ──────────────────────────────────── */}
        <div className="seasonal-grid">
          {destinations.map(dest => (
            <article key={dest.id} className="seasonal-card">

              {/* Image */}
              <div className="seasonal-card-img">
                {dest.image_url ? (
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    loading="lazy"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="seasonal-card-img-fallback" />
                )}
                <span className="seasonal-card-badge">{dest.season_label}</span>
              </div>

              {/* Body */}
              <div className="seasonal-card-body">
                <h3 className="seasonal-card-name">{dest.name}</h3>
                {dest.description && (
                  <p className="seasonal-card-desc">{dest.description}</p>
                )}
                {dest.cost_estimate && (
                  <span className="seasonal-card-cost">{dest.cost_estimate}</span>
                )}
                <button
                  id={`seasonal-explore-${dest.id}`}
                  className="seasonal-card-cta"
                  onClick={() => navigate('/plan')}
                >
                  Explore →
                </button>
              </div>

            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
