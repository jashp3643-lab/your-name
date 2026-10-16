// Official YONO SBI wordmark: lowercase "yono" + SBI cyan keyhole emblem + uppercase "SBI"
export default function Logo({ size = 26, color = '#fff' }) {
  const iconSize = Math.round(size * 0.95);
  return (
    <span
      className="logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        userSelect: 'none',
      }}
      aria-label="YONO SBI"
    >
      <span style={{ fontSize: size * 0.95, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1 }}>
        yono
      </span>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, verticalAlign: 'middle' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="#00a4e4"
          d="M 16 1 C 24.28 1 31 7.72 31 16 C 31 24.28 24.28 31 16 31 C 7.72 31 1 24.28 1 16 C 1 7.72 7.72 1 16 1 Z M 14.4 31 L 14.4 17.16 A 4 4 0 1 1 17.6 17.16 L 17.6 31 Z"
        />
      </svg>
      <span style={{ fontSize: size * 0.95, fontWeight: 800, letterSpacing: '0.02em', lineHeight: 1 }}>
        SBI
      </span>
    </span>
  );
}

