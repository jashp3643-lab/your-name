'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { amountInWords, formatDate, formatINR, maskAccount, pad2 } from '@/lib/format';
import Screen from '@/components/Screen';
import Icon from '@/components/Icon';

export default function TransferSuccess() {
  const { data, draft, clearDraft, toast } = useApp();
  const router = useRouter();
  const result = draft?.result;

  useEffect(() => {
    if (!result) router.replace('/transfer');
  }, [result, router]);
  if (!result) return <div className="splash" />;

  const account = data.accounts.find((a) => a.id === draft.accountId);
  const when = new Date(result.at);
  const time = `${formatDate(when)} ${pad2(when.getHours())}:${pad2(when.getMinutes())}`;

  const receipt = [
    'DemoBank transfer receipt (demo)',
    `Status: Successful`,
    `Amount: ${formatINR(result.amount)} (${amountInWords(result.amount)})`,
    `To: ${draft.beneficiary.name} (${maskAccount(draft.beneficiary.account)})`,
    `From: ${account.type} (${maskAccount(account.number)})`,
    `Mode: IMPS | Charges: ${formatINR(result.charge)}`,
    `Reference: ${result.reference}`,
    `Date: ${time}`,
  ].join('\n');

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'DemoBank transfer receipt', text: receipt });
        return;
      }
      await navigator.clipboard.writeText(receipt);
      toast('Receipt copied to the clipboard', 'success');
    } catch (e) {
      if (e && e.name === 'AbortError') return; // user closed the share sheet
      toast('Could not share the receipt on this device', 'error');
    }
  };

  const done = () => {
    clearDraft();
    router.replace('/transfer');
  };

  return (
    <Screen className="transfer" testId="transfer-success">
      <div className="success screen__body">
        <span className="success__icon" aria-hidden="true"><Icon name="check" size={34} /></span>
        <h1 className="success__title" data-testid="success-title">Successful</h1>
        <p className="success__amt" data-testid="success-amount">{formatINR(result.amount)}</p>
        <p className="success__words">{amountInWords(result.amount)}</p>

        <dl className="summary summary--card">
          <div><dt>To</dt><dd>{draft.beneficiary.name} · {maskAccount(draft.beneficiary.account)}</dd></div>
          <div><dt>From</dt><dd>{account.type} · {maskAccount(account.number)}</dd></div>
          <div><dt>Mode of transfer</dt><dd>IMPS</dd></div>
          <div><dt>Transaction charges</dt><dd>{formatINR(result.charge)}</dd></div>
          <div><dt>Reference</dt><dd data-testid="success-ref">{result.reference}</dd></div>
          <div><dt>Date</dt><dd>{time}</dd></div>
          <div><dt>Balance now</dt><dd>{formatINR(result.balanceAfter)}</dd></div>
        </dl>

        <div className="success__actions">
          <button type="button" className="btn btn--outline" onClick={share} data-testid="share-receipt">
            <Icon name="share" size={18} /> Share Screenshot
          </button>
          <button type="button" className="btn btn--primary" onClick={done} data-testid="back-to-transfer">Back to Transfer</button>
        </div>
        <p className="transfer__note">&ldquo;Share Screenshot&rdquo; shares a text receipt in this demo.</p>
      </div>
    </Screen>
  );
}
