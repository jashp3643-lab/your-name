'use client';

import Icon from './Icon';
import { useBack } from '@/lib/hooks';

// Inner-screen top bar: back chevron, title, optional right actions.
export default function TopBar({ title, actions, light = false, onBack, fallback = '/home', hideBack = false }) {
  const back = useBack(fallback);
  return (
    <header className={`topbar ${light ? 'topbar--light' : ''}`.trim()}>
      {hideBack ? (
        <span style={{ width: 8 }} />
      ) : (
        <button type="button" className="icon-btn" aria-label="Go back" onClick={onBack || back}>
          <Icon name="back" />
        </button>
      )}
      <h1 className="topbar__title">{title}</h1>
      {actions ? <div className="topbar__actions">{actions}</div> : null}
    </header>
  );
}

export function IconButton({ icon, label, onClick, dot = false, href, ...rest }) {
  return (
    <button
      type="button"
      className={`icon-btn ${dot ? 'icon-btn--dot' : ''}`.trim()}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
}
