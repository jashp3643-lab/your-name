'use client';

import InfoPage from '@/components/InfoPage';

export default function Investments() {
  return (
    <InfoPage
      title="Investments"
      nav="investments"
      testId="investments-screen"
      intro="Grow your money. These are sample products for the demo."
      items={[
        { icon: 'sprout', title: 'Mutual Fund', text: 'Start a SIP from a small monthly amount' },
        { icon: 'candles', title: 'Demat & Securities', text: 'Open and manage a demat account' },
        { icon: 'pension', title: 'NPS', text: 'Build a retirement corpus' },
        { icon: 'coins', title: 'PPF', text: 'Long-term tax-saving deposits' },
        { icon: 'invest', title: 'Fixed Deposit', text: 'Estimate returns with the deposit calculator', href: '/deposits/new' },
        { icon: 'star', title: 'Personal Finance Manager', text: 'Track spending and goals' },
      ]}
      note="Demo mode: no investments can be made."
    />
  );
}
