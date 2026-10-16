'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

// Auth guard for every signed-in screen.
export default function AppLayout({ children }) {
  const { authed } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!authed) router.replace('/login');
  }, [authed, router]);
  if (!authed) return <div className="splash" aria-busy="true" />;
  return children;
}
