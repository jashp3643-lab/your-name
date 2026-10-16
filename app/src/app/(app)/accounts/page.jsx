'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { formatINR, maskAccount } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import EyeToggle from '@/components/EyeToggle';
import Icon from '@/components/Icon';
import BottomSheet from '@/components/BottomSheet';

export default function AccountsPage() {
  const { data } = useApp();
  const [showNumber, setShowNumber] = useState(false);
  const [sheet, setSheet] = useState(null);

  const account = data.accounts[0] || {
    type: 'Savings Account',
    number: '50218047561',
    balance: 2352.0,
  };
  const userName = data.user?.name || 'Kuldeep Trivedi';
  const combinedBalance = data.accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

  return (
    <Screen className="accts-screen" testId="accounts-screen">
      <TopBar title="Accounts" />

      <div className="accts-body">
        {/* Dark Purple Hero Section */}
        <div className="accts-hero">
          <div className="accts-hero__header">
            <span className="accts-hero__label">Transaction Accounts</span>
            <span className="accts-hero__badge">{data.accounts.length}</span>
          </div>
          <h2 className="accts-hero__name">{userName}</h2>

          <div className="accts-hero__balance-box">
            <span className="accts-hero__bal-label">Combined Balance</span>
            <p className="accts-hero__bal-amt">{formatINR(combinedBalance)}</p>
          </div>
        </div>

        {/* White Panel - Edge-to-edge, flex-1 */}
        <div className="accts-panel">
          <div className="accts-panel__type">{account.type}</div>

          <div className="accts-panel__main-row">
            <div className="accts-panel__acct-num">
              <span>{showNumber ? account.number : maskAccount(account.number)}</span>
              <EyeToggle
                revealed={showNumber}
                onToggle={() => setShowNumber((v) => !v)}
                what="account number"
              />
            </div>

            <Link
              href="/transactions"
              className="accts-panel__bal-link"
              aria-label={`View transactions, balance ${formatINR(account.balance)}`}
            >
              <span>{formatINR(account.balance)}</span>
              <Icon name="chevron-right" size={16} />
            </Link>
          </div>

          <div className="accts-panel__actions">
            <button
              type="button"
              className="accts-panel__link-btn"
              onClick={() => setSheet('tech-error')}
            >
              Apply for a New Savings Account
            </button>
            <button
              type="button"
              className="accts-panel__link-btn"
              onClick={() => setSheet('tech-error')}
            >
              Apply for a New Current Account
            </button>
            <button
              type="button"
              className="accts-panel__link-btn"
              onClick={() => setSheet('tech-error')}
            >
              Apply for Joint Savings Account
            </button>
          </div>
        </div>

        {/* Bottom purple bar matching reference */}
        <div className="accts-bottom-bar" />
      </div>

      {sheet === 'tech-error' ? (
        <BottomSheet title="Unable to proceed" variant="light" hideClose onClose={() => setSheet(null)} testId="tech-error-sheet">
          {(close) => (
            <div className="tech-error">
              <div className="tech-error__graphic" aria-hidden="true">
                <svg viewBox="0 0 240 140" width="220" height="130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 130 C45 115 85 115 130 126 C165 118 200 120 230 130 Z" fill="#eee4dc" />
                  <path d="M40 130 C75 120 110 120 150 128 C180 124 205 125 225 130 Z" fill="#e4d5c8" />
                  <path d="M86 128 V108 C86 105 82 105 82 108 V114 H77 C74 114 74 109 77 109 H79" stroke="#789084" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M92 128 V102 C92 98 98 98 98 102 V112 H102 C105 112 105 107 102 107 H100" stroke="#789084" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="89" y1="128" x2="89" y2="94" stroke="#789084" strokeWidth="5.5" strokeLinecap="round" />
                  <ellipse cx="140" cy="126" rx="6" ry="3.5" fill="#c4b5aa" />
                  <ellipse cx="152" cy="127" rx="4" ry="2.5" fill="#b3a297" />
                  <line x1="120" y1="56" x2="120" y2="128" stroke="#848a97" strokeWidth="3.5" strokeLinecap="round" />
                  <polygon points="120,18 78,82 162,82" fill="#ffffff" stroke="#9e1837" strokeWidth="7" strokeLinejoin="round" />
                  <path d="M120 40 V58" stroke="#9e1837" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="120" cy="70" r="3.2" fill="#9e1837" />
                </svg>
              </div>
              <p className="tech-error__msg">
                Sorry! We are facing technical issues. Kindly retry after some time.
              </p>
              <button
                type="button"
                className="btn btn--tech-error-ok"
                onClick={() => {
                  close();
                  setSheet(null);
                }}
              >
                Ok
              </button>
            </div>
          )}
        </BottomSheet>
      ) : null}
    </Screen>
  );
}
