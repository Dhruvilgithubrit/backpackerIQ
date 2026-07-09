import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { places, indiaCenter } from '../../data/locationsData'
import './IndiaMap.css'

/**
 * Custom accent pin. Popular places get a slightly larger ring.
 * All pins use --accent (#FF3B1F) per the Blaze brief.
 */
function createPinIcon(popular, packageOnly) {
  const cls = [
    'biq-pin',
    popular      ? 'biq-pin--popular' : '',
    packageOnly  ? 'biq-pin--pkg'     : '',
  ].filter(Boolean).join(' ')

  return divIcon({
    className: '',
    html: `<div class="${cls}"><div class="biq-pin-dot"></div></div>`,
    iconSize:    [14, 14],
    iconAnchor:  [7, 7],
    popupAnchor: [0, -10],
  })
}

export default function IndiaMap() {
  return (
    <MapContainer
      center={[indiaCenter.lat, indiaCenter.lng]}
      zoom={indiaCenter.zoom}
      className="india-map"
      zoomControl={false}
      attributionControl={true}
      minZoom={4}
      maxZoom={14}
    >
      {/* CartoDB Positron — clean light tiles that let accent pins pop */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Zoom controls bottom-right, away from main CTA */}
      <ZoomControl position="bottomright" />

      {/* Plot all 38 places */}
      {places.map(place => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={createPinIcon(place.popular, place.packageOnly)}
        >
          <Popup className="biq-popup" minWidth={220} maxWidth={280}>
            <div className="biq-popup-inner">
              <p className="biq-popup-state">{place.stateName}</p>
              <h3 className="biq-popup-name">{place.name}</h3>
              <p className="biq-popup-detail">
                <span className="biq-popup-icon">⏱</span>
                {place.openingHours}
              </p>
              <p className="biq-popup-cost">{place.costRange}</p>
              {place.packageOnly && (
                <p className="biq-popup-pkg-note">
                  Package recommended — permits &amp; logistics required
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
