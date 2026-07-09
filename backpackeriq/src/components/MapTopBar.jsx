import SearchOverlay from './SearchOverlay'

export default function MapTopBar({ focusedState, onLocate, onResetView }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-trail flex items-center justify-center shadow-sm">
              <span className="text-marigold font-display font-semibold text-sm">
                B
              </span>
            </div>
            <span className="font-display text-lg text-ink tracking-tight drop-shadow-sm">
              BackpackerIQ
            </span>
          </div>
          <button className="h-9 px-4 rounded-full bg-white border border-mist text-sm font-medium text-ink/70 shadow-sm">
            Sign in
          </button>
        </div>

        <SearchOverlay onLocate={onLocate} />

        {focusedState && (
          <button
            onClick={onResetView}
            className="mt-3 h-9 px-4 rounded-full bg-white border border-mist shadow-sm text-sm font-medium text-ink/70 hover:text-ink transition-colors"
          >
            &larr; Back to full map
          </button>
        )}
      </div>
    </div>
  )
}
