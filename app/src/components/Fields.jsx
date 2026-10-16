'use client';

import { useId, useRef } from 'react';

export function TextField({
  label, value, onChange, onBlur, error, hint, required, type = 'text', inputMode, maxLength,
  placeholder, name, autoComplete = 'off', disabled, suffix, inputRef, testId, ...rest
}) {
  const id = useId();
  const descId = `${id}-d`;
  return (
    <div className={`field ${error ? 'field--error' : ''}`.trim()}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span className="req"> *</span> : null}
      </label>
      <div className="field__wrap">
        <input
          id={id}
          ref={inputRef}
          className="field__input"
          name={name}
          type={type}
          value={value}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || hint ? descId : undefined}
          data-testid={testId}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          {...rest}
        />
        {suffix}
      </div>
      {error ? (
        <span id={descId} className="field__error" role="alert">{error}</span>
      ) : hint ? (
        <span id={descId} className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, error, required, placeholder = 'Select', testId }) {
  const id = useId();
  return (
    <div className={`field ${error ? 'field--error' : ''}`.trim()}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? <span className="req"> *</span> : null}
      </label>
      <select
        id={id}
        className="field__input field__select"
        value={value}
        data-testid={testId}
        aria-invalid={error ? 'true' : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
      {error ? <span className="field__error" role="alert">{error}</span> : null}
    </div>
  );
}

// Six underlined boxes backed by one real (invisible) numeric input: works with keyboards, paste and autofill.
export function PinInput({ value, onChange, length = 6, error = false, disabled = false, autoFocus = false, label, dark = false, testId, boxed = false, reveal = false, inputMode = 'numeric', onFocus, onBlur }) {
  const ref = useRef(null);
  const digits = value.split('');
  return (
    <div
      className={`pin ${error ? 'pin--error' : ''} ${dark ? 'pin--dark' : ''} ${boxed ? 'pin--boxed' : ''}`.trim()}
      onClick={() => ref.current?.focus()}
    >
      <input
        ref={ref}
        className="pin__input"
        type={reveal ? 'text' : 'password'}
        inputMode={inputMode}
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={label}
        data-testid={testId}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
      />
      {Array.from({ length }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pin__box ${i === Math.min(digits.length, length - 1) && !disabled ? 'pin__box--active' : ''}`.trim()}
        >
          {digits[i] ? (reveal ? digits[i] : '•') : ''}
        </span>
      ))}
    </div>
  );
}
