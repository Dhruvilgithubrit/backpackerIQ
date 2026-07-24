import { useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { packagesByPlace, states, places } from '../data/locationsData'
import InteractiveItinerary from '../components/InteractiveItinerary/InteractiveItinerary'
import RouteMap from '../components/InteractiveItinerary/RouteMap'
import ItineraryDisplay from '../components/ItineraryDisplay/ItineraryDisplay'
import AccommodationList from '../components/AccommodationList/AccommodationList'
import Topbar from '../components/Topbar/Topbar'
import ShareTrip from '../components/ShareTrip/ShareTrip'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import './ResultsPage.css'

function getPlaceData(id, type) {
  if (type === 'state') return states.find(s => s.id === id) || null
  return places.find(p => p.id === id) || null
}

function PackageCard({ pkg }) {
  return (
    <div className="res-pkg-card">
      <div className="res-pkg-header">
        <div>
          <p className="res-pkg-operator">{pkg.operator}</p>
          <h3 className="res-pkg-name">{pkg.name}</h3>
        </div>
        <div className="res-pkg-price-wrap">
          <span className="res-pkg-price">₹{pkg.price.toLocaleString('en-IN')}</span>
          <span className="res-pkg-pp">/ person</span>
        </div>
      </div>

      <div className="res-pkg-details">
        <div className="res-pkg-row">
          <span className="res-pkg-key">Group</span>
          <span className="res-pkg-val">{pkg.groupSize}</span>
        </div>
        <div className="res-pkg-row">
          <span className="res-pkg-key">Includes</span>
          <span className="res-pkg-val">{pkg.inclusions}</span>
        </div>
        <div className="res-pkg-row">
          <span className="res-pkg-key">Rating</span>
          <span className="res-pkg-val res-pkg-rating">
            {'★'.repeat(Math.round(pkg.rating))}{'☆'.repeat(5 - Math.round(pkg.rating))}
            <span className="res-pkg-rating-num"> {pkg.rating}</span>
          </span>
        </div>
      </div>

      <a
        href={pkg.bookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="res-pkg-cta"
      >
        Book this package
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const id       = searchParams.get('id')
  const name     = searchParams.get('name')
  const type     = searchParams.get('type')

  const aiItineraryData = location.state?.itineraryData || null

  const [isSaving, setIsSaving] = useState(false)
  const [isSaved,  setIsSaved]  = useState(false)

  const destination = getPlaceData(id, type) || { name: name || 'Unknown', imageUrl: '' }
  const packages    = packagesByPlace[id] || []
  const hasPackages = packages.length > 0

  const placeData     = type === 'place' ? places.find(p => p.id === id) : null
  const isPackageOnly = placeData?.packageOnly || false

  const handleSaveTrip = async () => {
    if (!user) { alert('Sign in to save trips'); return }
    if (!aiItineraryData) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('user_itineraries')
        .insert({
          user_id: user.id,
          destination: name,
          days: location.state?.days || 5,
          budget: location.state?.budget || '₹10,000',
          itinerary_content: typeof aiItineraryData.itinerary === 'string' 
            ? aiItineraryData.itinerary 
            : JSON.stringify(aiItineraryData.itinerary)
        })

      if (error) throw error
      setIsSaved(true)
      alert('Trip saved!')
    } catch (err) {
      console.error('Error saving trip:', err)
      alert('Failed to save trip')
    } finally {
      setIsSaving(false)
    }
  }

  if (!name) {
    return (
      <div className="res-error-page">
        <p>No destination selected. <a href="/plan" onClick={e => { e.preventDefault(); navigate('/plan') }}>Go back to plan</a></p>
      </div>
    )
  }

  return (
    <div className="res-page">
      <Topbar />

      {/* ── Hero / Header ─────────────────────────────────── */}
      <div className="res-hero">
        {destination.imageUrl && (
          <div className="res-hero-bg">
            <img src={destination.imageUrl} alt={name} />
            <div className="res-hero-overlay" />
          </div>
        )}
        <div className="res-hero-content">
          <div className="res-hero-breadcrumb">
            <button onClick={() => navigate('/plan')} className="res-back-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Change destination
            </button>
          </div>
          <h1 className="res-dest-name">{name}</h1>
          <div className="res-hero-meta">
            {placeData && (
              <span className="res-hero-chip">
                📍 {placeData.stateName}
              </span>
            )}
            {aiItineraryData && (
              <>
                <span className="res-hero-chip">
                  📅 {aiItineraryData.days} Days
                </span>
                <span className="res-hero-chip">
                  💰 {aiItineraryData.budget}
                </span>
              </>
            )}
          </div>
          <div className="res-hero-actions">
            <ShareTrip destination={name} days={location.state?.days || 5} budget={location.state?.budget || ''} />
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className={`res-body ${hasPackages ? 'res-body--with-pkg' : ''} ${aiItineraryData && typeof aiItineraryData.itinerary !== 'string' ? 'res-body--with-map' : ''}`}>

        {/* ── Left: Itinerary ──────────────────────────── */}
        <section className="res-itinerary-col">
          <div className="res-col-header">
            <h2 className="res-col-title">Your Itinerary</h2>
            <p className="res-col-sub">AI-generated around real travel times and your pace</p>
          </div>

          {!aiItineraryData ? (
            <div className="res-no-data">
              <span className="res-no-data-icon">✈️</span>
              <h3>No itinerary yet</h3>
              <p>Generate one from the Plan Trip page.</p>
              <button className="res-goto-plan" onClick={() => navigate('/plan')}>Go to Plan Trip →</button>
            </div>
          ) : (
            <div className="res-days fade-in">
              {typeof aiItineraryData.itinerary === 'string' ? (
                <ItineraryDisplay itineraryText={aiItineraryData.itinerary} />
              ) : (
                <InteractiveItinerary 
                  initialData={aiItineraryData} 
                  destination={name}
                  budget={location.state?.budget || 'Standard'}
                  travelers={location.state?.travelers || 'Solo'}
                />
              )}

              <AccommodationList 
                destination={aiItineraryData.destination} 
                budget={aiItineraryData.budget} 
                travelers={location.state?.travelers || 'Backpackers'} 
              />

              {placeData && (
                <div className="res-place-info">
                  {placeData.openingHours && (
                    <div className="res-info-row">
                      <span className="res-info-key">Hours</span>
                      <span className="res-info-val">{placeData.openingHours}</span>
                    </div>
                  )}
                  <div className="res-info-row">
                    <span className="res-info-key">Budget range</span>
                    <span className="res-info-val res-info-accent">{placeData.costRange}</span>
                  </div>
                </div>
              )}

              <div className="res-actions">
                <button
                  className="res-save-btn btn btn-accent"
                  id="results-save-itinerary-btn"
                  onClick={handleSaveTrip}
                  disabled={isSaving || isSaved}
                >
                  {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Save Trip'}
                </button>
                <button
                  className="res-plan-another btn btn-outline"
                  onClick={() => navigate('/plan')}
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Center: Route Map ──────────────────────────── */}
        {aiItineraryData && typeof aiItineraryData.itinerary !== 'string' && (
          <section className="res-map-col fade-in">
            <div className="res-col-header">
              <h2 className="res-col-title">Route Map</h2>
              <p className="res-col-sub">Your day-by-day journey</p>
            </div>
            <div className="res-map-wrap">
              <RouteMap itinerary={aiItineraryData.itinerary.itinerary || []} />
            </div>
          </section>
        )}

        {/* ── Right: Packages ──────────────────────────── */}
        {hasPackages && (
          <section className="res-packages-col">
            <div className="res-col-header">
              <div className="res-pkg-col-title-row">
                <h2 className="res-col-title">Tour Packages</h2>
                {isPackageOnly && (
                  <span className="res-pkg-recommended">Recommended</span>
                )}
              </div>
              <p className="res-col-sub">
                {isPackageOnly
                  ? 'Permits & logistics make this destination easiest with an operator'
                  : 'Prefer hassle-free? These packages include logistics & guides'}
              </p>
            </div>
            <div className="res-packages">
              {packages.map((pkg, i) => (
                <PackageCard key={i} pkg={pkg} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
