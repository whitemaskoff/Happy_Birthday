import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

const cache = new Map()

export default function LottieStage({
  src,
  className = '',
  loop = true,
  autoplay = true,
}) {
  const [data, setData] = useState(() => cache.get(src) || null)

  useEffect(() => {
    if (!src) return undefined
    if (cache.has(src)) {
      setData(cache.get(src))
      return undefined
    }
    let live = true
    fetch(src)
      .then((r) => r.json())
      .then((json) => {
        cache.set(src, json)
        if (live) setData(json)
      })
      .catch(() => {
        if (live) setData(null)
      })
    return () => {
      live = false
    }
  }, [src])

  if (!data) return <div className={className} />
  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  )
}
