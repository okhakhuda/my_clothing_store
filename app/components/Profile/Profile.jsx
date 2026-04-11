'use client'

import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { fetchOrderByUserThunk } from '@/app/redux/features/order/thunks'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import s from './Profile.module.scss'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info')

  const user = useAppSelector(state => state.auth.user)
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const orders = useAppSelector(state => state.orderByUser.items)

  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (!isAuth || !user?.id) {
      return router.push('/login')
    }
    dispatch(fetchOrderByUserThunk(user.id))
  }, [dispatch, isAuth, router, user])

  if (!isAuth || !user) return null

  return (
    <section className={s.profile}>
      <div className={s.container}>
        <h1 className={s.title}>Мій профіль</h1>

        <div className={s.tabs}>
          <button
            type="button"
            className={activeTab === 'info' ? s.tabActive : s.tab}
            onClick={() => setActiveTab('info')}
          >
            Особиста інформація
          </button>
          <button
            type="button"
            className={activeTab === 'orders' ? s.tabActive : s.tab}
            onClick={() => setActiveTab('orders')}
          >
            Замовлення ({orders.length})
          </button>
        </div>

        <div className={s.content}>
          {activeTab === 'info' && (
            <div className={s.infoSection}>
              <div className={s.avatarWrapper}>
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.firstName} width={120} height={120} className={s.avatar} />
                ) : (
                  <div className={s.avatarPlaceholder}>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                )}
              </div>
              <div className={s.infoGrid}>
                <div className={s.infoItem}>
                  <span className={s.label}>Ім’я</span>
                  <span>{user.firstName}</span>
                </div>
                <div className={s.infoItem}>
                  <span className={s.label}>Прізвище</span>
                  <span>{user.lastName}</span>
                </div>
                <div className={s.infoItem}>
                  <span className={s.label}>Електронна пошта</span>
                  <span>{user.email}</span>
                </div>
                <div className={s.infoItem}>
                  <span className={s.label}>Телефон</span>
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={s.ordersSection}>
              {orders.length === 0 ? (
                <div className={s.empty}>
                  <p>У вас ще немає замовлень.</p>
                </div>
              ) : (
                <ul className={s.orderList}>
                  {orders.map(order => (
                    <li key={order.id} className={s.orderCard}>
                      <div className={s.orderHeader}>
                        <h3>Замовлення № {order.orderNumber}</h3>
                        <span className={s.date}>{order.createdAt}</span>
                      </div>

                      <div className={s.products}>
                        {order.products.slice(0, 3).map(product => (
                          <div key={product.id} className={s.product}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={60}
                              height={60}
                              className={s.productImage}
                            />
                            <div className={s.productInfo}>
                              <h4>{product.name}</h4>
                              <p>
                                {product.size}, {product.color}
                              </p>
                              <p>Кількість: {product.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.products.length > 3 && (
                          <div className={s.more}>+ {order.products.length - 3} товарів</div>
                        )}
                      </div>

                      <div className={s.orderFooter}>
                        <span className={s.address}>
                          {order.address.city}, {order.address.department}
                        </span>
                        <span className={s.total}>{order.totalPrice} грн.</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Profile
