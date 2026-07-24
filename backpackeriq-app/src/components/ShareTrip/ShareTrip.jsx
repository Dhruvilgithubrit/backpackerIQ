import { useState } from 'react'
import './ShareTrip.css'

export default function ShareTrip({ destination, days, budget }) {
  const [copied, setCopied] = useState(false)

  const shareUrl  = window.location.href
  const shareText = `Check out my ${days}-day ${destination} itinerary on BackpackerIQ! 🎒✈️`
  const wpText    = encodeURIComponent(`${shareText}\n${shareUrl}`)
  const twText    = encodeURIComponent(`${shareText} ${shareUrl} #BackpackerIQ #IndiaTravel`)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({ title: `${destination} Trip`, text: shareText, url: shareUrl })
    }
  }

  return (
    <div className="st-root">
      <p className="st-label">Share this trip</p>
      <div className="st-buttons">
        {/* Copy link */}
        <button
          className={`st-btn st-btn--copy ${copied ? 'st-btn--copied' : ''}`}
          onClick={copyLink}
          id="share-copy-btn"
        >
          {copied ? (
            <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
          ) : (
            <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="3" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-primary)"/></svg> Copy link</>
          )}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${wpText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="st-btn st-btn--whatsapp"
          id="share-whatsapp-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>

        {/* Twitter/X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${twText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="st-btn st-btn--twitter"
          id="share-twitter-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share
        </a>

        {/* PDF */}
        <button className="st-btn st-btn--pdf" onClick={() => window.print()} id="share-pdf-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PDF
        </button>

        {/* Native share (mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button className="st-btn st-btn--native" onClick={nativeShare} id="share-native-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10 1l3 3-3 3M13 4H5a3 3 0 000 6h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            More
          </button>
        )}
      </div>
    </div>
  )
}
