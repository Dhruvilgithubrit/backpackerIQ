import SearchForm from './SearchForm'

export default function PlanModal({ preset, onGenerate, onClose }) {
  return (
    <div className="fixed inset-0 z-40 bg-ink/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
      <div className="w-full max-w-lg bg-paper rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto fade-in-up">
        <div className="flex items-center justify-between px-5 pt-5">
          <p className="font-display text-xl text-ink">Plan your trip</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-mist flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-5">
          <SearchForm
            presetState={preset?.state}
            presetCity={preset?.city}
            onGenerate={onGenerate}
          />
        </div>
      </div>
    </div>
  )
}
