'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { fetchAllOrderThunk } from '@/app/redux/features/order/thunks'
import Image from 'next/image'
import s from './Order.module.scss'

export const Order = () => {
  const dispatch = useAppDispatch()
  const allOrder = useAppSelector(state => state.allOrder.items)

  useEffect(() => {
    dispatch(fetchAllOrderThunk())
  }, [dispatch])

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
    </main>
  )
}

// 'use client'

// import React, { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
// import { fetchOrderByUserThunk, fetchAllOrderThunk } from '@/app/redux/features/order/thunks'
// import Image from 'next/image'

// export const Order = () => {
//   const dispatch = useAppDispatch()
//   const allOrder = useAppSelector(state => state.allOrder.items)

//   useEffect(() => {
//     dispatch(fetchAllOrderThunk())
//   }, [dispatch])

//   return (
//     <div>
//       <h1>Order</h1>
//       {allOrder.length > 0 &&
//         allOrder.map(order => (
//           <ul key={order.id} className="card w-96 bg-base-100 shadow-xl">
//             <li>
//               <div className="card-body">
//                 <h2 className="card-title">Замовлення № {order.orderNumber}</h2>
//                 <p>Телефон: {order.user.phone}</p>
//                 <p>Загальна ціна: {order.totalPrice} грн.</p>
//               </div>
//               {order.products.map(product => (
//                 <ul key={product.id} className="card_products">
//                   <li className="card-body">
//                     <Image src={product.image} alt={product.name} width={100} height={100} className="rounded-xl" />
//                     <h2 className="card-title">{product.name}</h2>
//                     <p>Розмір: {product.size}</p>
//                     <p>Колір: {product.color}</p>
//                     <p>Артикул: {product.article}</p>
//                     <p>Кількість: {product.quantity}</p>
//                     <p>Ціна: {product.price} грн.</p>
//                   </li>
//                 </ul>
//               ))}

//               <ul className="card_address">
//                 <li className="card-body">
//                   <h2 className="card-title">Адреса доставки</h2>
//                   <p>Спосіб доставки: {order.address.provider}</p>
//                   <p>Область: {order.address.region}</p>
//                   <p>Місто: {order.address.city}</p>
//                   <p>Відділення: {order.address.department}</p>
//                 </li>
//               </ul>
//             </li>
//           </ul>
//         ))}

//       {/* <div className="overflow-x-auto">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Номер замовлення</th>
//               <th>Телефон</th>
//               <th>Загальна ціна</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allOrder.map(order => (
//               <tr key={order.id}>
//                 <td>{order.orderNumber}</td>
//                 <td>{order.user.phone}</td>
//                 <td>{order.totalPrice} грн.</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div> */}
//     </div>
//   )
// }
