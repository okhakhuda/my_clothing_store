'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { incrementQuantity, decrementQuantity } from '@/app/redux/features/cart/slices'
import { createOrderThunk } from '@/app/redux/features/order/thunks'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import s from './Cart.module.scss'
import DeliverySelection from '../../components/DeliverySelection/DeliverySelection'
import { GiShoppingCart } from 'react-icons/gi'
import { removeFromCart } from '../../redux/features/cart/slices'
import { useModalConfirm } from '../../components/hooks/useModalConfirm'
import { ModalConfirm } from '../../components/utils/ModalConfirmation/ModalConfirm'

// Регулярні вирази для валідації
const PHONE_REGEX = /^(\+380|0)[5-9]\d{8}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[а-яА-ЯїєґІЇЄҐ'`ʼʼ' ]{2,50}$/

const UA_OPERATORS = ['039','067','068','077', '096', '097', '098', '050', '066', '075', '095', '099', '063', '073', '093', '091', '092', '089', '094']

export default function Cart() {
  const dispatch = useAppDispatch()

  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  })

  console.log(errors.phone);
  

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [provider, setProvider] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [department, setDepartment] = useState('')

  const [disabled, setDisabled] = useState(true)

  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'firstname':
      case 'lastname':
        if (!value.trim()) {
          error = 'Поле обов\'язкове'
        } else if (value.trim().length < 2) {
          error = 'Мінімум 2 символи'
        } else if (!NAME_REGEX.test(value)) {
          error = 'Тільки кириличні літери, апостроф та пробіл'
        }
        break
        
      case 'phone':
        const cleanDigits = value.replace(/[^\d]/g, '')
        
        if (!value.trim()) {
          error = ''
        } 
        else if (cleanDigits.length === 0) {
          error = ''
        }
        // ✅ Тільки 10 або 12 цифр
        else if (cleanDigits.length !== 10 && cleanDigits.length !== 12) {
          error = 'Телефон: 10 цифр (0985816429) або +380XXXXXXXXX'
        }
        // ✅ Перевірка формату та оператора
        else if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) {
          error = 'Формат: +380985816429 або 0985816429'
        }
        // ✅ Перевірка оператора (5-9)
        else if (cleanDigits.length === 10) {
          const operator = cleanDigits.slice(0, 3)
          if (!UA_OPERATORS.includes(operator)) {
            error = 'Некоректний код оператора'
          }
        }
        else if (cleanDigits.length === 12) {
          const operator = cleanDigits.slice(2, 5)
          console.log(operator);
          
          if (!UA_OPERATORS.includes(operator)) {
            error = 'Некоректний код оператора'
          }
        }
        break
        
      case 'email':
        if (!value.trim()) error = 'Email обов\'язковий'
        else if (!EMAIL_REGEX.test(value)) error = 'Некоректний email'
        break
    }
    return error
  }

  const handleFirstnameChange = (e) => {
    // ✅ Блокуємо латинські символи та цифри на рівні input
    let value = e.target.value
      .replace(/\s+/g, ' ') // Один пробіл замість кількох
      .trimStart() // Прибираємо пробіл на початку
    
    // ✅ Максимум 50 символів
    value = value.slice(0, 50)
    
    setFirstname(value)
    setErrors(prev => ({ 
      ...prev, 
      firstname: validateField('firstname', value) 
    }))
  }

  const handleLastnameChange = (e) => {
    // ✅ Точно така ж логіка для прізвища
    let value = e.target.value
      .replace(/\s+/g, ' ')
      .trimStart()
    
    value = value.slice(0, 50)
    
    setLastname(value)
    setErrors(prev => ({ 
      ...prev, 
      lastname: validateField('lastname', value) 
    }))
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d+]/g, '')
    const cleanDigits = value.replace(/[^\d]/g, '')
    
    // ✅ ЖОРСТКЕ ОБМЕЖЕННЯ: тільки 12 символів максимум
    if (cleanDigits.length > 12) {
      return // Блокуємо зайві символи
    }
    
    // ✅ Форматування тільки правильних номерів
    let formattedValue = ''
    
    if (cleanDigits.startsWith('380') && cleanDigits.length <= 12) {
      // ✅ +380 тільки якщо є всі 12 цифр
      if (cleanDigits.length === 12) {
        formattedValue = '+380' + cleanDigits.slice(3)
      } else {
        formattedValue = '+380' + cleanDigits.slice(3)
      }
    } 
    else if (cleanDigits.startsWith('0') && cleanDigits.length <= 10) {
      formattedValue = '0' + cleanDigits.slice(1)
    }
    else {
      formattedValue = value
    }
    
    setPhone(formattedValue)
    
    // ✅ Валідація в реальному часі
    let phoneError = ''
    if (cleanDigits.length === 0) {
      phoneError = ''
    } 
    else if (cleanDigits.length < 10) {
      phoneError = `Потрібно ${10 - cleanDigits.length} цифр`
    }
    else if (cleanDigits.length > 12) {
      phoneError = 'Занадто довгий номер'
    }
    else {
      phoneError = validateField('phone', formattedValue)
    }
    
    setErrors(prev => ({ ...prev, phone: phoneError }))
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setErrors(prev => ({ ...prev, email: validateField('email', value) }))
  }

  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== '')
    const hasEmptyRequired = !firstname || !lastname || !phone || !provider || !region || !city || !department
    setDisabled(hasErrors || hasEmptyRequired)
  }, [firstname, lastname, phone, provider, region, city, department, errors])

  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()
  const [confirmMessage, setConfirmMessage] = useState('')

  const cart = useAppSelector(state => state.cart.items)
  const user = useAppSelector(state => state.auth.user)

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleIncrement = (productId, size) => {
    const product = cart.find(item => item.productId === productId && item.size === size)
    if (product) {
      dispatch(incrementQuantity({ productId, size, quantity: product.quantity }))
    }
  }

  const handleDecrement = (productId, size) => {
    const product = cart.find(item => item.productId === productId && item.size === size)
    if (product && product.quantity > 1) {
      dispatch(decrementQuantity({ productId, size, quantity: product.quantity }))
    } else if (product && product.quantity === 1) {
      handleDeleteClick(productId, product.name, size)
    }
  }

  const handleDeleteClick = (productId, name, size) => {
    setConfirmMessage(`Ви впевнені, що хочете видалити "${name}" з кошика?`)
    openConfirmModal(() => {
      dispatch(removeFromCart({productId, size}))
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
    setOrder(prev => ({
      ...prev,
      user: { firstName: firstname, lastName: lastname, phone: phone, email: email },
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
      address: { provider: provider, region: region, city: city, department: department },
    }))
  }, [cart, city, department, email, firstname, lastname, phone, provider, region, totalPrice, totalQuantity])

  const handleSubmit = e => {
    e.preventDefault()
    const finalErrors = {
      firstname: validateField('firstname', firstname),
      lastname: validateField('lastname', lastname),
      phone: validateField('phone', phone),
      email: validateField('email', email),
    }
    if (Object.values(finalErrors).some(error => error !== '')) {
      setErrors(finalErrors)
      return
    }
    dispatch(createOrderThunk({ ...order, userId: user?.id }))
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
            {cart.map((item) => (
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
                  <div className={s.quantityButtons}>
                    <button
                    type="button"
                    className={s.quantityButton}
                    onClick={() => handleDecrement(item.productId, item.size)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className={s.quantityInput}
                    value={item.quantity}
                    disabled
                  />
                  <button
                    type="button"
                    className={s.quantityButton}
                    onClick={() => handleIncrement(item.productId, item.size)}
                  >
                    +
                  </button>
                    </div>
                  <button
                    type="button"
                    className={s.deleteButton}
                    onClick={() => handleDeleteClick(item.productId, item.name, item.size)}
                  >                   
                    <GiShoppingCart className={s.deleteIcon} />
                    <span className={s.deleteText}>Видалити</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={s.summary}>
            <p className={s.summaryQuantity}>Кількість: {totalQuantity} шт.</p>
            <p className={s.summaryPrice}>Сума: {totalPrice} ₴</p>
          </div>

          <form className={s.orderForm} onSubmit={handleSubmit}>
            <div className={s.formSection}>
              <h2 className={s.formTitle}>Дані для замовлення</h2>
              
              <div className={s.formGroup}>
                <label htmlFor="firstname" className={s.formLabel}>Ім'я</label>
                <input
                  type="text"
                  id="firstname"
                  className={`${s.formInput} ${errors.firstname ? s.formInputError : ''}`}
                  value={firstname}
                  onChange={handleFirstnameChange}
                  placeholder="Введіть ім'я"
                />
                {errors.firstname && <p className={s.errorMessage}>{errors.firstname}</p>}
              </div>

              <div className={s.formGroup}>
                <label htmlFor="lastname" className={s.formLabel}>Прізвище</label>
                <input
                  type="text"
                  id="lastname"
                  className={`${s.formInput} ${errors.lastname ? s.formInputError : ''}`}
                  value={lastname}
                  onChange={handleLastnameChange}
                  placeholder="Введіть прізвище"
                />
                {errors.lastname && <p className={s.errorMessage}>{errors.lastname}</p>}
              </div>

              <div className={s.formGroup}>
                <label htmlFor="phone" className={s.formLabel}>Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  className={`${s.formInput} ${errors.phone ? s.formInputError : ''}`}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0501234567 або +380501234567"
                />
                {errors.phone && <p className={s.errorMessage}>{errors.phone}</p>}
              </div>

              <div className={s.formGroup}>
                <label htmlFor="email" className={s.formLabel}>Email</label>
                <input
                  type="email"
                  id="email"
                  className={`${s.formInput} ${errors.email ? s.formInputError : ''}`}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="example@email.com"
                />
                {errors.email && <p className={s.errorMessage}>{errors.email}</p>}
              </div>
            </div>
          </form>
        </div>

        <div className={s.deliverySection}>
          <DeliverySelection onDeliverySelected={handleDeliverySelected} />
        </div>

        <button 
          type="submit" 
          className={`${s.submitButton} ${disabled ? s.submitButtonDisabled : ''}`}
          disabled={disabled}
          onClick={handleSubmit}
        >
          Оформити замовлення
        </button>
      </div>
    </div>
  )
}



// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { incrementQuantity, decrementQuantity } from '@/app/redux/features/cart/slices'
// import { createOrderThunk } from '@/app/redux/features/order/thunks'
// import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
// import s from './Cart.module.scss'
// import DeliverySelection from '../../components/DeliverySelection/DeliverySelection'
// import { GiShoppingCart } from 'react-icons/gi'
// import { removeFromCart } from '../../redux/features/cart/slices'
// import { useModalConfirm } from '../../components/hooks/useModalConfirm'
// import { ModalConfirm } from '../../components/utils/ModalConfirmation/ModalConfirm'


// export default function Cart() {
//   const dispatch = useAppDispatch()

//   const [order, setOrder] = useState({
//     user: {
//       firstame: '',
//       lastname: '',
//       phone: '',
//       email: '',
//     },
//     products: [],
//     address: { provider: '', region: '', city: '', department: '' },
//     totalPrice: 0,
//     totalQuantity: 0,
//   })

//   const [firstname, setFirstname] = useState('')
//   const [lastname, setLastname] = useState('')
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')

//   const [provider, setProvider] = useState('')
//   const [region, setRegion] = useState('')
//   const [city, setCity] = useState('')
//   const [department, setDepartment] = useState('')

//   const [disabled, setDisabled] = useState(true)
//   useEffect(() => {
//     if (firstname && lastname && phone && provider && region && city && department) {
//       setDisabled(false)
//     } else {
//       setDisabled(true)
//     }
//   }, [firstname, lastname, phone, provider, region, city, department])

//   const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()
//   const [confirmMessage, setConfirmMessage] = useState('')

//   const cart = useAppSelector(state => state.cart.items)

//   const user = useAppSelector(state => state.auth.user)

//   const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
//   const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

//   const handleIncrement = (productId, size) => {
//     const product = cart.find(item => item.productId === productId && item.size === size)

//     if (product) {
//       dispatch(incrementQuantity({ productId, size, quantity: product.quantity }))
//     }
//   }

//   const handleDecrement = (productId, size) => {
//     const product = cart.find(item => item.productId === productId && item.size === size)

//     if (product) {
//       dispatch(decrementQuantity({ productId, size, quantity: product.quantity }))
//     }
//   }

//   const handleDeliverySelected = deliveryInfo => {
//     setProvider(deliveryInfo.provider)
//     setRegion(deliveryInfo.region)
//     setCity(deliveryInfo.city)
//     setDepartment(deliveryInfo.department)
//   }

//   const handleDeleteClick = (productId, name, size) => {
//     const product = cart.find(item => item.productId === productId)
//     if (product) {
//       setConfirmMessage(`Ви впевнені, що хочете видалити "${name}" з кошика?`)
//       openConfirmModal(() => {
//         dispatch(removeFromCart({productId, size}))
//         setConfirmMessage('')
//       })
//     }
//   }

//   useEffect(() => {
//     setOrder(prev => ({
//       ...prev,
//       user: {
//         firstName: firstname,
//         lastName: lastname,
//         phone: phone,
//         email: email,
//       },
//       products: cart.map(item => ({
//         productId: item.productId,
//         size: item.size,
//         color: item.color,
//         quantity: item.quantity,
//         price: item.price,
//         name: item.name,
//         article: item.article,
//         image: item.image,
//       })),
//       totalPrice: totalPrice,
//       totalQuantity: totalQuantity,
//       address: {
//         provider: provider,
//         region: region,
//         city: city,
//         department: department,
//       },
//     }))
//   }, [
//     cart,
//     city,
//     department,
//     email,
//     firstname,
//     lastname,
//     order.email,
//     order.firstame,
//     order.lastname,
//     order.phone,
//     phone,
//     provider,
//     region,
//     totalPrice,
//     totalQuantity,
//   ])

//   const handleSubmit = e => {
//     e.preventDefault()
//     dispatch(createOrderThunk({ ...order, userId: user?.id }))
//   }

//   return (
//     <div className={s.wrapper}>
//       <div>
//         <ModalConfirm
//           isModalConfirmOpen={isModalConfirmOpen}
//           handleConfirm={handleConfirm}
//           closeConfirmModal={closeConfirmModal}
//           message={confirmMessage}
//         />
//       </div>

//       <div>
//         <h1 className={s.title}>Кошик</h1>

//         <div>
//           <ul className={s.list}>
//             {cart.map((item, index) => (
//               <li key={item.productId + item.size} className={s.card}>
//                 <Link href={`/${item.genderCategory}/${item.category}/${item.productId}`} rel="preload">
//                   <Image src={item.image} alt={item.name} width={200} height={300} className={s.img} priority />
//                 </Link>
//                 <p>{item.name}</p>
//                 <p>Арт: {item.article}</p>
//                 <p>{item.size}</p>
//                 <p>Колір: {item.color}</p>
//                 <p>Ціна: {item.price * item.quantity} ₴</p>

//                 <div>
//                   <button
//                     type="button"
//                     className={s.button}
//                     onClick={() => handleDecrement(item.productId, item.size)}
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     max="10"
//                     className={s.input}
//                     value={item.quantity}
//                     id="input"
//                     disabled
//                     name="input"
//                     data-size={item.size}
//                     data-product-id={item.productId}
//                   />
//                   <button
//                     type="button"
//                     className={s.button}
//                     onClick={() => handleIncrement(item.productId, item.size)}
//                   >
//                     +
//                   </button>
//                   <button
//                     type="button"
//                     className={s.button}
//                     onClick={() => handleDeleteClick(item.productId, item.name, item.size)}
//                   >
//                     <GiShoppingCart />
//                     <p>DELETE</p>
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           <div className={s.suma}>
//             <p>Кількість: {totalQuantity} шт.</p>
//             <p>Сума: {totalPrice} ₴</p>
//             </div>
//             <div className={s.total}>
//               <p>Дані для замовлення</p>
//               <label htmlFor="firstname">Ім&#39;я</label>
//               <input
//                 type="text"
//                 id="firstname"
//                 value={firstname}
//                 onChange={e => setFirstname(e.target.value)}
//                 placeholder="Ім'я"
//               />
//               <label htmlFor="lastname">Призвище</label>
//               <input
//                 type="text"
//                 id="lastname"
//                 value={lastname}
//                 onChange={e => setLastname(e.target.value)}
//                 placeholder="Призвище"
//               />
//               <label htmlFor="phone">Телефон</label>
//               <input
//                 type="text"
//                 id="phone"
//                 value={phone}
//                 onChange={e => setPhone(e.target.value)}
//                 placeholder="Телефон"
//               />
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="Email"
//               />
            
//           </div>
//         </div>

//         <div>
//           <DeliverySelection onDeliverySelected={handleDeliverySelected} />
//         </div>
//         <button disabled={disabled} type="submit" className={s.btn} onClick={handleSubmit}>
//           Оформити замовлення
//         </button>
//       </div>
//     </div>
//   )
// }
