'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { formatINR, maskAccount } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import EyeToggle from '@/components/EyeToggle';

function AccountCard({ a }) {
  const [show, setShow] = useState(false);
  return (
    <li className="acct-card" data-testid="account-card">
      <div className="acct-card__top">
        <b>{a.type}</b>
        <span>{show ? a.number : maskAccount(a.number)} <EyeToggle revealed={show} onToggle={() => setShow((v) => !v)} what="account number" /></span>
      </div>
      <p className="acct-card__bal">{formatINR(a.balance)}</p>
      <small>Available balance · {a.branch}</small>
      <Link href="/transactions" className="link">View transactions</Link>
    </li>
  );
}

export default function AccountsPage() {
  const { data } = useApp();
  return (
    <Screen className="info" testId="accounts-screen">
      <TopBar title="My Accounts" />
      <div className="screen__body info__body">
        <ul className="acct-list">{data.accounts.map((a) => <AccountCard key={a.id} a={a} />)}</ul>
      </div>
    </Screen>
  );
}
