'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { layerRoot } from './BottomSheet';

export default function ConfirmDialog({ title, text, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const node = (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        ref={ref}
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={{ outline: 'none' }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      >
        <h2 className="dialog__title">{title}</h2>
        <p className="dialog__text">{text}</p>
        <div className="dialog__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="btn btn--primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
  const root = layerRoot();
  return root ? createPortal(node, root) : node;
}
