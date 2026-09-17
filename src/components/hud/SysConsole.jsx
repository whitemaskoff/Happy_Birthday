import { useEffect, useMemo, useState } from 'react'
import { soundtrack } from '../../lib/audio'

export default function SysConsole({ beats, onDone }) {
  const rows = useMemo(
    () => ['> handshake…', '> lock acquired', ...beats],
    [beats],
  )
  const [n, setN] = useState(0)

  useEffect(() => {
    soundtrack.sysTick()
    if (n >= rows.length) {
      const id = setTimeout(onDone, 1300)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setN((x) => x + 1), n === 0 ? 420 : 780)
    return () => clearTimeout(id)
  }, [n, onDone, rows.length])

  return (
    <div className="sys">
      <div className="sys-head">INCOMING LINK</div>
      {rows.slice(0, n).map((row, i) => (
        <div key={i} className={`sys-row ${row.startsWith('>') ? 'muted' : ''}`}>
          {row}
        </div>
      ))}
      <span className="sys-cursor">█</span>
    </div>
  )
}

export function AlertPanel({ title, year }) {
  return (
    <div className="alert">
      <div className="alert-head">⚠ SYSTEM ALERT — CRITICAL</div>
      <div className="alert-code">{title}</div>
      <div className="alert-meta">TIMELINE DRIFT</div>
      <div className="alert-year">{year}</div>
      <div className="alert-foot">DO NOT INTERRUPT PROCESS</div>
    </div>
  )
}
