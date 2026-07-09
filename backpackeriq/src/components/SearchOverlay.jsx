import { useState } from 'react'
import { searchIndex } from '../data/mockData'

export default function SearchOverlay({ onLocate }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results =
    query.trim().length > 0
      ? searchIndex
          .filter((item) =>
            item.name.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 6)
      : []

  function handleSelect(result) {
    onLocate(result)
    setQuery(result.name)
    setOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white rounded-full border border-mist shadow-sm px-4 h-11">
        <span className="text-ink/40 text-sm">&#9906;</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search a state or city"
          className="flex-1 outline-none text-sm bg-transparent placeholder:text-ink/40"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-13 left-0 right-0 mt-2 bg-white rounded-xl border border-mist shadow-md overflow-hidden z-20">
          {results.map((r) => (
            <button
              key={`${r.type}-${r.name}`}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-2.5 hover:bg-paper transition-colors flex items-center justify-between"
            >
              <span className="text-sm text-ink">{r.name}</span>
              <span className="text-xs text-ink/40 font-mono">
                {r.type === 'state' ? 'state' : r.state}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
