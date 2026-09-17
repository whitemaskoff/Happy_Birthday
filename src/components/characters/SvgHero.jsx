export default function SvgHero({ pose = 'idle', src, className = '' }) {
  const poseClass =
    pose === 'wave'
      ? 'animate-[walk-in_0.8s_ease_both] origin-bottom'
      : pose === 'dance'
        ? 'animate-[dance_1.2s_ease-in-out_infinite] origin-bottom'
        : pose === 'walk'
          ? 'animate-[walk-in_1.1s_ease_both]'
          : 'animate-[bob_3.4s_ease-in-out_infinite]'

  return (
    <div className={`relative ${className}`}>
      <img
        src={src || '/illustrations/hero-canonical.jpg'}
        alt=""
        className={`mx-auto max-h-full object-contain drop-shadow-[0_0_24px_rgba(126,240,255,0.25)] ${poseClass}`}
      />
    </div>
  )
}
