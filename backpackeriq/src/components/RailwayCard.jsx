export default function RailwayCard({ info }) {
  if (!info) return null

  return (
    <div className="flex items-start gap-3 bg-white rounded-card border border-mist p-4 mb-5">
      <div className="w-8 h-8 rounded-full bg-dusk/10 flex items-center justify-center shrink-0">
        <span className="text-dusk font-mono text-sm">&#8594;</span>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">
          {info.station}{' '}
          <span className="text-ink/40 font-normal">
            &middot; {info.distanceKm} km from hostel area
          </span>
        </p>
        <p className="text-xs text-ink/50 mt-0.5">
          Auto &#8377;{info.autoFare} ({info.autoTime}) &middot; Bus &#8377;
          {info.busFare} ({info.busTime})
        </p>
      </div>
    </div>
  )
}
