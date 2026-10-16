'use client';

import Icon from './Icon';

// Eye button used on tiles, account selector and FD rows. Open eye = value hidden (tap to reveal);
// crossed eye = value shown (tap to hide), as in the reference.
export default function EyeToggle({ revealed, onToggle, what = 'value' }) {
  return (
    <button
      type="button"
      className="eye-btn"
      aria-pressed={revealed}
      aria-label={revealed ? `Hide ${what}` : `Show ${what}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Icon name={revealed ? 'eye-off' : 'eye'} />
    </button>
  );
}
