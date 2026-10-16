'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { LATENCY } from '@/lib/config';
import { computeFd } from '@/lib/selectors';
import { formatDate, formatINR, formatINRSpaced, maskAccount, pad2 } from '@/lib/format';
import { useLoading, useNow } from '@/lib/hooks';
import Screen from '@/components/Screen';
import TopBar, { IconButton } from '@/components/TopBar';
import Icon from '@/components/Icon';
import EyeToggle from '@/components/EyeToggle';
import BottomSheet from '@/components/BottomSheet';
import { PageLoading } from '@/components/Spinner';
import Empty from '@/components/Empty';

function FdRow({ fd, now }) {
  const [show, setShow] = useState(false);
  const calc = computeFd(fd, now);
  return (
    <li>
      <Link href={`/deposits/${fd.id}`} className="fd-row" data-testid="fd-row" aria-label={`${fd.variant} ${maskAccount(fd.number)}, ${formatINRSpaced(calc.currentValue)}`}>
        <span className="fd-row__top">
          <span className="fd-row__id">
            <small>{fd.variant}</small>
            <b>{show ? fd.number : maskAccount(fd.number)} <EyeToggle revealed={show} onToggle={() => setShow((v) => !v)} what="deposit number" /></b>
          </span>
          <span className="fd-row__val">{formatINRSpaced(fd.principal)} <Icon name="chevron-right" size={14} /></span>
        </span>
        <span className="fd-row__foot">
          <span>Maturity Date: {formatDate(fd.maturityDate)}</span>
          <span>ROI: {fd.rate.toFixed(2)}%</span>
        </span>
      </Link>
    </li>
  );
}

export default function DepositsPage() {
  const { data, toast } = useApp();
  const router = useRouter();
  const now = useNow();
  const loading = useLoading(LATENCY.deposits);
  const [sheet, setSheet] = useState(null);

  const total = data.deposits.reduce((s, d) => s + d.principal, 0);

  return (
    <Screen className="deposits" testId="deposits-screen">
      <TopBar
        title="Deposits"
        actions={<IconButton icon="kebab" label="More options" onClick={() => setSheet('menu')} />}
      />
      {loading ? (
        <PageLoading label="Loading deposits" />
      ) : (
        <div className="screen__body fade-in" data-testid="deposits-content">
          <section className="dep-hero">
            <p className="dep-hero__eyebrow">COMBINED CURRENT VALUE</p>
            <p className="dep-hero__value" data-testid="deposits-total">
              {formatINRSpaced(total)}
              <button type="button" className="icon-btn" aria-label="About combined current value" onClick={() => setSheet('info')}>
                <Icon name="info" size={18} />
              </button>
            </p>
            <div className="dep-hero__actions">
              <Link href="/deposits/requests" className="btn btn--glass">Requests</Link>
              <Link href="/deposits/new" className="btn btn--glass btn--glass-strong">Open New Deposit</Link>
            </div>
          </section>

          <section className="dep-sheet">
            <h2 className="dep-sheet__title">Fixed Deposits ({pad2(data.deposits.length)})</h2>
            {data.deposits.length === 0 ? (
              <Empty icon="coins" title="No deposits yet" hint="Open a deposit to see it here." />
            ) : (
              <ul className="fd-list">
                {data.deposits.map((fd) => <FdRow key={fd.id} fd={fd} now={now} />)}
              </ul>
            )}
            <button type="button" className="dep-banner" onClick={() => toast('Linked accounts are not available in demo mode')}>
              <span>
                <small>View your linked</small>
                <b>Sukanya Samriddhi<br />Minor PPF Account</b>
              </span>
              <svg viewBox="0 0 120 80" width="104" height="70" aria-hidden="true">
                <circle cx="40" cy="26" r="12" fill="rgba(255,255,255,.85)" />
                <path d="M22 70c0-16 8-24 18-24s18 8 18 24z" fill="rgba(255,255,255,.55)" />
                <circle cx="84" cy="34" r="9" fill="rgba(255,255,255,.7)" />
                <path d="M70 70c0-12 6-18 14-18s14 6 14 18z" fill="rgba(255,255,255,.4)" />
              </svg>
            </button>
          </section>
        </div>
      )}

      {sheet === 'menu' ? (
        <BottomSheet title="Deposits" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <div className="options">
              <button type="button" className="option" onClick={() => close(() => router.push('/deposits/requests'))}>Deposit requests</button>
              <button type="button" className="option" onClick={() => close(() => router.push('/deposits/new'))}>Open new deposit</button>
              <button type="button" className="option" onClick={() => close(() => toast('Help is not available in demo mode'))}>Help</button>
            </div>
          )}
        </BottomSheet>
      ) : null}
      {sheet === 'info' ? (
        <BottomSheet title="Combined current value" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">
                Principal plus interest earned so far across your deposits. The demo calculates it with quarterly compounding, so the figures are indicative only.
              </p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>Got it</button>
            </>
          )}
        </BottomSheet>
      ) : null}
    </Screen>
  );
}
