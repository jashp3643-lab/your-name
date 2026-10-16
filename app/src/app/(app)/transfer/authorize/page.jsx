'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { TXN_PIN_MAX_ATTEMPTS } from '@/lib/config';
import { amountInWords, formatINR, maskAccount } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Spinner from '@/components/Spinner';
import { PinInput } from '@/components/Fields';

export default function Authorize() {
  const { data, draft, setDraft, clearDraft, confirmTransfer, chargeFor, toast } = useApp();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const sent = useRef('');

  const ready = !!(draft?.beneficiary && draft?.amount && draft?.accountId);
  useEffect(() => {
    if (!ready) router.replace('/transfer');
  }, [ready, router]);

  const submit = useCallback(
    async (value) => {
      setBusy(true);
      setError('');
      const res = await confirmTransfer(draft, value);
      setBusy(false);
      if (res.ok) {
        setDraft({ result: res });
        router.replace('/transfer/success');
        return;
      }
      setPin('');
      sent.current = '';
      if (res.error === 'ABORT') {
        clearDraft();
        toast('Too many wrong PIN attempts. The transfer was cancelled.', 'error');
        router.replace('/transfer');
        return;
      }
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if (res.error === 'WRONG') {
        setError(`Incorrect PIN. ${res.attemptsLeft} attempt${res.attemptsLeft === 1 ? '' : 's'} left.`);
      } else {
        setError(res.message || 'The transfer could not be completed.');
      }
    },
    [draft, confirmTransfer, setDraft, clearDraft, router, toast]
  );

  useEffect(() => {
    if (ready && pin.length === 6 && !busy && sent.current !== pin) {
      sent.current = pin;
      submit(pin);
    }
  }, [pin, busy, ready, submit]);

  if (!ready) return <div className="splash" />;

  const account = data.accounts.find((a) => a.id === draft.accountId);
  const charge = chargeFor(draft.mode);

  return (
    <Screen className="transfer" testId="transfer-authorize">
      <TopBar title="Quick Transfer" fallback="/transfer/amount" />
      <div className="screen__body transfer__body">
        <div className="payee">
          <span className="avatar" aria-hidden="true">{draft.beneficiary.name.slice(0, 1).toUpperCase()}</span>
          <span><b>{draft.beneficiary.name}</b><small>Bank account number {maskAccount(draft.beneficiary.account)}</small></span>
        </div>

        <p className="transfer__pin-title">Enter 6 digit Transaction PIN</p>
        <PinInput value={pin} onChange={setPin} error={shake} disabled={busy} autoFocus label="Transaction PIN" testId="txn-pin" />
        <div className="pin-status" aria-live="polite">
          {busy ? (
            <span className="pin-status__busy"><Spinner size={18} label="Processing" /> Processing your transfer...</span>
          ) : error ? (
            <span className="field__error" role="alert" data-testid="pin-error">{error}</span>
          ) : (
            <span className="field__hint">{TXN_PIN_MAX_ATTEMPTS} attempts allowed</span>
          )}
        </div>

        <dl className="summary">
          <div><dt>From</dt><dd>{account.type} · {maskAccount(account.number)}</dd></div>
          <div><dt>Mode of transfer</dt><dd>IMPS</dd></div>
          <div><dt>Transaction charges</dt><dd>{formatINR(charge)}</dd></div>
          <div><dt>Purpose</dt><dd>{draft.purpose}</dd></div>
        </dl>

        <div className="amount-block">
          <small>Amount (₹)</small>
          <b data-testid="auth-amount">{formatINR(draft.amount)}</b>
          <small>{amountInWords(draft.amount)}</small>
        </div>
        <p className="transfer__note">Demo mode: no money moves outside this browser.</p>
      </div>
    </Screen>
  );
}
