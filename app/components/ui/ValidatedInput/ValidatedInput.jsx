'use client'

import s from './ValidatedInput.module.scss'

export default function ValidatedInput({
  name,
  label,
  value,
  onChange,
  error,
  type = 'text',
  className = '',
  placeholder,
}) {
  const handleChange = e => {
    onChange(e.target.value)
  }

  const inputPlaceholder =
    name === 'phone'
      ? '0501234567 або +380501234567'
      : name === 'email'
        ? 'example@email.com'
        : placeholder || 'Введіть значення'

  return (
    <div className={`${s.formGroup} ${className}`}>
      <label htmlFor={name} className={s.formLabel}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={`${s.formInput} ${error ? s.formInputError : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={inputPlaceholder}
        name={name}
      />
      {error && <p className={s.errorMessage}>{error}</p>}
    </div>
  )
}
