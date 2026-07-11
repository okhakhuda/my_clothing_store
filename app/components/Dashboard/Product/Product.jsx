'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import {
  addProductThunk,
  updateProductThunk,
  removeProductThunk,
  fetchProductsThunk,
  fetchProductsByMainCatThunk,
  fetchProductsByCatThunk,
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
import { Pagination } from '../../utils/Pagination/Pagination'
import s from './Product.module.scss'

export const Product = () => {
  const mainCategories = useAppSelector(state => state.mainCategory.items)
  const categoryByMainSlug = useAppSelector(state => state.categoryByMainSlug.items)

  const {
    items: allProducts,
    isLoading: allLoading,
    total: allTotal,
    limit: allLimit,
  } = useAppSelector(state => state.products)
  const {
    items: byMainProducts,
    isLoading: byMainLoading,
    total: byMainTotal,
    limit: byMainLimit,
  } = useAppSelector(state => state.productsByMainCat)
  const {
    items: byCatProducts,
    isLoading: byCatLoading,
    total: byCatTotal,
    limit: byCatLimit,
  } = useAppSelector(state => state.productsByCat)

  const dispatch = useAppDispatch()
  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [productData, setProductData] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [mainId, setMainId] = useState('all')
  const [mainSlug, setMainSlug] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [categorySlug, setCategorySlug] = useState('')
  const [page, setPage] = useState(1)

  // Визначаємо активний набір даних залежно від фільтра
  const isAll = mainId === 'all'
  const isByMain = mainId !== 'all' && categoryId === 'all'
  const isByCat = mainId !== 'all' && categoryId !== 'all'

  const products = isAll ? allProducts : isByMain ? byMainProducts : byCatProducts
  const isLoading = isAll ? allLoading : isByMain ? byMainLoading : byCatLoading
  const total = isAll ? allTotal : isByMain ? byMainTotal : byCatTotal
  const limit = isAll ? allLimit : isByMain ? byMainLimit : byCatLimit
  const totalPages = limit && total ? Math.ceil(total / limit) : 1

  const toggleModal = () => setIsModalOpen(!isModalOpen)

  useEffect(() => {
    if (mainCategories.length === 0) dispatch(fetchMainCategoryThunk())
  }, [dispatch, mainCategories])

  // Завантаження підкатегорій при зміні головної категорії
  useEffect(() => {
    if (mainId === 'all') return
    const found = mainCategories.find(m => m.id === mainId)
    if (found?.slug) {
      setMainSlug(found.slug)
      dispatch(fetchCategoryByMainSlugThunk(found.slug))
    }
    setCategoryId('all')
    setCategorySlug('')
  }, [mainId, mainCategories, dispatch])

  // Запит до бекенду при зміні фільтра або сторінки
  useEffect(() => {
    if (isAll) {
      dispatch(fetchProductsThunk({ page, limit: allLimit }))
    } else if (isByMain && mainSlug) {
      dispatch(fetchProductsByMainCatThunk({ slug: mainSlug, page, limit: byMainLimit }))
    } else if (isByCat && mainSlug && categorySlug) {
      dispatch(fetchProductsByCatThunk({ mainSlug, categorySlug, page, limit: byCatLimit }))
    }
  }, [
    dispatch,
    page,
    mainId,
    categoryId,
    mainSlug,
    categorySlug,
    isAll,
    isByMain,
    isByCat,
    allLimit,
    byMainLimit,
    byCatLimit,
  ])

  const handleChangeMain = e => {
    setMainId(e.target.value)
    setPage(1)
  }

  const handleChangeCategory = e => {
    const selectedId = e.target.value
    setCategoryId(selectedId)
    const found = categoryByMainSlug.find(c => c.id === selectedId)
    setCategorySlug(found?.slug || '')
    setPage(1)
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
          <select id="mainId" name="mainId" value={mainId} onChange={handleChangeMain} className={s.formControl}>
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
            onChange={handleChangeCategory}
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

      {products.length > 0 && (
        <>
          <p className={s.counter}>
            Всього продуктів: {total} · сторінка {page} з {totalPages}
          </p>

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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            goToPage={setPage}
            goNext={() => setPage(p => p + 1)}
            goPrev={() => setPage(p => p - 1)}
            hasNext={page < totalPages}
            hasPrev={page > 1}
          />
        </>
      )}
    </main>
  )
}
