import { useState } from 'react'
import {
  railwayInfo,
  itineraryByVariant,
  hostelNudge,
  packages,
  packageOnlyCities,
} from '../data/mockData'
import VariantTabs from '../components/VariantTabs'
import TrailTimeline from '../components/TrailTimeline'
import RailwayCard from '../components/RailwayCard'
import HostelNudge from '../components/HostelNudge'
import PackageCard from '../components/PackageCard'

export default function Results({ trip, onBack }) {
  const hasPackages = packageOnlyCities.includes(trip.city)
  const [tab, setTab] = useState(hasPackages ? 'packages' : 'itinerary')
  const [variant, setVariant] = useState('fast')

  const itinerary = itineraryByVariant[variant]
  const railway = railwayInfo[trip.city]

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <button
        onClick={onBack}
        className="text-sm text-ink/50 hover:text-ink mb-4 transition-colors"
      >
        &larr; Change search
      </button>

      <h1 className="font-display text-3xl text-ink mb-1">{trip.city}</h1>
      <p className="text-sm text-ink/50 mb-6">
        {trip.days} days &middot; {trip.filter} &middot; &#8377;
        {trip.budget.toLocaleString('en-IN')}/day
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('itinerary')}
          className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors ${
            tab === 'itinerary'
              ? 'bg-ink text-paper border-ink'
              : 'bg-white text-ink/60 border-mist'
          }`}
        >
          Itinerary
        </button>
        {hasPackages && (
          <button
            onClick={() => setTab('packages')}
            className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors ${
              tab === 'packages'
                ? 'bg-ink text-paper border-ink'
                : 'bg-white text-ink/60 border-mist'
            }`}
          >
            Packages
          </button>
        )}
      </div>

      {tab === 'itinerary' && (
        <div>
          <VariantTabs active={variant} onChange={setVariant} />
          <RailwayCard info={railway} />

          <p className="font-display text-xl text-ink mb-4">
            Day 1 &middot; {itinerary.dayTitle}
          </p>
          <div className="bg-white rounded-card border border-mist p-5 mb-5">
            <TrailTimeline activities={itinerary.activities} />
          </div>

          <HostelNudge nudge={hostelNudge} />

          <div className="flex items-center justify-between py-3 border-t border-mist mb-5">
            <span className="text-sm text-ink/50">Day 1 total</span>
            <span className="font-mono text-ink">&#8377;{itinerary.dayTotal}</span>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 h-10 rounded-lg border border-mist bg-white text-sm font-medium text-ink/70 hover:border-ink/30 transition-colors">
              Download PDF
            </button>
            <button className="flex-1 h-10 rounded-lg border border-mist bg-white text-sm font-medium text-ink/70 hover:border-ink/30 transition-colors">
              Save trip
            </button>
          </div>
        </div>
      )}

      {tab === 'packages' && (
        <div>
          {packages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  )
}
