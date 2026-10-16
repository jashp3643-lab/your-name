'use client';

import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Empty from '@/components/Empty';

export default function DepositRequests() {
  return (
    <Screen className="info" testId="deposit-requests-screen">
      <TopBar title="Deposit Requests" fallback="/deposits" />
      <div className="screen__body info__body">
        <Empty icon="list" title="No pending requests" hint="Requests to open, close or change a deposit will show up here." />
      </div>
    </Screen>
  );
}
