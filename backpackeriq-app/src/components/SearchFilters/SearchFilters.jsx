import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { destinations } from '../../data/destinationsData'
import './SearchFilters.css'

const BUDGET_OPTIONS = [
  { label: '₹5K and under', value: '5000' },
  { label: '₹5K – ₹10K', value: '10000' },
  { label: '₹10K – ₹20K', value: '20000' },
  { label: '₹20K – ₹30K', value: '30000' },
  { label: '₹30K+', value: '50000' },
]
const ACTIVITIES = ['beach', 'mountain', 'culture', 'heritage', 'adventure', 'food', 'wildlife', 'spiritual']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const SEASONS = ['winter','summer','monsoon']
const SEASON_MONTHS = { winter: ['Oct','Nov','Dec','Jan','Feb'], summer: ['Mar','Apr','May','Jun'], monsoon: ['Jul','Aug','Sep'] }

export default function SearchFilters({ onFilterChange }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [budget, setBudget]   = useState(searchParams.get('budget') || '')
  const [season, setSeason]   = useState(searchParams.get('season') || '')
  const [activities, setActivities] = useState(() => {
    const a = searchParams.get('activities')
    return a ? a.split(',') : []
  })
  const [month, setMonth] = useState(searchParams.get('month') || '')
  const [matchCount, setMatchCount] = useState(destinations.length)
  const filterRef = useRef(null)

  // Compute matches
  useEffect(() => {
    let filtered = destinations
    if (budget) {
      const max = parseInt(budget)
      filtered = filtered.filter(d => {
        if (!d.budget_range) return true
        const match = d.budget_range.match(/₹([\d.]+)K/)
        if (!match) return true
        return parseInt(match[1]) * 1000 <= max
      })
    }
    if (season) filtered = filtered.filter(d => d.season_best.includes(season))
    if (activities.length) filtered = filtered.filter(d => activities.some(a => d.category.includes(a)))
    if (month) {
      const matched = Object.entries(SEASON_MONTHS).find(([, months]) => months.includes(month))?.[0]
      if (matched) filtered = filtered.filter(d => d.season_best.includes(matched) || d.season_best.includes('all-year'))
    }
    setMatchCount(filtered.length)
    onFilterChange?.(filtered)
  }, [budget, season, activities, month, onFilterChange])

  // Sync to URL
  useEffect(() => {
    const params = {}
    if (budget) params.budget = budget
    if (season) params.season = season
    if (activities.length) params.activities = activities.join(',')
    if (month) params.month = month
    setSearchParams(params, { replace: true })
  }, [budget, season, activities, month])

  function toggleActivity(a) {
    setActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  function reset() {
    setBudget(''); setSeason(''); setActivities([]); setMonth('')
    setSearchParams({}, { replace: true })
  }

  const activeCount = [budget, season, month, ...(activities.length ? ['act'] : [])].filter(Boolean).length

  return (
    <div className="sf-root" ref={filterRef}>
      {/* ── Toggle bar ─────────────────────────────────── */}
      <div className="sf-bar">
        <button
          className="sf-toggle-btn"
          onClick={() => setOpen(v => !v)}
          id="search-filters-toggle"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          Filters
          {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}
          <svg
            className={`sf-chevron ${open ? 'sf-chevron--up' : ''}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <span className="sf-match-count">
          <strong>{matchCount}</strong> destinations
        </span>

        {activeCount > 0 && (
          <button className="sf-reset-btn" onClick={reset} id="search-filters-reset">
            Clear all
          </button>
        )}
      </div>

      {/* ── Filter panel ───────────────────────────────── */}
      {open && (
        <div className="sf-panel fade-in">
          <div className="sf-grid">
            {/* Budget */}
            <div className="sf-group">
              <label className="sf-label">Budget per person</label>
              <select
                className="sf-select"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                id="filter-budget"
              >
                <option value="">Any budget</option>
                {BUDGET_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div className="sf-group">
              <label className="sf-label">Best season</label>
              <select
                className="sf-select"
                value={season}
                onChange={e => setSeason(e.target.value)}
                id="filter-season"
              >
                <option value="">Any season</option>
                {SEASONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Best month */}
            <div className="sf-group">
              <label className="sf-label">Best month</label>
              <select
                className="sf-select"
                value={month}
                onChange={e => setMonth(e.target.value)}
                id="filter-month"
              >
                <option value="">Any month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Activity checkboxes */}
          <div className="sf-group sf-group--full">
            <label className="sf-label">Activities & Categories</label>
            <div className="sf-activities">
              {ACTIVITIES.map(a => (
                <label
                  key={a}
                  className={`sf-activity-cb ${activities.includes(a) ? 'sf-activity-cb--active' : ''}`}
                  id={`filter-activity-${a}`}
                >
                  <input
                    type="checkbox"
                    checked={activities.includes(a)}
                    onChange={() => toggleActivity(a)}
                  />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="sf-footer">
            <button className="btn btn-accent sf-apply-btn" onClick={() => setOpen(false)} id="search-filters-apply">
              Show {matchCount} destinations
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
