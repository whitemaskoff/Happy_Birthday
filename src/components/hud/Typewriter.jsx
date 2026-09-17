import { useEffect, useMemo, useRef, useState } from 'react'
import { soundtrack } from '../../lib/audio'

const SLIP = { a: 's', e: 'w', i: 'o', o: 'p', s: 'a', t: 'r', n: 'm', h: 'j', l: 'k' }

function charMs(text) {
  const n = Math.max(text.replace(/\n/g, '').length, 1)
  if (n <= 4) return 88
  if (n <= 18) return 62
  if (n <= 40) return 48
  if (n <= 80) return 40
  return 34
}

function buildPlan(text) {
  const base = charMs(text)
  const short = text.length < 22
  const actions = []
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    const canEdit =
      !short && i > 4 && i < text.length - 5 && /[A-Za-z]/.test(ch) && Math.random() < 0.04
    if (canEdit) {
      const extra = 1 + (Math.random() < 0.35 ? 1 : 0)
      const wrong = SLIP[ch.toLowerCase()] || 'e'
      actions.push({ op: 'type', ch: wrong, ms: base })
      if (extra === 2) actions.push({ op: 'type', ch: 'e', ms: base * 0.9 })
      actions.push({ op: 'pause', ms: 140 + Math.random() * 120 })
      for (let k = 0; k < extra; k += 1) actions.push({ op: 'back', ms: 48 })
      actions.push({ op: 'pause', ms: 80 })
    }
    if (ch === '\n') {
      actions.push({ op: 'pause', ms: 420 + Math.random() * 180 })
      actions.push({ op: 'type', ch: '\n', ms: 30 })
    } else {
      let ms = base + Math.random() * base * 0.35
      if (i === 0) ms += 160
      if (ch === '.' || ch === '?' || ch === '!') {
        ms = text[i + 1] === '.' ? 110 : 520 + Math.random() * 220
      } else if (ch === ',' ) ms = 180 + Math.random() * 90
      else if (ch === ' ') ms = base
      actions.push({ op: 'type', ch, ms })
      if (!short && Math.random() < 0.035) {
        actions.push({ op: 'glitch', ms: 40, hold: 420 + Math.random() * 280 })
      }
    }
    i += 1
  }
  return actions
}

export default function Typewriter({ text = '', onDone, onGlitch, sound = true }) {
  const plan = useMemo(() => buildPlan(text), [text])
  const [step, setStep] = useState(0)
  const [shown, setShown] = useState('')
  const fired = useRef(false)
  const onDoneRef = useRef(onDone)
  const onGlitchRef = useRef(onGlitch)
  onDoneRef.current = onDone
  onGlitchRef.current = onGlitch

  useEffect(() => {
    setStep(0)
    setShown('')
    fired.current = false
  }, [text])

  useEffect(() => {
    if (!text) {
      if (!fired.current) {
        fired.current = true
        onDoneRef.current?.()
      }
      return undefined
    }
    if (step >= plan.length) {
      if (!fired.current) {
        fired.current = true
        onDoneRef.current?.()
      }
      return undefined
    }
    const action = plan[step]
    const id = setTimeout(() => {
      if (action.op === 'type') {
        setShown((s) => s + action.ch)
        if (sound) setTimeout(() => soundtrack.key(action.ch), 8)
      } else if (action.op === 'back') {
        setShown((s) => s.slice(0, -1))
        if (sound) setTimeout(() => soundtrack.back(), 8)
      } else if (action.op === 'glitch') {
        onGlitchRef.current?.(action.hold || 500)
      }
      setStep((s) => s + 1)
    }, Math.max(16, action.ms || 40))
    return () => clearTimeout(id)
  }, [plan, sound, step, text])

  return (
    <span className="type-keep">
      {shown}
      {step < plan.length ? <span className="caret" /> : null}
    </span>
  )
}
