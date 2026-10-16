'use client';

import { useMemo, useState } from 'react';
import { formatINRSpaced } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import { SelectField, TextField } from '@/components/Fields';

const RATES = { 6: 5.9, 12: 6.35, 18: 6.45, 24: 6.5, 36: 6.6, 60: 6.7 };

// Deposit calculator (opening a deposit is not part of the demo scope).
export default function NewDeposit() {
  const [amount, setAmount] = useState('50000');
  const [months, setMonths] = useState('12');
  const [touched, setTouched] = useState(false);

  const error = useMemo(() => {
    if (!amount) return 'Enter an amount';
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 5000) return 'Minimum amount is ₹5,000';
    if (n > 10000000) return 'Maximum amount is ₹1,00,00,000';
    return '';
  }, [amount]);

  const rate = RATES[months];
  const maturity = !error && months ? Number(amount) * Math.pow(1 + rate / 400, (4 * Number(months)) / 12) : 0;

  return (
    <Screen className="info" testId="new-deposit-screen">
      <TopBar title="Open New Deposit" fallback="/deposits" />
      <div className="screen__body info__body">
        <p className="info__intro">Estimate what a fixed deposit would earn. Opening a deposit is not available in demo mode.</p>
        <TextField
          label="Deposit amount (₹)"
          value={amount}
          onChange={(v) => { setAmount(v.replace(/\D/g, '')); setTouched(true); }}
          inputMode="numeric"
          error={touched ? error : ''}
          testId="dep-amount"
        />
        <SelectField
          label="Tenure"
          value={months}
          onChange={setMonths}
          options={Object.keys(RATES).map((m) => ({ value: m, label: m >= 12 && m % 12 === 0 ? `${m / 12} year${m / 12 > 1 ? 's' : ''}` : `${m} months` }))}
          testId="dep-tenure"
        />
        <dl className="summary summary--card" aria-live="polite">
          <div><dt>Interest rate</dt><dd>{rate.toFixed(2)}% p.a.</dd></div>
          <div><dt>Estimated maturity amount</dt><dd data-testid="dep-maturity">{error ? '-' : formatINRSpaced(maturity)}</dd></div>
          <div><dt>Estimated interest</dt><dd>{error ? '-' : formatINRSpaced(maturity - Number(amount))}</dd></div>
        </dl>
        <p className="transfer__note">Rates are invented for this demo (quarterly compounding).</p>
      </div>
    </Screen>
  );
}
