import { useEffect, useRef } from 'react'

export default function Waveform({ live = false, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf
    let t = 0
    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h
      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      ctx.strokeStyle = live ? 'rgba(180, 210, 190, 0.7)' : 'rgba(120, 140, 130, 0.25)'
      ctx.lineWidth = 1.2
      const mid = h / 2
      for (let x = 0; x < w; x += 1) {
        const n = live
          ? Math.sin(x * 0.08 + t) * 6 +
            Math.sin(x * 0.31 + t * 1.7) * 5 +
            (Math.random() - 0.5) * 6
          : Math.sin(x * 0.05 + t * 0.2) * 2
        const y = mid + n
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      t += live ? 0.18 : 0.02
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [live])

  return <canvas ref={ref} className={className} />
}
