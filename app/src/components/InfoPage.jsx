'use client';

import Link from 'next/link';
import { useApp } from '@/lib/store';
import Screen from './Screen';
import TopBar from './TopBar';
import Icon from './Icon';

// Shared layout for the smaller screens: a top bar and a list of tappable cards.
// An item with `href` navigates; an item without it shows a "demo" toast.
export default function InfoPage({ title, nav, intro, items = [], note, children, fallback = '/home', testId, actions }) {
  const { toast } = useApp();
  return (
    <Screen className="info" nav={nav} testId={testId}>
      <TopBar title={title} hideBack={!!nav} fallback={fallback} actions={actions} />
      <div className="screen__body info__body">
        {intro ? <p className="info__intro">{intro}</p> : null}
        {items.length ? (
          <ul className="info__list">
            {items.map((it) => {
              const inner = (
                <>
                  <span className="quick__ic"><Icon name={it.icon || 'star'} /></span>
                  <span className="info__text"><b>{it.title}</b>{it.text ? <small>{it.text}</small> : null}</span>
                  <Icon name="chevron-right" size={18} />
                </>
              );
              return (
                <li key={it.title}>
                  {it.href ? (
                    <Link href={it.href} className="info__card">{inner}</Link>
                  ) : (
                    <button type="button" className="info__card" onClick={() => toast(it.toast || `${it.title} is not available in demo mode`)}>
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
        {children}
        {note ? <p className="transfer__note">{note}</p> : null}
      </div>
    </Screen>
  );
}
