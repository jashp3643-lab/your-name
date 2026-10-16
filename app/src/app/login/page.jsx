'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { firstName, formatDate, formatINR, maskAccount, truncate } from '@/lib/format';
import Icon from '@/components/Icon';
import Logo from '@/components/Logo';
import Keypad from '@/components/Keypad';
import Spinner from '@/components/Spinner';
import BottomSheet from '@/components/BottomSheet';
import { PinInput, TextField } from '@/components/Fields';

export default function LoginPage() {
  const { authed, data, login, getLockState, toast } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState('mpin'); // 'mpin' | 'user'
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [lockLeft, setLockLeft] = useState(0);
  const [peek, setPeek] = useState(false);
  const [sheet, setSheet] = useState(null); // 'forgot' | 'quickpay'
  const submitted = useRef('');
  const [keypad, setKeypad] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [tab, setTab] = useState('transact');

  useEffect(() => {
    if (authed) router.replace('/home');
  }, [authed, router]);

  // Lock countdown (survives reloads because the lock lives in localStorage)
  useEffect(() => {
    const tick = () => setLockLeft(getLockState().remainingSeconds);
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [getLockState]);

  const locked = lockLeft > 0;

  const fail = useCallback((res) => {
    if (res.error === 'LOCKED') {
      setError('');
      setLockLeft(getLockState().remainingSeconds);
    } else {
      const n = res.attemptsLeft;
      setError(
        mode === 'mpin'
          ? `Incorrect MPIN. ${n} attempt${n === 1 ? '' : 's'} left.`
          : `Incorrect username or password. ${n} attempt${n === 1 ? '' : 's'} left.`
      );
    }
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, [getLockState, mode]);

  const submitMpin = useCallback(async (value) => {
    setBusy(true);
    setError('');
    const res = await login({ method: 'mpin', pin: value });
    setBusy(false);
    if (res.ok) {
      router.replace('/home');
    } else {
      setPin('');
      submitted.current = '';
      fail(res);
    }
  }, [login, router, fail]);

  // Auto-verify when six digits are entered
  useEffect(() => {
    if (mode === 'mpin' && pin.length === 6 && !busy && !locked && submitted.current !== pin) {
      submitted.current = pin;
      submitMpin(pin);
    }
  }, [pin, mode, busy, locked, submitMpin]);

  const submitUser = async (e) => {
    e.preventDefault();
    if (busy || locked) return;
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setBusy(true);
    setError('');
    const res = await login({ method: 'user', username, password });
    setBusy(false);
    if (res.ok) router.replace('/home');
    else {
      setPassword('');
      fail(res);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setPin('');
    submitted.current = '';
  };

  const acct = data?.accounts?.[0];
  const recent = acct ? data.transactions.filter((t) => t.accountId === acct.id).slice(0, 3) : [];
  const demo = (what) => toast(`${what} is available after you sign in (demo)`);
  const pad = (d) => setPin((p) => (p.length < 6 && !busy && !locked ? p + d : p));

  const QUICK = [
    ['phone', 'Pay to Mobile or Contact'],
    ['refresh', 'Quick Transfer'],
    ['share', 'Send Money'],
    ['bill', 'Bill Payments'],
  ];
  const TOOLS = [
    ['coins', 'EMI Calculator'],
    ['invest', 'SIP Calculator'],
    ['bank', 'FD Calculator'],
    ['coins', 'Deposit Rates'],
  ];
  const OFFERS = [
    ['gift', 'Festive cashback on bill payments'],
    ['shield', 'Free cover on your first policy'],
  ];

  return (
    <main className="screen login" data-testid="login-screen">
      <div
        className="login__scroll hide-scrollbar"
        onClick={(e) => { if (!e.target.closest('.login__card, .keypad')) setKeypad(false); }}
      >
        <header className="login__hero">
          <div className="login__top">
            <button type="button" className="icon-btn login__nav-btn" aria-label="Menu" onClick={() => demo('Menu')}>
              <Icon name="menu" size={24} />
            </button>
            <div className="login__brandbox">
              <Logo size={26} />
            </div>
            <button type="button" className="icon-btn login__nav-btn" aria-label="Branch locator" onClick={() => demo('Branch locator')}>
              <Icon name="pin" size={22} />
            </button>
          </div>

          <div className="login__greet-sbi">
            HI, {(data?.user?.name || 'KULDEEP TRIVEDI').toUpperCase()}
          </div>

          <section className="login__card" aria-label="Sign in">
            {mode === 'mpin' ? (
              <>
                <div className="login__label login__label--caps">
                  <span className="login__label-icon"><Icon name="key" size={18} /></span>
                  <span id="mpin-label">LOGIN USING MPIN</span>
                </div>
                <div onClick={() => setKeypad(true)}>
                  <PinInput
                    boxed
                    value={pin}
                    onChange={setPin}
                    reveal={reveal}
                    inputMode="none"
                    error={shake}
                    disabled={busy || locked}
                    label="Enter your 6 digit MPIN"
                    autoFocus
                    onFocus={() => setKeypad(true)}
                    testId="mpin-input"
                  />
                </div>
                <div className="login__row">
                  <span className="login__status" aria-live="polite">
                    {busy ? <Spinner size={18} label="Verifying" /> : null}
                  </span>
                  <button type="button" className="link link--plain login__forgot" onClick={() => setSheet('forgot')}>
                    Forgot MPIN?
                  </button>
                </div>
                {locked ? (
                  <p className="login__msg login__msg--error" role="alert" data-testid="login-locked">
                    Too many attempts. Try again in {lockLeft}s.
                  </p>
                ) : error ? (
                  <p className="login__msg login__msg--error" role="alert" data-testid="login-error">{error}</p>
                ) : null}
                <div className="divider-or"><span>OR</span></div>
                <div className="login__row login__row--center">
                  <button type="button" className="link link--plain login__switch-btn" onClick={() => switchMode('user')}>
                    Login using Username
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={submitUser} noValidate>
                <div className="login__label login__label--caps">
                  <span className="login__label-icon"><Icon name="login-arrow" size={18} /></span>
                  <span>LOGIN USING USERNAME</span>
                </div>
                <TextField
                  label="Username"
                  placeholder="Username"
                  value={username}
                  onChange={setUsername}
                  autoComplete="username"
                  disabled={busy || locked}
                  testId="username-input"
                />
                <TextField
                  label="Password"
                  placeholder="Password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                  disabled={busy || locked}
                  testId="password-input"
                  suffix={
                    <button
                      type="button"
                      className="icon-btn field__suffix-btn"
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPwd((v) => !v)}
                    >
                      <Icon name={showPwd ? 'eye-off' : 'eye'} size={20} />
                    </button>
                  }
                />
                {locked ? (
                  <p className="login__msg login__msg--error" role="alert" data-testid="login-locked">
                    Too many attempts. Try again in {lockLeft}s.
                  </p>
                ) : error ? (
                  <p className="login__msg login__msg--error" role="alert" data-testid="login-error">{error}</p>
                ) : null}
                <button type="button" className="link link--plain login__forgot login__forgot--right" onClick={() => setSheet('forgot')}>
                  Forgot Username or Password?
                </button>
                <button type="submit" className="btn btn--primary btn--block btn--login-sbi" disabled={busy || locked} data-testid="login-submit">
                  {busy ? <Spinner size={18} className="btn__spinner" label="Signing in" /> : null}
                  {busy ? 'Signing in...' : 'Login'}
                </button>
                <div className="divider-or"><span>OR</span></div>
                <div className="login__row login__row--center">
                  <button type="button" className="link link--plain login__switch-btn" onClick={() => switchMode('mpin')}>
                    Login using MPIN
                  </button>
                </div>
              </form>
            )}
          </section>
        </header>

        <div className="login__lower">
          <div
            className="login__card login__card--viewbal"
            onClick={() => setPeek((v) => !v)}
            role="button"
            tabIndex={0}
            data-testid="peek-toggle"
            aria-expanded={peek}
          >
            <span className="viewbal__icon">
              <Icon name="eye" size={20} />
            </span>
            <div className="viewbal__info">
              <b className="viewbal__title">VIEW BALANCE</b>
              <span className="viewbal__sub">View account balances and recent transactions.</span>
            </div>
          </div>

          {peek && acct ? (
            <section className="peek fade-in" aria-label="Balance" data-testid="peek-body">
              <p className="peek__acct">{acct.type} {maskAccount(acct.number)}</p>
              <p className="peek__bal">{formatINR(acct.balance)}</p>
              <ul>
                {recent.map((t) => (
                  <li key={t.id} className="peek__tx">
                    <span>{truncate(t.description, 22)}<small>{formatDate(t.date)}</small></span>
                    <b className={t.direction === 'debit' ? 'neg' : 'pos'}>
                      {t.direction === 'debit' ? '-' : '+'}{formatINR(t.amount)}
                    </b>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Quick Pay Section from Image 5 */}
          <section className="login__section login__section--quickpay" aria-label="Quick Pay">
            <div className="login__section-divider">
              <span className="divider-line" />
              <span className="divider-title">Quick Pay</span>
              <span className="divider-line" />
            </div>
            <ul className="quick-grid">
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Scan & Pay')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="qr" size={24} /></span>
                  <span>Scan &amp; Pay</span>
                </button>
              </li>
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Pay to Contact')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="phone" size={24} /></span>
                  <span>Pay to Contact</span>
                </button>
              </li>
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Pay to Bank A/C')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="bank" size={24} /></span>
                  <span>Pay to Bank A/C</span>
                </button>
              </li>
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Bill Pay')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="bill" size={24} /></span>
                  <span>Bill Pay</span>
                </button>
              </li>
            </ul>
            <div className="login__receive-box">
              <button type="button" className="btn btn--receive-qr" onClick={() => setSheet('quickpay')}>
                Receive Money via QR
              </button>
            </div>
          </section>

          {/* Services Grid from Image 5 */}
          <section className="login__section login__section--services" aria-label="Services">
            <ul className="quick-grid">
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('YONO Cash')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="card" size={24} /></span>
                  <span>YONO Cash</span>
                </button>
              </li>
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Deposits')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="coins" size={24} /></span>
                  <span>Deposits</span>
                </button>
              </li>
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Investments')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="invest" size={24} /></span>
                  <span>Investments</span>
                </button>
              </li>
              <li>
                <button type="button" className="quick quick--sbi" onClick={() => demo('Best Offers')}>
                  <span className="quick__ic quick__ic--sbi"><Icon name="star" size={24} /></span>
                  <span>Best Offers</span>
                </button>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer Navigation from Image 5 */}
      <footer className="login__footer-nav" aria-label="Help and policies">
        <button type="button" onClick={() => demo('Lock App')}><Icon name="lock" size={16} /><span>Lock App</span></button>
        <button type="button" onClick={() => demo('Terms & Conditions')}><Icon name="doc" size={16} /><span>T &amp; C</span></button>
        <button type="button" onClick={() => demo('Privacy Policy')}><Icon name="shield" size={16} /><span>Privacy Policy</span></button>
        <button type="button" onClick={() => demo('Helpline')}><Icon name="headset" size={16} /><span>Helpline</span></button>
      </footer>

      {keypad && mode === 'mpin' ? (
        <Keypad
          key="keypad"
          disabled={busy || locked}
          revealed={reveal}
          onToggleReveal={() => setReveal((v) => !v)}
          onDigit={pad}
          onBackspace={() => setPin((p) => p.slice(0, -1))}
        />
      ) : null}

      {sheet === 'forgot' ? (
        <BottomSheet title="Forgot MPIN?" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">
                MPIN reset is not available in demo mode. The default MPIN is documented in the project README
                (and can be changed in <code>src/lib/config.js</code>).
              </p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>Got it</button>
            </>
          )}
        </BottomSheet>
      ) : null}
      {sheet === 'quickpay' ? (
        <BottomSheet title="Quick Pay" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">
                Quick Pay lets you pay a QR code without signing in. In this demo it is a placeholder: sign in and use
                Scan QR instead.
              </p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>OK</button>
            </>
          )}
        </BottomSheet>
      ) : null}
    </main>
  );
}
