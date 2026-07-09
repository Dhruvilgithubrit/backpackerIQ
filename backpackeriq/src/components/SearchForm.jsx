import { useState } from 'react'
import { states, citiesByState, filters } from '../data/mockData'

export default function SearchForm({ onGenerate, presetState, presetCity }) {
  const [state, setState] = useState(presetState || states[0])
  const [city, setCity] = useState(
    presetCity || citiesByState[presetState || states[0]][0]
  )
  const [days, setDays] = useState(3)
  const [filter, setFilter] = useState('Culture')
  const [budget, setBudget] = useState(700)

  function handleStateChange(next) {
    setState(next)
    setCity(citiesByState[next][0])
  }

  return (
    <div className="bg-white rounded-card border border-mist p-6 shadow-sm">
      <p className="font-display text-2xl text-ink mb-1">Where to next?</p>
      <p className="text-sm text-ink/50 mb-5">
        Tell us the trip, we will find the trail.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-ink/50 mb-1.5">
            State
          </label>
          <select
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full h-10 rounded-lg border border-mist bg-paper px-3 text-sm focus:ring-1 focus:ring-trail focus:border-trail outline-none"
          >
            {states.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink/50 mb-1.5">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 rounded-lg border border-mist bg-paper px-3 text-sm focus:ring-1 focus:ring-trail focus:border-trail outline-none"
          >
            {citiesByState[state].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center justify-between text-xs font-medium text-ink/50 mb-1.5">
          <span>Days</span>
          <span className="font-mono text-ink">{days}</span>
        </label>
        <input
          type="range"
          min={2}
          max={10}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-trail"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-ink/50 mb-2">
          Travel style
        </label>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
                filter === f
                  ? 'bg-trail text-paper border-trail'
                  : 'bg-white text-ink/60 border-mist hover:border-trail/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center justify-between text-xs font-medium text-ink/50 mb-1.5">
          <span>Budget per day</span>
          <span className="font-mono text-ink">&#8377;{budget.toLocaleString('en-IN')}</span>
        </label>
        <input
          type="range"
          min={300}
          max={2000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-marigold"
        />
      </div>

      <button
        onClick={() => onGenerate({ state, city, days, filter, budget })}
        className="w-full h-11 rounded-lg bg-marigold text-ink font-medium text-sm hover:bg-marigold-dark transition-colors"
      >
        Generate itinerary
      </button>
    </div>
  )
}
