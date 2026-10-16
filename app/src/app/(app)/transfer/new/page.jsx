'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { OWN_BANK_IFSC, lookupIfsc, searchIfsc } from '@/lib/ifsc';
import { maskAccount } from '@/lib/format';
import {
  validateAccountNumber, validateConfirmAccount, validateIfsc, validateName, validateNickname,
} from '@/lib/validation';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Icon from '@/components/Icon';
import BottomSheet, { OptionList } from '@/components/BottomSheet';
import { SelectField, TextField } from '@/components/Fields';

export default function NewBeneficiary() {
  const { data, draft, setDraft } = useApp();
  const router = useRouter();
  const method = draft?.method || 'quick';
  const own = method === 'own';

  const [mode, setMode] = useState(method === 'account' ? 'other' : 'within');
  const [f, setF] = useState({ name: '', account: '', confirm: '', ifsc: '', nickname: '' });
  const [ownId, setOwnId] = useState('');
  const [touched, setTouched] = useState({});
  const [sheet, setSheet] = useState(false);
  const [ifscQuery, setIfscQuery] = useState('');

  // direct visit without choosing a method still works (defaults to quick transfer)
  useEffect(() => {
    if (!draft) setDraft({ method: 'quick' });
  }, [draft, setDraft]);

  const set = (k) => (v) => setF((s) => ({ ...s, [k]: k === 'account' || k === 'confirm' ? v.replace(/\D/g, '') : k === 'ifsc' ? v.toUpperCase() : v }));
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errors = useMemo(() => {
    if (own) return { own: ownId ? '' : 'Choose the account to send money to' };
    return {
      name: validateName(f.name),
      account: validateAccountNumber(f.account),
      confirm: validateConfirmAccount(f.confirm, f.account),
      ifsc: mode === 'other' ? validateIfsc(f.ifsc) : '',
      nickname: validateNickname(f.nickname),
    };
  }, [f, mode, own, ownId]);

  const valid = Object.values(errors).every((e) => !e);
  const show = (k) => (touched[k] || touched.all ? errors[k] : '');
  const branch = mode === 'other' && !errors.ifsc ? lookupIfsc(f.ifsc) : null;

  const proceed = () => {
    if (!valid) {
      setTouched({ all: true });
      return;
    }
    if (own) {
      const acc = data.accounts.find((a) => a.id === ownId);
      setDraft({
        method,
        mode: 'within',
        beneficiary: { name: acc.type, account: acc.number, ifsc: OWN_BANK_IFSC, nickname: '' },
      });
    } else {
      setDraft({
        method,
        mode,
        beneficiary: {
          name: f.name.trim(),
          account: f.account.trim(),
          ifsc: mode === 'within' ? OWN_BANK_IFSC : f.ifsc.trim().toUpperCase(),
          nickname: f.nickname.trim(),
        },
      });
    }
    router.push('/transfer/amount');
  };

  return (
    <Screen className="transfer" testId="transfer-new">
      <TopBar title={own ? 'My Accounts' : 'Quick Transfer'} fallback="/transfer" />
      <div className="screen__body transfer__body">
        {own ? (
          <>
            <p className="transfer__lead">Send money to one of your own accounts.</p>
            <SelectField
              label="To account"
              required
              value={ownId}
              onChange={setOwnId}
              options={data.accounts.map((a) => ({ value: a.id, label: `${a.type} · ${maskAccount(a.number)}` }))}
              error={show('own')}
              testId="own-to"
            />
          </>
        ) : (
          <>
            <div className="segmented" role="tablist" aria-label="Transfer type">
              <button type="button" role="tab" aria-selected={mode === 'within'} className={mode === 'within' ? 'is-on' : ''} onClick={() => setMode('within')} data-testid="mode-within">To within bank</button>
              <button type="button" role="tab" aria-selected={mode === 'other'} className={mode === 'other' ? 'is-on' : ''} onClick={() => setMode('other')} data-testid="mode-other">To other bank</button>
            </div>

            <TextField label="Beneficiary Name" required value={f.name} onChange={set('name')} onBlur={touch('name')} error={show('name')} placeholder="Beneficiary Name" testId="bene-name" autoComplete="off" />
            <TextField label="Account Number" required value={f.account} onChange={set('account')} onBlur={touch('account')} error={show('account')} inputMode="numeric" maxLength={18} placeholder="Account Number" testId="bene-account" />
            <TextField label="Confirm Account Number" required value={f.confirm} onChange={set('confirm')} onBlur={touch('confirm')} error={show('confirm')} inputMode="numeric" maxLength={18} placeholder="Confirm Account Number" testId="bene-confirm" />
            {mode === 'other' ? (
              <TextField
                label="IFSC Code"
                required
                value={f.ifsc}
                onChange={set('ifsc')}
                onBlur={touch('ifsc')}
                error={show('ifsc')}
                maxLength={11}
                placeholder="IFSC Code"
                testId="bene-ifsc"
                hint={branch ? `${branch.bank}, ${branch.branch}` : !errors.ifsc ? 'Branch not found in the demo directory (format is valid)' : undefined}
                suffix={
                  <button type="button" className="link field__link" onClick={() => setSheet(true)}>Search IFSC</button>
                }
              />
            ) : null}
            <TextField label="Nickname" value={f.nickname} onChange={set('nickname')} onBlur={touch('nickname')} error={show('nickname')} placeholder="Nickname (optional)" testId="bene-nick" maxLength={30} />
          </>
        )}

        <button type="button" className="btn btn--primary btn--block transfer__cta" onClick={proceed} data-testid="proceed-new">
          Proceed to pay
        </button>
      </div>

      {sheet ? (
        <BottomSheet title="Search IFSC" variant="light" onClose={() => setSheet(false)} testId="ifsc-sheet">
          {(close) => (
            <>
              <TextField label="Bank, branch or IFSC" value={ifscQuery} onChange={setIfscQuery} testId="ifsc-query" />
              <OptionList
                label="IFSC results"
                options={searchIfsc(ifscQuery).map((e) => ({
                  key: e.ifsc,
                  label: <span className="opt-two"><b>{e.ifsc}</b><small>{e.bank} · {e.branch}</small></span>,
                }))}
                value={f.ifsc}
                onSelect={(k) => {
                  setF((s) => ({ ...s, ifsc: k }));
                  setTouched((t) => ({ ...t, ifsc: true }));
                  close();
                }}
              />
              {searchIfsc(ifscQuery).length === 0 ? <p className="field__hint">No match in the demo directory.</p> : null}
            </>
          )}
        </BottomSheet>
      ) : null}
    </Screen>
  );
}
