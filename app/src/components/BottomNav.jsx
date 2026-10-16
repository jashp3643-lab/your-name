'use client';

import Link from 'next/link';
import Icon from './Icon';

const ITEMS = [
  { key: 'home', label: 'Home', icon: 'home', href: '/home' },
  { key: 'favorites', label: 'Favorites', icon: 'heart', href: '/favorites' },
  { key: 'scan', label: 'Scan QR', icon: 'qr', href: '/scan', fab: true },
  { key: 'insurance', label: 'Insurance', icon: 'shield', href: '/insurance' },
  { key: 'investments', label: 'Investments', icon: 'invest', href: '/investments' },
];

export default function BottomNav({ active }) {
  return (
    <nav className="tabbar" aria-label="Main navigation">
      {ITEMS.map((it) =>
        it.fab ? (
          <Link key={it.key} href={it.href} className="tabbar__fab" aria-label="Scan QR" aria-current={active === it.key ? 'page' : undefined}>
            <span className="tabbar__fab-btn">
              <Icon name="qr" size={26} />
            </span>
            <span className="tabbar__fab-label">{it.label}</span>
          </Link>
        ) : (
          <Link key={it.key} href={it.href} className="tabbar__item" aria-current={active === it.key ? 'page' : undefined}>
            <Icon name={it.icon} />
            <span>{it.label}</span>
          </Link>
        )
      )}
    </nav>
  );
}
