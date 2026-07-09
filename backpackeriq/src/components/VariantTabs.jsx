import { variantMeta } from '../data/mockData'

export default function VariantTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {variantMeta.map((v) => {
        const isActive = active === v.id
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`flex-1 rounded-lg py-2.5 text-center border transition-colors ${
              isActive
                ? 'border-trail bg-trail/10'
                : 'border-mist bg-white hover:border-trail/30'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isActive ? 'text-trail-dark' : 'text-ink/70'
              }`}
            >
              {v.label}
            </p>
            <p
              className={`text-xs font-mono mt-0.5 ${
                isActive ? 'text-trail-dark' : 'text-ink/40'
              }`}
            >
              &#8377;{v.costPerDay}/day
            </p>
          </button>
        )
      })}
    </div>
  )
}
