export const indiaCenter = { lat: 22.9734, lng: 78.6569, zoom: 5 }

export const statesGeo = [
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, zoom: 7 },
  { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, zoom: 6.5 },
  { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, zoom: 7.5 },
  { name: 'Goa', lat: 15.2993, lng: 74.124, zoom: 9.5 },
]

export const citiesGeo = {
  'Uttar Pradesh': [
    { name: 'Kashi (Varanasi)', lat: 25.3176, lng: 82.9739 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  ],
  Rajasthan: [
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
  ],
  'Himachal Pradesh': [
    { name: 'Manali', lat: 32.2432, lng: 77.1892 },
    { name: 'Spiti Valley', lat: 32.2461, lng: 78.0092 },
  ],
  Goa: [
    { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    { name: 'Arambol', lat: 15.6869, lng: 73.7051 },
  ],
}

// Derived, kept for backward compatibility with SearchForm
export const states = statesGeo.map((s) => s.name)
export const citiesByState = Object.fromEntries(
  Object.entries(citiesGeo).map(([state, cities]) => [
    state,
    cities.map((c) => c.name),
  ])
)

// Flat list for the map search bar's autocomplete
export const searchIndex = [
  ...statesGeo.map((s) => ({
    type: 'state',
    name: s.name,
    lat: s.lat,
    lng: s.lng,
    zoom: s.zoom,
  })),
  ...Object.entries(citiesGeo).flatMap(([state, cities]) =>
    cities.map((c) => ({
      type: 'city',
      name: c.name,
      state,
      lat: c.lat,
      lng: c.lng,
    }))
  ),
]

// Cities where DIY itinerary planning is impractical (permits, altitude, remote roads)
export const packageOnlyCities = ['Spiti Valley']

export const filters = ['Culture', 'Adventure', 'Food']

export const railwayInfo = {
  'Kashi (Varanasi)': {
    station: 'Varanasi Junction (BSB)',
    distanceKm: 3.5,
    autoFare: '80-120',
    autoTime: '15-20 min',
    busFare: '20',
    busTime: '30-40 min',
  },
}

export const variantMeta = [
  { id: 'fast', label: 'Fast', costPerDay: 850 },
  { id: 'balanced', label: 'Balanced', costPerDay: 717 },
  { id: 'slow', label: 'Slow', costPerDay: 483 },
]

export const itineraryByVariant = {
  fast: {
    dayTitle: 'Arrival and spirituality',
    dayTotal: '1,000 - 1,200',
    activities: [
      { time: '5:30 AM', name: 'Ghat walks at sunrise', duration: '1.5 hrs', cost: 'Free', note: 'Dashashwamedh Ghat' },
      { time: '9:00 AM', name: 'Varanasi Ghats exploration', duration: '2.5 hrs', cost: 'Free', note: '10 min walk from hostel' },
      { time: '1:15 PM', name: 'Kashi Vishwanath temple', duration: '1.5 hrs', cost: 'Free + guide 300', note: 'Closes 11 PM - avoid 4-8 PM crowd' },
      { time: '5:30 PM', name: 'Boat ride and evening aarti', duration: '1.5 hrs', cost: '300-500', note: 'Dashashwamedh Ghat, sunset' },
    ],
  },
  balanced: {
    dayTitle: 'Ghats and temple, unhurried',
    dayTotal: '800 - 950',
    activities: [
      { time: '6:30 AM', name: 'Ghat walk at sunrise', duration: '1.5 hrs', cost: 'Free', note: 'Dashashwamedh Ghat' },
      { time: '10:00 AM', name: 'Kashi Vishwanath temple', duration: '1.5 hrs', cost: 'Free', note: 'Moderate crowd this hour' },
      { time: '5:00 PM', name: 'Boat ride and evening aarti', duration: '1.5 hrs', cost: '300-500', note: 'Best light just before sunset' },
    ],
  },
  slow: {
    dayTitle: 'One ghat, no rush',
    dayTotal: '400 - 550',
    activities: [
      { time: '7:00 AM', name: 'Ghat walk at sunrise', duration: '2 hrs', cost: 'Free', note: 'Dashashwamedh Ghat' },
      { time: '6:00 PM', name: 'Evening aarti from the steps', duration: '1 hr', cost: 'Free', note: 'Watch from the ghat, skip the boat' },
    ],
  },
}

export const hostelNudge = {
  hostelName: 'Zostel Udaipur',
  price: 450,
  budgetPerDay: 1000,
  percentOfBudget: 45,
  alternative: { name: 'Hostel Moustache', price: 280, distanceKm: 1.2, rating: 4.4 },
}

export const packages = [
  {
    operator: 'Invincible Trip',
    name: 'Spiti Valley 7D/6N group tour',
    groupSize: '10-15 people',
    inclusions: 'Stay, meals, transport and permits included',
    price: 12999,
    rating: 4.6,
    bookingLink: '#',
  },
  {
    operator: 'Indiahikes',
    name: 'Spiti Valley trek 6D',
    groupSize: 'Small groups',
    inclusions: 'Guide, camping, meals and permits included',
    price: 9999,
    rating: 4.8,
    bookingLink: '#',
  },
]
