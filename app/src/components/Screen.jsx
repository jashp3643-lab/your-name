'use client';

import BottomNav from './BottomNav';

// Page container. Mounting it plays the short cross-fade that the reference shows on every screen change.
export default function Screen({ children, className = '', nav, testId }) {
  return (
    <main className={`screen ${className}`.trim()} data-testid={testId}>
      {children}
      {nav ? <BottomNav active={nav} /> : null}
    </main>
  );
}
