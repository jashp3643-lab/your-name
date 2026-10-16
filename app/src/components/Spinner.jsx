export default function Spinner({ size, className = '', label = 'Loading' }) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg className={`spinner ${className}`.trim()} style={s} viewBox="0 0 24 24" role="status" aria-label={label}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function PageLoading({ label }) {
  return (
    <div className="page-loading" data-testid="page-loading">
      <Spinner label={label} />
    </div>
  );
}
