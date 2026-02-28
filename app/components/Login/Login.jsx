'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/app/redux/hooks'
import { loginThunk } from '../../redux/features/auth/thunks'
import { useRouter } from 'next/navigation'
import ValidatedInput from '../ui/ValidatedInput/ValidatedInput'
import { useFormValidation } from '../hooks/useFormValidation'
import s from './Login.module.scss'

function Login() {
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()

  // ✅ Використовуємо хук з параметром isRegister=true
  const { values, errors, handleChange, hasErrors, reset } = useFormValidation(true)

  // ✅ disabled враховує всі обов'язкові поля + помилки
  const isFormValid =
    !hasErrors &&
    // values.phone &&
    values.email &&
    values.password &&
    !isLoading

  const handleSubmit = async e => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)
    try {
      await dispatch(loginThunk({ email: values.email, password: values.password })).unwrap()
      router.push('/')
      reset()
    } catch (error) {
      setServerError(error.message || 'Некоректні дані')
      // Серверна помилка (наприклад, неправильний email або пароль)
      handleChange('email', values.email) // Перевалідувати для показу помилки
      handleChange('password', values.password) // Перевалідувати для показу помилки
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={s.loginWrapper}>
      <div className={s.loginContainer}>
        <div className={s.loginCard}>
          <h2 className={s.loginTitle}>Вхід в акаунт</h2>

          <form className={s.loginForm} onSubmit={handleSubmit}>
            <div className={s.formGroup}>
              <ValidatedInput
                name="email"
                type="email"
                label="Email *"
                value={values.email}
                onChange={value => handleChange('email', value)}
                error={errors.email}
                disabled={isLoading}
                className={s.formField}
              />
            </div>

            <div className={s.formGroup}>
              <ValidatedInput
                name="password"
                type="password"
                label="Пароль *"
                value={values.password}
                onChange={value => handleChange('password', value)}
                error={errors.password}
                disabled={isLoading}
                className={s.formField}
              />
            </div>
            {serverError && <p className={s.serverError}>{serverError}</p>}

            <button
              className={`${s.submitButton} ${!isFormValid ? s.submitButtonDisabled : ''}`}
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span className={s.spinner}></span>
                  Увійти...
                </>
              ) : (
                'Увійти'
              )}
            </button>
          </form>

          <div className={s.loginFooter}>
            <button type="button" className={s.resetButton} onClick={reset} disabled={isLoading}>
              Очистити
            </button>
            {/* <p className={s.helpText}>
              Потрібна допомога?{' '}
              <a href="/forgot-password" className={s.helpLink}>
                Відновити пароль
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
