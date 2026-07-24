import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSeasonalDestinations, getCurrentSeason, seasonMeta } from '../../data/destinationsData'
import DestinationCard from '../DestinationCard/DestinationCard'
import DestinationModal from '../DestinationModal/DestinationModal'
import './SeasonalSuggestions.css'

export default function SeasonalSuggestions() {
  const navigate   = useNavigate()
  const [modalDest, setModalDest] = useState(null)

  const season = getCurrentSeason()
  const meta   = seasonMeta[season] || seasonMeta.winter
  const cards  = getSeasonalDestinations(6)

  if (!cards.length) return null

  return (
    <>
      <section className="ss-section" aria-label={`Best destinations for ${meta.label}`}>
        <div className="ss-inner">
          {/* Header */}
          <div className="ss-header">
            <div>
              <p className="ss-eyebrow">Curated by season</p>
              <h2 className="ss-title">
                Perfect for {meta.label} {meta.emoji}
              </h2>
              <p className="ss-sub">
                Top destinations right now — best conditions, best value, {meta.months}.
              </p>
            </div>
            <button className="ss-view-all btn btn-outline" onClick={() => navigate('/plan')}>
              View all destinations →
            </button>
          </div>

          {/* Cards grid */}
          <div className="ss-grid">
            {cards.map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onOpenModal={setModalDest}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalDest && (
        <DestinationModal
          destination={modalDest}
          onClose={() => setModalDest(null)}
        />
      )}
    </>
  )
}
