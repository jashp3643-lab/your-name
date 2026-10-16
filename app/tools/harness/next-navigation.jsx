// Verification-only stand-in for `next/navigation` (hash-based router).
// The real Next.js build never uses this file: it is only aliased in tools/harness/build.mjs.
import { useSyncExternalStore } from 'react';
import { getPath, getParams, navigate, subscribe } from './router-state.js';

export function usePathname() {
  return useSyncExternalStore(subscribe, getPath, () => '/');
}

export function useParams() {
  useSyncExternalStore(subscribe, getPath, () => '/');
  return getParams();
}

export function useRouter() {
  return {
    push: (href) => navigate(href, false),
    replace: (href) => navigate(href, true),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => {},
    prefetch: () => {},
  };
}

export function redirect(href) {
  navigate(href, true);
}
