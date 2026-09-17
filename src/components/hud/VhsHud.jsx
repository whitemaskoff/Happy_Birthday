import { useEffect, useState } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function VhsHud({ running, era = 'future' }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const total = 12 * 3600 + 6 * 60 + tick
  const h = Math.floor(total / 3600) % 24
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const date = era === 'present' ? 'SEP. 17 2026' : 'SEP. 18 2035'

  if (!running) return null

  return (
    <div className="vhs-hud" aria-hidden="true">
      <span className="vhs-play">▶ PLAY</span>
      <span className="vhs-brand">VHS</span>
      <div className="vhs-stamp">
        <div>
          {pad(h)}:{pad(m)}:{pad(s)}
        </div>
        <div>{date}</div>
      </div>
    </div>
  )
}
