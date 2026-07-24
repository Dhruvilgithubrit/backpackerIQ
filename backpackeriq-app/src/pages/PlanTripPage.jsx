import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { states, places } from '../data/locationsData'
import { getPopularDestinations } from '../data/destinationsData'
import Topbar from '../components/Topbar/Topbar'
import PlanTripForm from '../components/PlanTripForm/PlanTripForm'
import BudgetTracker from '../components/BudgetTracker/BudgetTracker'
import SearchFilters from '../components/SearchFilters/SearchFilters'
import DestinationCard from '../components/DestinationCard/DestinationCard'
import DestinationModal from '../components/DestinationModal/DestinationModal'
import './PlanTripPage.css'

const popularPlaces = places.filter(p => p.popular)

export default function PlanTripPage() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState('₹10,000 (Backpacker)')
  const [days, setDays] = useState(7)
  const [filteredDests, setFilteredDests] = useState(null)
  const [modalDest, setModalDest] = useState(null)
  const discoverDests = filteredDests ?? getPopularDestinations(12)

  function handlePlaceCard(place) {
    const params = new URLSearchParams({
      id: place.id,
      name: place.name,
      type: 'place',
      stateId: place.stateId,
    })
    navigate(`/results?${params.toString()}`)
  }

  function handleStateCard(state) {
    const params = new URLSearchParams({
      id: state.id,
      name: state.name,
      type: 'state',
      stateId: state.id,
    })
    navigate(`/results?${params.toString()}`)
  }

  return (
    <div className="plan-page">
      <Topbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="plan-hero">
        <div className="plan-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
            alt="Planning an adventure trip"
          />
          <div className="plan-hero-overlay" />
        </div>
        <div className="plan-hero-content">
          <p className="plan-hero-eyebrow">AI-Powered Itinerary Planner</p>
          <h1 className="plan-hero-title">Plan Your Adventure</h1>
          <p className="plan-hero-sub">
            Tell us where you want to go — we'll handle the rest.
          </p>
        </div>
      </section>

      {/* ── Form Card ─────────────────────────────────────────── */}
      <section className="plan-form-section">
        <div className="plan-form-card">
          <div className="plan-form-card-header">
            <h2 className="plan-form-card-title">Build Your Itinerary</h2>
            <p className="plan-form-card-sub">Fill in the details and let AI craft your perfect trip</p>
          </div>
          <PlanTripForm
            onBudgetChange={setBudget}
            onDaysChange={setDays}
          />

          {/* Budget Tracker */}
          <div className="plan-budget-tracker-wrap">
            <BudgetTracker budget={budget} days={days} />
          </div>
        </div>
      </section>

      {/* ── Search + Discover ───────────────────────────── */}
      <main className="plan-main">
        {/* ── Discover Destinations ─────────────────────── */}
        <section className="plan-section">
          <div className="plan-section-header">
            <h2 className="plan-section-title">Discover Destinations</h2>
          </div>
          <SearchFilters onFilterChange={setFilteredDests} />
          <div className="plan-dests-grid">
            {discoverDests.slice(0, 12).map(dest => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onOpenModal={setModalDest}
              />
            ))}
          </div>
        </section>

        {/* ── Legacy popular places (original locationsData) ─── */}
        <section className="plan-section">
          <div className="plan-section-header">
            <h2 className="plan-section-title">Quick Plan — Popular Spots</h2>
            <span className="plan-section-count">{popularPlaces.length} places</span>
          </div>
          <div className="plan-popular-grid">
            {popularPlaces.map((place, i) => (
              <button
                key={place.id}
                className="plan-place-card"
                onClick={() => handlePlaceCard(place)}
                id={`popular-place-${place.id}`}
              >
                <div className="plan-card-img">
                  <img src={place.imageUrl} alt={place.name} loading="lazy" />
                  <span className="plan-card-index">{String(i + 1).padStart(2, '0')}</span>
                  {place.hasPackage && <span className="plan-card-pkg-badge">PKG</span>}
                </div>
                <div className="plan-card-body">
                  <p className="plan-card-name">{place.name}</p>
                  <p className="plan-card-meta">{place.stateName}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Browse by state ──────────────────────────────────── */}
        <section className="plan-section">
          <div className="plan-section-header">
            <h2 className="plan-section-title">Browse by State</h2>
            <span className="plan-section-count">{states.length} states</span>
          </div>
          <div className="plan-states-grid">
            {states.map(state => (
              <button
                key={state.id}
                className="plan-state-card"
                onClick={() => handleStateCard(state)}
                id={`state-card-${state.id}`}
              >
                <div className="plan-state-img">
                  <img src={state.imageUrl} alt={state.name} loading="lazy" />
                  <div className="plan-state-overlay">
                    <p className="plan-state-name">{state.name}</p>
                    <p className="plan-state-tagline">{state.tagline}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {modalDest && (
        <DestinationModal destination={modalDest} onClose={() => setModalDest(null)} />
      )}
    </div>
  )
}
