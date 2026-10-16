'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { maskAccount } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Icon from '@/components/Icon';
import Empty from '@/components/Empty';

export default function Favorites() {
  const { data, setDraft, clearDraft } = useApp();
  const router = useRouter();
  const pay = (b) => {
    clearDraft();
    setDraft({ method: 'saved', mode: b.scope, beneficiary: { name: b.name, account: b.account, ifsc: b.ifsc, nickname: b.nickname } });
    router.push('/transfer/amount');
  };
  return (
    <Screen className="info" nav="favorites" testId="favorites-screen">
      <TopBar title="Favorites" hideBack actions={<Link href="/transfer/new" className="icon-btn" aria-label="Add beneficiary"><Icon name="user-plus" size={22} /></Link>} />
      <div className="screen__body info__body">
        {data.beneficiaries.length === 0 ? (
          <Empty icon="heart" title="No favorites yet" hint="Payees you save while transferring money appear here.">
            <Link href="/transfer/new" className="btn btn--outline btn--pill">Add a beneficiary</Link>
          </Empty>
        ) : (
          <ul className="bene-list">
            {data.beneficiaries.map((b) => (
              <li key={b.id}>
                <button type="button" className="bene" onClick={() => pay(b)} data-testid="fav-bene">
                  <span className="avatar avatar--sm" aria-hidden="true">{b.name.slice(0, 1)}</span>
                  <span className="method__text"><b>{b.nickname || b.name}</b><small>{b.name} · {maskAccount(b.account)}</small></span>
                  <span className="link link--plain">Pay</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}
