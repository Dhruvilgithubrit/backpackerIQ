import { useState, useEffect } from 'react';
import './AccommodationList.css';

export default function AccommodationList({ destination, budget, travelers }) {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchAccommodations() {
      if (!destination) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/search-accommodations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, budget, travelers })
        });
        
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
        } else {
          throw new Error('Server returned an invalid response.');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch accommodations');
        }

        if (isMounted) {
          setAccommodations(data.results || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAccommodations();
    return () => { isMounted = false; };
  }, [destination, budget, travelers]);

  if (loading) {
    return (
      <div className="acc-list-container acc-loading">
        <div className="acc-spinner"></div>
        <p>Searching Zostel, OYO, and Google Maps for budget stays in {destination}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acc-list-container acc-error">
        <p>Could not load accommodations: {error}</p>
      </div>
    );
  }

  if (accommodations.length === 0) {
    return null;
  }

  return (
    <div className="acc-list-container fade-in">
      <div className="acc-header">
        <h2 className="res-col-title">Explore Accommodation</h2>
        <p className="res-col-sub">Top 5 budget stays in {destination} (Low to High)</p>
      </div>
      
      <div className="acc-grid">
        {accommodations.map((acc, index) => (
          <div key={index} className="acc-card">
            <div className="acc-card-header">
              <div>
                <span className="acc-source">{acc.source} • {acc.type}</span>
                <h3 className="acc-name">{acc.name}</h3>
              </div>
              <div className="acc-rating">
                ★ {acc.rating}
              </div>
            </div>
            
            <p className="acc-desc">{acc.description}</p>
            
            <div className="acc-footer">
              <div className="acc-price-wrap">
                <span className="acc-price">₹{acc.price?.toLocaleString('en-IN') || acc.price}</span>
                <span className="acc-per-night">/ night</span>
              </div>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(acc.name + ' ' + destination + ' booking')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline acc-book-btn"
                style={{ textDecoration: 'none' }}
              >
                View Deal
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
