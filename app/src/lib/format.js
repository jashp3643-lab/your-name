// Formatting helpers (Indian numbering, dd/mm/yyyy dates). No locale APIs are needed for dates.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const inr2 = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inr0 = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function formatINR(value) {
  const n = Number(value) || 0;
  return `₹${inr2.format(n)}`;
}

// Spaced rupee sign as used on the deposit detail screens: "₹ 60,000.00"
export function formatINRSpaced(value) {
  const n = Number(value) || 0;
  return `₹ ${inr2.format(n)}`;
}

// Tiles on Home show whole rupees; the reference showed 2,334.94 as "₹2,334" (truncated, not rounded).
export function formatINRWhole(value) {
  const n = Math.floor(Number(value) || 0);
  return `₹${inr0.format(n)}`;
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function formatDate(d) {
  const x = d instanceof Date ? d : new Date(d);
  return `${pad2(x.getDate())}/${pad2(x.getMonth() + 1)}/${x.getFullYear()}`;
}

export function monthLabel(d) {
  const x = d instanceof Date ? d : new Date(d);
  return `${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
}

export function monthKey(d) {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}`;
}

export function maskAccount(num, tail = 4) {
  const s = String(num || '');
  if (s.length <= tail) return s;
  return 'X'.repeat(s.length - tail) + s.slice(-tail);
}

export function truncate(text, max = 24) {
  const s = String(text || '');
  return s.length > max ? `${s.slice(0, max)}...` : s;
}

export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function firstName(name) {
  return String(name || '').trim().split(/\s+/)[0] || '';
}

// ---- Amount in words (Indian system: lakh, crore) ----
const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
  'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function below1000(n) {
  let out = '';
  if (n >= 100) {
    out += `${ONES[Math.floor(n / 100)]} Hundred`;
    n %= 100;
    if (n) out += ' ';
  }
  if (n >= 20) {
    out += TENS[Math.floor(n / 10)];
    if (n % 10) out += ` ${ONES[n % 10]}`;
  } else if (n > 0) {
    out += ONES[n];
  }
  return out;
}

export function integerToWords(n) {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'Zero';
  const parts = [];
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  if (crore) parts.push(`${integerToWords(crore)} Crore`);
  if (lakh) parts.push(`${below1000(lakh)} Lakh`);
  if (thousand) parts.push(`${below1000(thousand)} Thousand`);
  if (n) parts.push(below1000(n));
  return parts.join(' ');
}

export function amountInWords(amount) {
  const n = Number(amount);
  if (!isFinite(n) || n <= 0) return '';
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let out = `Rupees ${integerToWords(rupees)}`;
  if (paise) out += ` and ${integerToWords(paise)} Paise`;
  return `${out} Only`;
}

// ---- Duration between two dates as "1 Year 2 Months 18 Days" ----
export function durationYMD(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  return [plural(years, 'Year'), plural(months, 'Month'), plural(days, 'Day')].join(' ');
}

export function addYMD(date, y, m, d) {
  const x = new Date(date);
  x.setFullYear(x.getFullYear() + y);
  x.setMonth(x.getMonth() + m);
  x.setDate(x.getDate() + d);
  return x;
}

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
