'use client'

import { useState } from 'react'
import { PiEyeSlashLight, PiEyeLight } from 'react-icons/pi'
import s from './ValidatedInput.module.scss'

export default function ValidatedInput({
  name,
  label,
  value,
  onChange,
  error,
  type = 'text',
  className = '',
  disabled = false,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = e => {
    onChange(e.target.value)
  }

  const handleChangeShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const inputPlaceholder =
    name === 'phone'
      ? '0501234567 або +380501234567'
      : name === 'email'
        ? 'example@email.com'
        : placeholder || 'Введіть значення'

  return (
    <>
      <div className={`${s.formGroup} ${className}`}>
        <label htmlFor={name} className={s.formLabel}>
          {label}
        </label>
        <div className={s.inputWrapper}>
          <input
            id={name}
            type={showPassword ? 'text' : type}
            className={`${s.formInput} ${error ? s.formInputError : ''}`}
            value={value}
            onChange={handleChange}
            placeholder={inputPlaceholder}
            name={name}
            disabled={disabled}
          />
          {type === 'password' && (
            <button
              className={s.iconWrapper}
              type="button"
              onClick={() => handleChangeShowPassword()}
              aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
            >
              {showPassword ? <PiEyeLight className={s.icon} /> : <PiEyeSlashLight className={s.icon} />}
            </button>
          )}
        </div>
        {error && <p className={s.errorMessage}>{error}</p>}
      </div>
    </>
  )
}
