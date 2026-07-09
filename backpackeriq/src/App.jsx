import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import MapExplorer from './components/MapExplorer'
import MapTopBar from './components/MapTopBar'
import PlanFab from './components/PlanFab'
import CitySheet from './components/CitySheet'
import PlanModal from './components/PlanModal'
import Navbar from './components/Navbar'
import Results from './pages/Results'
import { indiaCenter } from './data/mockData'

export default function App() {
  const [phase, setPhase] = useState('splash') // splash | map | results
  const [trip, setTrip] = useState(null)

  const [focusedState, setFocusedState] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null) // { city, state }
  const [flyTarget, setFlyTarget] = useState(null)

  const [planOpen, setPlanOpen] = useState(false)
  const [planPreset, setPlanPreset] = useState(null)

  function handleSelectState(state) {
    setFocusedState(state.name)
    setSelectedCity(null)
    setFlyTarget({ lat: state.lat, lng: state.lng, zoom: state.zoom })
  }

  function handleSelectCity(city, state) {
    setSelectedCity({ city: city.name, state })
    setFlyTarget({ lat: city.lat, lng: city.lng, zoom: 10.5 })
  }

  function handleLocate(result) {
    if (result.type === 'state') {
      handleSelectState(result)
    } else {
      setFocusedState(result.state)
      setSelectedCity({ city: result.name, state: result.state })
      setFlyTarget({ lat: result.lat, lng: result.lng, zoom: 10.5 })
    }
  }

  function handleResetView() {
    setFocusedState(null)
    setSelectedCity(null)
    setFlyTarget({ ...indiaCenter })
  }

  function openPlanFromSheet(city, state) {
    setPlanPreset({ city, state })
    setPlanOpen(true)
  }

  function openPlanFresh() {
    setPlanPreset(null)
    setPlanOpen(true)
  }

  function handleGenerate(tripData) {
    setTrip(tripData)
    setPlanOpen(false)
    setSelectedCity(null)
    setPhase('results')
  }

  function handleBackFromResults() {
    setTrip(null)
    setPhase('map')
  }

  if (phase === 'splash') {
    return <SplashScreen onDone={() => setPhase('map')} />
  }

  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-paper font-body">
        <Navbar />
        <Results trip={trip} onBack={handleBackFromResults} />
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body">
      <MapExplorer
        focusedState={focusedState}
        onSelectState={handleSelectState}
        onSelectCity={handleSelectCity}
        flyTarget={flyTarget}
      />

      <MapTopBar
        focusedState={focusedState}
        onLocate={handleLocate}
        onResetView={handleResetView}
      />

      {!selectedCity && <PlanFab onClick={openPlanFresh} />}

      {selectedCity && (
        <CitySheet
          city={selectedCity.city}
          state={selectedCity.state}
          onPlan={openPlanFromSheet}
          onClose={() => setSelectedCity(null)}
        />
      )}

      {planOpen && (
        <PlanModal
          preset={planPreset}
          onGenerate={handleGenerate}
          onClose={() => setPlanOpen(false)}
        />
      )}
    </div>
  )
}
