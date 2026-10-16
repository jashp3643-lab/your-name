'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { LATENCY } from '@/lib/config';
import { computeFd } from '@/lib/selectors';
import { durationYMD, formatDate, formatINR, formatINRSpaced, maskAccount } from '@/lib/format';
import { useLoading, useNow } from '@/lib/hooks';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Icon from '@/components/Icon';
import EyeToggle from '@/components/EyeToggle';
import BottomSheet from '@/components/BottomSheet';
import { PageLoading } from '@/components/Spinner';
import Empty from '@/components/Empty';

function KV({ label, children, full = false, testId }) {
  return (
    <div className={`kv ${full ? 'kv--full' : ''}`.trim()}>
      <dt>{label}</dt>
      <dd data-testid={testId}>{children}</dd>
    </div>
  );
}

function downloadSummary(fd, calc, branchLine) {
  const lines = [
    'YONO SBI fixed deposit summary',
    '------------------------------',
    `Account No: ${fd.number}`,
    `Variant: ${fd.variant}`,
    `Principal: ${formatINRSpaced(fd.principal)}`,
    `Interest earned so far: ${formatINRSpaced(calc.interest)}`,
    `Current value: ${formatINRSpaced(calc.currentValue)}`,
    `Rate of interest: ${fd.rate.toFixed(2)}%`,
    `Start date: ${formatDate(fd.startDate)}`,
    `Maturity date: ${formatDate(fd.maturityDate)}`,
    `Maturity amount: ${formatINRSpaced(calc.maturityAmount)}`,
    `Branch: ${branchLine}`,
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fd-${fd.number}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function FdDetailsPage() {
  const params = useParams();
  const { data, toast } = useApp();
  const now = useNow();
  const loading = useLoading(LATENCY.deposit, params.id);
  const [show, setShow] = useState(false);
  const [sheet, setSheet] = useState(null);

  const fd = data.deposits.find((d) => d.id === params.id);
  const calc = fd ? computeFd(fd, now) : null;

  return (
    <Screen className="fd" testId="fd-screen">
      <TopBar title="Fixed Deposit Details" fallback="/deposits" />
      {loading ? (
        <PageLoading label="Loading deposit" />
      ) : !fd ? (
        <Empty icon="warning" title="Deposit not found" hint="This deposit does not exist or was closed.">
          <Link href="/deposits" className="btn btn--outline btn--pill">Back to deposits</Link>
        </Empty>
      ) : (
        <>
          <div className="screen__body fd__body fade-in" data-testid="fd-body">
            {fd.lienMarked ? (
              <div className="banner" data-testid="lien-banner">
                <Icon name="info" />
                <span>This FD has lien/hold marked. You cannot modify/close this FD</span>
              </div>
            ) : null}

            <div className="stats">
              <div className="stat"><small>Current Value</small><b data-testid="fd-current">{formatINRSpaced(calc.currentValue)}</b></div>
              <div className="stat"><small>Rate of Interest</small><b>{fd.rate.toFixed(2)}%</b></div>
              <div className="stat"><small>Maturity Amount</small><b>{formatINRSpaced(calc.maturityAmount)}</b></div>
              <div className="stat"><small>Maturity Date</small><b>{formatDate(fd.maturityDate)}</b></div>
            </div>

            <div className="overview-head">
              <h2>Overview</h2>
              <div className="overview-head__icons">
                <button type="button" className="icon-btn" aria-label="Deposit information" onClick={() => setSheet('info')}><Icon name="info" size={18} /></button>
                <button type="button" className="icon-btn" aria-label="Deposit statement" onClick={() => toast('Statements are not generated in demo mode. Use Download for a summary file.')}><Icon name="doc" size={18} /></button>
                <button type="button" className="icon-btn" aria-label="Email details" onClick={() => toast('Demo mode: no email is sent')}><Icon name="mail" size={18} /></button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Download summary"
                  data-testid="fd-download"
                  onClick={() => {
                    downloadSummary(fd, calc, `${fd.branch} (${fd.branchCode})`);
                    toast('Summary downloaded', 'success');
                  }}
                >
                  <Icon name="download" size={18} />
                </button>
              </div>
            </div>

            <dl className="kvgrid">
              <KV label="FD Account No." testId="fd-number">
                {show ? fd.number : maskAccount(fd.number)} <EyeToggle revealed={show} onToggle={() => setShow((v) => !v)} what="account number" />
              </KV>
              <KV label="FD Variant">{fd.variant}</KV>
              <KV label="Principal Amount">{formatINRSpaced(fd.principal)}</KV>
              <KV label="Interest Amount">{formatINRSpaced(calc.interest)}</KV>
              <KV label="Duration" full>{durationYMD(fd.startDate, fd.maturityDate)}</KV>
              <KV label="FD Start Date">{formatDate(fd.startDate)}</KV>
              <KV label="Currency">{fd.currency}</KV>
              {fd.lienMarked && fd.lienAmount > 0 ? (
                <KV label="Lien Amount" full>{formatINRSpaced(fd.lienAmount)}</KV>
              ) : null}
              <KV label="Branch">{fd.branch}</KV>
              <KV label="Branch Code">{fd.branchCode}</KV>
              <KV label="Ownership" full>{fd.ownership}</KV>
            </dl>

            <section className="fd-section" aria-labelledby="fd-int">
              <h2 id="fd-int">Interest &amp; Maturity Details</h2>
              <dl className="kvgrid kvgrid--one">
                <KV label="Interest Payout" full>{fd.interestPayout}</KV>
                <KV label="Maturity Instruction" full>{fd.maturityInstruction}</KV>
              </dl>
            </section>

            <section className="fd-section" aria-labelledby="fd-nom">
              <h2 id="fd-nom">Nominee Details</h2>
              <Link href={`/deposits/${fd.id}/nominee`} className="link fd-section__link" data-testid="view-nominee">View Nominee Details</Link>
            </section>
          </div>
        </>
      )}

      {sheet === 'info' ? (
        <BottomSheet title="About this deposit" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">
                Interest accrues with quarterly compounding and is paid at maturity. Figures in this demo are indicative.
              </p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>Close</button>
            </>
          )}
        </BottomSheet>
      ) : null}
    </Screen>
  );
}
