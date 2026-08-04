import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchIndex } from '../../data/locationsData';
import { destinationSearchIndex } from '../../data/destinationsData';
import './PlanTripForm.css';

// Merge old location data + new destinations dataset for search
const combinedSearchIndex = [
  ...searchIndex,
  ...destinationSearchIndex.map(d => ({
    id: d.id, name: d.name,
    stateName: d.state,
    type: 'place', stateId: d.id,
  }))
]

const BUDGET_OPTIONS = [
  '₹5,000 (Shoestring)',
  '₹10,000 (Backpacker)',
  '₹20,000 (Standard)',
  '₹30,000+ (Comfort)',
];

const INTERESTS = [
  'Beaches', 'Mountains', 'Culture', 'Food',
  'Adventure', 'Nightlife', 'Wildlife', 'Relaxation'
];

const TRAVELERS = ['Solo', 'Couple', 'Group of Friends', 'Family'];

export default function PlanTripForm({ onBudgetChange, onDaysChange }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [destination, setDestination] = useState(null);
  const [query, setQuery] = useState(() => searchParams.get('dest') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState(7);
  const [interests, setInterests] = useState([]);
  const [traveler, setTraveler] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setSuggestions([]); return; }
    const matches = combinedSearchIndex.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.stateName && item.stateName.toLowerCase().includes(q))
    ).slice(0, 10);
    setSuggestions(matches);
  }, [query]);

  useEffect(() => {
    const destName = searchParams.get('dest');
    if (!destName) {
      setDestination(null);
      setQuery('');
      return;
    }

    const normalized = destName.toLowerCase();
    const match = combinedSearchIndex.find(
      item => item.id.toLowerCase() === normalized || item.name.toLowerCase() === normalized
    );

    if (match) {
      setDestination(match);
      setQuery(match.name);
    } else {
      setDestination(null);
      setQuery(destName);
    }
  }, [searchParams]);

  useEffect(() => {
    function handler(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectDestination = (item) => {
    setDestination(item);
    setQuery(item.name);
    setSuggestions([]);
    setIsFocused(false);
  };

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const isFormValid = destination && budget && traveler && interests.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Show friendly validation errors if form is incomplete
    if (!isFormValid) {
      const missing = [];
      if (!destination) missing.push('a destination (select from dropdown)');
      if (!budget) missing.push('a budget');
      if (!traveler) missing.push('traveler type');
      if (interests.length === 0) missing.push('at least one interest');
      setError(`Please fill in: ${missing.join(', ')}.`);
      return;
    }

    setLoading(true);
    setError(null);

    // 60-second timeout — Groq can be slow for long itineraries
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          destination: destination.name,
          budget,
          days,
          interests,
          travelers: traveler,
        }),
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Server returned HTML (likely a crash/proxy error) — log it
        const text = await response.text();
        console.error('Non-JSON response from server:', text.substring(0, 500));
        throw new Error(`Server error (${response.status}). Please try again.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      // Navigate to results page with data via state
      const params = new URLSearchParams({
        id: destination.id,
        name: destination.name,
        type: destination.type,
        stateId: destination.stateId || destination.id,
      });
      navigate(`/results?${params.toString()}`, { state: { itineraryData: data, travelers: traveler } });
      
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timed out. The AI is taking too long — try fewer days or a simpler destination.');
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const showDropdown = isFocused && (suggestions.length > 0 || (query.length > 0 && suggestions.length === 0));

  return (
    <form className="plan-trip-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      
      {/* 1. Destination (Autocomplete) */}
      <div className="form-group">
        <label>Destination</label>
        <div className="dest-search-box" data-focused={isFocused ? 'true' : undefined}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. Goa, Manali..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDestination(null);
              setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              className="dest-search-clear"
              onClick={() => { setQuery(''); setDestination(null); setSuggestions([]); inputRef.current?.focus(); }}
            >
              ×
            </button>
          )}
        </div>
        
        {showDropdown && (
          <ul ref={dropdownRef} className="dest-suggestions" role="listbox">
            {suggestions.length === 0 ? (
              <li className="dest-suggestions-empty">No results for "{query}"</li>
            ) : suggestions.map(item => (
              <li
                key={item.id}
                className="dest-suggestion-item"
                role="option"
                onClick={() => handleSelectDestination(item)}
              >
                <span className="dest-suggestion-type">{item.type === 'state' ? '🗺' : '📍'}</span>
                <span className="dest-suggestion-name">{item.name}</span>
                {item.stateName && <span className="dest-suggestion-state">{item.stateName}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 2. Budget */}
      <div className="form-group">
        <label>Budget (Total)</label>
        <select value={budget} onChange={(e) => { setBudget(e.target.value); onBudgetChange?.(e.target.value); }} disabled={loading} required>
          <option value="" disabled>Select a budget</option>
          {BUDGET_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 3. Duration */}
      <div className="form-group">
        <label className="duration-label">
          Duration
          <span className="duration-value">{days} {days === 1 ? 'Day' : 'Days'}</span>
        </label>
        <div className="duration-slider-wrap">
          <input
            type="range"
            min="2"
            max="30"
            value={days}
            style={{ '--pct': `${((days - 2) / (30 - 2)) * 100}%` }}
            onChange={(e) => { setDays(Number(e.target.value)); onDaysChange?.(Number(e.target.value)); }}
            disabled={loading}
          />
          <div className="duration-ticks">
            <span>2d</span>
            <span>7d</span>
            <span>14d</span>
            <span>21d</span>
            <span>30d</span>
          </div>
        </div>
      </div>

      {/* 4. Travelers */}
      <div className="form-group">
        <label>Who's traveling?</label>
        <div className="travelers-options">
          {TRAVELERS.map(t => (
            <label key={t} className={`traveler-radio ${traveler === t ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="traveler" 
                value={t} 
                checked={traveler === t} 
                onChange={() => setTraveler(t)}
                disabled={loading}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      {/* 5. Interests */}
      <div className="form-group">
        <label>Interests (select at least one)</label>
        <div className="interests-grid">
          {INTERESTS.map(int => (
            <label key={int} className={`interest-cb ${interests.includes(int) ? 'active' : ''}`}>
              <input 
                type="checkbox" 
                checked={interests.includes(int)} 
                onChange={() => toggleInterest(int)}
                disabled={loading}
              />
              {int}
            </label>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-accent form-submit-btn" 
        disabled={loading}
      >
        {loading ? (
          <><span className="spinner"></span> ✨ Crafting your itinerary...</>
        ) : (
          'Generate Itinerary'
        )}
      </button>
    </form>
  );
}
