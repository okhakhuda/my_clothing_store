'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { fetchAllOrderThunk } from '@/app/redux/features/order/thunks'
import Image from 'next/image'
import Loader from '../../Loader/Loader'
import { Pagination } from '../../utils/Pagination/Pagination'
import s from './Order.module.scss'

export const Order = () => {
  const dispatch = useAppDispatch()
  const allOrder = useAppSelector(state => state.allOrder.items)
  const { total, limit, isLoading } = useAppSelector(state => state.allOrder)

  const [page, setPage] = useState(1)

  const totalPages = limit && total ? Math.ceil(total / limit) : 1

  useEffect(() => {
    dispatch(fetchAllOrderThunk({ page, limit }))
  }, [dispatch, page, limit])

  if (isLoading) return <Loader />

  if (!allOrder.length) {
    return (
      <main className={s.main}>
        <h1 className={s.title}>Замовлення</h1>
        <p className={s.empty}>Немає замовлень</p>
      </main>
    )
  }

  return (
    <main className={s.main}>
      <h1 className={s.title}>Замовлення</h1>

      <p className={s.counter}>
        Всього замовлень: {total} · сторінка {page} з {totalPages}
      </p>

      <div className={s.list}>
        {allOrder.map(order => (
          <article key={order.id} className={s.card}>
            <header className={s.header}>
              <h2>Замовлення № {order.orderNumber}</h2>
              <p>Телефон: {order.user.phone}</p>
              <p>Загальна ціна: {order.totalPrice} грн.</p>
            </header>

            <div className={s.products}>
              {order.products.map(product => (
                <div key={product.id} className={s.productCard}>
                  <Image src={product.image} alt={product.name} width={100} height={100} className={s.productImage} />
                  <div className={s.productDetails}>
                    <h3>{product.name}</h3>
                    <p>Розмір: {product.size}</p>
                    <p>Колір: {product.color}</p>
                    <p>Артикул: {product.article}</p>
                    <p>Кількість: {product.quantity}</p>
                    <p>Ціна: {product.price} грн.</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={s.address}>
              <h3>Адреса доставки</h3>
              <p>Спосіб доставки: {order.address.provider}</p>
              <p>Область: {order.address.region}</p>
              <p>Місто: {order.address.city}</p>
              <p>Відділення: {order.address.department}</p>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        goToPage={setPage}
        goNext={() => setPage(p => p + 1)}
        goPrev={() => setPage(p => p - 1)}
        hasNext={page < totalPages}
        hasPrev={page > 1}
      />
    </main>
  )
}
