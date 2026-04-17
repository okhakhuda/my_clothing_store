'use client'

import React, { useEffect, useState, useCallback, useMemo, use } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchCategoryByMainSlugThunk } from '../../../redux/features/categories/thunks'
import { removeProductImageThunk } from '../../../redux/features/products/thunks'
import Image from 'next/image'
import allSizes from '../../../sizes.json'
import { useModalConfirm } from '../../hooks/useModalConfirm'
import { ModalConfirm } from '../ModalConfirmation/ModalConfirm'
import s from './ModalProduct.module.scss'

export const ModalProduct = ({ isOpen, onClose, onSubmit, productData = {}, isEditing = false }) => {
  const dispatch = useAppDispatch()
  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

  const mainCategories = useAppSelector(state => state.mainCategory.items)
  const categories = useAppSelector(state => state.categoryByMainSlug.items)

  const [formData, setFormData] = useState({})
  const [mainId, setMainId] = useState('')
  const [mainSlug, setMainSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sizesPrev, setSizesPrev] = useState(Object.values(allSizes))
  const [previewImages, setPreviewImages] = useState([])

  // Ініціалізація форми при відкритті модалки
  useEffect(() => {
    if (isOpen && productData) {
      setFormData({
        id: productData.id || '',
        mainCategory: productData.genderCategory?.id || '',
        category: productData.category?.id || '',
        name: productData.name || '',
        description: productData.description || '',
        sizeList: productData.sizeList || [],
        color: productData.color || '',
        quantity: productData.quantity || '',
        price: productData.price || '',
        productImage: productData.image || [],
        newImage: [],
      })

      setPreviewImages([])
    }
  }, [isOpen, productData, mainCategories, categories])

  // Завантаження категорій при зміні mainSlug
  useEffect(() => {
    if (mainSlug && isOpen) {
      dispatch(fetchCategoryByMainSlugThunk(mainSlug))
    }
  }, [mainSlug, dispatch, isOpen])

  useEffect(() => {
    if (mainCategories.length > 0 && isOpen) {
      setMainId(productData?.genderCategory?.id || mainCategories[0]?.id || '')
      setMainSlug(productData?.genderCategory?.slug || mainCategories[0]?.slug || '')
    }
  }, [mainCategories, productData?.genderCategory?.id, productData?.genderCategory?.slug, isOpen])

  // Оновлення categoryId при завантаженні категорій
  useEffect(() => {
    if (categories.length > 0 && isOpen) {
      setCategoryId(productData?.category?.id || categories[0]?.id || '')
    }
  }, [categories, productData?.category?.id, isOpen])

  // Обробники подій
  const handleMainCategoryChange = useCallback(
    e => {
      const id = e.target.value
      const mainCategory = mainCategories.find(cat => cat.id === id)
      setMainId(id)
      setMainSlug(mainCategory?.slug || '')
      setCategoryId('')
    },
    [mainCategories],
  )

  const handleCategoryChange = useCallback(
    e => {
      setCategoryId(e.target.value)
      const category = categories.find(category => category.id === e.target.value)
      setCategoryId(category.id)
    },
    [categories],
  )

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSizeChange = useCallback(size => {
    setFormData(prev => ({
      ...prev,
      sizeList: prev.sizeList?.includes(size)
        ? prev.sizeList.filter(s => s !== size)
        : [...(prev.sizeList || []), size],
    }))
  }, [])

  const isSizeChecked = useCallback(
    size => {
      return formData.sizeList?.includes(size) || false
    },
    [formData.sizeList],
  )

  const handleImageUpload = useCallback(e => {
    const files = Array.from(e.target.files)
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))

    setPreviewImages(prev => [...prev, ...newPreviewUrls])
    setFormData(prev => ({
      ...prev,
      newImage: prev.newImage ? [...prev.newImage, ...files] : files,
    }))
  }, [])

  const handleExistingImageDelete = useCallback(
    (id, cloudId) => {
      openConfirmModal(() => {
        dispatch(removeProductImageThunk({ id, idFileCloud: cloudId })).then(({ payload }) => {
          setFormData(prev => ({
            ...prev,
            productImage: payload.updateProduct.image || [],
          }))
        })
      })
    },
    [dispatch, openConfirmModal],
  )

  const handlePreviewImageDelete = useCallback(
    (url, index) => {
      openConfirmModal(() => {
        setPreviewImages(prev => prev.filter(img => img !== url))

        const newImages = formData.newImage?.filter((_, i) => i !== index) || []
        setFormData(prev => ({ ...prev, newImage: newImages }))
      })
    },
    [formData.newImage, openConfirmModal],
  )

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()

      const formDataToSend = new FormData()
      formDataToSend.append('genderCategory', mainId)
      formDataToSend.append('category', categoryId)
      formDataToSend.append('name', formData.name || '')
      formDataToSend.append('quantity', formData.quantity || '')
      formDataToSend.append('color', formData.color || '')
      formDataToSend.append('price', formData.price || '')

      formDataToSend.append('description', formData.description)
      for (const key of Object.keys(formData.newImage)) {
        formDataToSend.append('image', formData.newImage[key])
      }
      for (const size of formData.sizeList) {
        formDataToSend.append('sizeList', size)
      }
      onSubmit(formData.id, formDataToSend)
      onClose()
    },
    [formData, mainId, categoryId, onSubmit, onClose],
  )

  if (!isOpen) return null

  return (
    <>
      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        handleConfirm={handleConfirm}
        closeConfirmModal={closeConfirmModal}
      />

      <div className={s.modalOverlay} onClick={onClose} />

      <div className={s.modal}>
        <div className={s.header}>
          <h2 className={s.title}>{isEditing ? 'Редагувати товар' : 'Додати новий товар'}</h2>
          <button className={s.closeBtn} onClick={onClose} aria-label="Закрити модальне вікно">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={s.form}>
          <fieldset className={s.fieldset}>
            <div className={s.formGroup}>
              <label htmlFor="mainCategory" className={s.label}>
                Головна категорія
              </label>
              <select
                id="mainCategory"
                name="mainCategory"
                value={mainId}
                onChange={handleMainCategoryChange}
                className={s.select}
                required
              >
                {mainCategories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.formGroup}>
              <label htmlFor="category" className={s.label}>
                Категорія
              </label>
              <select
                id="category"
                name="category"
                value={categoryId}
                onChange={handleCategoryChange}
                className={s.select}
                disabled={!categories.length}
                required
              >
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.formGroup}>
              <label htmlFor="images" className={s.label}>
                Зображення товару
              </label>
              <input
                id="images"
                type="file"
                name="images"
                onChange={handleImageUpload}
                className={s.fileInput}
                multiple
                accept="image/*"
              />
            </div>
          </fieldset>

          {/* Нові зображення */}
          {previewImages.length > 0 && (
            <section className={s.imagesSection}>
              <h3 className={s.sectionTitle}>Нові зображення</h3>
              <ul className={s.imagesList} role="list">
                {previewImages.map((imageUrl, index) => (
                  <li key={imageUrl} className={s.imageItem}>
                    <div className={s.imageWrapper}>
                      <Image
                        src={imageUrl}
                        alt="Попередній перегляд"
                        width={80}
                        height={80}
                        className={s.previewImage}
                      />
                    </div>
                    <button
                      type="button"
                      className={s.deleteBtn}
                      onClick={() => handlePreviewImageDelete(imageUrl, index)}
                      aria-label="Видалити зображення"
                    >
                      Видалити
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Існуючі зображення */}
          {formData.productImage?.length > 0 && (
            <section className={s.imagesSection}>
              <h3 className={s.sectionTitle}>Поточні зображення</h3>
              <ul className={s.imagesList} role="list">
                {formData.productImage.map((image, index) => (
                  <li key={image.id || index} className={s.imageItem}>
                    <div className={s.imageWrapper}>
                      <Image
                        src={image.url}
                        alt="Зображення товару"
                        width={80}
                        height={80}
                        className={s.previewImage}
                      />
                    </div>
                    <button
                      type="button"
                      className={s.deleteBtn}
                      onClick={() => handleExistingImageDelete(productData.id, image.idFileCloud)}
                      aria-label="Видалити зображення з сервера"
                    >
                      Видалити
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <fieldset className={s.fieldset}>
            <div className={s.formGroup}>
              <label htmlFor="name" className={s.label}>
                Назва товару *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className={s.input}
                required
              />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="description" className={s.label}>
                Опис
              </label>
              <input
                id="description"
                type="text"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className={s.input}
              />
            </div>

            <div className={s.formGroup}>
              <label className={s.label}>Доступні розміри</label>
              <div className={s.sizesGrid} role="group">
                {sizesPrev.map((size, index) => (
                  <label key={size} className={s.sizeLabel}>
                    <input
                      type="checkbox"
                      name="sizeList"
                      value={size}
                      checked={isSizeChecked(size)}
                      onChange={() => handleSizeChange(size)}
                      className={s.sizeCheckbox}
                    />
                    <span className={s.sizeText}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label htmlFor="color" className={s.label}>
                  Колір
                </label>
                <input
                  id="color"
                  type="text"
                  name="color"
                  value={formData.color || ''}
                  onChange={handleInputChange}
                  className={s.input}
                />
              </div>

              <div className={s.formGroup}>
                <label htmlFor="quantity" className={s.label}>
                  Кількість *
                </label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity || ''}
                  onChange={handleInputChange}
                  className={s.input}
                  min="0"
                  required
                />
              </div>

              <div className={s.formGroup}>
                <label htmlFor="price" className={s.label}>
                  Ціна *
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  className={s.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </fieldset>

          <div className={s.actions}>
            <button type="submit" className={s.submitBtn}>
              {isEditing ? 'Оновити товар' : 'Додати товар'}
            </button>
            <button type="button" className={s.cancelBtn} onClick={onClose}>
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
