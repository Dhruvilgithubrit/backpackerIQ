export default function HostelNudge({ nudge }) {
  const savings = nudge.price - nudge.alternative.price

  return (
    <div className="bg-marigold/10 border border-marigold/30 rounded-card p-4 mb-6">
      <p className="text-sm font-medium text-ink">
        {nudge.hostelName} is {nudge.percentOfBudget}% of your daily budget
      </p>
      <p className="text-xs text-ink/50 mt-0.5 mb-3">
        &#8377;{nudge.price}/night against your &#8377;{nudge.budgetPerDay}/day target
      </p>
      <div className="flex gap-2">
        <button className="flex-1 h-9 rounded-lg bg-white border border-mist text-xs font-medium text-ink/70 hover:border-ink/30 transition-colors">
          Keep this hostel
        </button>
        <button className="flex-1 h-9 rounded-lg bg-ink text-paper text-xs font-medium hover:bg-ink/90 transition-colors">
          Switch &middot; save &#8377;{savings}
        </button>
      </div>
      <p className="text-xs text-ink/40 mt-2">
        {nudge.alternative.name} &middot; {nudge.alternative.distanceKm} km away &middot;{' '}
        {nudge.alternative.rating} rating
      </p>
    </div>
  )
}
