'use client'

import { useState, useCallback } from 'react'

const UA_OPERATORS = [
  '039',
  '067',
  '068',
  '077',
  '096',
  '097',
  '098',
  '050',
  '066',
  '075',
  '095',
  '099',
  '063',
  '073',
  '093',
  '091',
  '092',
  '089',
  '094',
]

const PHONE_REGEX = /^(\+380|0)[5-9]\d{8}$/
const NAME_REGEX = /^[а-яА-ЯїєґІЇЄҐ'`ʼʼ' ]{2,50}$/
const EMAIL_REGEX = /^[^\s@]+@[^@\s]+(\.[^@\s]+)+$/

export function useFormValidation() {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  })

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  })

  const validateField = useCallback((name, value) => {
    let error = ''

    switch (name) {
      case 'firstname':
      case 'lastname':
        if (!value.trim()) error = "Поле обов'язкове"
        else if (value.trim().length < 2) error = 'Мінімум 2 символи'
        else if (!NAME_REGEX.test(value)) error = 'Тільки кириличні літери, апостроф та пробіл'
        break

      case 'phone':
        const cleanDigits = value.replace(/[^\d]/g, '')
        if (cleanDigits.length === 0) return ''
        if (cleanDigits.length < 10) return `Потрібно ${10 - cleanDigits.length} цифр`
        if (cleanDigits.length !== 10 && cleanDigits.length !== 12) return 'Телефон: 10 цифр або +380XXXXXXXXX'
        if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) return 'Формат: +380XXXXXXXXX або 0XXXXXXXXX'

        const operator = cleanDigits.length === 10 ? cleanDigits.slice(0, 3) : cleanDigits.slice(2, 5)
        if (!UA_OPERATORS.includes(operator)) return 'Некоректний код оператора'
        break

      case 'email':
        if (value.trim() && !EMAIL_REGEX.test(value)) {
          error = 'Некоректний email'
        }
        break
    }
    return error
  }, [])

  const handleChange = useCallback(
    (name, rawValue) => {
      let cleanValue = rawValue

      switch (name) {
        case 'firstname':
        case 'lastname':
          cleanValue = rawValue.replace(/\s+/g, ' ').trimStart().slice(0, 50)
          break
        case 'phone':
          cleanValue = rawValue.replace(/[^\d+]/g, '')
          const cleanDigits = cleanValue.replace(/[^\d]/g, '')
          if (cleanDigits.length > 12) return
          break
      }

      setValues(prev => ({ ...prev, [name]: cleanValue }))
      const error = validateField(name, cleanValue)
      setErrors(prev => ({ ...prev, [name]: error }))
    },
    [validateField],
  )

  const hasErrors = Object.values(errors).some(error => error !== '')
  const isEmpty = ['firstname', 'lastname', 'phone'].every(field => !values[field].trim())

  const reset = useCallback(() => {
    setValues({
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
    })
    setErrors({
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
    })
  }, [])

  return {
    values,
    errors,
    handleChange,
    hasErrors,
    isEmpty,
    reset,
    setValues,
  }
}
