'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { QUICK_TRANSFER_LIMIT } from '@/lib/config';
import { amountInWords, formatINR, maskAccount } from '@/lib/format';
import { validateAmount } from '@/lib/validation';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import { SelectField, TextField } from '@/components/Fields';

const PURPOSES = ['Family maintenance', 'Bill payment', 'Rent', 'Education', 'Investment', 'Gift', 'Others'];

export default function TransferAmount() {
  const { data, draft, setDraft, chargeFor } = useApp();
  const router = useRouter();
  const [amount, setAmount] = useState(draft?.amount ? String(draft.amount) : '');
  const [accountId, setAccountId] = useState(draft?.accountId || data.accounts[0].id);
  const [purpose, setPurpose] = useState(draft?.purpose || '');
  const [isTest, setIsTest] = useState(!!draft?.isTest);
  const [submitted, setSubmitted] = useState(false);

  const hasDraft = !!draft?.beneficiary;
  useEffect(() => {
    if (!hasDraft) router.replace('/transfer');
  }, [hasDraft, router]);
  if (!hasDraft) return <div className="splash" />;

  const bene = draft.beneficiary;
  const account = data.accounts.find((a) => a.id === accountId);
  const charge = chargeFor(draft.mode);
  const effective = isTest ? '1' : amount;

  let error = validateAmount(effective, { balance: account.balance, charge, limit: QUICK_TRANSFER_LIMIT });
  if (!error && account.number === bene.account) error = 'Choose a different source account';
  const purposeError = purpose ? '' : 'Select a purpose';
  const words = !validateAmount(effective, { limit: Infinity }) ? amountInWords(effective) : '';

  const proceed = () => {
    setSubmitted(true);
    if (error || purposeError) return;
    setDraft({ amount: Number(effective), accountId, purpose, isTest });
    router.push('/transfer/authorize');
  };

  return (
    <Screen className="transfer" testId="transfer-amount">
      <TopBar title="Quick Transfer" fallback="/transfer/new" />
      <div className="screen__body transfer__body">
        <div className="payee">
          <span className="avatar" aria-hidden="true">{bene.name.slice(0, 1).toUpperCase()}</span>
          <span><b>{bene.name}</b><small>Bank account number {maskAccount(bene.account)}</small></span>
        </div>

        <TextField
          label="Amount"
          required
          value={isTest ? '1' : amount}
          onChange={(v) => setAmount(v.replace(/[^\d.]/g, ''))}
          inputMode="decimal"
          placeholder="Enter amount"
          disabled={isTest}
          error={submitted || amount ? error : ''}
          hint={words || `Limit: max ${formatINR(QUICK_TRANSFER_LIMIT)} per transaction`}
          testId="amount-input"
        />
        <SelectField
          label="Select Account"
          required
          value={accountId}
          onChange={setAccountId}
          options={data.accounts.map((a) => ({ value: a.id, label: `${a.type} · ${maskAccount(a.number)} · ${formatINR(a.balance)}` }))}
          testId="source-account"
        />
        <SelectField
          label="Select a purpose"
          required
          value={purpose}
          onChange={setPurpose}
          options={PURPOSES}
          error={submitted ? purposeError : ''}
          testId="purpose"
        />
        <label className="checkbox transfer__test">
          <input type="checkbox" checked={isTest} onChange={(e) => setIsTest(e.target.checked)} data-testid="test-amount" />
          <span>Send ₹1 as a test amount. Use it to check the account details before sending the full amount.</span>
        </label>
        <p className="transfer__note">Charges: {formatINR(charge)} ({draft.mode === 'within' ? 'within bank' : 'other bank'})</p>

        <button type="button" className="btn btn--primary btn--block transfer__cta" onClick={proceed} data-testid="proceed-amount">
          Proceed to pay
        </button>
      </div>
    </Screen>
  );
}
