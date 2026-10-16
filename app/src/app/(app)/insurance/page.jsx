'use client';

import InfoPage from '@/components/InfoPage';

export default function Insurance() {
  return (
    <InfoPage
      title="Insurance"
      nav="insurance"
      testId="insurance-screen"
      intro="Protect what matters. These are sample products for the demo."
      items={[
        { icon: 'heart', title: 'Life insurance', text: 'Cover for your family from a small monthly premium' },
        { icon: 'shield', title: 'Health insurance', text: 'Hospital and day-care cover for you and your family' },
        { icon: 'car', title: 'Motor insurance', text: 'Renew or buy cover for your car or bike' },
        { icon: 'plane', title: 'Travel insurance', text: 'Trip, baggage and medical cover abroad' },
      ]}
      note="Demo mode: no policies can be bought."
    />
  );
}
