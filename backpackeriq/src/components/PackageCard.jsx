export default function PackageCard({ pkg }) {
  return (
    <div className="bg-white rounded-card border border-mist p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-1">
        <p className="font-display text-lg text-ink leading-snug">{pkg.name}</p>
        <span className="shrink-0 text-xs font-mono bg-trail/10 text-trail-dark px-2 py-1 rounded-full">
          {pkg.rating} &#9733;
        </span>
      </div>
      <p className="text-sm text-ink/50 mb-1">
        {pkg.operator} &middot; {pkg.groupSize}
      </p>
      <p className="text-sm text-ink/40 mb-4">{pkg.inclusions}</p>
      <div className="flex items-center justify-between">
        <p className="font-mono text-lg text-ink">
          &#8377;{pkg.price.toLocaleString('en-IN')}
          <span className="text-xs text-ink/40 font-sans"> /person</span>
        </p>
        <a
          href={pkg.bookingLink}
          className="h-9 px-4 rounded-lg border border-mist text-xs font-medium text-ink/70 flex items-center hover:border-ink/30 transition-colors"
        >
          Book on {pkg.operator}
        </a>
      </div>
    </div>
  )
}
