import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './UserPreferences.css'

const BUDGETS = ['₹5,000 (Shoestring)', '₹10,000 (Backpacker)', '₹20,000 (Standard)', '₹30,000+ (Comfort)']
const ACTIVITIES = ['beach', 'mountain', 'culture', 'heritage', 'adventure', 'food', 'wildlife', 'spiritual']
const SEASONS = ['winter', 'summer', 'monsoon']
const STYLES = ['Fast-paced', 'Relaxed', 'Adventure-heavy', 'Cultural deep-dive']

export default function UserPreferences({ onClose }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  const [budget, setBudget] = useState('')
  const [activities, setActivities] = useState([])
  const [season, setSeason] = useState([])
  const [style, setStyle] = useState('')

  useEffect(() => {
    async function loadPrefs() {
      if (!user) return
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()
        
      if (data) {
        setBudget(data.preferred_budget || '')
        setActivities(data.favorite_activities || [])
        setSeason(data.preferred_seasons || [])
        setStyle(data.travel_style || '')
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error)
      }
      setLoading(false)
    }
    loadPrefs()
  }, [user])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      user_id: user.id,
      preferred_budget: budget,
      favorite_activities: activities,
      preferred_seasons: season,
      travel_style: style,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('user_preferences')
      .upsert(payload, { onConflict: 'user_id' })

    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      onClose?.()
    }
  }

  function toggleActivity(act) {
    setActivities(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act])
  }

  function toggleSeason(s) {
    setSeason(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  if (loading) return <div className="upref-loading">Loading...</div>

  return (
    <div className="upref-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className="upref-modal fade-up">
        <button className="upref-close" onClick={onClose}>×</button>
        
        <div className="upref-header">
          <h2 className="upref-title">Travel Preferences</h2>
          <p className="upref-sub">Tell AI how you like to travel for better recommendations.</p>
        </div>

        <form onSubmit={handleSave} className="upref-form">
          {error && <div className="upref-error">{error}</div>}
          
          <div className="upref-group">
            <label className="upref-label">Typical Budget</label>
            <select value={budget} onChange={e => setBudget(e.target.value)} className="upref-select">
              <option value="">No preference</option>
              {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="upref-group">
            <label className="upref-label">Travel Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)} className="upref-select">
              <option value="">No preference</option>
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="upref-group">
            <label className="upref-label">Favorite Seasons</label>
            <div className="upref-pills">
              {SEASONS.map(s => (
                <button
                  type="button"
                  key={s}
                  className={`upref-pill ${season.includes(s) ? 'upref-pill--active' : ''}`}
                  onClick={() => toggleSeason(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="upref-group">
            <label className="upref-label">Activities you love</label>
            <div className="upref-pills">
              {ACTIVITIES.map(a => (
                <button
                  type="button"
                  key={a}
                  className={`upref-pill ${activities.includes(a) ? 'upref-pill--active' : ''}`}
                  onClick={() => toggleActivity(a)}
                >
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="upref-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
