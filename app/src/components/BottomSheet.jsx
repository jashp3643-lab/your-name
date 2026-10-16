'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

// Sheets and dialogs mount on the device root so they always sit above sticky bars and the tab bar.
export function layerRoot() {
  return (typeof document !== 'undefined' && document.getElementById('device')) || null;
}

const CLOSE_MS = 200; // matches --dur-sheet-out

// Bottom sheet with slide-up / slide-down motion, dimmed overlay, Esc to close, focus trap and focus restore.
// `children` may be a function receiving `close` so options can dismiss the sheet.
export default function BottomSheet({ title, onClose, variant = 'blue', children, testId, hideClose = false }) {
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef(null);
  const lastFocus = useRef(null);
  const titleId = useId();

  const close = useCallback(
    (after) => {
      if (closing) return;
      setClosing(true);
      setTimeout(() => {
        onClose();
        if (typeof after === 'function') after();
      }, CLOSE_MS);
    },
    [closing, onClose]
  );

  useEffect(() => {
    lastFocus.current = document.activeElement;
    const el = sheetRef.current;
    if (el) el.focus();
    return () => {
      const prev = lastFocus.current;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const nodes = sheetRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes || !nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const layer = (
    <>
      <div className={`overlay ${closing ? 'overlay--closing' : ''}`.trim()} onClick={() => close()} aria-hidden="true" />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid={testId || 'sheet'}
        className={`sheet ${variant === 'light' ? 'sheet--light' : ''} ${closing ? 'sheet--closing' : ''}`.trim()}
        onKeyDown={onKeyDown}
        style={{ outline: 'none' }}
      >
        <div className="sheet__head">
          <h2 className="sheet__title" id={titleId}>{title}</h2>
          {!hideClose ? (
            <button type="button" className="sheet__close" aria-label="Close" onClick={() => close()}>
              <Icon name="close" size={22} />
            </button>
          ) : null}
        </div>
        <div className="sheet__body">{typeof children === 'function' ? children(close) : children}</div>
      </div>
    </>
  );
  const root = layerRoot();
  return root ? createPortal(layer, root) : layer;
}

export function OptionList({ options, value, onSelect, label }) {
  return (
    <div className="options" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={value === o.key}
          className={`option ${value === o.key ? 'option--selected' : ''}`.trim()}
          onClick={() => onSelect(o.key)}
        >
          <span>{o.label}</span>
          {value === o.key ? <Icon name="check-circle" className="option__check" /> : null}
        </button>
      ))}
    </div>
  );
}
