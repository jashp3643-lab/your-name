// Verification-only stand-in for `next/link`.
import { navigate } from './router-state.js';

export default function Link({ href, replace, prefetch, scroll, onClick, children, ...rest }) {
  const to = typeof href === 'string' ? href : href?.pathname || '/';
  return (
    <a
      href={`#${to}`}
      {...rest}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to, !!replace);
      }}
    >
      {children}
    </a>
  );
}
