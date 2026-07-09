# BackpackerIQ — Project Brief for Antigravity

## ⚠️ This flow and design direction are FINAL — supersedes earlier drafts

Earlier versions of this brief described a bottom-sheet-on-map flow and two
competing visual directions ("Trail" and "Digital Zen"). Both are
superseded. The flow and design system below are the ones to build.

## Design system: "Blaze" (locked)

| Token | Value | Notes |
|---|---|---|
| `ink` (text) | `#0A0A0A` | near-black |
| `paper` (background) | `#FFFFFF` | pure white |
| `accent` (blaze) | `#FF3B1F` | vivid signal orange-red. Use SPARINGLY — CTAs, active states, prices, map pins, the "Plan your next trip" button only. Everything else stays black/white/gray. |
| `line` (borders) | `#0A0A0A` | flat 2px borders — NO soft drop-shadows anywhere |
| `mist` (dividers) | `#E5E5E5` | subtle structural lines only |
| Display font | Archivo (Black/ExtraBold) | big, confident headlines |
| Body font | Inter | neutral, readable |
| Numeric/mono font | IBM Plex Mono | times, prices, day counters |

Signature visual habit: numbered index labels for itinerary variants
(`01 FAST` / `02 BALANCED` / `03 SLOW` in large Archivo type), flat black
borders instead of shadows, accent color reserved for things that matter
so it stays punchy when it appears.

Do not use: the earlier "Trail" palette (forest teal/marigold/plum/Fraunces),
or the Stitch-generated "Digital Zen" Material palette (teal `#00685f` /
purple `#4b41e1` / orange `#924628` / Geist font). Both are discarded.

## Finalized user flow

```
1. LOGIN (mandatory gate — nothing is visible before this)
   - Email + password fields
   - Google login option
   - No splash screen before this; login IS the entry point

2. HOME PAGE (after login)
   - Full map of India
   - ALL locations plotted — not just a handful of states/cities, every
     place we have data for, including small/remote ones
   - Fixed "Plan your next trip" button, bottom-center, accent color
   - Tapping a map pin can show basic info, but the main path forward is
     the button below, not necessarily the map itself

3. PLAN-TRIP PAGE (opens as its own full page, NOT a bottom sheet/modal)
   - "Most popular places" section (image cards)
   - ALL states shown as image cards (one representative photo per state)
   - A single search bar — NO dropdown menus for state/city selection.
     Search is the only input method for choosing a destination.

4. SEARCH RESULTS (user has searched/selected a destination)
   - AI generates 3 itinerary variants (Fast/Balanced/Slow — same logic
     as before: real travel time between coordinates, opening hours,
     rush-hour avoidance, ~2km walking limit with luggage, budget fit)
   - IF a package exists for this destination: a separate package
     section appears BESIDE the itinerary section (side-by-side layout,
     not a tab switch like earlier drafts had)
   - IF no package exists: only the itinerary section shows, full width

5. ADMIN DASHBOARD (separate auth, not linked from public site)
   - CRUD for every place/destination shown in search — admin controls
     what's searchable and what data (hours, cost, images, coordinates)
     each place has
   - Since most destinations will NOT have a package, admin manually
     writes a package description (operator, price, inclusions, booking
     link) only for the specific destinations that have one — packages
     are not auto-generated or expected for every place
```

## What already exists (reference material, not final)

**`backpackeriq/`** — earlier React + Vite + Tailwind + Leaflet scaffold.
The Leaflet map implementation (`MapExplorer.jsx`) is real and working
(actual pan/zoom, real lat/lng markers) — reuse this map logic, but note
the FLOW built around it (splash → tap state → tap city → bottom sheet →
modal) is now outdated per the flow above. The map becomes the home
page's background map showing ALL locations, not a state-then-city
drill-down gate.

**`stitch-screens/`** — Stitch-generated HTML prototypes in the discarded
"Digital Zen" visual style. Useful ONLY for layout/structure reference
(e.g. the admin table structure, the itinerary timeline layout, the
plan-trip page's image-card grid concept) — restyle everything using the
Blaze design system above, and note the flow differences per section 3-4
above (no dropdowns, side-by-side packages not tabs).

## Full feature list (build order suggestion)

1. Login page (email/password + Google) — auth gate, nothing else
   accessible without it
2. Home page: full India map (all locations), fixed "Plan your next
   trip" button
3. Plan-trip page: popular places + state image cards + search bar (no
   dropdowns)
4. Search results: itinerary variants + conditional package section
   beside it
5. Admin dashboard: place/destination CRUD + manual package entry per
   destination (separate auth from user login)
6. Backend: Node.js + Express, `/api/generate-itinerary` endpoint,
   Groq API (Llama 3 70B, free tier) with the constraint-aware prompt
   (travel time, hours, budget, luggage distance)
7. Database: Supabase (Postgres) — `states`, `cities`/`places` (lat/lng,
   hours, cost, images), `hostels` (multi-platform pricing links, no
   affiliate partnership needed), `tour_packages` (manually entered,
   operator/price/inclusions/booking link/active status), `users`,
   `saved_itineraries`
8. PDF export, save-trip, multi-day accordion (only Day 1 has been
   designed in detail so far — loop the itinerary timeline per day once
   backend returns full multi-day arrays)

## Known constraints to respect (unchanged)

- No scraping (Hostelworld/Google Maps/Booking.com ToS) — official APIs
  or manual data entry only
- No ads — monetization is affiliate links + optional premium tier +
  package operator partnerships
- Admin auth completely separate from user auth — regular users must
  never reach admin routes, and admin screens must never show public
  Login/Sign Up buttons
- No scraping-based "fake map" — the India map must be a real, working
  Leaflet (or equivalent) map with actual geographic pan/zoom, not a
  decorative shader/image with hardcoded pixel-position pins


## Suggested task breakdown for Antigravity

1. **Plan mode first**: review `backpackeriq/` (old React scaffold) and
   `stitch-screens/` (old Digital Zen prototypes), confirm you understand
   the flow differences described above before writing code.
2. Build the login page (auth gate) first — this is the true entry point.
3. Build the home page: full India map (port the working Leaflet logic
   from `MapExplorer.jsx`, restyle to Blaze design system, plot ALL
   locations not just 4 states), fixed "Plan your next trip" button.
4. Build the plan-trip page: popular places section, state image-card
   grid, search bar (no dropdowns — remove the old SearchForm's
   dropdown-based city/state selectors entirely).
5. Build search results: itinerary variant display + conditional
   package section beside it (side-by-side CSS grid/flex layout, not a
   tab component).
6. Set up Supabase project + schema (tables listed above).
7. Build the Express backend + Groq API integration for itinerary
   generation.
8. Build admin dashboard (separate auth) for place/destination CRUD +
   manual package entry.
9. Wire up PDF export, save-trip, multi-day accordion.

Verify each step in-browser (screenshot via browser subagent) before
moving to the next — especially step 2 (login gate must actually block
access) and step 5 (package section must only appear conditionally).
