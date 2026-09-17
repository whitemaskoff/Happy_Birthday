import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const RiveCompanion = lazy(() => import('./RiveCompanion'))

export default function Companion({ mood = 'idle', enabled = true }) {
  const wrap = useRef(null)
  const [hop, setHop] = useState(false)
  const [riveOk, setRiveOk] = useState(null)

  useEffect(() => {
    fetch('/rive/companion.riv')
      .then(async (r) => {
        const type = r.headers.get('content-type') || ''
        if (!r.ok || type.includes('text/html')) {
          setRiveOk(false)
          return
        }
        const buf = await r.arrayBuffer()
        setRiveOk(buf.byteLength > 32)
      })
      .catch(() => setRiveOk(false))
  }, [])

  useEffect(() => {
    const el = wrap.current
    if (!el || !enabled) return undefined
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = (e.clientX - (rect.left + rect.width / 2)) / 28
      const dy = (e.clientY - (rect.top + rect.height / 2)) / 36
      el.style.transform = `translate(${Math.max(-14, Math.min(14, dx))}px, ${Math.max(-10, Math.min(10, dy))}px) rotate(${dx * 0.6}deg)`
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  useEffect(() => {
    if (mood === 'celebrate') {
      setHop(true)
      const id = setTimeout(() => setHop(false), 700)
      return () => clearTimeout(id)
    }
    return undefined
  }, [mood])

  if (!enabled) return null

  if (riveOk) {
    return (
      <button
        type="button"
        className="fixed bottom-4 right-4 z-30 h-28 w-28"
        onClick={() => setHop(true)}
        aria-label="Companion"
      >
        <Suspense fallback={null}>
          <RiveCompanion src="/rive/companion.riv" />
        </Suspense>
      </button>
    )
  }

  return (
    <button
      type="button"
      ref={wrap}
      className="fixed bottom-3 right-3 z-30 h-16 w-16 origin-bottom transition-transform duration-200 md:bottom-6 md:right-6 md:h-28 md:w-28"
      onClick={() => {
        setHop(true)
        setTimeout(() => setHop(false), 600)
      }}
      aria-label="Signal kitten"
    >
      <img
        src="/illustrations/companion-kitten.jpg"
        alt=""
        className={`h-full w-full rounded-full object-cover shadow-[0_0_24px_rgba(126,240,255,0.35)] ring-1 ring-cyan-200/40 ${
          hop ? 'animate-[hop_0.6s_ease]' : 'animate-[floaty_3s_ease-in-out_infinite]'
        }`}
      />
    </button>
  )
}
