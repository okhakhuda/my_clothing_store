'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from '@/app/redux/features/cart/slices'
import { createOrderThunk } from '@/app/redux/features/order/thunks'
import { GiShoppingCart } from 'react-icons/gi'
import { useModalConfirm } from '../../components/hooks/useModalConfirm'
import { ModalConfirm } from '../../components/utils/ModalConfirmation/ModalConfirm'
import DeliverySelection from '../../components/DeliverySelection/DeliverySelection'
import ValidatedInput from '../../components/ui/ValidatedInput/ValidatedInput'
import { useFormValidation } from '../../components/hooks/useFormValidation'
import { useRouter } from 'next/navigation'
import s from './Cart.module.scss'

export default function Cart() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const cart = useAppSelector(state => state.cart.items)
  const user = useAppSelector(state => state.auth.user)

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  const { values, errors, handleChange, hasErrors, isEmpty } = useFormValidation()

  const [provider, setProvider] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [department, setDepartment] = useState('')

  const [disabled, setDisabled] = useState(true)

  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()
  const [confirmMessage, setConfirmMessage] = useState('')

  useEffect(() => {
    const hasEmptyDelivery = !provider || !region || !city || !department
    setDisabled(hasErrors || isEmpty || hasEmptyDelivery || cart.length === 0)
  }, [hasErrors, isEmpty, provider, region, city, department, cart.length])

  const handleIncrement = (productId, size) => {
    const product = cart.find(item => item.productId === productId && item.size === size)
    if (product) {
      dispatch(incrementQuantity({ productId, size, quantity: product.quantity }))
    }
  }

  const handleDecrement = (productId, size) => {
    const product = cart.find(item => item.productId === productId && item.size === size)
    if (product?.quantity > 1) {
      dispatch(decrementQuantity({ productId, size, quantity: product.quantity }))
    } else if (product) {
      handleDeleteClick(productId, product.name, size)
    }
  }

  const handleDeleteClick = (productId, name, size) => {
    setConfirmMessage(`Ви впевнені, що хочете видалити "${name}" з кошика?`)
    openConfirmModal(() => {
      dispatch(removeFromCart({ productId, size }))
      setConfirmMessage('')
    })
  }

  const handleDeliverySelected = deliveryInfo => {
    setProvider(deliveryInfo.provider)
    setRegion(deliveryInfo.region)
    setCity(deliveryInfo.city)
    setDepartment(deliveryInfo.department)
  }

  const [order, setOrder] = useState({
    user: { firstName: '', lastName: '', phone: '', email: '' },
    products: [],
    address: { provider: '', region: '', city: '', department: '' },
    totalPrice: 0,
    totalQuantity: 0,
  })

  useEffect(() => {
    setOrder({
      user: {
        firstName: values.firstname,
        lastName: values.lastname,
        phone: values.phone,
        email: values.email,
      },
      products: cart.map(item => ({
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        article: item.article,
        image: item.image,
      })),
      totalPrice,
      totalQuantity,
      address: { provider, region, city, department },
    })
  }, [cart, values, provider, region, city, department, totalPrice, totalQuantity])

  const handleSubmit = e => {
    e.preventDefault()

    if (hasErrors || isEmpty || !provider || !region || !city || !department) {
      return
    }

    dispatch(createOrderThunk({ ...order, userId: user?.id })).then(order => {
      console.log(order)

      if (!order) {
        setConfirmMessage('Помилка при створенні замовлення. Спробуйте ще раз.')
      } else {
        router.push(`./order/${order.payload.order.orderNumber}`)
        dispatch(clearCart())
      }
    })
  }

  if (cart.length === 0) {
    return (
      <div className={s.emptyCart}>
        <h2 className={s.emptyCartTitle}>Кошик порожній</h2>
        <Link href="/" className={s.emptyCartLink}>
          Перейти до каталогу
        </Link>
      </div>
    )
  }

  return (
    <div className={s.cartWrapper}>
      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        handleConfirm={handleConfirm}
        closeConfirmModal={closeConfirmModal}
        message={confirmMessage}
        className={s.modalConfirm}
      />

      <div className={s.cartContainer}>
        <h1 className={s.cartTitle}>Кошик</h1>

        <div className={s.cartContent}>
          <ul className={s.productsList}>
            {cart.map(item => (
              <li key={`${item.productId}-${item.size}`} className={s.productCard}>
                <Link href={`/${item.genderCategory}/${item.category}/${item.productId}`} className={s.productLink}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={300}
                    className={s.productImage}
                    priority
                  />
                </Link>

                <div className={s.productInfo}>
                  <p className={s.productName}>{item.name}</p>
                  <p className={s.productArticle}>Арт: {item.article}</p>
                  <p className={s.productSize}>Розмір: {item.size}</p>
                  <p className={s.productColor}>Колір: {item.color}</p>
                  <p className={s.productPrice}>{item.price * item.quantity} ₴</p>
                </div>

                <div className={s.quantityControls}>
                  <div className={s.deleteButtonContainer}>
                    <button
                      type="button"
                      className={s.deleteButton}
                      onClick={() => handleDeleteClick(item.productId, item.name, item.size)}
                    >
                      <GiShoppingCart className={s.deleteIcon} />
                      <span className={s.deleteText}>Видалити</span>
                    </button>
                  </div>
                  <div className={s.quantityButtons}>
                    <button
                      type="button"
                      className={s.quantityButton}
                      onClick={() => handleDecrement(item.productId, item.size)}
                    >
                      -
                    </button>
                    <input type="number" min="1" max="10" className={s.quantityInput} value={item.quantity} disabled />
                    <button
                      type="button"
                      className={s.quantityButton}
                      onClick={() => handleIncrement(item.productId, item.size)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className={s.summary}>
            <p className={s.summaryQuantity}>Кількість: {totalQuantity} шт.</p>
            <p className={s.summaryPrice}>Сума: {totalPrice} ₴</p>
          </div>

          <form id="order-form" className={s.orderForm} onSubmit={handleSubmit}>
            <div className={s.formSection}>
              <h2 className={s.formTitle}>Дані для замовлення</h2>

              <ValidatedInput
                name="firstname"
                label="Ім'я *"
                value={values.firstname}
                placeholder="Введіть ім'я"
                onChange={value => handleChange('firstname', value)}
                error={errors.firstname}
              />

              <ValidatedInput
                name="lastname"
                label="Прізвище *"
                placeholder="Введіть прізвище"
                value={values.lastname}
                onChange={value => handleChange('lastname', value)}
                error={errors.lastname}
              />

              <ValidatedInput
                name="phone"
                type="tel"
                label="Телефон *"
                value={values.phone}
                onChange={value => handleChange('phone', value)}
                error={errors.phone}
              />

              <ValidatedInput
                name="email"
                type="email"
                label="Email"
                value={values.email}
                onChange={value => handleChange('email', value)}
                error={errors.email}
              />
            </div>
          </form>

          <div className={s.deliverySection}>
            <DeliverySelection onDeliverySelected={handleDeliverySelected} />
          </div>

          <button
            type="submit"
            form="order-form"
            className={`${s.submitButton} ${disabled ? s.submitButtonDisabled : ''}`}
            disabled={disabled}
          >
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  )
}
