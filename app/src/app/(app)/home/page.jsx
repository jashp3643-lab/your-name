'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { LATENCY } from '@/lib/config';
import { combinedBalance, combinedDeposits } from '@/lib/selectors';
import { firstName, formatINR, formatINRWhole, initials, maskAccount, pad2 } from '@/lib/format';
import { useLoading, useNow } from '@/lib/hooks';
import Screen from '@/components/Screen';
import Icon from '@/components/Icon';
import Tabs from '@/components/Tabs';
import EyeToggle from '@/components/EyeToggle';
import BottomSheet from '@/components/BottomSheet';
import ConfirmDialog from '@/components/ConfirmDialog';

const STORIES = [
  { key: 'fraud', label: 'Fraud Awareness', icon: 'shield', from: '#ff9a6b', to: '#d9487a', title: 'Spot the scam', body: 'Banks never ask for your MPIN, OTP or card PIN. If someone does, hang up and report it.' },
  { key: 'lock', label: 'e - Secure Lock', icon: 'lock', from: '#6bb8ff', to: '#3d5fd8', title: 'Lock your card in a tap', body: 'Switch a card off instantly from the Cards screen and switch it back on when you need it.' },
  { key: 'green', label: 'Sustainability', icon: 'leaf', from: '#7fe0a6', to: '#25906a', title: 'Go paperless', body: 'Choose e-statements and digital receipts to cut paper and keep your records in one place.' },
  { key: 'cover', label: 'Be Covered', icon: 'umbrella', from: '#ffd36b', to: '#e8873a', title: 'Cover what matters', body: 'Review your insurance cover once a year so it keeps up with your life.' },
  { key: 'digital', label: 'Go Digital', icon: 'bolt', from: '#c79bff', to: '#6b3fd0', title: 'Pay in seconds', body: 'Save your regular payees as favorites and pay them in two taps.' },
];

const PAY_TABS = [
  { key: 'upi', label: 'UPI' },
  { key: 'transfer', label: 'Fund Transfer' },
  { key: 'bills', label: 'Bills' },
  { key: 'cash', label: 'Yono Cash' },
];

const HOME_TABS = [
  { key: 'banking', label: 'Banking' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'rewards', label: 'Rewards' },
];

function Tile({ tone, eyebrow, count, label, value, revealed, onToggle, onRefresh, refreshing, links, testId, what, maskedPlaceholder = '₹XXXX.XX' }) {
  const router = useRouter();
  return (
    <section
      className={`tile tile--${tone}`}
      aria-label={eyebrow}
      data-testid={testId}
      onClick={(e) => {
        if (!e.target.closest('button, a') && links?.[0]?.href) {
          router.push(links[0].href);
        }
      }}
      style={{ cursor: links?.[0]?.href ? 'pointer' : 'default' }}
    >
      <div className="tile__top">
        <span className="tile__eyebrow">
          {count != null ? `${eyebrow} (${pad2(count)})` : eyebrow}
        </span>
        <EyeToggle revealed={revealed} onToggle={onToggle} what={what} />
      </div>
      <p className="tile__label">{label}</p>
      <p className="tile__value" data-testid={`${testId}-value`}>{revealed ? formatINRWhole(value) : maskedPlaceholder}</p>
      {onRefresh ? (
        <button
          type="button"
          className={`tile__refresh ${refreshing ? 'is-spinning' : ''}`.trim()}
          aria-label="Refresh balance"
          onClick={onRefresh}
        >
          <Icon name="refresh" size={18} />
        </button>
      ) : null}
      <div className="tile__links">
        {links.map((l) => (
          <Link key={l.label} href={l.href} className="tile__link">{l.label}</Link>
        ))}
      </div>
    </section>
  );
}

function BankingTab() {
  const { data, toast, setSetting, logout } = useApp();
  const router = useRouter();
  const now = useNow();
  const skeleton = useLoading(LATENCY.tiles);
  const hidden = data.settings.hideBalances !== false;
  const [reveal, setReveal] = useState({ acc: !hidden, dep1: !hidden, dep2: !hidden, dep3: !hidden });
  const [refreshing, setRefreshing] = useState(false);
  const [payTab, setPayTab] = useState('upi');
  const [sheet, setSheet] = useState(null);

  const total = combinedBalance(data.accounts);
  const toggle = (k) => setReveal((r) => ({ ...r, [k]: !r[k] }));

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast('Balances refreshed', 'success');
    }, LATENCY.refresh);
  };

  const upiId = data.settings.upiId;
  const [fd1, fd2, fd3] = data.deposits;

  return (
    <div className="home__banking fade-in">
      {skeleton ? (
        <div className="tiles tiles--skeleton" aria-hidden="true" data-testid="tiles-skeleton">
          <div className="skeleton tile-skel" />
          <div className="skeleton tile-skel" />
        </div>
      ) : (
        <div className="tiles hide-scrollbar" role="group" aria-label="Account summary" data-testid="tiles">
          <Tile
            tone="magenta" eyebrow="TRANSACTION ACCOUNTS" count={data.accounts.length} label="Combined Balance"
            value={total} revealed={reveal.acc} onToggle={() => toggle('acc')} what="combined balance"
            onRefresh={refresh} refreshing={refreshing} testId="tile-accounts"
            links={[{ label: 'View Accounts', href: '/accounts' }, { label: 'Transactions', href: '/transactions' }]}
          />
          <Tile
            tone="indigo" eyebrow="DEPOSITS" count={1} label="Deposit Amount"
            value={fd1 ? (fd1.principal || fd1.currentValue) : 60000} revealed={reveal.dep1} onToggle={() => toggle('dep1')} what="deposit 1 amount" testId="tile-deposits"
            links={[{ label: 'View Details', href: '/deposits' }, { label: 'Invest More', href: '/deposits/new' }]}
          />
          <Tile
            tone="indigo" eyebrow="DEPOSITS" count={2} label="Deposit Amount"
            value={fd2 ? (fd2.principal || fd2.currentValue) : 54500} revealed={reveal.dep2} onToggle={() => toggle('dep2')} what="deposit 2 amount" testId="tile-deposits-2"
            links={[{ label: 'View Details', href: '/deposits/fd2' }, { label: 'Invest More', href: '/deposits/new' }]}
          />
          <Tile
            tone="indigo" eyebrow="DEPOSITS" count={3} label="Deposit Amount"
            value={fd3 ? (fd3.principal || fd3.currentValue) : 60000} revealed={reveal.dep3} onToggle={() => toggle('dep3')} what="deposit 3 amount" testId="tile-deposits-3"
            links={[{ label: 'View Details', href: '/deposits/fd3' }, { label: 'Invest More', href: '/deposits/new' }]}
          />
        </div>
      )}

      <button type="button" className="promo" onClick={() => toast('Credit card applications are not available in demo mode')}>
        <Icon name="bell" size={18} />
        <span>You are just a few taps away from your CREDIT CARD, Apply Now!</span>
        <Icon name="chevron-right" size={18} />
      </button>
      <div className="pager" aria-hidden="true">
        <span className="pager__pill is-active" />
        <span className="pager__dot" />
        <span className="pager__dot" />
        <span className="pager__dot" />
      </div>

      <h2 className="home__h2">Payments &amp; Transfers</h2>
      <Tabs tabs={PAY_TABS} value={payTab} onChange={setPayTab} label="Payments and transfers" className="tabs--pay" />
      <div className="pay-panel" role="tabpanel" aria-labelledby={`tab-${payTab}`}>
        {payTab === 'upi' ? (
          upiId ? (
            <div className="upi-strip upi-strip--ok" data-testid="upi-strip">
              <Icon name="check-circle" size={18} />
              <span>Your UPI ID: <b>{upiId}</b></span>
            </div>
          ) : (
            <div className="upi-strip" data-testid="upi-strip">
              <i className="dot" aria-hidden="true" />
              <span>You haven&apos;t created a UPI ID</span>
              <button type="button" className="link" onClick={() => setSheet('upi')}>Activate UPI ID</button>
            </div>
          )
        ) : null}
        {payTab === 'transfer' ? (
          <ul className="quick-grid quick-grid--3">
            <li><Link href="/transfer" className="quick"><span className="quick__ic"><Icon name="bank" /></span><span>Quick Transfer</span></Link></li>
            <li><Link href="/transfer/new" className="quick"><span className="quick__ic"><Icon name="user-plus" /></span><span>Add Beneficiary</span></Link></li>
            <li><Link href="/accounts" className="quick"><span className="quick__ic"><Icon name="card" /></span><span>My Accounts</span></Link></li>
          </ul>
        ) : null}
        {payTab === 'bills' ? (
          <ul className="quick-grid">
            <li><Link href="/services" className="quick"><span className="quick__ic"><Icon name="phone" /></span><span>Mobile Recharge</span></Link></li>
            <li><Link href="/services" className="quick"><span className="quick__ic"><Icon name="tv" /></span><span>DTH</span></Link></li>
            <li><Link href="/services" className="quick"><span className="quick__ic"><Icon name="bolt" /></span><span>Electricity</span></Link></li>
            <li><Link href="/services" className="quick"><span className="quick__ic"><Icon name="water" /></span><span>Water</span></Link></li>
          </ul>
        ) : null}
        {payTab === 'cash' ? (
          <div className="upi-strip upi-strip--plain">
            <Icon name="coins" size={18} />
            <span>Cash withdrawal and deposit points near you</span>
            <button type="button" className="link" onClick={() => toast('Location search is not available in demo mode')}>Find</button>
          </div>
        ) : null}
      </div>

      <div className="section-title">
        <span>UPI Payments</span>
        <Link href="/scan" className="link link--plain view-all">View All</Link>
      </div>
      <ul className="quick-grid">
        <li><Link href="/scan" className="quick"><span className="quick__ic"><Icon name="phone" /></span><span>Pay to mobile or contact</span></Link></li>
        <li><Link href="/scan" className="quick"><span className="quick__ic"><Icon name="user" /></span><span>Pay UPI ID or Number</span></Link></li>
        <li><Link href="/transfer" className="quick"><span className="quick__ic"><Icon name="bank" /></span><span>Pay to Bank A/C</span></Link></li>
        <li><Link href="/transactions" className="quick"><span className="quick__ic"><Icon name="list" /></span><span>View Transaction</span></Link></li>
      </ul>

      <div className="section-title">
        <span>Investments</span>
        <Link href="/investments" className="link link--plain view-all">View All</Link>
      </div>
      <ul className="quick-grid">
        <li><Link href="/investments" className="quick"><span className="quick__ic"><Icon name="sprout" /></span><span>Mutual Fund</span></Link></li>
        <li><Link href="/investments" className="quick"><span className="quick__ic"><Icon name="candles" /></span><span>Demat &amp; Securities</span></Link></li>
        <li><Link href="/investments" className="quick"><span className="quick__ic"><Icon name="pension" /></span><span>NPS</span></Link></li>
        <li><Link href="/investments" className="quick"><span className="quick__ic"><Icon name="coins" /></span><span>PPF</span></Link></li>
      </ul>
      <Link href="/investments" className="pfm">
        <span>Personal Finance<br />Manager <Icon name="chevron-right" size={16} /></span>
        <svg viewBox="0 0 120 70" width="110" height="64" aria-hidden="true">
          <rect x="14" y="30" width="16" height="30" rx="3" fill="rgba(255,255,255,.35)" />
          <rect x="38" y="18" width="16" height="42" rx="3" fill="rgba(255,255,255,.55)" />
          <rect x="62" y="38" width="16" height="22" rx="3" fill="rgba(255,255,255,.35)" />
          <path d="M10 26l30-14 26 16 40-22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>


      {sheet === 'upi' ? (
        <BottomSheet title="Activate UPI ID" variant="light" onClose={() => setSheet(null)}>
          {(close) => (
            <>
              <p className="sheet__text">
                Create a UPI ID linked to your Savings Account. In this demo the ID is only stored in your browser.
              </p>
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => {
                  setSetting('upiId', `${firstName(data.user.name).toLowerCase()}@demobank`);
                  close(() => toast('UPI ID created', 'success'));
                }}
              >
                Create UPI ID
              </button>
            </>
          )}
        </BottomSheet>
      ) : null}
    </div>
  );
}

function LifestyleTab() {
  const offers = [
    { icon: 'movie', title: 'Movie nights', text: 'Pay with your DemoBank card and get a free ticket on every third booking.' },
    { icon: 'plane', title: 'Travel smarter', text: 'Lounge access and bonus points on flights booked in the app.' },
    { icon: 'gift', title: 'Dining offers', text: 'Up to 20% back at partner restaurants this month.' },
  ];
  return (
    <div className="home__banking fade-in" role="tabpanel">
      <ul className="offer-list">
        {offers.map((o) => (
          <li key={o.title} className="offer">
            <span className="quick__ic"><Icon name={o.icon} /></span>
            <span><b>{o.title}</b><small>{o.text}</small></span>
          </li>
        ))}
      </ul>
      <p className="home__note">Sample offers for the demo. No real partner deals.</p>
    </div>
  );
}

function RewardsTab() {
  return (
    <div className="home__banking fade-in" role="tabpanel">
      <div className="points">
        <span>Reward points</span>
        <b>1,240</b>
        <small>Worth about ₹310 (demo values)</small>
      </div>
      <ul className="offer-list">
        <li className="offer"><span className="quick__ic"><Icon name="star" /></span><span><b>Earn 2x on bills</b><small>Pay utility bills in the app for double points.</small></span></li>
        <li className="offer"><span className="quick__ic"><Icon name="gift" /></span><span><b>Redeem vouchers</b><small>Swap points for shopping vouchers (not available in demo).</small></span></li>
      </ul>
    </div>
  );
}

export default function HomePage() {
  const { data, logout } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState('banking');
  const [story, setStory] = useState(null);
  const [confirmOut, setConfirmOut] = useState(false);
  const unread = data.notifications.some((n) => !n.read);

  useEffect(() => {
    // each visit starts at the top of the Banking tab
    setTab('banking');
  }, []);

  const doLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <Screen className="home" nav="home" testId="home-screen">
      <header className="homebar">
        <span className="avatar" aria-hidden="true">{initials(data.user.name)}</span>
        <span className="homebar__text">
          <span className="homebar__hello">Hello <strong>{firstName(data.user.name)},</strong></span>
          <small>Let&apos;s get started!</small>
        </span>
        <span className="homebar__actions">
          <Link href="/search" className="icon-btn" aria-label="Search"><Icon name="search" size={22} /></Link>
          <Link href="/notifications" className={`icon-btn ${unread ? 'icon-btn--dot' : ''}`.trim()} aria-label="Notifications"><Icon name="bell" size={22} /></Link>
          <button type="button" className="icon-btn" aria-label="Log out" onClick={() => setConfirmOut(true)}><Icon name="logout" size={22} /></button>
        </span>
      </header>

      <div className="home__scroll hide-scrollbar" data-testid="home-scroll">
        <ul className="stories hide-scrollbar" aria-label="Stories">
          {STORIES.map((s) => (
            <li key={s.key}>
              <button type="button" className="story" onClick={() => setStory(s)}>
                <span className="story__ring" style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
                  <span className="story__img" style={{ background: `radial-gradient(circle at 30% 25%, ${s.from}, ${s.to})` }}>
                    <Icon name={s.icon} size={26} />
                  </span>
                </span>
                <span className="story__label">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <Tabs tabs={HOME_TABS} value={tab} onChange={setTab} label="Home sections" sticky className="tabs--home" />
        {tab === 'banking' ? <BankingTab /> : null}
        {tab === 'lifestyle' ? <LifestyleTab /> : null}
        {tab === 'rewards' ? <RewardsTab /> : null}
      </div>

      {story ? (
        <BottomSheet title={story.title} variant="light" onClose={() => setStory(null)} testId="story-sheet">
          {(close) => (
            <>
              <p className="sheet__text">{story.body}</p>
              <button type="button" className="btn btn--primary btn--block" onClick={() => close()}>Close</button>
            </>
          )}
        </BottomSheet>
      ) : null}

      {confirmOut ? (
        <ConfirmDialog
          title="Log out?"
          text="You will need your MPIN to sign in again."
          confirmLabel="Log out"
          onCancel={() => setConfirmOut(false)}
          onConfirm={doLogout}
        />
      ) : null}
    </Screen>
  );
}
