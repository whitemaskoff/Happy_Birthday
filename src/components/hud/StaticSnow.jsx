import { useEffect, useRef } from 'react'

export default function StaticSnow({ amount = 0.18 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    let raf
    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) {
        raf = requestAnimationFrame(draw)
        return
      }
      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h
      const img = ctx.createImageData(w, h)
      const data = img.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = amount * 255 * Math.random()
      }
      ctx.putImageData(img, 0, 0)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [amount])

  return <canvas ref={ref} className="static-snow" />
}
