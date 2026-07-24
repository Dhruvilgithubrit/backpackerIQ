import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { destinations, categoryColors } from '../../data/destinationsData'
import DestinationModal from '../DestinationModal/DestinationModal'
import './IndiaMap.css'

const indiaCenter = { lat: 22.9734, lng: 78.6569, zoom: 5 }

function createPinIcon(primaryCategory) {
  const color = categoryColors[primaryCategory] || '#FF3B1F'
  return divIcon({
    className: '',
    html: `<div class="biq-pin" style="--pin-color:${color}"><div class="biq-pin-dot"></div></div>`,
    iconSize:    [14, 14],
    iconAnchor:  [7, 7],
    popupAnchor: [0, -10],
  })
}

const CATEGORY_ICONS = {
  beach: '🏖️', mountain: '⛰️', culture: '🏛️', heritage: '🏰',
  adventure: '🧗', food: '🍛', wildlife: '🐅', spiritual: '🕌',
}

export default function IndiaMap() {
  const [modalDest, setModalDest] = useState(null)

  return (
    <>
      <MapContainer
        center={[indiaCenter.lat, indiaCenter.lng]}
        zoom={indiaCenter.zoom}
        className="india-map"
        zoomControl={false}
        attributionControl={true}
        minZoom={4}
        maxZoom={14}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />

        {destinations.map((dest, index) => (
          <Marker
            key={`${dest.id}-${index}`}
            position={[dest.latitude, dest.longitude]}
            icon={createPinIcon(dest.category?.[0] || 'culture')}
            eventHandlers={{ click: () => setModalDest(dest) }}
          >
            <Popup className="biq-popup" minWidth={200} maxWidth={260}>
              <div className="biq-popup-inner">
                <p className="biq-popup-state">{dest.state}</p>
                <h3 className="biq-popup-name">{dest.name}</h3>
                {dest.budget_range && (
                  <p className="biq-popup-cost">{dest.budget_range}</p>
                )}
                <p className="biq-popup-cats">
                  {(dest.category || []).slice(0,2).map(c =>
                    <span key={c} className="biq-popup-cat">{CATEGORY_ICONS[c] || '📍'} {c}</span>
                  )}
                </p>
                <button
                  className="biq-popup-plan-btn"
                  onClick={() => setModalDest(dest)}
                >
                  View details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {modalDest && (
        <DestinationModal
          destination={modalDest}
          onClose={() => setModalDest(null)}
        />
      )}
    </>
  )
}
