import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './RouteMap.css';

// Fix leafet default icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createNumberedIcon(number) {
  return L.divIcon({
    className: 'route-marker-icon',
    html: `<div class="route-marker-pin"><span>${number}</span></div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
}

function MapUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [bounds, map]);
  return null;
}

export default function RouteMap({ itinerary }) {
  // Extract all valid locations from the itinerary — guard against non-array
  const safeItinerary = Array.isArray(itinerary) ? itinerary : [];
  const locations = [];
  safeItinerary.forEach(day => {
    if (day.locations && Array.isArray(day.locations)) {
      day.locations.forEach(loc => {
        if (loc.lat && loc.lng) {
          locations.push({
            ...loc,
            dayNumber: day.day,
            dayTitle: day.title
          });
        }
      });
    }
  });

  const positions = locations.map(loc => [loc.lat, loc.lng]);
  const bounds = positions.length > 0 ? L.latLngBounds(positions) : null;

  if (positions.length === 0) {
    return <div className="route-map-empty card">No map data available for this route.</div>;
  }

  return (
    <div className="route-map-container card">
      <MapContainer 
        center={positions[0]} 
        zoom={10} 
        style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '12px' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
        
        {/* Draw lines between points */}
        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="var(--accent)" 
            weight={3} 
            opacity={0.7} 
            dashArray="8, 8"
          />
        )}

        {/* Draw markers */}
        {locations.map((loc, idx) => (
          <Marker 
            key={`${idx}-${loc.name}`} 
            position={[loc.lat, loc.lng]}
            icon={createNumberedIcon(loc.dayNumber)}
          >
            <Popup className="route-map-popup">
              <div className="route-popup-content">
                <span className="route-popup-day">Day {loc.dayNumber}</span>
                <h4>{loc.name}</h4>
                <p>{loc.dayTitle}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {bounds && <MapUpdater bounds={bounds} />}
      </MapContainer>
    </div>
  );
}
