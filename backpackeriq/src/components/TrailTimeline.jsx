export default function TrailTimeline({ activities }) {
  return (
    <ol className="relative pl-7">
      <div
        className="trail-line absolute left-[7px] top-2 bottom-2 w-[2px]"
        aria-hidden="true"
      />
      {activities.map((stop, i) => (
        <li key={i} className="relative pb-7 last:pb-0 fade-in-up">
          <span
            className="waypoint-dot absolute -left-7 top-1 w-3 h-3 rounded-full bg-trail"
            aria-hidden="true"
          />
          <p className="font-mono text-xs text-trail-dark tracking-wide">
            {stop.time}
          </p>
          <p className="font-display text-lg text-ink mt-0.5">{stop.name}</p>
          <p className="text-sm text-ink/60 mt-0.5">
            {stop.duration} &middot; {stop.cost}
          </p>
          <p className="text-sm text-ink/50 italic mt-0.5">{stop.note}</p>
        </li>
      ))}
    </ol>
  )
}
