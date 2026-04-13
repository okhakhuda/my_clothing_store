'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { addCategoryThunk, updateCategoryThunk } from '../../../redux/features/categories/thunks'
import { useModalConfirm } from '../../hooks/useModalConfirm'
import { ModalConfirm } from '../ModalConfirmation/ModalConfirm'
import s from './ModalCategory.module.scss'

export const ModalCategory = ({ categoryData = {}, isOpen, onClose, isEditing = false }) => {
  const dispatch = useAppDispatch()
  const mainCategories = useAppSelector(state => state.mainCategory.items)
  const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

  const [formData, setFormData] = useState({})
  const [previewImage, setPreviewImage] = useState('')
  const [mainCategoryId, setMainCategoryId] = useState('')

  // Ініціалізація при відкритті
  useEffect(() => {
    if (isOpen && mainCategories.length > 0) {
      const defaultMainId = categoryData.genderCategory || mainCategories[0]?.id || ''
      setMainCategoryId(defaultMainId)

      setFormData({
        id: categoryData.id || '',
        genderCategory: defaultMainId,
        title: categoryData.title || '',
        image: categoryData.image || '',
        newImage: null,
      })
      setPreviewImage('')
    }
  }, [isOpen, categoryData, mainCategories])

  // Обробники подій
  const handleMainCategoryChange = useCallback(e => {
    setMainCategoryId(e.target.value)
    setFormData(prev => ({ ...prev, genderCategory: e.target.value }))
  }, [])

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleImageUpload = useCallback(e => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
      setFormData(prev => ({ ...prev, newImage: file }))
    }
  }, [])

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()

      const formDataToSend = new FormData()
      formDataToSend.append('genderCategory', mainCategoryId)
      formDataToSend.append('title', formData.title)

      if (formData.newImage) {
        formDataToSend.append('image', formData.newImage)
      } else if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const submitAction = isEditing
        ? updateCategoryThunk({ id: formData.id, formData: formDataToSend })
        : addCategoryThunk(formDataToSend)

      openConfirmModal(() => {
        dispatch(submitAction).then(res => {
          if (res.payload?.status === 'success') {
            onClose()
          }
        })
      })
    },
    [formData, mainCategoryId, isEditing, dispatch, openConfirmModal, onClose],
  )

  const handleClose = useCallback(() => {
    setPreviewImage('')
    setFormData({})
    setMainCategoryId('')
    onClose()
  }, [onClose])

  if (!isOpen) return null

  const confirmMessage = isEditing ? `Оновити категорію "${formData.title}"?` : `Додати категорію "${formData.title}"?`

  return (
    <>
      <div className={s.modalOverlay} onClick={handleClose} aria-hidden="true" />

      <div className={s.modalContainer}>
        <header className={s.header}>
          <h2 className={s.title}>{isEditing ? 'Редагувати категорію' : 'Нова категорія'}</h2>
          <button className={s.closeBtn} onClick={handleClose} aria-label="Закрити модальне вікно">
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className={s.form}>
          <fieldset className={s.fieldset}>
            <div className={s.formGroup}>
              <label htmlFor="mainCategory" className={s.label}>
                Головна категорія *
              </label>
              <select
                id="mainCategory"
                name="genderCategory"
                value={mainCategoryId}
                onChange={handleMainCategoryChange}
                className={s.select}
                required
              >
                {mainCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.formGroup}>
              <label htmlFor="image" className={s.label}>
                Зображення
              </label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleImageUpload}
                className={s.fileInput}
                accept="image/*"
              />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="title" className={s.label}>
                Назва категорії *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className={s.input}
                placeholder="Введіть назву категорії"
                required
                maxLength={100}
              />
            </div>
          </fieldset>

          {/* Попередній перегляд нового зображення */}
          {previewImage && (
            <section className={s.previewSection}>
              <h3 className={s.sectionTitle}>Нове зображення</h3>
              <div className={s.imageWrapper}>
                <Image
                  src={previewImage}
                  alt="Попередній перегляд"
                  width={140}
                  height={140}
                  className={s.previewImage}
                />
              </div>
            </section>
          )}

          {/* Поточне зображення */}
          {formData.image && !previewImage && (
            <section className={s.currentImageSection}>
              <h3 className={s.sectionTitle}>Поточне зображення</h3>
              <div className={s.imageWrapper}>
                <Image
                  src={formData.image}
                  alt={formData.title}
                  width={140}
                  height={140}
                  className={s.currentImage}
                  priority
                />
              </div>
            </section>
          )}

          <div className={s.actions}>
            <button type="submit" className={s.submitBtn} disabled={!formData.title?.trim() || !mainCategoryId}>
              {isEditing ? 'Оновити категорію' : 'Додати категорію'}
            </button>
            <button type="button" className={s.cancelBtn} onClick={handleClose}>
              Скасувати
            </button>
          </div>
        </form>
      </div>

      <ModalConfirm
        isModalConfirmOpen={isModalConfirmOpen}
        handleConfirm={handleConfirm}
        closeConfirmModal={closeConfirmModal}
        message={confirmMessage}
      />
    </>
  )
}

// import Image from 'next/image'
// import React, { useEffect, useState, useCallback } from 'react'
// import { ModalConfirm } from '../ModalConfirmation/ModalConfirm'
// import { useModalConfirm } from '../../hooks/useModalConfirm'
// import { useAppDispatch } from '../../../redux/hooks'

// import { addCategoryThunk, updateCategoryThunk } from '../../../redux/features/categories/thunks'
// import { useAppSelector } from '../../../redux/hooks'
// import s from './ModalCategory.module.scss'

// export const ModalCategory = ({ categoryData, isOpen, onClose, isEditing }) => {
//   const mainCategories = useAppSelector(state => state.mainCategory.items)
//   console.log('mainCategories', mainCategories)

//   const [formCategoryData, setFormCategoryData] = useState(categoryData)
//   const [previewImage, setPreviewImage] = useState([])
//   const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()
//   const [mainId, setMainId] = useState(mainCategories[0]?.id || '')

//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (mainCategories) {
//       setMainId(mainCategories[0]?.id)
//     }
//   }, [mainCategories])

//   useEffect(() => {
//     if (categoryData) {
//       setFormCategoryData(prevProduct => ({
//         ...prevProduct,
//         id: categoryData?.id || '',
//         genderCategory: categoryData?.genderCategory || mainId || '',
//         title: categoryData?.title || '',
//         image: categoryData?.image || [],
//         newImage: {},
//       }))
//     }
//   }, [categoryData, mainId])

//   console.log('formCategoryData', formCategoryData)

//   const handleChangeMain = e => {
//     setMainId(e.target.value)
//   }

//   const handleInputChange = e => {
//     const { name, value } = e.target
//     setFormCategoryData({ ...formCategoryData, [name]: value })
//   }

//   const handleImageUpload = e => {
//     const file = e.target.files[0]

//     const newPreviewImage = URL.createObjectURL(file)
//     setPreviewImage(newPreviewImage)

//     setFormCategoryData(prevProduct => ({
//       ...prevProduct,
//       newImage: file,
//     }))
//   }

//   const clearModal = useCallback(() => {
//     setFormCategoryData(prevState => ({
//       ...prevState,
//       genderCategory: categoryData?.genderCategory || '',
//       title: categoryData?.title || '',
//       image: categoryData?.image || [],
//       newImage: {},
//     }))
//   }, [categoryData])

//   const onSubmit = (id, formData) => {
//     if (isEditing) {
//       openConfirmModal(() => {
//         dispatch(updateCategoryThunk({ id: id, formData })).then(res => {
//           if (res.payload.status === 'success') {
//             clearModal()
//             onClose()
//           }
//         })
//       })
//     } else {
//       dispatch(addCategoryThunk(formData)).then(res => {
//         if (res.payload.status === 'success') {
//           clearModal()
//           onClose()
//         }
//       })
//     }
//   }

//   const handleSubmit = e => {
//     e.preventDefault()
//     const { title, image, newImage, id } = formCategoryData
//     const formData = new FormData()
//     formData.append('genderCategory', mainId)
//     formData.append('title', title)
//     if (newImage.name) {
//       formData.append('image', newImage)
//     } else {
//       formData.append('image', image)
//     }
//     onSubmit(id, formData)
//   }

//   useEffect(() => {
//     if (isOpen) {
//       setPreviewImage([])
//       setFormCategoryData(prevState => ({
//         ...prevState,
//         newImage: {},
//       }))
//     }
//   }, [isOpen])

//   if (!isOpen) return null

//   return (
//     <>
//       <div onClick={onClose} className={s.modal_overlay}></div>
//       <div className={s.modal}>
//         <form onSubmit={handleSubmit}>
//           <div className={s.form_group}>
//             <label>Головна категорія</label>
//             <select name="mainId" value={mainId} onChange={handleChangeMain} className={s.form_control}>
//               {mainCategories?.map(el => (
//                 <option key={el.id} value={el.id} className={s.option}>
//                   {el.title}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className={s.form_group}>
//             <label>Зображення</label>
//             <input type="file" name="image" onChange={handleImageUpload} className={s.form_control} />
//           </div>
//           {previewImage.length > 0 && (
//             <div>
//               <p className={s.preview_text}>Нове зображення:</p>
//               <div>
//                 <Image className={s.image_preview} src={previewImage} alt="Preview" width={100} height={100} />
//               </div>
//             </div>
//           )}
//           {formCategoryData?.image?.length > 0 && (
//             <div className={s.image_preview}>
//               <Image
//                 src={formCategoryData?.image}
//                 alt={formCategoryData?.title}
//                 className={previewImage.length > 0 ? s.image_grey : s.image}
//                 priority={true}
//                 width={100}
//                 height={100}
//               />
//             </div>
//           )}
//           <div className={s.form_group}>
//             <label>Назва</label>
//             <input
//               type="text"
//               name="title"
//               value={formCategoryData?.title}
//               onChange={handleInputChange}
//               className={s.form_control}
//             />
//           </div>
//           <button type="submit" className={s.btn}>
//             {isEditing ? 'Оновити категорію' : 'Додати категорію'}
//           </button>
//           <button type="button" onClick={onClose}>
//             Скасувати
//           </button>
//         </form>
//       </div>
//       <ModalConfirm
//         isModalConfirmOpen={isModalConfirmOpen}
//         handleConfirm={handleConfirm}
//         closeConfirmModal={closeConfirmModal}
//         message={
//           isEditing
//             ? `Ви впевнені, що хочете оновити категорію ${formCategoryData?.title}?`
//             : `Ви впевнені, що хочете додати категорію ${formCategoryData?.title}?`
//         }
//       />
//     </>
//   )
// }
