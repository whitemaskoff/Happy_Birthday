export default function Gift({ opened, photos, prompt, label, onOpen }) {
  if (opened) {
    return (
      <div className="gift-full">
        <img src={photos[0]} alt="" />
        <img src={photos[1]} alt="" />
      </div>
    )
  }

  return (
    <div className="gift-stage">
      <p className="type-line gift-tease">{prompt}</p>
      <button type="button" className="old-message" onClick={onOpen}>
        <span className="old-message-fold" />
        <span className="old-message-label">{label || 'old message'}</span>
      </button>
    </div>
  )
}
