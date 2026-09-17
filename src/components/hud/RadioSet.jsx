export default function RadioSet({ live = false, kind = 'off', on = false, className = '' }) {
  const talking = live && kind === 'her'
  const dead = kind === 'dead' || !on
  return (
    <svg
      viewBox="0 0 360 210"
      className={`radio-set ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a241c" />
          <stop offset="100%" stopColor="#12100c" />
        </linearGradient>
        <radialGradient id="eye" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor={talking ? '#7dff9a' : on ? '#2a6a3a' : '#0c120e'} />
          <stop offset="100%" stopColor="#041208" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="8" y="18" width="344" height="176" rx="8" fill="url(#body)" stroke="#3a3328" />
      <rect x="20" y="32" width="200" height="86" rx="3" fill="#0a0c0a" />
      <text x="28" y="48" fill="#6a7a62" fontSize="8" fontFamily="Share Tech Mono, monospace" letterSpacing="2">
        {on ? (dead ? 'NO CARRIER' : '7.403 Mc') : 'STANDBY'}
      </text>
      <g transform="translate(28 58)">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <rect
            key={i}
            x={i * 15}
            y="8"
            width="9"
            height={on ? 6 : 3}
            fill={talking ? '#8fef9a' : '#1c2a1c'}
            opacity={on ? 0.9 : 0.25}
          >
            {talking ? (
              <animate
                attributeName="height"
                values="4;26;7;22;5"
                dur={`${0.32 + (i % 5) * 0.08}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </rect>
        ))}
      </g>
      <g transform="translate(248 36)">
        <circle cx="42" cy="42" r="40" fill="#0b0f0c" stroke="#2a3328" />
        <circle cx="42" cy="42" r="34" fill="url(#eye)" filter="url(#glow)" />
        <path
          d={talking ? 'M18 48 Q42 18 66 48' : 'M24 50 Q42 38 60 50'}
          fill="none"
          stroke="#c8ffd2"
          strokeWidth="2"
          opacity={on ? 0.85 : 0.15}
        >
          {talking ? (
            <animate
              attributeName="d"
              values="M18 48 Q42 16 66 48;M18 48 Q42 28 66 48;M18 48 Q42 16 66 48"
              dur="0.9s"
              repeatCount="indefinite"
            />
          ) : null}
        </path>
        <text x="42" y="92" textAnchor="middle" fill="#6a7a62" fontSize="7" fontFamily="Share Tech Mono, monospace">
          MAGIC EYE
        </text>
      </g>
      <g transform="translate(28 132)">
        <rect width="304" height="44" rx="3" fill="#16140f" />
        <line x1="12" y1="22" x2="292" y2="22" stroke="#3a3428" />
        <g
          style={{
            transformOrigin: '20px 22px',
            transform: `rotate(${dead ? -18 : talking ? 42 : on ? 12 : -22}deg)`,
            transition: 'transform 180ms linear',
          }}
        >
          <line x1="20" y1="22" x2="120" y2="8" stroke="#e8c48a" strokeWidth="1.6" />
        </g>
        <circle cx="20" cy="22" r="4" fill="#c9a36a" />
        <text x="250" y="38" fill="#6a7a62" fontSize="7" fontFamily="Share Tech Mono, monospace">
          S-METER
        </text>
      </g>
      <circle cx="328" cy="48" r="6" fill={on ? '#c45a32' : '#2a1810'} filter={on ? 'url(#glow)' : undefined}>
        {on && live ? (
          <animate attributeName="opacity" values="1;0.45;1" dur="1.4s" repeatCount="indefinite" />
        ) : null}
      </circle>
    </svg>
  )
}
