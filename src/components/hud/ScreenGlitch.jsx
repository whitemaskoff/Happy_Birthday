import { useEffect, useRef } from 'react'

function drawTv(ctx, w, h, p) {
  ctx.clearRect(0, 0, w, h)
  const snow = (n, a = 0.8) => {
    for (let i = 0; i < n; i += 1) {
      const v = 160 + Math.random() * 95
      ctx.fillStyle = `rgba(${v},${v},${v},${a})`
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() > 0.7 ? 2 : 1, 1)
    }
  }
  const bar = (y, thick, x, len, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, len, thick)
  }

  switch (p) {
    case 0:
      snow(420)
      break
    case 1:
      snow(80, 0.5)
      for (let i = 0; i < 4; i += 1)
        bar(Math.random() * h, 1, Math.random() * 40, 40 + Math.random() * 80, 'rgba(255,255,255,0.95)')
      break
    case 2:
      snow(120)
      bar(h - 18, 16, 0, w, 'rgba(200,200,200,0.35)')
      for (let y = h - 18; y < h; y += 2) bar(y, 1, 0, w, 'rgba(255,255,255,0.4)')
      break
    case 3: {
      const off = (Math.random() - 0.5) * 20
      snow(200)
      bar(h / 2 + off, 8, 0, w, 'rgba(255,255,255,0.15)')
      break
    }
    case 4:
      snow(90)
      bar(h - 10, 10, 0, w, 'rgba(180,180,180,0.5)')
      break
    case 5:
      for (let y = 0; y < h; y += 3) {
        const s = Math.sin(y * 0.2) * 8
        bar(y, 2, s, w, 'rgba(255,255,255,0.12)')
      }
      snow(80)
      break
    case 6:
      snow(60)
      for (let i = 0; i < 8; i += 1) {
        const x = Math.random() * w
        const y = Math.random() * h
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.fillRect(x, y, 8 + Math.random() * 10, 1)
      }
      break
    case 7:
      snow(70)
      bar(30 + Math.random() * 40, 22, 0, w, 'rgba(220,220,230,0.22)')
      break
    case 8:
      snow(150)
      bar(20, 12, 0, w, 'rgba(255,255,255,0.2)')
      bar(h - 24, 12, 0, w, 'rgba(255,255,255,0.2)')
      break
    case 9:
      snow(700, 0.9)
      break
    case 10:
      snow(100)
      for (let i = 0; i < 20; i += 1) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ff40d0' : '#40ffc0'
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
      }
      break
    default:
      snow(200)
      bar(Math.random() * h, 3, 0, w, 'rgba(255,255,255,0.7)')
  }
}

function drawRgb(ctx, w, h, p) {
  ctx.clearRect(0, 0, w, h)
  const strip = (y, t, shift) => {
    ctx.fillStyle = 'rgba(255,0,70,0.34)'
    ctx.fillRect(shift, y, w, t)
    ctx.fillStyle = 'rgba(0,220,255,0.34)'
    ctx.fillRect(-shift, y + 1, w, t)
  }
  switch (p) {
    case 0:
      for (let i = 0; i < 6; i += 1) strip(Math.random() * h, 3 + Math.random() * 5, (Math.random() - 0.5) * 14)
      break
    case 1:
      for (let i = 0; i < 18; i += 1) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.35)'
        ctx.fillRect(Math.random() * w, Math.random() * h, 8 + Math.random() * 16, 8 + Math.random() * 12)
      }
      break
    case 2:
      for (let i = 0; i < 4; i += 1) strip(Math.random() * h, 10 + Math.random() * 12, (Math.random() - 0.5) * 22)
      break
    case 3:
      for (let x = 0; x < w; x += 8)
        for (let y = 0; y < h; y += 8) {
          if (Math.random() > 0.7) {
            ctx.fillStyle = `rgba(${Math.random() * 255},0,${Math.random() * 255},0.35)`
            ctx.fillRect(x, y, 8, 8)
          }
        }
      break
    case 4:
      for (let y = 0; y < h; y += 2) {
        ctx.fillStyle = y % 4 === 0 ? 'rgba(255,0,70,0.2)' : 'rgba(0,220,255,0.2)'
        ctx.fillRect((y % 8) - 4, y, w, 1)
      }
      break
    case 5:
      for (let i = 0; i < 5; i += 1) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'
        ctx.fillRect(0, Math.random() * h, w, 4 + Math.random() * 8)
      }
      break
    case 6:
      strip(h * 0.3, 28, 18)
      strip(h * 0.6, 16, -14)
      break
    case 7:
      for (let i = 0; i < 40; i += 1) {
        ctx.fillStyle = ['#ff2bd6', '#2bffc8', '#fff', '#111'][i % 4]
        ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2)
      }
      break
    case 8:
      ctx.fillStyle = 'rgba(255,0,70,0.4)'
      ctx.fillRect(10, 20, w, 8)
      ctx.fillStyle = 'rgba(0,220,255,0.4)'
      ctx.fillRect(-12, 40, w, 8)
      break
    case 9:
      for (let x = 0; x < w; x += 6)
        for (let y = 0; y < h; y += 6) {
          if ((x + y) % 12 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)'
            ctx.fillRect(x, y, 6, 6)
          }
        }
      break
    case 10:
      for (let y = 0; y < h; y += 5) strip(y, 2, Math.sin(y) * 10)
      break
    default:
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.fillRect(0, h * 0.7, w, h * 0.3)
      strip(h * 0.72, 6, 8)
  }
}

export default function ScreenGlitch({ mode = 'tv', pattern = 0 }) {
  const ref = useRef(null)
  const p = Math.abs(pattern) % 12

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    const w = 220
    const h = 124
    canvas.width = w
    canvas.height = h
    let raf
    const draw = () => {
      if (mode === 'tv') drawTv(ctx, w, h, p)
      else drawRgb(ctx, w, h, p)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [mode, p])

  return <canvas ref={ref} className={`glitch-canvas ${mode}`} aria-hidden="true" />
}
