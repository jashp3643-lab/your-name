'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';

function StatusBar() {
  const [time, setTime] = useState('9:41');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="statusbar" aria-hidden="true">
      <span className="statusbar__time">{time}</span>
      <span className="statusbar__island" />
      <span className="statusbar__icons">
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.2a10 10 0 0 1 14 0M4 7a6.5 6.5 0 0 1 9 0M6.6 9.6a2.8 2.8 0 0 1 3.8 0" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="16" height="9" rx="2.2" fill="currentColor" /><rect x="24" y="4.2" width="2" height="4.6" rx="1" fill="currentColor" opacity="0.4" /></svg>
      </span>
    </div>
  );
}

function ToastHost() {
  const { toasts } = useApp();
  return (
    <div className="toasts" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}

export default function DeviceFrame({ children }) {
  const { ready } = useApp();
  return (
    <div className="stage">
      <div className="device" id="device">
        <StatusBar />
        {ready ? children : <div className="splash" aria-busy="true" />}
        <ToastHost />
      </div>
    </div>
  );
}
