'use client';

// App state: persisted demo data (localStorage), auth session (sessionStorage), transfer draft, toasts.
// There is no backend. Actions that the UI treats as "remote" wait for a short, configurable latency.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_PIN,
  DEFAULT_USERNAME,
  LATENCY,
  LOCK_KEY,
  LOGIN_LOCK_SECONDS,
  LOGIN_MAX_ATTEMPTS,
  OTHER_BANK_CHARGE,
  QUICK_TRANSFER_LIMIT,
  SESSION_KEY,
  STORAGE_KEY,
  TXN_PIN_MAX_ATTEMPTS,
  WITHIN_BANK_CHARGE,
} from './config';
import { createSeed } from './seed';
import { validateAmount } from './validation';

const AppContext = createContext(null);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function safeGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode / quota): the app keeps working in memory */
  }
}
function safeRemove(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function loadData() {
  const raw = safeGet(window.localStorage, STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.version === 8 &&
        Array.isArray(parsed.accounts) &&
        parsed.accounts[0]?.balance === 2350 &&
        parsed.nominees?.fd1?.list?.[0]?.name === 'Varsha Trivedi' &&
        parsed.transactions?.length >= 25
      ) {
        return parsed;
      }
    } catch {
      /* fall through to a fresh seed */
    }
  }
  return createSeed(new Date());
}

function readLock() {
  const raw = safeGet(window.localStorage, LOCK_KEY);
  if (!raw) return { count: 0, until: 0 };
  try {
    const v = JSON.parse(raw);
    return { count: Number(v.count) || 0, until: Number(v.until) || 0 };
  } catch {
    return { count: 0, until: 0 };
  }
}
function writeLock(lock) {
  safeSet(window.localStorage, LOCK_KEY, JSON.stringify(lock));
}

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [draft, setDraftState] = useState(null);
  const [toasts, setToasts] = useState([]);
  const dataRef = useRef(null);
  const txnFailures = useRef(0);
  const toastId = useRef(0);

  // Initial load (client only)
  useEffect(() => {
    const d = loadData();
    dataRef.current = d;
    setData(d);
    setAuthed(safeGet(window.sessionStorage, SESSION_KEY) === '1');
    setReady(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!ready || !data) return;
    dataRef.current = data;
    safeSet(window.localStorage, STORAGE_KEY, JSON.stringify(data));
  }, [ready, data]);

  const toast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const getLockState = useCallback(() => {
    const lock = readLock();
    const remaining = Math.max(0, lock.until - Date.now());
    return { lockedUntil: remaining > 0 ? lock.until : 0, remainingSeconds: Math.ceil(remaining / 1000), count: lock.count };
  }, []);

  const login = useCallback(async ({ method, pin, username, password }) => {
    const lock = readLock();
    if (lock.until > Date.now()) {
      return { ok: false, error: 'LOCKED', lockedUntil: lock.until };
    }
    await delay(LATENCY.login);
    const good =
      method === 'mpin'
        ? String(pin) === DEFAULT_PIN
        : String(username).trim().toLowerCase() === DEFAULT_USERNAME && String(password) === DEFAULT_PIN;
    if (good) {
      writeLock({ count: 0, until: 0 });
      safeSet(window.sessionStorage, SESSION_KEY, '1');
      setAuthed(true);
      return { ok: true };
    }
    const count = lock.count + 1;
    if (count >= LOGIN_MAX_ATTEMPTS) {
      const until = Date.now() + LOGIN_LOCK_SECONDS * 1000;
      writeLock({ count: 0, until });
      return { ok: false, error: 'LOCKED', lockedUntil: until };
    }
    writeLock({ count, until: 0 });
    return { ok: false, error: 'WRONG', attemptsLeft: LOGIN_MAX_ATTEMPTS - count };
  }, []);

  const logout = useCallback(() => {
    safeRemove(window.sessionStorage, SESSION_KEY);
    setAuthed(false);
    setDraftState(null);
  }, []);

  const setDraft = useCallback((patch) => {
    setDraftState((d) => ({ ...(d || {}), ...patch }));
  }, []);
  const clearDraft = useCallback(() => {
    setDraftState(null);
    txnFailures.current = 0;
  }, []);

  const chargeFor = useCallback((mode) => (mode === 'within' ? WITHIN_BANK_CHARGE : OTHER_BANK_CHARGE), []);

  // Verifies the transaction PIN and, when correct, applies the transfer to the local ledger.
  const confirmTransfer = useCallback(
    async (d, pin) => {
      if (txnFailures.current >= TXN_PIN_MAX_ATTEMPTS) return { ok: false, error: 'ABORT', attemptsLeft: 0 };
      await delay(LATENCY.transfer);
      if (String(pin) !== DEFAULT_PIN) {
        txnFailures.current += 1;
        const attemptsLeft = TXN_PIN_MAX_ATTEMPTS - txnFailures.current;
        return { ok: false, error: attemptsLeft <= 0 ? 'ABORT' : 'WRONG', attemptsLeft };
      }
      const current = dataRef.current;
      const account = current.accounts.find((a) => a.id === d.accountId);
      if (!account) return { ok: false, error: 'NO_ACCOUNT' };
      const charge = chargeFor(d.mode);
      const amount = Number(d.amount);
      const check = validateAmount(String(d.amount), { balance: account.balance, charge, limit: QUICK_TRANSFER_LIMIT });
      if (check) return { ok: false, error: 'INVALID', message: check };

      const now = new Date();
      const stamp = String(now.getTime());
      const reference = `DB${stamp.slice(-10)}`;
      const afterTransfer = Math.round((account.balance - amount) * 100) / 100;
      const afterCharge = Math.round((afterTransfer - charge) * 100) / 100;
      const txns = [
        {
          id: `${account.id}-x${stamp}`,
          accountId: account.id,
          date: now.toISOString(),
          channel: 'IMPS',
          direction: 'debit',
          amount,
          description: `IMPS- TRANSFER TO ${d.beneficiary.account}`,
          balanceAfter: afterTransfer,
          reference,
        },
      ];
      if (charge > 0) {
        txns.push({
          id: `${account.id}-c${stamp}`,
          accountId: account.id,
          date: new Date(now.getTime() + 1000).toISOString(),
          channel: 'IMPS',
          direction: 'debit',
          amount: charge,
          description: `IMPS- TRANSFER CHARGES ${reference}`,
          balanceAfter: afterCharge,
          reference,
        });
      }
      const known = current.beneficiaries.some(
        (b) => b.account === d.beneficiary.account && b.ifsc === d.beneficiary.ifsc
      );
      const newBeneficiaries = known
        ? current.beneficiaries
        : [
            ...current.beneficiaries,
            {
              id: `b${stamp}`,
              name: d.beneficiary.name,
              account: d.beneficiary.account,
              ifsc: d.beneficiary.ifsc,
              nickname: d.beneficiary.nickname || '',
              scope: d.mode,
            },
          ];
      // Transfer to another account of the same customer: credit it as well so both ledgers stay consistent.
      const dest = current.accounts.find((a) => a.number === d.beneficiary.account && a.id !== account.id);
      if (dest) {
        txns.push({
          id: `${dest.id}-x${stamp}`,
          accountId: dest.id,
          date: now.toISOString(),
          channel: 'IMPS',
          direction: 'credit',
          amount,
          description: `IMPS- TRANSFER FROM ${account.number}`,
          balanceAfter: Math.round((dest.balance + amount) * 100) / 100,
          reference,
        });
      }
      const next = {
        ...current,
        accounts: current.accounts.map((a) => {
          if (a.id === account.id) return { ...a, balance: afterCharge };
          if (dest && a.id === dest.id) return { ...a, balance: Math.round((a.balance + amount) * 100) / 100 };
          return a;
        }),
        transactions: [...txns, ...current.transactions],
        beneficiaries: newBeneficiaries,
        notifications: [
          {
            id: `nt${stamp}`,
            title: 'Transfer successful',
            body: `Transfer to ${d.beneficiary.name} completed. Ref ${reference}.`,
            at: now.toISOString(),
            read: false,
          },
          ...current.notifications,
        ],
      };
      dataRef.current = next;
      setData(next);
      txnFailures.current = 0;
      return { ok: true, reference, charge, amount, at: now.toISOString(), balanceAfter: afterCharge };
    },
    [chargeFor]
  );

  const updateNominees = useCallback((depositId, list) => {
    setData((prev) => ({
      ...prev,
      nominees: { ...prev.nominees, [depositId]: { ...prev.nominees[depositId], list } },
    }));
  }, []);

  const addStatementRequest = useCallback((req) => {
    setData((prev) => ({
      ...prev,
      statementRequests: [{ id: `sr${Date.now()}`, at: new Date().toISOString(), ...req }, ...prev.statementRequests],
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setData((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const setSetting = useCallback((key, value) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  }, []);

  const resetData = useCallback(() => {
    const seed = createSeed(new Date());
    dataRef.current = seed;
    setData(seed);
    writeLock({ count: 0, until: 0 });
  }, []);

  const value = useMemo(
    () => ({
      ready,
      authed,
      data,
      draft,
      toasts,
      toast,
      login,
      logout,
      getLockState,
      setDraft,
      clearDraft,
      chargeFor,
      confirmTransfer,
      updateNominees,
      addStatementRequest,
      markNotificationsRead,
      setSetting,
      resetData,
    }),
    [
      ready, authed, data, draft, toasts, toast, login, logout, getLockState, setDraft, clearDraft,
      chargeFor, confirmTransfer, updateNominees, addStatementRequest, markNotificationsRead, setSetting, resetData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
