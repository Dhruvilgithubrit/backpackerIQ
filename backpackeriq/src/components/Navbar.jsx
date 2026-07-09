export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-mist">
      <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-trail flex items-center justify-center">
            <span className="text-marigold font-display font-semibold text-sm">
              B
            </span>
          </div>
          <span className="font-display text-lg text-ink tracking-tight">
            BackpackerIQ
          </span>
        </div>
        <button className="text-sm text-ink/60 font-medium hover:text-ink transition-colors">
          Sign in
        </button>
      </div>
    </header>
  )
}
