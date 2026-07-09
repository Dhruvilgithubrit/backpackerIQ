export default function PlanFab({ onClick }) {
  return (
    <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-4">
      <button
        onClick={onClick}
        className="h-12 px-6 rounded-full bg-ink text-paper font-medium text-sm shadow-lg hover:bg-ink/90 transition-colors"
      >
        Plan your next trip
      </button>
    </div>
  )
}
