'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { QUICK_TRANSFER_LIMIT } from '@/lib/config';
import { formatINR, maskAccount } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Icon from '@/components/Icon';

export default function TransferMethods() {
  const { data, setDraft, clearDraft, toast } = useApp();
  const router = useRouter();

  const start = (method) => {
    clearDraft();
    setDraft({ method });
    router.push('/transfer/new');
  };

  const payTo = (b) => {
    clearDraft();
    setDraft({
      method: 'saved',
      mode: b.scope,
      beneficiary: { name: b.name, account: b.account, ifsc: b.ifsc, nickname: b.nickname },
    });
    router.push('/transfer/amount');
  };

  return (
    <Screen className="transfer" testId="transfer-methods">
      <TopBar title="Bank Transfer" />
      <div className="screen__body transfer__body">
        <ul className="method-list">
          <li>
            <button type="button" className="method" onClick={() => start('quick')} data-testid="method-quick">
              <span className="method__ic"><Icon name="bolt" /></span>
              <span className="method__text"><b>Quick Transfer</b><small>Transfer up to {formatINR(QUICK_TRANSFER_LIMIT)} to any account</small></span>
              <Icon name="chevron-right" size={18} />
            </button>
          </li>
          <li>
            <button type="button" className="method" onClick={() => start('account')} data-testid="method-account">
              <span className="method__ic"><Icon name="bank" /></span>
              <span className="method__text"><b>Bank Account</b><small>Transfer to another bank account</small></span>
              <Icon name="chevron-right" size={18} />
            </button>
          </li>
          <li>
            <button type="button" className="method" onClick={() => start('own')} data-testid="method-own">
              <span className="method__ic"><Icon name="user" /></span>
              <span className="method__text"><b>My Accounts</b><small>Move money between your own accounts</small></span>
              <Icon name="chevron-right" size={18} />
            </button>
          </li>
          <li>
            <button type="button" className="method" onClick={() => toast('Mobile Money Identifier transfers are not available in demo mode')}>
              <span className="method__ic"><Icon name="phone" /></span>
              <span className="method__text"><b>MMID Transfer</b><small>Mobile number and money identifier</small></span>
              <Icon name="chevron-right" size={18} />
            </button>
          </li>
        </ul>

        <h2 className="transfer__h">Saved beneficiaries</h2>
        {data.beneficiaries.length === 0 ? (
          <p className="transfer__empty">No saved beneficiaries yet. Add one with Quick Transfer.</p>
        ) : (
          <ul className="bene-list">
            {data.beneficiaries.map((b) => (
              <li key={b.id}>
                <button type="button" className="bene" onClick={() => payTo(b)} data-testid="saved-bene">
                  <span className="avatar avatar--sm" aria-hidden="true">{b.name.slice(0, 1)}</span>
                  <span className="method__text"><b>{b.nickname || b.name}</b><small>{b.name} · {maskAccount(b.account)}</small></span>
                  <Icon name="chevron-right" size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="transfer__note">Demo mode: transfers only change the data stored in this browser.</p>
      </div>
    </Screen>
  );
}
