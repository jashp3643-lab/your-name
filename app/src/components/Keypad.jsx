'use client';

import { useState } from 'react';
import Icon from './Icon';

function shuffled() {
  const a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Secure-style numeric keypad: digit positions are shuffled each time it is opened.
export default function Keypad({ onDigit, onBackspace, revealed, onToggleReveal, disabled }) {
  const [keys] = useState(shuffled);
  const cell = (k) => (
    <button key={k} type="button" className="keypad__key" disabled={disabled} onClick={() => onDigit(k)} aria-label={k}>
      {k}
    </button>
  );
  return (
    <div className="keypad" role="group" aria-label="Secure keypad" data-testid="keypad">
      {keys.slice(0, 9).map(cell)}
      <button type="button" className="keypad__key keypad__key--icon" onClick={onToggleReveal} aria-label={revealed ? 'Hide digits' : 'Show digits'} aria-pressed={revealed}>
        <Icon name={revealed ? 'eye-off' : 'eye'} size={22} />
      </button>
      {cell(keys[9])}
      <button type="button" className="keypad__key keypad__key--icon" disabled={disabled} onClick={onBackspace} aria-label="Delete last digit">
        <Icon name="back" size={22} />
      </button>
    </div>
  );
}
