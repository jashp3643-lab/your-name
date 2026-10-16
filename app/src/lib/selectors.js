import { formatDate, monthKey, monthLabel, startOfDay } from './format';

export const DURATIONS = [
  { key: 'recent20', label: 'Recent Transfers', short: 'Recent Transfers' },
  { key: 'current', label: 'Current Month', short: 'Current Month' },
  { key: 'last', label: 'Last Month', short: 'Last Month' },
  { key: 'last3', label: 'Last 3 Months', short: 'Last 3 Months' },
  { key: 'custom', label: 'Custom Date Range', short: 'Custom Range' },
];

export const SORTS = [
  { key: 'date-desc', label: 'Date: newest first' },
  { key: 'date-asc', label: 'Date: oldest first' },
  { key: 'amount-desc', label: 'Amount: high to low' },
  { key: 'amount-asc', label: 'Amount: low to high' },
];

export function durationShort(key) {
  return (DURATIONS.find((d) => d.key === key) || DURATIONS[0]).short;
}

function inWindow(t, key, now, custom) {
  const d = new Date(t.date);
  const n = new Date(now);
  switch (key) {
    case 'current':
      return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth();
    case 'last': {
      const prev = new Date(n.getFullYear(), n.getMonth() - 1, 1);
      return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth();
    }
    case 'last3': {
      const from = startOfDay(new Date(n.getFullYear(), n.getMonth() - 3, n.getDate()));
      return d >= from && d <= n;
    }
    case 'custom': {
      if (!custom || !custom.from || !custom.to) return true;
      const from = startOfDay(new Date(custom.from));
      const to = new Date(custom.to);
      to.setHours(23, 59, 59, 999);
      return d >= from && d <= to;
    }
    default:
      return true;
  }
}

// Returns transactions for one account for the chosen window, then applies search, filter, sort.
export function queryTransactions(transactions, opts) {
  const {
    accountId,
    duration = 'recent20',
    custom,
    query = '',
    type = 'all',
    channel = 'all',
    min = '',
    max = '',
    sort = 'date-desc',
    now = new Date(),
  } = opts;

  let list = transactions
    .filter((t) => t.accountId === accountId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (duration === 'recent20') list = list.slice(0, 50);
  else list = list.filter((t) => inWindow(t, duration, now, custom));

  const q = String(query).trim().toLowerCase();
  if (q) {
    list = list.filter((t) => {
      const hay = [
        t.description,
        t.channel,
        formatDate(t.date),
        t.amount.toFixed(2),
        String(Math.floor(t.amount)),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (type !== 'all') list = list.filter((t) => t.direction === type);
  if (channel !== 'all') list = list.filter((t) => t.channel === channel);
  if (min !== '' && !Number.isNaN(Number(min))) list = list.filter((t) => t.amount >= Number(min));
  if (max !== '' && !Number.isNaN(Number(max))) list = list.filter((t) => t.amount <= Number(max));

  const sorted = [...list];
  if (sort === 'date-asc') sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sort === 'amount-desc') sorted.sort((a, b) => b.amount - a.amount);
  else if (sort === 'amount-asc') sorted.sort((a, b) => a.amount - b.amount);
  else sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted;
}

// Groups by month when ordered by date; a single un-labelled group when ordered by amount.
export function groupTransactions(list, sort) {
  if (sort === 'amount-desc' || sort === 'amount-asc') return [{ key: 'all', label: '', items: list }];
  const groups = [];
  list.forEach((t) => {
    const key = monthKey(t.date);
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) {
      g = { key, label: monthLabel(t.date), items: [] };
      groups.push(g);
    }
    g.items.push(t);
  });
  return groups;
}

export function spendSummary(list) {
  let debit = 0;
  let credit = 0;
  const byChannel = {};
  list.forEach((t) => {
    if (t.direction === 'debit') {
      debit += t.amount;
      byChannel[t.channel] = (byChannel[t.channel] || 0) + t.amount;
    } else {
      credit += t.amount;
    }
  });
  const channels = Object.entries(byChannel)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  return { debit, credit, channels };
}

// ---- Fixed deposit maths (quarterly compounding, simple demo formula) ----
export function computeFd(fd, now = new Date()) {
  if (fd.currentValue != null && fd.interest != null && fd.maturityAmount != null) {
    return {
      interest: fd.interest,
      currentValue: fd.currentValue,
      maturityAmount: fd.maturityAmount,
    };
  }
  const start = new Date(fd.startDate);
  const end = new Date(fd.maturityDate);
  const totalDays = Math.max(1, (end - start) / 86400000);
  const elapsed = Math.min(totalDays, Math.max(0, (new Date(now) - start) / 86400000));
  const r = fd.rate / 100;
  const factor = (days) => Math.pow(1 + r / 4, (4 * days) / 365);
  const interest = fd.principal * (factor(elapsed) - 1);
  const maturityAmount = fd.principal * factor(totalDays);
  return {
    interest: Math.round(interest * 100) / 100,
    currentValue: Math.round((fd.principal + interest) * 100) / 100,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
  };
}

export function combinedBalance(accounts) {
  return accounts.reduce((s, a) => s + a.balance, 0);
}

export function combinedDeposits(deposits, now = new Date()) {
  return deposits.reduce((s, d) => s + (d.principal || computeFd(d, now).currentValue), 0);
}

export function combinedLoans(loans) {
  return loans.reduce((s, l) => s + l.outstanding, 0);
}
