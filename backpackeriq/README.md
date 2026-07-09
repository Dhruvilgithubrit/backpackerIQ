# BackpackerIQ — Frontend Base

React + Vite + Tailwind + Leaflet. Runs entirely on mock data in
`src/data/mockData.js` — no backend yet.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL.

## The flow

1. **Splash screen** — software name, auto-dismisses after ~1.7s
2. **Map screen** — full-screen Leaflet map of India
   - Tap a state marker (green) → map flies in, reveals city markers (marigold) for that state
   - Tap a city marker → bottom sheet slides up with the city name and a
     "Plan a trip here" / "See packages" button (Spiti Valley shows the
     packages variant, since it's in `packageOnlyCities`)
   - Search bar (top) — type a state or city name, autocomplete jumps the
     map straight there
   - "Back to full map" button appears once you've drilled into a state
   - "Plan your next trip" floating button — opens the same plan form
     without needing to touch the map (manual state/city dropdowns)
3. **Plan modal** — the original search form (days slider, filter chips,
   budget slider), pre-filled if you came from a map marker
4. **Results screen** — Itinerary/Packages tabs, Fast/Balanced/Slow
   variants, trail timeline, railway card, budget nudge (same as before)

## Map implementation notes

- Uses `react-leaflet` + OpenStreetMap tiles (free, no API key needed).
  Requires internet access at runtime to load map tiles — this only
  matters when you actually run it in a browser, not during `npm run build`.
- State/city markers are custom `divIcon` pill labels (not default pins),
  styled to match the app's palette — avoids Leaflet's default marker
  icon path issue with Vite bundling.
- Drill-down (state → city) is done by swapping which marker set renders
  based on `focusedState`, not real GeoJSON state boundaries. Good enough
  for MVP; if you want actual state boundary outlines later, look at
  `react-leaflet-geojson` with an India states GeoJSON file.
- All coordinates in `mockData.js` are approximate city/state centers —
  fine for marker placement, not precise enough for real distance math
  (your backend will handle real routing distance later).

## What's NOT wired up yet (by design — this is the base)

- No routing library — phase is just local state in `App.jsx` (`splash`,
  `map`, `results`). Add `react-router-dom` once you have more pages
  (login, saved trips, profile) and want real URLs/back-button support.
- No API calls — swap `mockData.js` reads for real `fetch()` calls.
  Components expect the same data shape either way.
- No auth — "Sign in" button is a placeholder.
- No PDF export / save-trip persistence — buttons are visual only.
- Only Day 1 renders in results — loop `TrailTimeline` per day once your
  backend returns the full multi-day array.

## File map

```
src/
  components/
    SplashScreen.jsx     — intro screen
    MapExplorer.jsx       — the Leaflet map + markers
    MapTopBar.jsx          — logo, search, back-to-map button (map screen overlay)
    SearchOverlay.jsx      — autocomplete search input
    PlanFab.jsx             — floating "Plan your next trip" button
    CitySheet.jsx           — bottom sheet on city marker tap
    PlanModal.jsx           — modal wrapping SearchForm
    SearchForm.jsx          — days/filter/budget inputs (now accepts presetState/presetCity)
    Navbar.jsx              — used on the Results screen only
    VariantTabs.jsx         — Fast/Balanced/Slow switcher
    TrailTimeline.jsx       — signature route-line component
    RailwayCard.jsx
    HostelNudge.jsx
    PackageCard.jsx
  pages/
    Results.jsx
  data/
    mockData.js            — swap this for real API responses
  App.jsx                  — phase orchestration (splash/map/results)
  index.css                — Tailwind + trail-line CSS
tailwind.config.js         — color/font tokens (trail, marigold, dusk, mist)
```

## Design tokens

- `trail` (#2F5D50) — primary, state markers
- `marigold` (#E3A020) — accent, city markers, CTAs
- `dusk` (#6B4C6B) — secondary accent, sparingly
- `paper` (#EDE9DC) — background
- `mist` (#C9C2AE) — borders
- Fonts: `font-display` (Fraunces, headings), `font-body` (Inter, default),
  `font-mono` (IBM Plex Mono, times/prices)
