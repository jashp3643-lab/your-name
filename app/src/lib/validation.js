import { QUICK_TRANSFER_LIMIT } from './config';
import { formatINR } from './format';

export function validatePin(value) {
  if (!/^\d{6}$/.test(String(value || ''))) return 'Enter a 6-digit PIN';
  return '';
}

export function validateName(value) {
  const v = String(value || '').trim();
  if (!v) return 'Enter the beneficiary name';
  if (v.length < 2) return 'Name is too short';
  if (v.length > 60) return 'Name is too long (max 60 characters)';
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return 'Use letters, spaces, . - or \' only';
  return '';
}

export function validateAccountNumber(value) {
  const v = String(value || '').trim();
  if (!v) return 'Enter the account number';
  if (!/^\d+$/.test(v)) return 'Account number must contain digits only';
  if (v.length < 9 || v.length > 18) return 'Account number must be 9 to 18 digits';
  return '';
}

export function validateConfirmAccount(value, original) {
  const v = String(value || '').trim();
  if (!v) return 'Re-enter the account number';
  if (v !== String(original || '').trim()) return 'Account numbers do not match';
  return '';
}

export function validateIfsc(value) {
  const v = String(value || '').trim().toUpperCase();
  if (!v) return 'Enter the IFSC code';
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v)) return 'IFSC must be 11 characters, e.g. ABCD0123456';
  return '';
}

export function validateNickname(value) {
  const v = String(value || '').trim();
  if (v.length > 30) return 'Nickname is too long (max 30 characters)';
  return '';
}

export function validateAmount(value, { balance, charge = 0, limit = QUICK_TRANSFER_LIMIT } = {}) {
  const raw = String(value ?? '').trim();
  if (!raw) return 'Enter an amount';
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return 'Enter a valid amount (up to 2 decimals)';
  const n = Number(raw);
  if (n <= 0) return 'Amount must be greater than 0';
  if (n > limit) return `Amount exceeds the limit of ${formatINR(limit)}`;
  if (typeof balance === 'number' && n + charge > balance) return 'Insufficient balance';
  return '';
}

export function validateNominees(list) {
  const errors = [];
  let total = 0;
  list.forEach((n, i) => {
    const e = {};
    if (!String(n.name || '').trim()) e.name = 'Enter the nominee name';
    else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(String(n.name).trim())) e.name = 'Use letters and spaces only';
    if (!String(n.relationship || '').trim()) e.relationship = 'Select the relationship';
    const share = Number(n.sharePct);
    if (!Number.isInteger(share) || share < 1 || share > 100) e.sharePct = 'Share must be 1 to 100';
    else total += share;
    errors[i] = e;
  });
  let summary = '';
  if (!errors.some((e) => e.sharePct) && total !== 100) summary = `Shares must add up to 100% (now ${total}%)`;
  const ok = !summary && errors.every((e) => Object.keys(e).length === 0);
  return { ok, errors, summary };
}

export function validateDateRange(from, to) {
  if (!from || !to) return 'Choose both dates';
  if (new Date(from) > new Date(to)) return 'The start date must be on or before the end date';
  return '';
}
