import { packageOnlyCities } from '../data/mockData'

export default function CitySheet({ city, state, onPlan, onClose }) {
  const isPackageCity = packageOnlyCities.includes(city)

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 fade-in-up">
      <div className="max-w-lg mx-auto bg-white rounded-t-2xl border-t border-x border-mist shadow-lg px-5 pt-4 pb-6">
        <div className="w-10 h-1 bg-mist rounded-full mx-auto mb-4" />

        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="font-display text-2xl text-ink">{city}</p>
            <p className="text-sm text-ink/50">{state}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-ink/60 my-3">
          {isPackageCity
            ? 'Permits and altitude make this a group-tour destination. Browse curated packages instead of a DIY route.'
            : 'Budget hostels, ghats, and hidden spots mapped out for a solo trip here.'}
        </p>

        <button
          onClick={() => onPlan(city, state)}
          className="w-full h-11 rounded-lg bg-marigold text-ink font-medium text-sm hover:bg-marigold-dark transition-colors"
        >
          {isPackageCity ? 'See packages' : 'Plan a trip here'}
        </button>
      </div>
    </div>
  )
}
