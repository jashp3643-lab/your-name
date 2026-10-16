import Icon from './Icon';

export default function Empty({ icon = 'list', title, hint, children }) {
  return (
    <div className="empty" data-testid="empty-state">
      <Icon name={icon} />
      <p className="empty__title">{title}</p>
      {hint ? <p className="empty__hint">{hint}</p> : null}
      {children}
    </div>
  );
}
