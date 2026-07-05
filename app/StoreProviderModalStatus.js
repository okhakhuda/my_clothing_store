'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { ModalStatus } from './components/utils/ModalStatus/ModalStatus'
import { clearCartMessage } from './redux/features/cart/slices'

const ModalContext = createContext()

// Хук для керування станом модального вікна
export const useModalStatus = () => useContext(ModalContext)

export const StoreProviderModalStatus = ({ children }) => {
  const productMessage = useAppSelector(state => state.products.message)
  const productError = useAppSelector(state => state.products.error)
  const categoryMessage = useAppSelector(state => state.category.message)
  const categoryError = useAppSelector(state => state.category.error)
  const mainCategoryMessage = useAppSelector(state => state.mainCategory.message)
  const mainCategoryError = useAppSelector(state => state.mainCategory.error)
  const cartMessage = useAppSelector(state => state.cart.message)
  const cartError = useAppSelector(state => state.cart.error)

  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (
      productMessage ||
      productError ||
      categoryMessage ||
      categoryError ||
      mainCategoryMessage ||
      mainCategoryError ||
      cartMessage ||
      cartError
    ) {
      setMessage(productMessage || categoryMessage || mainCategoryMessage || cartMessage)
      setError(productError || categoryError || mainCategoryError || cartError)

      setIsOpen(true)
      const timer = setTimeout(() => {
        setIsOpen(false)
        dispatch(clearCartMessage())
        setMessage('')
        setError('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [
    dispatch,
    productMessage,
    productError,
    categoryMessage,
    categoryError,
    mainCategoryMessage,
    mainCategoryError,
    cartMessage,
    cartError,
  ])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setMessage('')
    setError('')
  }, [])

  useEffect(() => {
    const handleEsc = event => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
  }, [handleClose, isOpen])

  return (
    <ModalContext.Provider value={{ isOpen, handleClose, message, error }}>
      {children}
      <ModalStatus />
    </ModalContext.Provider>
  )
}
