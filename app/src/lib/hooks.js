'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// True for `ms` milliseconds after mount and after every change of `key` (simulated request latency).
export function useLoading(ms, key = '') {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms, key]);
  return loading;
}

// Back navigation that falls back to a route when the page was opened directly.
export function useBack(fallback = '/home') {
  const router = useRouter();
  return useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(fallback);
  }, [router, fallback]);
}

export function useNow() {
  // Stable "now" per mount (avoids re-running selectors on every render).
  const [now] = useState(() => new Date());
  return now;
}
