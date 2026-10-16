'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function Index() {
  const { authed } = useApp();
  const router = useRouter();
  useEffect(() => {
    router.replace(authed ? '/home' : '/login');
  }, [authed, router]);
  return <div className="splash" aria-busy="true" />;
}
