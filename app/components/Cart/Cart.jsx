'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { incrementQuantity, decrementQuantity, setQuantity } from '@/app/redux/features/cart/slices'
import { createOrderThunk } from '@/app/redux/features/order/thunks'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import s from './Cart.module.scss'
import DeliverySelection from '../../components/DeliverySelection/DeliverySelection'
import { GiShoppingCart } from 'react-icons/gi'
import { removeFromCart } from '../../redux/features/cart/slices'
import { useModalConfirm } from '../../components/hooks/useModalConfirm'
import { ModalConfirm } from '../../components/utils/ModalConfirmation/ModalConfirm'
import Header from '../../components/Header/Header'

export default function Cart() {
  const [order, setOrder] = useState({
    user: {
      firstame: '',
      lastname: '',
      phone: '',
      email: '',
    },
    products: [],
    address: { provider: '', region: '', city: '', department: '' },
    totalPrice: 0,
    totalQuantity: 0,
  })

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [provider, setProvider] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [department, setDepartment] = useState('')

  const [disabled, setDisabled] = useState(true)
  useEffect(() => {
    if (firstname && lastname && phone && provider && region && city && department) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [firstname, lastname, phone, provider, region, city, department])

  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()
  const [confirmMessage, setConfirmMessage] = useState('')

  const cart = useAppSelector(state => state.cart.items)

  const user = useAppSelector(state => state.auth.user)

  const dispatch = useAppDispatch()

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleIncrement = e => {
    const productId = e.target.dataset.productId
    const size = e.target.dataset.size
    const product = cart.find(item => item.productId === productId && item.size === size)

    if (product) {
      dispatch(incrementQuantity({ productId, size, quantity: product.quantity }))
    }
  }

  const handleDecrement = e => {
    const productId = e.target.dataset.productId
    const size = e.target.dataset.size
    const product = cart.find(item => item.productId === productId && item.size === size)

    if (product) {
      dispatch(decrementQuantity({ productId, size }))
    }
  }

  const handleDeliverySelected = deliveryInfo => {
    setProvider(deliveryInfo.provider)
    setRegion(deliveryInfo.region)
    setCity(deliveryInfo.city)
    setDepartment(deliveryInfo.department)
  }

  const handleDeleteClick = (productId, name) => {
    const product = cart.find(item => item.productId === productId)
    if (product) {
      setConfirmMessage(`Ви впевнені, що хочете видалити "${name}" з кошика?`)
      openConfirmModal(() => {
        dispatch(removeFromCart(productId))
        setConfirmMessage('')
      })
    }
  }

  useEffect(() => {
    setOrder(prev => ({
      ...prev,
      user: {
        firstName: firstname,
        lastName: lastname,
        phone: phone,
        email: email,
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
      totalPrice: totalPrice,
      totalQuantity: totalQuantity,
      address: {
        provider: provider,
        region: region,
        city: city,
        department: department,
      },
    }))
  }, [
    cart,
    city,
    department,
    email,
    firstname,
    lastname,
    order.email,
    order.firstame,
    order.lastname,
    order.phone,
    phone,
    provider,
    region,
    totalPrice,
    totalQuantity,
  ])

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(createOrderThunk({ ...order, userId: user?.id }))
  }

  return (
    <>
      <Header />
      <div>
        <ModalConfirm
          isModalConfirmOpen={isModalConfirmOpen}
          handleConfirm={handleConfirm}
          closeConfirmModal={closeConfirmModal}
          message={confirmMessage}
        />
      </div>

      <div>
        <h1>Кошик</h1>

        <div>
          <ul>
            {cart.map((item, index) => (
              <li key={item.productId + item.size} className={s.card}>
                <Link href={'/'} rel="preload">
                  <Image src={item.image} alt={item.name} width={100} height={100} className={s.img} priority />
                </Link>
                <p>{item.name}</p>
                <p>Арт: {item.article}</p>
                <p>{item.size}</p>
                <p>Колір: {item.color}</p>
                <p>Ціна: {item.price * item.quantity} ₴</p>

                <div>
                  <button
                    type="button"
                    onClick={handleDecrement}
                    data-product-id={item.productId}
                    data-size={item.size}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className={s.input}
                    value={item.quantity}
                    id="input"
                    disabled
                    name="input"
                    data-size={item.size}
                    data-product-id={item.productId}
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    data-product-id={item.productId}
                    data-size={item.size}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={s.button}
                    onClick={() => handleDeleteClick(item.productId, item.name)}
                  >
                    <GiShoppingCart />
                    <p>DELETE</p>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className={s.total}>
            <p>Total Price: {totalPrice} ₴</p>
            <p>Total Quantity: {totalQuantity} шт.</p>
            {/* <Link href={'/'} rel="preload" className={s.btn}>
              Checkout
            </Link>
            <Link href={'/'} rel="preload" className={s.btn}>
              Continue Shopping
            </Link> */}
            <div>
              <label htmlFor="firstname">Ім&#39;я</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={e => setFirstname(e.target.value)}
                placeholder="Ім'я"
              />
              <label htmlFor="lastname">Призвище</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
                placeholder="Призвище"
              />
              <label htmlFor="phone">Телефон</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Телефон"
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        <div>
          <DeliverySelection onDeliverySelected={handleDeliverySelected} />
        </div>
        <button disabled={disabled} type="submit" className={s.btn} onClick={handleSubmit}>
          Оформити замовлення
        </button>
      </div>
    </>
  )
}
