'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Icon from '@/components/Icon';
import Empty from '@/components/Empty';

const DESTINATIONS = [
  { title: 'Transactions', keywords: 'passbook statement history spend', href: '/transactions', icon: 'list' },
  { title: 'Fund Transfer', keywords: 'send money pay imps neft beneficiary', href: '/transfer', icon: 'bank' },
  { title: 'Deposits', keywords: 'fixed deposit fd maturity nominee', href: '/deposits', icon: 'coins' },
  { title: 'My Accounts', keywords: 'savings salary balance', href: '/accounts', icon: 'card' },
  { title: 'Favorites', keywords: 'saved payees beneficiaries', href: '/favorites', icon: 'heart' },
  { title: 'Recharge & Bills', keywords: 'mobile dth electricity water gas fastag', href: '/services', icon: 'bill' },
  { title: 'Scan QR', keywords: 'upi pay qr', href: '/scan', icon: 'qr' },
  { title: 'Insurance', keywords: 'life health motor travel cover', href: '/insurance', icon: 'shield' },
  { title: 'Investments', keywords: 'mutual fund demat nps ppf sip', href: '/investments', icon: 'invest' },
  { title: 'Notifications', keywords: 'alerts messages', href: '/notifications', icon: 'bell' },
  { title: 'Settings', keywords: 'mask balance reset demo logout', href: '/settings', icon: 'lock' },
];

export default function SearchPage() {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DESTINATIONS;
    return DESTINATIONS.filter((d) => `${d.title} ${d.keywords}`.toLowerCase().includes(s));
  }, [q]);
  return (
    <Screen className="info" testId="search-screen">
      <TopBar title="Search" />
      <div className="screen__body info__body">
        <label className="searchbox searchbox--big">
          <Icon name="search" size={18} />
          <input type="search" autoFocus placeholder="Search features, e.g. deposit" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search features" data-testid="feature-search" />
        </label>
        {results.length === 0 ? (
          <Empty icon="search" title="No matches" hint="Try words like transfer, deposit or statement." />
        ) : (
          <ul className="info__list">
            {results.map((d) => (
              <li key={d.title}>
                <Link href={d.href} className="info__card" data-testid="search-result">
                  <span className="quick__ic"><Icon name={d.icon} /></span>
                  <span className="info__text"><b>{d.title}</b></span>
                  <Icon name="chevron-right" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}
