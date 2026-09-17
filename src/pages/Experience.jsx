import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import Gift from '../components/hud/Gift'
import ScreenGlitch from '../components/hud/ScreenGlitch'
import SysConsole, { AlertPanel } from '../components/hud/SysConsole'
import Typewriter from '../components/hud/Typewriter'
import VhsHud from '../components/hud/VhsHud'
import VintageHeart from '../components/hud/VintageHeart'
import { interpolate } from '../data/siteContent'
import { soundtrack } from '../lib/audio'
import { useContent } from '../lib/contentStore'

function holdMs(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  if (words <= 2) return 1600
  if (words <= 8) return 2000
  if (words <= 20) return 2600
  return 3200
}

const FLASH = ['SIGNAL DESTABILIZING...', 'CONNECTION LOST...', 'DATE ERROR']

export default function Experience() {
  const { content } = useContent()
  const blocks = content.blocks || []
  const nightLines = content.nightLines || []
  const [on, setOn] = useState(false)
  const [idx, setIdx] = useState(-1)
  const [typed, setTyped] = useState(false)
  const [muted, setMuted] = useState(Boolean(content.muteByDefault))
  const [phase, setPhase] = useState('talk')
  const [glitch, setGlitch] = useState(false)
  const [glitchMode, setGlitchMode] = useState('tv')
  const [glitchPattern, setGlitchPattern] = useState(0)
  const [flash, setFlash] = useState('')
  const [year, setYear] = useState(2036)
  const [nightIdx, setNightIdx] = useState(-1)
  const [lockIdx, setLockIdx] = useState(0)
  const [shake, setShake] = useState(0)
  const waiting = useRef(false)
  const glitchTimer = useRef(0)
  const lockBeats = content.lockBeats || ['TRANSMISSION RECEIVED', 'SOURCE: UNKNOWN', 'YEAR', '2036']

  const block = idx >= 0 ? blocks[idx] : null
  const spoken = block ? block.lines.map((l) => interpolate(l, content)).join('\n') : ''
  const herName = interpolate('{{herName}}', content)
  const pair = ['/gift/one.jpg', '/gift/two.jpg']
  const nightish = ['night', 'finale', 'gift', 'photos', 'dying'].includes(phase)

  useEffect(() => {
    soundtrack.setMuted(muted)
  }, [muted])

  useEffect(() => {
    if (!on || idx < 0 || !block || phase !== 'talk') return
    setTyped(false)
  }, [block, idx, on, phase])

  const finishLock = useCallback(() => {
    setPhase('talk')
    setIdx(0)
  }, [])

  const advance = useCallback(() => {
    waiting.current = false
    if (idx + 1 >= blocks.length) {
      setPhase('turn')
      setTyped(false)
      return
    }
    setIdx(idx + 1)
  }, [blocks.length, idx])

  useEffect(() => {
    if (!on || phase !== 'talk' || idx < 0 || !block) return undefined
    if (spoken && !typed) return undefined
    waiting.current = true
    const id = setTimeout(() => {
      if (waiting.current) advance()
    }, holdMs(spoken))
    return () => clearTimeout(id)
  }, [advance, block, idx, on, phase, spoken, typed])

  useEffect(() => {
    if (phase !== 'connect') return undefined
    setGlitch(false)
    const timers = []
    timers.push(
      setTimeout(() => {
        const p = Math.floor(Math.random() * 12)
        setGlitchMode('tv')
        setGlitchPattern(p)
        setGlitch(true)
        soundtrack.glitchTv(p)
      }, 350),
    )
    timers.push(setTimeout(() => setGlitch(false), 700))
    timers.push(
      setTimeout(() => {
        setGlitchMode('rgb')
        setGlitchPattern(Math.floor(Math.random() * 12))
        setGlitch(true)
        soundtrack.glitchRgb(Math.floor(Math.random() * 12))
      }, 1100),
    )
    timers.push(setTimeout(() => setGlitch(false), 1500))
    timers.push(
      setTimeout(() => {
        const p = Math.floor(Math.random() * 12)
        setGlitchMode('tv')
        setGlitchPattern(p)
        setGlitch(true)
        soundtrack.glitchTv(p)
      }, 2000),
    )
    timers.push(setTimeout(() => setGlitch(false), 2400))
    timers.push(
      setTimeout(() => {
        setPhase('lock')
        setLockIdx(0)
      }, 3200),
    )
    return () => timers.forEach((t) => clearTimeout(t))
  }, [phase])

  useEffect(() => {
    if (phase !== 'rewind') return undefined
    soundtrack.rumble(1)
    soundtrack.alarm()
    soundtrack.rewind()
    soundtrack.impact()
    setYear(2036)
    setFlash(FLASH[0])
    setShake(1)
    soundtrack.crackGlass()
    const timers = []
    timers.push(
      setTimeout(() => {
        setFlash(FLASH[1])
        setShake(2)
        soundtrack.rumble(2)
        soundtrack.crackGlass()
        soundtrack.impact()
      }, 2200),
    )
    timers.push(
      setTimeout(() => {
        setFlash(FLASH[2])
        setShake(3)
        soundtrack.rumble(3)
        soundtrack.crackGlass()
        soundtrack.impact()
      }, 4400),
    )
    let y = 2036
    let count
    timers.push(
      setTimeout(() => {
        count = setInterval(() => {
          y -= 1
          setYear(y)
          soundtrack.impact()
          soundtrack.crackGlass()
          if (y <= 2026) {
            clearInterval(count)
            setTimeout(() => {
              soundtrack.stopDisaster()
              soundtrack.present()
              setShake(0)
              setPhase('date')
            }, 1100)
          }
        }, 520)
      }, 6400),
    )
    return () => {
      timers.forEach((t) => clearTimeout(t))
      if (count) clearInterval(count)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'night') return undefined
    setNightIdx(0)
    return undefined
  }, [phase])

  useEffect(() => {
    if (phase !== 'night' || nightIdx < 0) return undefined
    if (nightIdx >= nightLines.length) {
      const id = setTimeout(() => setPhase('finale'), 1600)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setNightIdx((n) => n + 1), holdMs(nightLines[nightIdx]) + 500)
    return () => clearTimeout(id)
  }, [nightIdx, nightLines, phase])

  useEffect(() => {
    if (phase !== 'finale') return undefined
    const id = setTimeout(() => setPhase('gift'), 3000)
    return () => clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'photos') return undefined
    const id = setTimeout(() => {
      setPhase('dying')
      soundtrack.off()
    }, 7000)
    return () => clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'dying') return undefined
    setGlitchMode('tv')
    const id = setTimeout(() => setPhase('off'), 2000)
    return () => clearTimeout(id)
  }, [phase])

  const powerOn = async () => {
    setOn(true)
    setIdx(-1)
    setPhase('connect')
    setNightIdx(-1)
    setShake(0)
    try {
      await soundtrack.unlock()
      soundtrack.setMuted(muted)
      soundtrack.hiss(true, 0.02)
    } catch {
      /* autoplay */
    }
  }

  const startedRef = useRef(false)
  useEffect(() => {
    if (startedRef.current) return undefined
    if (window.location.hash === '#listen') {
      startedRef.current = true
      powerOn()
    }
    return undefined
  })

  const flashGlitch = (ms = 520) => {
    const mode = Math.random() > 0.5 ? 'tv' : 'rgb'
    const pattern = Math.floor(Math.random() * 12)
    setGlitchMode(mode)
    setGlitchPattern(pattern)
    setGlitch(true)
    if (mode === 'tv') soundtrack.glitchTv(pattern)
    else soundtrack.glitchRgb(pattern)
    window.clearTimeout(glitchTimer.current)
    glitchTimer.current = window.setTimeout(() => setGlitch(false), ms)
  }

  const onStageClick = (e) => {
    if (e.target.closest('button, a, input')) return
    if (!on || phase !== 'talk') return
    if (waiting.current && typed) advance()
  }

  const screenGlitch = (glitch && phase !== 'rewind') || phase === 'dying'

  if (phase === 'off') return <div className="stage blackout" />

  return (
    <div>
      <div
        className={`stage page ${nightish ? 'night-sky stars' : ''} ${phase === 'rewind' ? 'disaster' : ''} shake-${shake} ${phase === 'dying' ? 'dying' : ''}`}
        onClick={onStageClick}
        role="presentation"
      >
        {screenGlitch && <ScreenGlitch mode={glitchMode} pattern={glitchPattern} />}
        {phase === 'rewind' && (
          <svg className="cracks" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M48 0 L52 22 L40 40 L58 58 L46 78 L55 100" />
            <path d="M52 22 L70 30 L88 28" />
            <path d="M40 40 L18 48 L8 70" />
            <path d="M58 58 L80 62 L96 80" />
            <path d="M46 78 L30 90" />
          </svg>
        )}
        {on && phase !== 'connect' && (
          <VhsHud
            running={on}
            era={['date', 'bday', 'night', 'finale', 'gift', 'photos', 'dying'].includes(phase) ? 'present' : 'future'}
          />
        )}
        {nightish && (
          <div className="hearts" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className={`floater f${i % 7}`} />
            ))}
          </div>
        )}
        <div className="grain" />
        <header className="pointer-events-none absolute right-4 top-12 z-20 md:right-7">
          <div className="pointer-events-auto flex items-center gap-3">
            {content.showSkip && on && phase === 'talk' ? (
              <button
                type="button"
                className="skip"
                onClick={(e) => {
                  e.stopPropagation()
                  if (spoken && !typed) setTyped(true)
                  else advance()
                }}
              >
                next
              </button>
            ) : null}
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#f3ead8]"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </header>

        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6">
          {!on && (
            <button type="button" className="listen-btn" onClick={powerOn}>
              {content.listenLabel || 'Turn it'}
            </button>
          )}

          {on && phase === 'lock' && (
            <SysConsole
              beats={lockBeats}
              onDone={finishLock}
            />
          )}

          {on && phase === 'talk' && spoken ? (
            <p className="type-line">
              {typed ? (
                spoken
              ) : (
                <Typewriter text={spoken} onDone={() => setTyped(true)} onGlitch={flashGlitch} />
              )}
            </p>
          ) : null}

          {on && phase === 'turn' && (
            <p className="type-line">
              <Typewriter
                text={content.turnLine}
                onDone={() => setTimeout(() => setPhase('today'), 1400)}
                onGlitch={flashGlitch}
              />
            </p>
          )}

          {on && phase === 'today' && (
            <p className="type-line">
              <Typewriter
                text={content.todayLabel || 'TODAY'}
                onDone={() => setTimeout(() => setPhase('rewind'), 1200)}
                onGlitch={flashGlitch}
              />
            </p>
          )}

          {on && phase === 'rewind' && <AlertPanel title={flash} year={year} />}

          {on && phase === 'date' && (
            <div className="date-block">
              <p className="type-line">
                <Typewriter
                  text={content.birthdayDateLine}
                  onDone={() => {}}
                  onGlitch={flashGlitch}
                />
              </p>
              <DateContinue delay={2800} onDone={() => setPhase('bday')} />
            </div>
          )}

          {on && phase === 'bday' && (
            <div className="date-block">
              <p className="type-line big">
                {content.happyLine} <VintageHeart />
              </p>
              <p className="type-line">{herName}</p>
              <DateContinue delay={3400} onDone={() => setPhase('night')} />
            </div>
          )}

          {on && phase === 'night' && (
            <p className="type-line">
              {nightIdx >= 0 && nightIdx < nightLines.length ? nightLines[nightIdx] : ''}
            </p>
          )}

          {on && phase === 'finale' && (
            <p className="type-line big">
              HAPPY BIRTHDAY, {herName} <VintageHeart />
            </p>
          )}

          {on && phase === 'gift' && (
            <Gift
              opened={false}
              prompt={content.giftPrompt}
              label={content.giftOpenLabel}
              photos={pair}
              onOpen={() => {
                soundtrack.crackle()
                setPhase('photos')
              }}
            />
          )}

          {on && (phase === 'photos' || phase === 'dying') && (
            <Gift opened photos={pair} />
          )}
        </div>
      </div>
    </div>
  )
}

function DateContinue({ onDone, delay = 3200 }) {
  useEffect(() => {
    const id = setTimeout(onDone, delay)
    return () => clearTimeout(id)
  }, [delay, onDone])
  return null
}
