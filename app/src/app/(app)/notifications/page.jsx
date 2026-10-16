'use client';

import { useApp } from '@/lib/store';
import { formatDate } from '@/lib/format';
import Screen from '@/components/Screen';
import TopBar from '@/components/TopBar';
import Empty from '@/components/Empty';

export default function Notifications() {
  const { data, markNotificationsRead } = useApp();
  const unread = data.notifications.filter((n) => !n.read).length;
  return (
    <Screen className="info" testId="notifications-screen">
      <TopBar
        title="Notifications"
        actions={unread ? <button type="button" className="link link--plain notif__mark" onClick={markNotificationsRead} data-testid="mark-read">Mark all read</button> : null}
      />
      <div className="screen__body info__body">
        {data.notifications.length === 0 ? (
          <Empty icon="bell" title="You are all caught up" hint="New alerts will appear here." />
        ) : (
          <ul className="notif-list">
            {data.notifications.map((n) => (
              <li key={n.id} className={`notif ${n.read ? '' : 'is-unread'}`.trim()} data-testid="notification">
                <b>{n.title}</b>
                <p>{n.body}</p>
                <small>{formatDate(n.at)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}
