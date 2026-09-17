export default function VintageHeart({ className = '' }) {
  return (
    <svg
      className={`vintage-heart ${className}`}
      viewBox="0 0 24 22"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 20.4C10.2 18.7 3 13.2 3 7.8 3 5 5.1 3 7.8 3c1.6 0 3.1.8 4.2 2.1C13.1 3.8 14.6 3 16.2 3 18.9 3 21 5 21 7.8c0 5.4-7.2 10.9-9 12.6z"
      />
    </svg>
  )
}
