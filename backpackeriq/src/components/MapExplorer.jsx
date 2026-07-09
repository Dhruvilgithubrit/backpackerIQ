import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { indiaCenter, statesGeo, citiesGeo } from '../data/mockData'

function labeledIcon(label, bg, fg) {
  return divIcon({
    className: '',
    html: `<div style="
      background:${bg}; color:${fg}; font-family:Inter,sans-serif;
      font-size:11px; font-weight:600; padding:6px 12px; border-radius:999px;
      white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.25); border:2px solid #EDE9DC;
      transform:translate(-50%,-50%);
    ">${label}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function FlyToController({ target }) {
  const map = useMap()
  if (target) {
    map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.9 })
  }
  return null
}

export default function MapExplorer({
  focusedState,
  onSelectState,
  onSelectCity,
  flyTarget,
}) {
  return (
    <MapContainer
      center={[indiaCenter.lat, indiaCenter.lng]}
      zoom={indiaCenter.zoom}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {flyTarget && <FlyToController target={flyTarget} />}

      {!focusedState &&
        statesGeo.map((s) => (
          <Marker
            key={s.name}
            position={[s.lat, s.lng]}
            icon={labeledIcon(s.name, '#2F5D50', '#EDE9DC')}
            eventHandlers={{ click: () => onSelectState(s) }}
          />
        ))}

      {focusedState &&
        citiesGeo[focusedState].map((c) => (
          <Marker
            key={c.name}
            position={[c.lat, c.lng]}
            icon={labeledIcon(c.name, '#E3A020', '#1B2B22')}
            eventHandlers={{ click: () => onSelectCity(c, focusedState) }}
          />
        ))}
    </MapContainer>
  )
}
