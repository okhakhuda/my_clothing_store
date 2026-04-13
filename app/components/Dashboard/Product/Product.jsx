'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { addProductThunk, updateProductThunk, removeProductThunk } from '@/app/redux/features/products/thunks'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { IoAddCircleOutline } from 'react-icons/io5'
import { RxUpdate } from 'react-icons/rx'
import Image from 'next/image'
import Link from 'next/link'
import Loader from '@/app/components/Loader/Loader'
import { ModalProduct } from '../../utils/ModalProduct/ModalProduct'
import { ModalConfirm } from '../../utils/ModalConfirmation/ModalConfirm'
import { useModalConfirm } from '../../hooks/useModalConfirm'
import s from './Product.module.scss'

export const Product = () => {
  const products = useAppSelector(state => state.products.items)
  const isLoading = useAppSelector(state => state.products.isLoading)
  const dispatch = useAppDispatch()

  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [productData, setProductData] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleAddProduct = () => {
    setIsEditing(false)
    setProductData({
      mainCategory: '',
      category: '',
      name: '',
      description: '',
      sizeList: [],
      color: '',
      quantity: '',
      price: '',
      productImage: [],
    })
    toggleModal()
  }

  const handleEditProduct = product => {
    setIsEditing(true)
    setProductData(product)
    toggleModal()
  }

  const handleDeleteProduct = (productId, name) => {
    setConfirmMessage(`Ви впевнені, що хочете видалити ${name}?`)
    openConfirmModal(() => {
      dispatch(removeProductThunk(productId))
    })
  }

  const handleSubmit = (id, formData) => {
    if (isEditing) {
      dispatch(updateProductThunk({ id, formData }))
    } else {
      dispatch(addProductThunk(formData))
    }
    toggleModal()
    setProductData(null)
  }

  return (
    <main className={s.main}>
      <header className={s.header}>
        <h1>Продукти</h1>
        <button type="button" className={s.addButton} onClick={handleAddProduct}>
          Додати продукт
          <span className={s.addIcon}>
            <IoAddCircleOutline />
          </span>
        </button>
      </header>

      <ModalProduct
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSubmit={handleSubmit}
        productData={productData}
        isEditing={isEditing}
      />

      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        handleConfirm={handleConfirm}
        closeConfirmModal={closeConfirmModal}
        message={confirmMessage}
      />

      {isLoading && <Loader />}

      {products?.length > 0 && (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Фото</th>
                <th scope="col">Назва</th>
                <th scope="col">Ціна</th>
                <th scope="col">Оновити</th>
                <th scope="col">Видалити</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <th scope="row">
                    <Link
                      href={`../../${product.genderCategory?.slug}/${product.category?.slug}/${product.id}`}
                      key={product.id}
                    >
                      <Image
                        src={product.image?.[0]?.url || '/placeholder.svg'}
                        alt="product"
                        width={20}
                        height={20}
                        className={s.image}
                      />
                    </Link>
                  </th>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <button type="button" className={s.actionButton} onClick={() => handleEditProduct(product)}>
                      <RxUpdate />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={s.actionButton}
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                    >
                      <RiDeleteBin2Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

// 'use client'

// import { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
// import { addProductThunk, updateProductThunk, removeProductThunk } from '@/app/redux/features/products/thunks'
// import { useState } from 'react'
// import { RiDeleteBin2Line } from 'react-icons/ri'
// import { IoAddCircleOutline } from 'react-icons/io5'
// import { RxUpdate } from 'react-icons/rx'
// import Image from 'next/image'
// import s from './Product.module.scss'
// import { ModalProduct } from '../../utils/ModalProduct/ModalProduct'
// import Loader from '../../Loader/Loader'

// import { useModalConfirm } from '../../hooks/useModalConfirm'
// import { ModalConfirm } from '../../utils/ModalConfirmation/ModalConfirm'

// export const Product = () => {
//   const products = useAppSelector(state => state.products.items)
//   const isLoading = useAppSelector(state => state.products.isLoading)

//   const dispatch = useAppDispatch()

//   const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [productData, setProductData] = useState({})
//   const [confirmMessage, setConfirmMessage] = useState('')

//   const toggleModal = () => {
//     setIsModalOpen(!isModalOpen)
//   }

//   const handleAddProduct = () => {
//     setIsEditing(false)
//     setProductData({
//       mainCategory: '',
//       category: '',
//       name: '',
//       description: '',
//       sizeList: [],
//       color: '',
//       quantity: '',
//       price: '',
//       productImage: [],
//     })
//     toggleModal()
//   }

//   const handleEditProduct = product => {
//     setIsEditing(true)
//     setProductData(product)
//     toggleModal()
//   }

//   const handleDeleteProduct = (productId, name) => {
//     setConfirmMessage(`Ви впевнені, що хочете видалити ${name}?`)
//     openConfirmModal(() => {
//       dispatch(removeProductThunk(productId))
//       setConfirmMessage('')
//     })
//   }

//   const handleSubmit = (id, formData) => {
//     if (isEditing) {
//       dispatch(updateProductThunk({ id: id, formData }))
//     } else {
//       dispatch(addProductThunk(formData))
//     }
//   }

//   // Expected server HTML to contain a matching <div> in <div>. Error Component Stack

//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) return null

//   return (
//     <>
//       <button type="button" onClick={handleAddProduct}>
//         Додати продукт
//         <span>
//           <IoAddCircleOutline />
//         </span>
//       </button>

//       <ModalProduct
//         isOpen={isModalOpen}
//         onClose={toggleModal}
//         onSubmit={handleSubmit}
//         productData={productData}
//         isEditing={isEditing}
//       />

//       <ModalConfirm
//         isModalConfirmOpen={isModalConfirmOpen}
//         handleConfirm={handleConfirm}
//         closeConfirmModal={closeConfirmModal}
//         message={confirmMessage}
//       />

//       {isLoading && <Loader />}

//       {products && (
//         <div>
//           <table className={s.table_productTable}>
//             <thead>
//               <tr>
//                 <th scope="col">Фото</th>
//                 <th scope="col">Назва</th>
//                 <th scope="col">Ціна</th>
//                 <th scope="col">Оновити</th>
//                 <th scope="col">Видалити</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products &&
//                 products.map(product => (
//                   <tr key={product.id}>
//                     <th scope="row">
//                       <Image
//                         className={s.image}
//                         src={product?.image[0]?.url}
//                         alt="product"
//                         width="20"
//                         height="20"
//                         sizes="100vw"
//                         priority={true}
//                       />
//                     </th>
//                     <td>{product.name}</td>
//                     <td>{product.price}</td>
//                     <td>
//                       <button type="button" className={s.button} onClick={() => handleEditProduct(product)}>
//                         <RxUpdate />
//                       </button>
//                     </td>
//                     <td>
//                       <button
//                         type="button"
//                         className={s.button}
//                         onClick={() => handleDeleteProduct(product.id, product.name)}
//                       >
//                         <RiDeleteBin2Line />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </>
//   )
// }
