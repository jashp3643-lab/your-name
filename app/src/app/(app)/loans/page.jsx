'use client';

import Link from 'next/link';
import { useApp } from '@/lib/store';
import { formatINR, maskAccount } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Empty from '@/components/Empty';

export default function LoansPage() {
  const { data } = useApp();
  return (
    <Screen className="info" testId="loans-screen">
      <TopBar title="Loans" fallback="/home" />
      <div className="screen__body info__body">
        {data.loans.length === 0 ? (
          <Empty icon="coins" title="No active loans" hint="Loans you take will appear here." />
        ) : (
          <ul className="acct-list">
            {data.loans.map((l) => (
              <li key={l.id} className="acct-card" data-testid="loan-card">
                <div className="acct-card__top"><b>{l.type}</b><span>{maskAccount(l.number)}</span></div>
                <p className="acct-card__bal">{formatINR(l.outstanding)}</p>
                <small>Outstanding amount</small>
                <dl className="summary summary--plain">
                  <div><dt>Overdraft limit</dt><dd>{formatINR(l.limit)}</dd></div>
                  <div><dt>Available</dt><dd>{formatINR(l.limit - l.outstanding)}</dd></div>
                  <div><dt>Interest rate</dt><dd>{l.rate.toFixed(2)}% p.a.</dd></div>
                </dl>
                {l.depositId ? <Link href={`/deposits/${l.depositId}`} className="link">View linked deposit</Link> : null}
              </li>
            ))}
          </ul>
        )}
        <p className="transfer__note">Demo data. Repayment and manage options are not available in demo mode.</p>
      </div>
    </Screen>
  );
}
