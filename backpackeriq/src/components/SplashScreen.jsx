import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1300)
    const doneTimer = setTimeout(onDone, 1700)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-trail transition-opacity duration-400 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-14 h-14 rounded-full bg-marigold flex items-center justify-center mb-4">
        <span className="text-trail-dark font-display font-semibold text-2xl">
          B
        </span>
      </div>
      <p className="font-display text-2xl text-paper tracking-tight">
        BackpackerIQ
      </p>
      <p className="font-mono text-xs text-paper/50 mt-2 tracking-widest uppercase">
        Plan the trail
      </p>
    </div>
  )
}
