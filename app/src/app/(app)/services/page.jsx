'use client';

import { useApp } from '@/lib/store';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Icon from '@/components/Icon';

const ITEMS = [
  ['phone', 'Prepaid'], ['phone', 'Postpaid'], ['tv', 'DTH'], ['phone', 'Landline'],
  ['flame', 'Gas'], ['bolt', 'Electricity'], ['water', 'Water'], ['car', 'FASTag'], ['card', 'Credit Card'],
];

export default function Services() {
  const { toast } = useApp();
  return (
    <Screen className="info" testId="services-screen">
      <TopBar title="Recharge & Bills" />
      <div className="screen__body info__body">
        <ul className="quick-grid quick-grid--wrap">
          {ITEMS.map(([icon, label]) => (
            <li key={label}>
              <button type="button" className="quick" onClick={() => toast(`${label} payments are not available in demo mode`)}>
                <span className="quick__ic"><Icon name={icon} /></span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="transfer__note">Demo mode: bill payments are not processed.</p>
      </div>
    </Screen>
  );
}
