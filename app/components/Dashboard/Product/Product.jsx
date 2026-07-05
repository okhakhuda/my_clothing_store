'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import {
  addProductThunk,
  updateProductThunk,
  removeProductThunk,
  fetchProductsThunk,
} from '@/app/redux/features/products/thunks'
import { fetchCategoryByMainSlugThunk } from '@/app/redux/features/categories/thunks'
import { fetchMainCategoryThunk } from '@/app/redux/features/mainCategories/thunks'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { IoAddCircleOutline } from 'react-icons/io5'
import { RxUpdate } from 'react-icons/rx'
import Image from 'next/image'
import Link from 'next/link'
import Loader from '../../Loader/Loader'
import { ModalProduct } from '../../utils/ModalProduct/ModalProduct'
import { ModalConfirm } from '../../utils/ModalConfirmation/ModalConfirm'
import { useModalConfirm } from '../../hooks/useModalConfirm'
import s from './Product.module.scss'

export const Product = () => {
  const mainCategories = useAppSelector(state => state.mainCategory.items)
  const categoryByMainSlug = useAppSelector(state => state.categoryByMainSlug.items)
  const productsSelector = useAppSelector(state => state.products.items)
  const isLoading = useAppSelector(state => state.products.isLoading)
  const dispatch = useAppDispatch()

  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [productData, setProductData] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [mainId, setMainId] = useState('all')
  const [categoryId, setCategoryId] = useState('all')

  const toggleModal = () => setIsModalOpen(prev => !prev)

  useEffect(() => {
    if (mainCategories.length === 0) dispatch(fetchMainCategoryThunk())
    if (productsSelector.length === 0) dispatch(fetchProductsThunk())
  }, [dispatch, mainCategories, productsSelector])

  useEffect(() => {
    if (mainId === 'all') return
    const mainSlug = mainCategories.find(m => m.id === mainId)?.slug
    if (mainSlug) dispatch(fetchCategoryByMainSlugThunk(mainSlug))
    setCategoryId('all')
  }, [mainId, mainCategories, dispatch])

  const products = productsSelector.filter(p => {
    if (mainId !== 'all' && p.genderCategory?.id !== mainId) return false
    if (categoryId !== 'all' && p.category?.id !== categoryId) return false
    return true
  })

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
    openConfirmModal(() => dispatch(removeProductThunk(productId)))
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

      {mainCategories?.length > 0 && (
        <div className={s.formGroup}>
          <label htmlFor="mainId" className={s.label}>
            Продукти за головною категорією
          </label>
          <select
            id="mainId"
            name="mainId"
            value={mainId}
            onChange={e => setMainId(e.target.value)}
            className={s.formControl}
          >
            <option value="all">Всі категорії</option>
            {mainCategories.map(el => (
              <option key={el.id} value={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {categoryByMainSlug?.length > 0 && mainId !== 'all' && (
        <div className={s.formGroup}>
          <label htmlFor="categoryId" className={s.label}>
            Продукти за категорією
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className={s.formControl}
          >
            <option value="all">Всі категорії</option>
            {categoryByMainSlug.map(el => (
              <option key={el.id} value={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        </div>
      )}

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
                    <Link href={`../../${product.genderCategory?.slug}/${product.category?.slug}/${product.id}`}>
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
