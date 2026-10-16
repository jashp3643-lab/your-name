'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { APP_NAME, DEMO_NOTICE } from '@/lib/config';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function Settings() {
  const { data, setSetting, resetData, logout, toast } = useApp();
  const router = useRouter();
  const [confirm, setConfirm] = useState(null);
  return (
    <Screen className="info" testId="settings-screen">
      <TopBar title="Settings" />
      <div className="screen__body info__body">
        <ul className="info__list">
          <li className="info__card info__card--static">
            <span className="info__text"><b>Mask balances on Home</b><small>Tiles start hidden each time you open Home</small></span>
            <label className="switch">
              <input
                type="checkbox"
                role="switch"
                checked={data.settings.hideBalances !== false}
                onChange={(e) => setSetting('hideBalances', e.target.checked)}
                aria-label="Mask balances on Home"
                data-testid="mask-setting"
              />
              <span aria-hidden="true" />
            </label>
          </li>
          <li>
            <button type="button" className="info__card" onClick={() => setConfirm('reset')} data-testid="reset-data">
              <span className="info__text"><b>Reset demo data</b><small>Restore the original accounts, transactions and nominee</small></span>
            </button>
          </li>
          <li>
            <button type="button" className="info__card" onClick={() => setConfirm('logout')}>
              <span className="info__text"><b>Log out</b></span>
            </button>
          </li>
        </ul>
        <p className="transfer__note">{APP_NAME} · {DEMO_NOTICE}</p>
      </div>
      {confirm === 'reset' ? (
        <ConfirmDialog
          title="Reset demo data?"
          text="Transfers, nominee edits and settings will be restored to the original demo values."
          confirmLabel="Reset"
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            resetData();
            setConfirm(null);
            toast('Demo data restored', 'success');
          }}
        />
      ) : null}
      {confirm === 'logout' ? (
        <ConfirmDialog
          title="Log out?"
          text="You will need your MPIN to sign in again."
          confirmLabel="Log out"
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            logout();
            router.replace('/login');
          }}
        />
      ) : null}
    </Screen>
  );
}
