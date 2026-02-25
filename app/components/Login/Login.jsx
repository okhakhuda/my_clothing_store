'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/app/redux/hooks'
import { loginThunk } from '../../redux/features/auth/thunks'
import { useRouter } from 'next/navigation'
import s from './Login.module.scss'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateEmail = value => {
    if (!value.trim()) return "Email обов'язковий"
    if (!EMAIL_REGEX.test(value)) return 'Некоректний email'
    return ''
  }

  const validatePassword = value => {
    if (!value) return "Пароль обов'язковий"
    if (value.length < 6) return 'Мінімум 6 символів'
    return ''
  }

  const handleEmailChange = e => {
    const value = e.target.value
    setEmail(value)
    setErrors(prev => ({ ...prev, email: validateEmail(value) }))
  }

  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    setErrors(prev => ({ ...prev, password: validatePassword(value) }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      return
    }

    setIsLoading(true)
    try {
      const result = await dispatch(loginThunk({ email, password })).unwrap()
      router.push('/')
      reset()
    } catch (error) {
      setErrors(prev => ({ ...prev, email: 'Некоректні дані' }))
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setEmail('')
    setPassword('')
    setErrors({ email: '', password: '' })
  }

  const hasErrors = errors.email || errors.password
  const isFormValid = email && password && !hasErrors && !isLoading

  return (
    <div className={s.loginWrapper}>
      <div className={s.loginContainer}>
        <div className={s.loginCard}>
          <h2 className={s.loginTitle}>Вхід в акаунт</h2>

          <form className={s.loginForm} onSubmit={handleSubmit}>
            <div className={s.formGroup}>
              <label htmlFor="email" className={s.formLabel}>
                Email
              </label>
              <input
                id="email"
                className={`${s.formInput} ${errors.email ? s.formInputError : ''}`}
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@email.com"
                disabled={isLoading}
              />
              {errors.email && <p className={s.errorMessage}>{errors.email}</p>}
            </div>

            <div className={s.formGroup}>
              <label htmlFor="password" className={s.formLabel}>
                Пароль
              </label>
              <input
                id="password"
                className={`${s.formInput} ${errors.password ? s.formInputError : ''}`}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && <p className={s.errorMessage}>{errors.password}</p>}
            </div>

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

// 'use client'

// import { useState } from 'react'
// import { useAppDispatch } from '@/app/redux/hooks'
// import { loginThunk } from '../../redux/features/auth/thunks'

// import { useRouter } from 'next/navigation'
// import s from './Login.module.scss'

// function Login() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const dispatch = useAppDispatch()
//   const router = useRouter()

//   const handleChange = e => {
//     const { name, value } = e.target
//     switch (name) {
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
//     const user = { email, password }
//     dispatch(loginThunk(user)).then(res => {
//       if (res.error) {
//         console.log('error', res.error)
//       } else {
//         router.push('/')
//       }
//     })

//     reset()
//   }

//   const reset = () => {
//     setEmail('')
//     setPassword('')
//   }

//   return (
//     <>
//       <h2 className={s.title}>Вхід</h2>
//       <form className={s.form} onSubmit={handleSubmit}>
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
//           Ввійти
//         </button>
//       </form>
//     </>
//   )
// }

// export default Login
