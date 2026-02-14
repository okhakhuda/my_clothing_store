import Image from 'next/image'
import React, { useEffect, useState, useCallback } from 'react'
import { ModalConfirm } from '../ModalConfirmation/ModalConfirm'
import { useModalConfirm } from '../../hooks/useModalConfirm'
import { useAppDispatch } from '../../../redux/hooks'

import { addCategoryThunk, updateCategoryThunk } from '../../../redux/features/categories/thunks'
import { useAppSelector } from '../../../redux/hooks'
import s from './ModalCategory.module.scss'

export const ModalCategory = ({ categoryData, isOpen, onClose, isEditing }) => {
  const mainCategories = useAppSelector(state => state.mainCategory.items)
  console.log('mainCategories', mainCategories)

  const [formCategoryData, setFormCategoryData] = useState(categoryData)
  const [previewImage, setPreviewImage] = useState([])
  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()
  const [mainId, setMainId] = useState(mainCategories[0]?.id || '')

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (mainCategories) {
      setMainId(mainCategories[0]?.id)
    }
  }, [mainCategories])

  useEffect(() => {
    if (categoryData) {
      setFormCategoryData(prevProduct => ({
        ...prevProduct,
        id: categoryData?.id || '',
        genderCategory: categoryData?.genderCategory || mainId || '',
        title: categoryData?.title || '',
        image: categoryData?.image || [],
        newImage: {},
      }))
    }
  }, [categoryData, mainId])

  console.log('formCategoryData', formCategoryData)

  const handleChangeMain = e => {
    setMainId(e.target.value)
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormCategoryData({ ...formCategoryData, [name]: value })
  }

  const handleImageUpload = e => {
    const file = e.target.files[0]

    const newPreviewImage = URL.createObjectURL(file)
    setPreviewImage(newPreviewImage)

    setFormCategoryData(prevProduct => ({
      ...prevProduct,
      newImage: file,
    }))
  }

  const clearModal = useCallback(() => {
    setFormCategoryData(prevState => ({
      ...prevState,
      genderCategory: categoryData?.genderCategory || '',
      title: categoryData?.title || '',
      image: categoryData?.image || [],
      newImage: {},
    }))
  }, [categoryData])

  const onSubmit = (id, formData) => {
    if (isEditing) {
      openConfirmModal(() => {
        dispatch(updateCategoryThunk({ id: id, formData })).then(res => {
          if (res.payload.status === 'success') {
            clearModal()
            onClose()
          }
        })
      })
    } else {
      dispatch(addCategoryThunk(formData)).then(res => {
        if (res.payload.status === 'success') {
          clearModal()
          onClose()
        }
      })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    const { title, image, newImage, id } = formCategoryData
    const formData = new FormData()
    formData.append('genderCategory', mainId)
    formData.append('title', title)
    if (newImage.name) {
      formData.append('image', newImage)
    } else {
      formData.append('image', image)
    }
    onSubmit(id, formData)
  }

  useEffect(() => {
    if (isOpen) {
      setPreviewImage([])
      setFormCategoryData(prevState => ({
        ...prevState,
        newImage: {},
      }))
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div onClick={onClose} className={s.modal_overlay}></div>
      <div className={s.modal}>
        <form onSubmit={handleSubmit}>
          <div className={s.form_group}>
            <label>Головна категорія</label>
            <select name="mainId" value={mainId} onChange={handleChangeMain} className={s.form_control}>
              {mainCategories?.map(el => (
                <option key={el.id} value={el.id} className={s.option}>
                  {el.title}
                </option>
              ))}
            </select>
          </div>

          <div className={s.form_group}>
            <label>Зображення</label>
            <input type="file" name="image" onChange={handleImageUpload} className={s.form_control} />
          </div>
          {previewImage.length > 0 && (
            <div>
              <p className={s.preview_text}>Нове зображення:</p>
              <div>
                <Image className={s.image_preview} src={previewImage} alt="Preview" width={100} height={100} />
              </div>
            </div>
          )}
          {formCategoryData?.image?.length > 0 && (
            <div className={s.image_preview}>
              <Image
                src={formCategoryData?.image}
                alt={formCategoryData?.title}
                className={previewImage.length > 0 ? s.image_grey : s.image}
                priority={true}
                width={100}
                height={100}
              />
            </div>
          )}
          <div className={s.form_group}>
            <label>Назва</label>
            <input
              type="text"
              name="title"
              value={formCategoryData?.title}
              onChange={handleInputChange}
              className={s.form_control}
            />
          </div>
          <button type="submit" className={s.btn}>
            {isEditing ? 'Оновити категорію' : 'Додати категорію'}
          </button>
          <button type="button" onClick={onClose}>
            Скасувати
          </button>
        </form>
      </div>
      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        handleConfirm={handleConfirm}
        closeConfirmModal={closeConfirmModal}
        message={
          isEditing
            ? `Ви впевнені, що хочете оновити категорію ${formCategoryData?.title}?`
            : `Ви впевнені, що хочете додати категорію ${formCategoryData?.title}?`
        }
      />
    </>
  )
}
