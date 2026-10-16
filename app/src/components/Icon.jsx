// Original inline SVG icon set (24x24, stroke based). No third-party assets.
const P = (d) => <path d={d} />;

const ICONS = {
  menu: P('M4 6h16M4 12h16M4 18h16'),
  'login-arrow': (
    <>
      <circle cx="12" cy="12" r="9.5" />
      {P('M9.5 12h5M12 9.5l2.5 2.5-2.5 2.5')}
    </>
  ),
  pin: (
    <>
      {P('M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z')}
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  apps: (
    <>
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
      {P('M12 4l3 5H9z')}
    </>
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="18.5" cy="12" r="1.2" />
    </>
  ),
  back: P('M15 5l-7 7 7 7'),
  'chevron-right': P('M9 5l7 7-7 7'),
  'chevron-down': P('M6 9l6 6 6-6'),
  'chevron-up': P('M6 15l6-6 6 6'),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      {P('M16 16l4.5 4.5')}
    </>
  ),
  bell: (
    <>
      {P('M6 17v-6a6 6 0 1 1 12 0v6l1.5 2h-15L6 17z')}
      {P('M10 21a2 2 0 0 0 4 0')}
    </>
  ),
  logout: (
    <>
      {P('M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5')}
      {P('M14 8l4 4-4 4')}
      {P('M18 12H9')}
    </>
  ),
  eye: (
    <>
      {P('M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z')}
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      {P('M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z')}
      <circle cx="12" cy="12" r="3" />
      {P('M4 4l16 16')}
    </>
  ),
  refresh: (
    <>
      {P('M20 11a8 8 0 1 0-2.3 5.7')}
      {P('M20 5v6h-6')}
    </>
  ),
  filter: P('M4 5h16l-6 7v6l-4 2v-8L4 5z'),
  sort: (
    <>
      {P('M8 5v14M8 5L4.5 8.5M8 5l3.5 3.5')}
      {P('M16 19V5M16 19l-3.5-3.5M16 19l3.5-3.5')}
    </>
  ),
  headset: (
    <>
      {P('M4 14v-2a8 8 0 0 1 16 0v2')}
      {P('M4 14h3v5H5a1 1 0 0 1-1-1v-4zM20 14h-3v5h2a1 1 0 0 0 1-1v-4z')}
      {P('M17 19a3 3 0 0 1-3 2h-2')}
    </>
  ),
  kebab: (
    <>
      <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      {P('M12 11v5M12 7.8h.01')}
    </>
  ),
  doc: (
    <>
      {P('M7 3h7l4 4v14H7z')}
      {P('M14 3v4h4M9.5 12h6M9.5 16h6')}
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      {P('M3 7l9 6 9-6')}
    </>
  ),
  download: (
    <>
      {P('M12 4v11M7.5 10.5L12 15l4.5-4.5')}
      {P('M5 20h14')}
    </>
  ),
  check: P('M5 12.5l4.5 4.5L19 7.5'),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      {P('M8 12.5l3 3 5-6')}
    </>
  ),
  close: P('M6 6l12 12M18 6L6 18'),
  plus: P('M12 5v14M5 12h14'),
  home: (
    <>
      {P('M4 11l8-7 8 7')}
      {P('M6 10v10h12V10')}
      {P('M10 20v-6h4v6')}
    </>
  ),
  heart: P('M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z'),
  qr: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      {P('M14 14h2.5v2.5H14zM18 18h2M17 20v0M20 14v1')}
    </>
  ),
  shield: P('M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z'),
  invest: (
    <>
      {P('M4 17l5-5 4 4 7-8')}
      {P('M15 8h5v5')}
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      {P('M4 20c1-4 4-6 8-6s7 2 8 6')}
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="4" />
      {P('M12 12h9M18 12v3M21 12v2')}
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      {P('M11 18.5h2')}
    </>
  ),
  bank: (
    <>
      {P('M3 9l9-5 9 5')}
      {P('M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18')}
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      {P('M3 10h18M6.5 15h4')}
    </>
  ),
  bill: (
    <>
      {P('M6 3h12v18l-3-2-3 2-3-2-3 2z')}
      {P('M9 8h6M9 12h6')}
    </>
  ),
  sprout: (
    <>
      {P('M12 21v-8')}
      {P('M12 13C12 9 9 7 5 7c0 4 2 6 7 6zM12 11c0-3 2-5 6-5 0 3-2 5-6 5z')}
    </>
  ),
  candles: (
    <>
      {P('M6 4v3M6 15v4M12 3v4M12 17v4M18 6v3M18 17v3')}
      <rect x="4.5" y="7" width="3" height="8" rx="0.5" />
      <rect x="10.5" y="7" width="3" height="10" rx="0.5" />
      <rect x="16.5" y="9" width="3" height="8" rx="0.5" />
    </>
  ),
  pension: (
    <>
      <circle cx="12" cy="9" r="4.5" />
      {P('M12 7v4M10.5 9h3')}
      {P('M4 19c2-2 4-2 6-1l4 1c1 .3 2 0 3-.8l3-2')}
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="8" rx="5" ry="2.5" />
      {P('M4 8v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V8')}
      {P('M14 11c.6-.1 1.3-.1 2-.1 2.8 0 5 1.1 5 2.5v3c0 1.4-2.2 2.5-5 2.5s-5-1.1-5-2.5v-1')}
    </>
  ),
  'arrow-ne': P('M7 17L17 7M9 7h8v8'),
  'arrow-sw': P('M17 7L7 17M15 17H7V9'),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      {P('M8 10.5V8a4 4 0 0 1 8 0v2.5')}
    </>
  ),
  share: (
    <>
      {P('M12 15V4M8 8l4-4 4 4')}
      {P('M5 12v7h14v-7')}
    </>
  ),
  edit: P('M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4'),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      {P('M4 10h16M8.5 3.5v4M15.5 3.5v4')}
    </>
  ),
  umbrella: (
    <>
      {P('M3 12a9 9 0 0 1 18 0H3z')}
      {P('M12 12v6a2 2 0 0 1-4 0')}
    </>
  ),
  leaf: P('M5 19C5 10 10 5 20 5c0 10-5 15-13 14M5 19c2-5 5-8 9-10'),
  camera: (
    <>
      {P('M4 8h3l1.5-2h7L17 8h3v11H4z')}
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  star: P('M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z'),
  bolt: P('M13 3L5 14h6l-1 7 8-11h-6z'),
  trash: P('M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13'),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      {P('M3 9h18v3H3zM12 9v11M12 9c-3 0-4-4-1-4 1.5 0 1 4 1 4zM12 9c3 0 4-4 1-4-1.5 0-1 4-1 4z')}
    </>
  ),
  'user-plus': (
    <>
      <circle cx="10" cy="8" r="4" />
      {P('M3 20c1-4 3.5-6 7-6M18 14v6M15 17h6')}
    </>
  ),
  list: P('M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01'),
  warning: (
    <>
      {P('M12 4l9 16H3z')}
      {P('M12 10v4M12 17h.01')}
    </>
  ),
  tv: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      {P('M8 21h8M12 17v4')}
    </>
  ),
  flame: P('M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 2 1.5 2C10 8 11 5 12 3z'),
  water: P('M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'),
  plane: P('M3 13l18-8-6 15-3-6-9-1z'),
  car: (
    <>
      {P('M4 15l1.5-5h13L20 15v4h-2.5v-2h-11v2H4z')}
      {P('M7 13h.01M17 13h.01')}
    </>
  ),
  movie: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      {P('M3 9h18M8 5l-2 4M13 5l-2 4M18 5l-2 4')}
    </>
  ),
};

export default function Icon({ name, size, className = '', style, title, ...rest }) {
  const body = ICONS[name];
  const s = size ? { width: size, height: size, ...style } : style;
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      style={s}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      {body || null}
    </svg>
  );
}
