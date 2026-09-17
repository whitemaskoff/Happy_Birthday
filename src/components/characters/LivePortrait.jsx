import { useEffect, useRef } from 'react'

export default function LivePortrait({ className = '', mood = 'future' }) {
  const root = useRef(null)
  const lPupil = useRef(null)
  const rPupil = useRef(null)
  const hair = useRef(null)
  const lids = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!el) return undefined
    let blinkTimer
    let raf
    let t = 0
    const look = (x, y) => {
      const rect = el.getBoundingClientRect()
      const nx = ((x - rect.left) / rect.width - 0.5) * 2
      const ny = ((y - rect.top) / rect.height - 0.5) * 2
      const px = Math.max(-1, Math.min(1, nx)) * 5.5
      const py = Math.max(-1, Math.min(1, ny)) * 4
      if (lPupil.current) lPupil.current.setAttribute('transform', `translate(${px} ${py})`)
      if (rPupil.current) rPupil.current.setAttribute('transform', `translate(${px} ${py})`)
    }
    const onMove = (e) => look(e.clientX, e.clientY)
    const tick = () => {
      t += 0.03
      if (hair.current) {
        hair.current.setAttribute('transform', `rotate(${Math.sin(t) * 1.6} 80 42)`)
      }
      raf = requestAnimationFrame(tick)
    }
    const blink = () => {
      if (!lids.current) return
      lids.current.setAttribute('opacity', '1')
      setTimeout(() => lids.current?.setAttribute('opacity', '0'), 140)
      blinkTimer = setTimeout(blink, 2800 + Math.random() * 2500)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    blinkTimer = setTimeout(blink, 1200)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      clearTimeout(blinkTimer)
    }
  }, [])

  const sweater = mood === 'present' ? '#f4d7c8' : '#f3eadc'
  const trim = mood === 'present' ? '#ff8fab' : '#7ef0ff'

  return (
    <svg
      ref={root}
      viewBox="0 0 160 210"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e6b089" />
          <stop offset="100%" stopColor="#c8865d" />
        </linearGradient>
        <linearGradient id="hairg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a2418" />
          <stop offset="100%" stopColor="#1a0e0a" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={trim} stopOpacity="0.28" />
          <stop offset="100%" stopColor={trim} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="118" rx="62" ry="78" fill="url(#glow)" />
      <ellipse cx="80" cy="175" rx="46" ry="28" fill={sweater} />
      <path d="M34 168c8-28 24-40 46-40s38 12 46 40" fill={sweater} />
      <rect x="36" y="166" width="88" height="8" rx="3" fill={trim} opacity="0.85" />
      <g ref={hair}>
        <path
          d="M38 78c4-38 24-58 42-58 22 0 42 18 46 56 2 18-6 28-14 32-2-18-8-28-18-32-12 22-38 24-52 8-6 6-8 16-10 28-10-8-12-22-6-34z"
          fill="url(#hairg)"
        />
      </g>
      <ellipse cx="80" cy="96" rx="32" ry="36" fill="url(#skin)" />
      <path d="M52 86c8-6 16-8 28-8 14 0 24 4 30 10" fill="url(#hairg)" />
      <g>
        <ellipse cx="68" cy="98" rx="7.2" ry="8.2" fill="#fff" />
        <ellipse cx="92" cy="98" rx="7.2" ry="8.2" fill="#fff" />
        <g ref={lPupil}>
          <circle cx="68" cy="99" r="3.4" fill="#2a1810" />
          <circle cx="67" cy="97.5" r="1.1" fill="#fff" />
        </g>
        <g ref={rPupil}>
          <circle cx="92" cy="99" r="3.4" fill="#2a1810" />
          <circle cx="91" cy="97.5" r="1.1" fill="#fff" />
        </g>
        <g ref={lids} opacity="0">
          <ellipse cx="68" cy="98" rx="7.4" ry="8.4" fill="#c8865d" />
          <ellipse cx="92" cy="98" rx="7.4" ry="8.4" fill="#c8865d" />
        </g>
      </g>
      <path d="M78 106c1.4 2 3.2 2 4.4 0" stroke="#a06648" strokeWidth="1.2" fill="none" />
      <path d="M72 116c5 5 12 5 17 0" stroke="#b45a5a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="58" cy="110" r="3.2" fill="#e89a8a" opacity="0.45" />
      <circle cx="102" cy="110" r="3.2" fill="#e89a8a" opacity="0.45" />
      <circle cx="54" cy="108" r="2.2" fill="#d4b15a" />
      <circle cx="106" cy="108" r="2.2" fill="#d4b15a" />
    </svg>
  )
}
