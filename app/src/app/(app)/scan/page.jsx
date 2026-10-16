'use client';

import InfoPage from '@/components/InfoPage';
import Icon from '@/components/Icon';

export default function Scan() {
  return (
    <InfoPage
      title="Scan QR"
      nav="scan"
      testId="scan-screen"
      items={[
        { icon: 'phone', title: 'Pay to mobile or contact', text: 'Send money using a phone number' },
        { icon: 'user', title: 'Pay UPI ID or Number', text: 'Pay a UPI ID directly' },
        { icon: 'bank', title: 'Pay to Bank A/C', text: 'Transfer to an account number', href: '/transfer' },
        { icon: 'arrow-sw', title: 'Request money', text: 'Ask someone to pay you' },
      ]}
      note="Demo mode: the camera is not used and no payments are made."
    >
      <div className="viewfinder" aria-label="QR viewfinder (demo, camera not used)">
        <span /><span /><span /><span />
        <Icon name="qr" size={56} />
        <p>Point the camera at a QR code</p>
      </div>
    </InfoPage>
  );
}
