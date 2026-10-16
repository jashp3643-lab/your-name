'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { LATENCY } from '@/lib/config';
import { maskAccount } from '@/lib/format';
import { validateNominees } from '@/lib/validation';
import { useLoading } from '@/lib/hooks';
import Screen from '@/components/Screen';
import TopBar, { IconButton } from '@/components/TopBar';
import Icon from '@/components/Icon';
import BottomSheet from '@/components/BottomSheet';
import { PageLoading } from '@/components/Spinner';
import Empty from '@/components/Empty';
import { SelectField, TextField } from '@/components/Fields';

const RELATIONS = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Other'];

export default function NomineePage() {
  const params = useParams();
  const { data, updateNominees, toast } = useApp();
  const loading = useLoading(LATENCY.nominee, params.id);
  const fd = data.deposits.find((d) => d.id === params.id);
  const nom = fd ? data.nominees[fd.id] : null;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState([]);
  const [result, setResult] = useState({ ok: true, errors: [], summary: '' });
  const [sheet, setSheet] = useState(null);

  const startEdit = () => {
    setDraft(nom.list.map((n) => ({ ...n, sharePct: String(n.sharePct) })));
    setResult({ ok: true, errors: [], summary: '' });
    setEditing(true);
  };

  const setRow = (i, patch) => setDraft((d) => d.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const save = () => {
    const r = validateNominees(draft);
    setResult(r);
    if (!r.ok) return;
    updateNominees(fd.id, draft.map((n, i) => ({ id: n.id || `n${Date.now()}${i}`, name: n.name.trim(), relationship: n.relationship, sharePct: Number(n.sharePct) })));
    setEditing(false);
    toast('Nominee details updated', 'success');
  };

  return (
    <Screen className="nominee" testId="nominee-screen">
      <TopBar
        title={editing ? 'Edit Nominee' : 'Manage Nominee'}
        fallback={fd ? `/deposits/${fd.id}` : '/deposits'}
        actions={<IconButton icon="headset" label="Help" onClick={() => setSheet('help')} />}
      />
      {loading ? (
        <PageLoading label="Loading nominee details" />
      ) : !fd || !nom ? (
        <Empty icon="warning" title="Nominee details not found">
          <Link href="/deposits" className="btn btn--outline btn--pill">Back to deposits</Link>
        </Empty>
      ) : editing ? (
        <div className="screen__body nominee__body fade-in" data-testid="nominee-edit">
          {draft.map((n, i) => (
            <fieldset key={n.id || i} className="nominee-card">
              <legend>Nominee {i + 1}</legend>
              <TextField label="Name" required value={n.name} onChange={(v) => setRow(i, { name: v })} error={result.errors[i]?.name} testId={`nominee-name-${i}`} />
              <SelectField label="Relationship" required value={n.relationship} onChange={(v) => setRow(i, { relationship: v })} options={RELATIONS} error={result.errors[i]?.relationship} testId={`nominee-rel-${i}`} />
              <TextField label="Share (%)" required inputMode="numeric" value={n.sharePct} onChange={(v) => setRow(i, { sharePct: v.replace(/\D/g, '').slice(0, 3) })} error={result.errors[i]?.sharePct} testId={`nominee-share-${i}`} />
              {draft.length > 1 ? (
                <button type="button" className="link" onClick={() => setDraft((d) => d.filter((_, idx) => idx !== i))}>Remove nominee</button>
              ) : null}
            </fieldset>
          ))}
          {draft.length < 3 ? (
            <button type="button" className="btn btn--outline btn--block add-nominee" onClick={() => setDraft((d) => [...d, { id: '', name: '', relationship: '', sharePct: '' }])}>
              <Icon name="plus" size={18} /> Add another nominee
            </button>
          ) : null}
          {result.summary ? <p className="field__error" role="alert" data-testid="nominee-summary-error">{result.summary}</p> : null}
          <div className="sheet__actions nominee__actions">
            <button type="button" className="btn btn--outline" onClick={() => setEditing(false)}>Cancel</button>
            <button type="button" className="btn btn--primary" onClick={save} data-testid="nominee-save">Save</button>
          </div>
        </div>
      ) : (
        <div className="screen__body nominee__body fade-in" data-testid="nominee-view">
          <p className="nominee__label">Selected Account</p>
          <div className="acct-select acct-select--static">
            <span className="bank-ic" aria-hidden="true"><Icon name="bank" size={18} /></span>
            <span className="acct-select__text">
              <b>{maskAccount(fd.number)}</b>
              <small>Fixed Deposit</small>
            </span>
            <Icon name="chevron-down" size={18} className="acct-select__chev" />
          </div>

          <dl className="kvgrid nominee__kv">
            <div className="kv"><dt>Mode of operation</dt><dd>{nom.modeOfOperation}</dd></div>
            <div className="kv"><dt>Type of nomination</dt><dd>{nom.nominationType}</dd></div>
          </dl>

          <h2 className="nominee__h">Nominee details</h2>
          <ul className="nominee__list">
            {nom.list.map((n, i) => (
              <li key={n.id} className="nominee__row" data-testid="nominee-row">
                <div className="kv"><dt>Nominee {i + 1}</dt><dd>{n.name}{n.relationship ? <small> ({n.relationship})</small> : null}</dd></div>
                <div className="kv"><dt>Share (%)</dt><dd>{n.sharePct}%</dd></div>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--outline btn--block" onClick={startEdit} data-testid="edit-nominee">Edit Nominee</button>
        </div>
      )}

      {sheet === 'help' ? (
        <BottomSheet title="Need help?" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">Nominee changes in the real app need a branch or OTP step. In the demo they are saved immediately in your browser.</p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>Close</button>
            </>
          )}
        </BottomSheet>
      ) : null}
    </Screen>
  );
}
