import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { clearMessage } from '../../redux/features/products/thunks'

const useModalStatus = () => {
  const message = useAppSelector(state => state.products.message)
  const error = useAppSelector(state => state.products.error)
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (message || error) {
      setIsOpen(true)
      const timer = setTimeout(() => {
        setIsOpen(false)
        dispatch(clearMessage())
      }, 3000) // Закриваємо через 3 секунд

      return () => clearTimeout(timer)
    }
  }, [message, dispatch, error])

  const handleClose = () => {
    setIsOpen(false)
    dispatch(clearMessage())
  }

  const handleBackdropClick = event => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  return { isOpen, handleBackdropClick, message, error }
}

export default useModalStatus
