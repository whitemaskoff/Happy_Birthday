export default function Polaroid({ src, fallback, caption, className = '' }) {
  const image = src || fallback
  return (
    <figure className={`polaroid ${className}`}>
      <div className="aspect-[3/4] overflow-hidden bg-black/20">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-hud text-[10px] tracking-[0.25em] text-cyan-200/60">
            NO SIGNAL
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 px-1 text-center font-story text-sm italic opacity-80">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
