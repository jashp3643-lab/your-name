'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { LATENCY } from '@/lib/config';
import { DURATIONS, SORTS, durationShort, groupTransactions, queryTransactions, spendSummary } from '@/lib/selectors';
import { formatDate, formatINR, maskAccount, truncate } from '@/lib/format';
import { validateDateRange } from '@/lib/validation';
import { useLoading, useNow } from '@/lib/hooks';
import Screen from '@/components/Screen';
import TopBar, { IconButton } from '@/components/TopBar';
import Icon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import EyeToggle from '@/components/EyeToggle';
import BottomSheet, { OptionList } from '@/components/BottomSheet';
import { PageLoading } from '@/components/Spinner';
import Empty from '@/components/Empty';
import { SelectField, TextField } from '@/components/Fields';

const TABS = [
  { key: 'details', label: 'Transaction Details' },
  { key: 'spend', label: 'Spend Analysis' },
];

const EMPTY_FILTERS = { type: 'all', channel: 'all', min: '', max: '' };

function TxRow({ t, expanded, onToggle, onViewDetails }) {
  const debit = t.direction === 'debit';
  return (
    <li
      className={`tx-row ${expanded ? 'tx-row--expanded' : ''}`}
      data-testid="tx-row"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={expanded}
      aria-label={`${t.description}, ${debit ? 'debit' : 'credit'} ${formatINR(t.amount)} on ${formatDate(t.date)}, balance ${formatINR(t.balanceAfter)}`}
    >
      <div className="tx-row__header">
        <span className="tag">{t.channel}</span>
      </div>
      <div className="tx-row__content">
        <div className="tx-row__info">
          <p className="tx-row__desc">
            {expanded ? t.description : truncate(t.description, 26)}
          </p>
        </div>
        <div className="tx-row__amt">
          {formatINR(t.amount)}
          <Icon name={debit ? 'arrow-ne' : 'arrow-sw'} size={13} className={debit ? 'neg' : 'pos'} />
        </div>
      </div>
      <div className="tx-row__sub">
        <span className="tx-row__date">{formatDate(t.date)}</span>
        <span className="tx-row__bal">Balance: {formatINR(t.balanceAfter)}</span>
      </div>
      {expanded ? (
        <div className="tx-row__actions">
          <button
            type="button"
            className="tx-row__view-details-btn"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(t);
            }}
            data-testid="view-details-btn"
          >
            View Details <Icon name="chevron-right" size={13} />
          </button>
        </div>
      ) : null}
    </li>
  );
}

function SpendView({ list }) {
  const s = useMemo(() => spendSummary(list), [list]);
  const max = Math.max(1, ...s.channels.map((c) => c.value));
  if (!list.length) return <Empty icon="invest" title="Nothing to analyse" hint="There are no transactions in this window." />;
  return (
    <div className="spend fade-in" data-testid="spend-view">
      <div className="spend__totals">
        <div><small>Money out</small><b className="neg">{formatINR(s.debit)}</b></div>
        <div><small>Money in</small><b className="pos">{formatINR(s.credit)}</b></div>
      </div>
      <h2 className="spend__h">Spent by channel</h2>
      <ul>
        {s.channels.map((c) => (
          <li key={c.name} className="spend__bar">
            <span>{c.name}</span>
            <span className="spend__track"><i style={{ width: `${Math.max(4, (c.value / max) * 100)}%` }} /></span>
            <b>{formatINR(c.value)}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TransactionsPage() {
  const { data, toast, addStatementRequest } = useApp();
  const now = useNow();
  const [tab, setTab] = useState('details');
  const [accountId, setAccountId] = useState(data.accounts[0].id);
  const [duration, setDuration] = useState('recent20');
  const [custom, setCustom] = useState({ from: '', to: '' });
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('date-desc');
  const [sheet, setSheet] = useState(null);
  const [revealAcc, setRevealAcc] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const firstLoad = useRef(true);

  const account = data.accounts.find((a) => a.id === accountId) || data.accounts[0];

  const reloadKey = [accountId, duration, custom.from, custom.to, JSON.stringify(filters), sort].join('|');
  const loading = useLoading(firstLoad.current ? LATENCY.transactions : 300, reloadKey);
  if (!loading) firstLoad.current = false;

  const list = useMemo(
    () =>
      queryTransactions(data.transactions, {
        accountId,
        duration,
        custom,
        query,
        type: filters.type,
        channel: filters.channel,
        min: filters.min,
        max: filters.max,
        sort,
        now,
      }),
    [data.transactions, accountId, duration, custom, query, filters, sort, now]
  );
  const groups = useMemo(() => groupTransactions(list, sort), [list, sort]);

  const filtersActive = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);
  const clearAll = () => {
    setQuery('');
    setFilters(EMPTY_FILTERS);
  };

  return (
    <Screen className="tx" testId="transactions-screen">
      <TopBar
        title="Transactions"
        actions={
          <>
            <Link href="/notifications" className={`icon-btn ${data.notifications.some((n) => !n.read) ? 'icon-btn--dot' : ''}`.trim()} aria-label="Notifications">
              <Icon name="bell" size={22} />
            </Link>
            <IconButton icon="headset" label="Help" onClick={() => setSheet('help')} />
          </>
        }
      />
      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Transactions views" wide />

      <div className="tx__fixed">
        <p className="tx__label">Select Account</p>
        <div
          className="acct-select"
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-label={`Selected account ${account.type} ${maskAccount(account.number)}. Change account`}
          data-testid="account-select"
          onClick={() => setSheet('accounts')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSheet('accounts'))}
        >
          <span className="bank-ic" aria-hidden="true"><Icon name="bank" size={18} /></span>
          <span className="acct-select__text">
            <b data-testid="account-number">
              {revealAcc ? account.number : maskAccount(account.number)}{' '}
              <EyeToggle revealed={revealAcc} onToggle={() => setRevealAcc((v) => !v)} what="account number" />
            </b>
            <small>{account.type}</small>
            <small>Available Balance: {formatINR(account.balance)}</small>
          </span>
          <Icon name="chevron-down" size={18} className="acct-select__chev" />
        </div>

        {tab === 'details' ? (
          <>
            <div className="tx__search">
              <label className="searchbox">
                <Icon name="search" size={18} />
                <input
                  type="search"
                  placeholder="Search here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search transactions"
                  data-testid="tx-search"
                />
              </label>
              <button type="button" className={`icon-btn ${filtersActive ? 'icon-btn--dot' : ''}`.trim()} aria-label="Filter" onClick={() => setSheet('filter')} data-testid="filter-btn">
                <Icon name="filter" size={20} />
              </button>
              <button type="button" className={`icon-btn ${sort !== 'date-desc' ? 'icon-btn--dot' : ''}`.trim()} aria-label="Sort" onClick={() => setSheet('sort')} data-testid="sort-btn">
                <Icon name="sort" size={20} />
              </button>
            </div>
            <div className="tx__bar">
              <button type="button" className="dd" aria-haspopup="dialog" onClick={() => setSheet('duration')} data-testid="duration-btn">
                {durationShort(duration)}
                <Icon name="chevron-down" size={16} />
              </button>
              <button type="button" className="btn btn--ghost-outline btn--pill" onClick={() => setSheet('statement')} data-testid="statement-btn">
                Request<br />Statement
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="tx__list hide-scrollbar" data-testid="tx-list" aria-busy={loading}>
        {tab === 'spend' ? (
          loading ? <PageLoading /> : <SpendView list={list} />
        ) : loading ? (
          <PageLoading />
        ) : list.length === 0 ? (
          <Empty icon="search" title="No transactions found" hint="Try another time window, or clear the search and filters.">
            {query || filtersActive ? (
              <button type="button" className="btn btn--outline btn--pill" onClick={clearAll}>Clear search and filters</button>
            ) : null}
          </Empty>
        ) : (
          <ul className="fade-in" data-testid="tx-groups">
            {groups.map((g) => (
              <li key={g.key}>
                {g.label ? <h2 className="tx-band" data-testid="tx-band">{g.label}</h2> : null}
                <ul>
                  {g.items.map((t) => (
                    <TxRow
                      key={t.id}
                      t={t}
                      expanded={expandedId === t.id}
                      onToggle={() => setExpandedId((prev) => (prev === t.id ? null : t.id))}
                      onViewDetails={() => setSheet('tech-error')}
                    />
                  ))}
                </ul>
              </li>
            ))}
            <li className="tx__end" aria-hidden="true">{list.length} transaction{list.length === 1 ? '' : 's'}</li>
          </ul>
        )}
      </div>

      {sheet === 'duration' ? (
        <BottomSheet title="Duration" onClose={() => setSheet(null)} testId="duration-sheet">
          {(close) => (
            <OptionList
              label="Duration"
              options={DURATIONS}
              value={duration}
              onSelect={(k) => {
                if (k === 'recent20') {
                  setDuration(k);
                  close();
                } else {
                  close(() => setSheet('tech-error'));
                }
              }}
            />
          )}
        </BottomSheet>
      ) : null}

      {sheet === 'tech-error' ? (
        <BottomSheet title="Unable to proceed" variant="light" hideClose onClose={() => setSheet(null)} testId="tech-error-sheet">
          {(close) => (
            <div className="tech-error">
              <div className="tech-error__graphic" aria-hidden="true">
                <svg viewBox="0 0 240 140" width="220" height="130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Soft background desert dunes */}
                  <path d="M15 130 C45 115 85 115 130 126 C165 118 200 120 230 130 Z" fill="#eee4dc" />
                  <path d="M40 130 C75 120 110 120 150 128 C180 124 205 125 225 130 Z" fill="#e4d5c8" />
                  
                  {/* Cactus */}
                  <path d="M86 128 V108 C86 105 82 105 82 108 V114 H77 C74 114 74 109 77 109 H79" stroke="#789084" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M92 128 V102 C92 98 98 98 98 102 V112 H102 C105 112 105 107 102 107 H100" stroke="#789084" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="89" y1="128" x2="89" y2="94" stroke="#789084" strokeWidth="5.5" strokeLinecap="round" />
                  
                  {/* Pebbles */}
                  <ellipse cx="140" cy="126" rx="6" ry="3.5" fill="#c4b5aa" />
                  <ellipse cx="152" cy="127" rx="4" ry="2.5" fill="#b3a297" />

                  {/* Sign Post */}
                  <line x1="120" y1="56" x2="120" y2="128" stroke="#848a97" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Warning Triangle Sign */}
                  <polygon points="120,18 78,82 162,82" fill="#ffffff" stroke="#9e1837" strokeWidth="7" strokeLinejoin="round" />
                  
                  {/* Exclamation Point inside Triangle */}
                  <line x1="120" y1="36" x2="120" y2="60" stroke="#9e1837" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="120" cy="71" r="2.8" fill="#9e1837" />
                </svg>
              </div>
              <p className="tech-error__msg">
                Sorry! We are facing technical issues. Kindly retry after some time.
              </p>
              <button
                type="button"
                className="btn btn--primary btn--block btn--tech-error-ok"
                onClick={() => close()}
                data-testid="tech-error-ok"
              >
                Ok
              </button>
            </div>
          )}
        </BottomSheet>
      ) : null}

      {sheet === 'accounts' ? (
        <BottomSheet title="Select Account" onClose={() => setSheet(null)} testId="accounts-sheet">
          {(close) => (
            <OptionList
              label="Accounts"
              options={data.accounts.map((a) => ({
                key: a.id,
                label: (
                  <span className="opt-two">
                    <b>{maskAccount(a.number)}</b>
                    <small>{a.type} · {formatINR(a.balance)}</small>
                  </span>
                ),
              }))}
              value={accountId}
              onSelect={(k) => {
                setAccountId(k);
                close();
              }}
            />
          )}
        </BottomSheet>
      ) : null}

      {sheet === 'sort' ? (
        <BottomSheet title="Sort by" onClose={() => setSheet(null)} testId="sort-sheet">
          {(close) => (
            <OptionList
              label="Sort by"
              options={SORTS}
              value={sort}
              onSelect={(k) => {
                setSort(k);
                close();
              }}
            />
          )}
        </BottomSheet>
      ) : null}

      {sheet === 'filter' ? (
        <FilterSheet
          initial={filters}
          onClose={() => setSheet(null)}
          onApply={(f) => {
            setFilters(f);
          }}
        />
      ) : null}

      {sheet === 'custom' ? (
        <CustomRangeSheet
          initial={custom}
          onClose={() => setSheet(null)}
          onApply={(range) => {
            setCustom(range);
            setDuration('custom');
          }}
        />
      ) : null}

      {sheet === 'statement' ? (
        <StatementSheet
          accountLabel={`${account.type} ${maskAccount(account.number)}`}
          onClose={() => setSheet(null)}
          onSubmit={(req) => {
            addStatementRequest({ accountId, ...req });
            toast('Statement request saved. Demo mode: nothing is sent.', 'success');
          }}
        />
      ) : null}

      {sheet === 'help' ? (
        <BottomSheet title="Need help?" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">This is a demo app, so there is no live support. In a real app this opens chat or a call to the bank.</p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>Close</button>
            </>
          )}
        </BottomSheet>
      ) : null}
    </Screen>
  );
}

function FilterSheet({ initial, onClose, onApply }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState('');
  const apply = (close) => {
    if (f.min !== '' && f.max !== '' && Number(f.min) > Number(f.max)) {
      setErr('Minimum amount cannot be more than the maximum.');
      return;
    }
    onApply(f);
    close();
  };
  return (
    <BottomSheet title="Filter" variant="light" onClose={onClose} testId="filter-sheet">
      {(close) => (
        <>
          <fieldset className="seg" aria-label="Transaction type">
            {[['all', 'All'], ['debit', 'Debit'], ['credit', 'Credit']].map(([k, label]) => (
              <label key={k} className={`seg__item ${f.type === k ? 'is-on' : ''}`.trim()}>
                <input type="radio" name="ftype" checked={f.type === k} onChange={() => setF({ ...f, type: k })} />
                {label}
              </label>
            ))}
          </fieldset>
          <SelectField
            label="Channel"
            value={f.channel === 'all' ? '' : f.channel}
            onChange={(v) => setF({ ...f, channel: v || 'all' })}
            options={['UPI', 'IMPS', 'NEFT']}
            placeholder="All channels"
            testId="filter-channel"
          />
          <div className="field__row">
            <TextField label="Min amount" value={f.min} onChange={(v) => setF({ ...f, min: v.replace(/[^\d.]/g, '') })} inputMode="decimal" testId="filter-min" />
            <TextField label="Max amount" value={f.max} onChange={(v) => setF({ ...f, max: v.replace(/[^\d.]/g, '') })} inputMode="decimal" testId="filter-max" />
          </div>
          {err ? <p className="field__error" role="alert">{err}</p> : null}
          <div className="sheet__actions">
            <button type="button" className="btn btn--outline" onClick={() => setF(EMPTY_FILTERS)}>Reset</button>
            <button type="button" className="btn btn--primary" onClick={() => apply(close)} data-testid="filter-apply">Apply</button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}

function CustomRangeSheet({ initial, onClose, onApply }) {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [err, setErr] = useState('');
  return (
    <BottomSheet title="Custom Date Range" variant="light" onClose={onClose} testId="custom-sheet">
      {(close) => (
        <>
          <TextField label="From" type="date" value={from} onChange={setFrom} max={today} testId="custom-from" />
          <TextField label="To" type="date" value={to} onChange={setTo} max={today} testId="custom-to" />
          {err ? <p className="field__error" role="alert">{err}</p> : null}
          <div className="sheet__actions">
            <button type="button" className="btn btn--outline" onClick={() => close()}>Cancel</button>
            <button
              type="button"
              className="btn btn--primary"
              data-testid="custom-apply"
              onClick={() => {
                const e = validateDateRange(from, to);
                if (e) return setErr(e);
                onApply({ from, to });
                close();
              }}
            >
              Apply
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}

function StatementSheet({ accountLabel, onClose, onSubmit }) {
  const [period, setPeriod] = useState('');
  const [err, setErr] = useState('');
  return (
    <BottomSheet title="Request Statement" variant="light" onClose={onClose} testId="statement-sheet">
      {(close) => (
        <>
          <p className="sheet__text">Account: {accountLabel}</p>
          <SelectField
            label="Period"
            required
            value={period}
            onChange={(v) => { setPeriod(v); setErr(''); }}
            options={[{ value: 'current', label: 'Current month' }, { value: 'last', label: 'Last month' }, { value: 'last3', label: 'Last 3 months' }]}
            error={err}
            testId="statement-period"
          />
          <p className="field__hint">Delivered to your registered email in the real app. In this demo the request is only saved in your browser.</p>
          <div className="sheet__actions">
            <button type="button" className="btn btn--outline" onClick={() => close()}>Cancel</button>
            <button
              type="button"
              className="btn btn--primary"
              data-testid="statement-submit"
              onClick={() => {
                if (!period) return setErr('Choose a period');
                onSubmit({ period });
                close();
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
