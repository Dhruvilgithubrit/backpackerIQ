import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Topbar from '../components/Topbar/Topbar'
import ItineraryDisplay from '../components/ItineraryDisplay/ItineraryDisplay'
import InteractiveItinerary from '../components/InteractiveItinerary/InteractiveItinerary'
import UserPreferences from '../components/UserPreferences/UserPreferences'
import './SavedTripsPage.css'

export default function SavedTripsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [prefsOpen, setPrefsOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    async function fetchTrips() {
      const { data, error } = await supabase
        .from('user_itineraries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching saved trips:', error)
      } else {
        setTrips(data || [])
      }
      setLoading(false)
    }

    fetchTrips()
  }, [user, navigate])

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this trip?')) return
    const { error } = await supabase
      .from('user_itineraries')
      .delete()
      .eq('id', id)

    if (!error) {
      setTrips(prev => prev.filter(t => t.id !== id))
    } else {
      alert('Failed to delete trip.')
    }
  }

  return (
    <div className="saved-page">
      <Topbar />
      
      <main className="saved-content">
        <div className="saved-header">
          <div>
            <h1 className="saved-title t-display-lg">Saved Trips</h1>
            <p className="saved-sub t-body">Access your personalized AI itineraries anytime.</p>
          </div>
          <button className="btn btn-outline" onClick={() => setPrefsOpen(true)}>
            ⚙️ Travel Preferences
          </button>
        </div>

        {loading ? (
          <div className="saved-loading">Loading your adventures...</div>
        ) : trips.length === 0 ? (
          <div className="saved-empty card">
            <span className="saved-empty-icon">🎒</span>
            <h2 className="t-display-md">No trips saved yet</h2>
            <p className="t-body">Ready for your next adventure? Start exploring destinations and save your favorite itineraries here.</p>
            <button className="btn btn-accent" onClick={() => navigate('/plan')}>
              Plan a new trip
            </button>
          </div>
        ) : (
          <div className="saved-grid">
            {trips.map(trip => (
              <article key={trip.id} className="saved-card card">
                <div className="saved-card-header" onClick={() => setExpandedId(expandedId === trip.id ? null : trip.id)}>
                  <div>
                    <h3 className="saved-card-dest t-display-md">{trip.destination}</h3>
                    <div className="saved-card-meta">
                      <span className="saved-meta-pill t-mono">📅 {trip.days} Days</span>
                      <span className="saved-meta-pill t-mono">💰 {trip.budget}</span>
                      <span className="saved-meta-pill t-mono">🕒 {new Date(trip.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="saved-card-toggle btn-ghost">
                    {expandedId === trip.id ? '↑ Close' : '↓ View Itinerary'}
                  </button>
                </div>

                {expandedId === trip.id && (
                  <div className="saved-card-body fade-in">
                    <div className="saved-card-markdown">
                      {(() => {
                        try {
                          const parsed = JSON.parse(trip.itinerary_content);
                          if (parsed && typeof parsed === 'object') {
                            return <InteractiveItinerary initialData={{ itinerary: parsed }} destination={trip.destination} budget={trip.budget} travelers="Solo" />
                          }
                        } catch (e) {
                          // Fallback to text
                        }
                        return <ItineraryDisplay itineraryText={trip.itinerary_content} />
                      })()}
                    </div>
                    <div className="saved-card-actions">
                      <button className="btn btn-outline" onClick={() => handleDelete(trip.id)}>
                        Delete Trip
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
      
      {prefsOpen && <UserPreferences onClose={() => setPrefsOpen(false)} />}
    </div>
  )
}
