// Central demo configuration. Everything here is a DEMO value: there is no backend and no real money.
// The default credentials are visible to anyone who opens the browser dev tools. Never reuse real PINs.

export const APP_NAME = 'YONO SBI';

// Default MPIN, username password and transaction PIN (requested default for now).
// Override at build time with NEXT_PUBLIC_DEMO_PIN if you want another value.
export const DEFAULT_PIN = process.env.NEXT_PUBLIC_DEMO_PIN || '250219';
export const DEFAULT_USERNAME = 'demo.user';

export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCK_SECONDS = 30;
export const TXN_PIN_MAX_ATTEMPTS = 3;

export const QUICK_TRANSFER_LIMIT = 25000; // INR per transaction
export const OTHER_BANK_CHARGE = 2.65; // INR flat, other-bank transfers
export const WITHIN_BANK_CHARGE = 0;

// Mock latency (ms) taken from the reference video (see animation-specifications.md)
export const LATENCY = {
  transactions: 500,
  deposits: 1200,
  deposit: 450,
  nominee: 450,
  refresh: 600,
  transfer: 900,
  login: 450,
  tiles: 400,
};

export const STORAGE_KEY = 'yonosbi.data.v8';
export const LOCK_KEY = 'yonosbi.lock.v8';
export const SESSION_KEY = 'yonosbi.session.v8';

export const DEMO_NOTICE = 'Demo mode: all data is synthetic and stored only in this browser.';
