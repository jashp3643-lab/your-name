'use client';

// Underline tab strip used for Banking/Lifestyle/Rewards, UPI/Fund Transfer/Bills/Cash, Transaction Details/Spend Analysis.
export default function Tabs({ tabs, value, onChange, label, sticky = false, wide = false, className = '' }) {
  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.key === value);
    if (e.key === 'ArrowRight') onChange(tabs[(i + 1) % tabs.length].key);
    if (e.key === 'ArrowLeft') onChange(tabs[(i - 1 + tabs.length) % tabs.length].key);
  };
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`tabs ${sticky ? 'tabs--sticky' : ''} ${wide ? 'tabs--wide' : ''} ${className}`.trim()}
      onKeyDown={onKeyDown}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          id={`tab-${t.key}`}
          aria-selected={value === t.key}
          tabIndex={value === t.key ? 0 : -1}
          className="tab"
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
