'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { registerThunk } from '../../redux/features/auth/thunks'
import { useRouter } from 'next/navigation'
import { useFormValidation } from '../hooks/useFormValidation'
import ValidatedInput from '../ui/ValidatedInput/ValidatedInput'
import s from './Register.module.scss'

function Register() {
  const dispatch = useAppDispatch()
  const authError = useAppSelector(state => state.auth.error)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // ✅ Використовуємо хук з параметром isRegister=true
  const { values, errors, handleChange, hasErrors, reset } = useFormValidation(true)

  // ✅ disabled враховує всі обов'язкові поля + помилки
  const isFormValid =
    !hasErrors &&
    values.firstname &&
    values.lastname &&
    values.phone &&
    values.email &&
    values.password &&
    values.confirmPassword &&
    !isLoading

  const handleSubmit = async e => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)

    try {
      await dispatch(
        registerThunk({
          firstName: values.firstname,
          lastName: values.lastname,
          phone: values.phone,
          email: values.email,
          password: values.password,
          // confirmPassword: values.confirmPassword,
        }),
      ).unwrap()
      reset()
      router.push('/')
    } catch (error) {
      setServerError(error.message || '!!! Користувач з таким email або телефоном вже існує')
      // Серверна помилка (користувач існує)
      handleChange('email', values.email) // Перевалідувати для показу помилки
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={s.registerWrapper}>
      <div className={s.registerContainer}>
        <div className={s.registerCard}>
          <div className={s.registerHeader}>
            <h2 className={s.registerTitle}>Створити акаунт</h2>
            <p className={s.registerSubtitle}>Заповніть дані для реєстрації</p>
          </div>

          <form className={s.registerForm} onSubmit={handleSubmit}>
            <div className={s.formRow}>
              <ValidatedInput
                name="firstname"
                label="Ім'я *"
                value={values.firstname}
                onChange={value => handleChange('firstname', value)}
                error={errors.firstname}
                disabled={isLoading}
                className={s.formField}
              />

              <ValidatedInput
                name="lastname"
                label="Прізвище *"
                value={values.lastname}
                onChange={value => handleChange('lastname', value)}
                error={errors.lastname}
                disabled={isLoading}
                className={s.formField}
              />
            </div>

            <ValidatedInput
              name="phone"
              type="tel"
              label="Телефон *"
              value={values.phone}
              onChange={value => handleChange('phone', value)}
              error={errors.phone}
              disabled={isLoading}
              className={s.formField}
            />

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

            <div className={s.formRow}>
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

              <ValidatedInput
                name="confirmPassword"
                type="password"
                label="Підтвердити пароль *"
                value={values.confirmPassword}
                onChange={value => handleChange('confirmPassword', value)}
                error={errors.confirmPassword}
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
                  Реєстрація...
                </>
              ) : (
                'Зареєструватися'
              )}
            </button>
          </form>

          <div className={s.registerFooter}>
            <button type="button" className={s.resetButton} onClick={reset} disabled={isLoading}>
              Очистити форму
            </button>
            <p className={s.loginLinkText}>
              Вже маєте акаунт?{' '}
              <button type="button" className={s.loginLink} onClick={() => router.push('/login')} disabled={isLoading}>
                Увійти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
