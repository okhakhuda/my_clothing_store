'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { registerThunk } from '../../redux/features/auth/thunks'
import { useRouter } from 'next/navigation'
import s from './Register.module.scss'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const authError = useAppSelector(state => state.auth.error)
  const router = useRouter()

  // Регулярні вирази
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const PHONE_REGEX = /^(\+380|0)[5-9]\d{8}$/
  const NAME_REGEX = /^[а-яА-ЯїєґІЇЄҐ'`ʼʼ' ]{2,50}$/

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return "Поле обов'язкове"
        if (value.trim().length < 2) return 'Мінімум 2 символи'
        if (!NAME_REGEX.test(value)) return 'Тільки кириличні літери'
        return ''

      case 'phone':
        if (!value.trim()) return "Телефон обов'язковий"
        if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) return 'Формат: +380XXXXXXXXX або 0XXXXXXXXX'
        return ''

      case 'email':
        if (!value.trim()) return "Email обов'язковий"
        if (!EMAIL_REGEX.test(value)) return 'Некоректний email'
        return ''

      case 'password':
        if (!value) return "Пароль обов'язковий"
        if (value.length < 6) return 'Мінімум 6 символів'
        return ''

      case 'confirmPassword':
        if (!value) return 'Підтвердіть пароль'
        if (value !== formData.password) return 'Паролі не співпадають'
        return ''

      default:
        return ''
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // ✅ Реал-тайм валідація
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }))
  }

  const handlePhoneChange = e => {
    let value = e.target.value.replace(/[^\d+]/g, '')
    const cleanDigits = value.replace(/[^\d]/g, '')

    if (cleanDigits.length > 12) return

    let formatted = ''
    if (cleanDigits.startsWith('380') && cleanDigits.length <= 12) {
      formatted = '+380' + cleanDigits.slice(3)
    } else if (cleanDigits.startsWith('0') && cleanDigits.length <= 10) {
      formatted = '0' + cleanDigits.slice(1)
    } else {
      formatted = value
    }

    setFormData(prev => ({ ...prev, phone: formatted }))
    setErrors(prev => ({
      ...prev,
      phone: validateField('phone', formatted),
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // ✅ Фінальна валідація всіх полів
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        newErrors[key] = validateField(key, formData[key])
      }
    })

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await dispatch(registerThunk(formData)).unwrap()
      reset()
      router.push('/')
    } catch (error) {
      setErrors({ ...errors, email: 'Користувач вже існує' })
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setErrors({})
  }

  const isFormValid =
    Object.values(errors).every(error => !error) &&
    formData.firstName &&
    formData.lastName &&
    formData.phone &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !isLoading

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
              <div className={s.formGroup}>
                <label htmlFor="firstName" className={s.formLabel}>
                  Ім'я
                </label>
                <input
                  id="firstName"
                  className={`${s.formInput} ${errors.firstName ? s.formInputError : ''}`}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Іван"
                  maxLength="50"
                  disabled={isLoading}
                />
                {errors.firstName && <p className={s.errorMessage}>{errors.firstName}</p>}
              </div>

              <div className={s.formGroup}>
                <label htmlFor="lastName" className={s.formLabel}>
                  Прізвище
                </label>
                <input
                  id="lastName"
                  className={`${s.formInput} ${errors.lastName ? s.formInputError : ''}`}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Петренко"
                  maxLength="50"
                  disabled={isLoading}
                />
                {errors.lastName && <p className={s.errorMessage}>{errors.lastName}</p>}
              </div>
            </div>

            <div className={s.formGroup}>
              <label htmlFor="phone" className={s.formLabel}>
                Телефон
              </label>
              <input
                id="phone"
                className={`${s.formInput} ${errors.phone ? s.formInputError : ''}`}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="+380 98 123 45 67"
                disabled={isLoading}
              />
              {errors.phone && <p className={s.errorMessage}>{errors.phone}</p>}
            </div>

            <div className={s.formGroup}>
              <label htmlFor="email" className={s.formLabel}>
                Email
              </label>
              <input
                id="email"
                className={`${s.formInput} ${errors.email ? s.formInputError : ''}`}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                disabled={isLoading}
              />
              {errors.email && <p className={s.errorMessage}>{errors.email}</p>}
            </div>

            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="password" className={s.formLabel}>
                  Пароль
                </label>
                <input
                  id="password"
                  className={`${s.formInput} ${errors.password ? s.formInputError : ''}`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && <p className={s.errorMessage}>{errors.password}</p>}
              </div>

              <div className={s.formGroup}>
                <label htmlFor="confirmPassword" className={s.formLabel}>
                  Підтвердити пароль
                </label>
                <input
                  id="confirmPassword"
                  className={`${s.formInput} ${errors.confirmPassword ? s.formInputError : ''}`}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className={s.errorMessage}>{errors.confirmPassword}</p>}
              </div>
            </div>

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

// 'use client'

// import { useState } from 'react'
// import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
// import { registerThunk } from '../../redux/features/auth/thunks'
// import { useRouter } from 'next/navigation'
// import s from './Register.module.scss'

// function Register() {
//   const [firstName, setFirstName] = useState('')
//   const [lastName, setLastName] = useState('')
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const dispatch = useAppDispatch()
//   const isError = useAppSelector(state => state.auth.error)
//   const router = useRouter()

//   //   const isAuth = useAppSelector(state => state.auth.isAuth)

//   const handleChange = e => {
//     const { name, value } = e.target
//     switch (name) {
//       case 'firstName':
//         setFirstName(value)
//         break
//       case 'lastName':
//         setLastName(value)
//         break
//       case 'phone':
//         setPhone(value)
//         break
//       case 'email':
//         setEmail(value)
//         break
//       case 'password':
//         setPassword(value)
//         break
//       default:
//         break
//     }
//   }

//   const handleSubmit = e => {
//     e.preventDefault()
//     const user = { firstName, lastName, phone, email, password }
//     dispatch(registerThunk(user)).then(res => {
//       if (res.error) {
//         console.log('error', res.error)
//       } else {
//         reset()
//         router.push('/')
//       }
//     })
//   }

//   const reset = () => {
//     setFirstName('')
//     setLastName('')
//     setPhone('')
//     setEmail('')
//     setPassword('')
//   }

//   return (
//     <>
//       <h2 className={s.title}>Реєстрація</h2>
//       <form className={s.form} onSubmit={handleSubmit}>
//         <label className={s.label}>Ім&#39;я</label>
//         <input className={s.input} type="text" name="firstName" value={firstName} onChange={handleChange}></input>
//         <label className={s.label}>Призвіще</label>
//         <input className={s.input} type="text" name="lastName" value={lastName} onChange={handleChange}></input>
//         <label className={s.label}>Телефон</label>
//         <input className={s.input} type="text" name="phone" value={phone} onChange={handleChange}></input>
//         <label className={s.label}>Email</label>
//         <input
//           className={s.input}
//           type="text"
//           name="email"
//           value={email}
//           placeholder="email"
//           onChange={handleChange}
//         ></input>
//         <label className={s.label}>Password</label>
//         <input
//           className={s.input}
//           type="password"
//           name="password"
//           value={password}
//           placeholder="password"
//           onChange={handleChange}
//         ></input>

//         <button className={s.button} type="submit">
//           Зареєструватися
//         </button>
//       </form>
//     </>
//   )
// }

// export default Register
