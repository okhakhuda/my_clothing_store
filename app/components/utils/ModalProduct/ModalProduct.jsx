'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
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

      setMainId(productData.genderCategory?.id || mainCategories[0]?.id || '')
      setMainSlug(productData.genderCategory?.slug || mainCategories[0]?.slug || '')
      setCategoryId(productData.category?.id || categories[0]?.id || '')
      setPreviewImages([])
    }
  }, [isOpen, productData, mainCategories, categories])

  // Завантаження категорій при зміні mainSlug
  useEffect(() => {
    if (mainSlug && isOpen) {
      dispatch(fetchCategoryByMainSlugThunk(mainSlug))
    }
  }, [mainSlug, dispatch, isOpen])

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

  const handleCategoryChange = useCallback(e => {
    setCategoryId(e.target.value)
  }, [])

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
      formDataToSend
        .append(
          'description',
          formData.description || '',
        )(
          // Додаємо розміри
          formData.sizeList || [],
        )
        .forEach(size => {
          formDataToSend.append('sizeList', size)
        })(
          // Додаємо нові зображення
          formData.newImage || [],
        )
        .forEach(image => {
          formDataToSend.append('image', image)
        })

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
                {mainCategories.map(category => (
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
                {categories.map(category => (
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

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
// import { fetchCategoryByMainSlugThunk } from '../../../redux/features/categories/thunks'
// import { removeProductImageThunk } from '../../../redux/features/products/thunks'
// import Image from 'next/image'
// import allSizes from '../../../sizes.json'
// import { useModalConfirm } from '../../hooks/useModalConfirm'
// import { ModalConfirm } from '../ModalConfirmation/ModalConfirm'
// import s from './ModalProduct.module.scss'

// export const ModalProduct = ({ isOpen, onClose, onSubmit, productData, isEditing }) => {
//   const dispatch = useAppDispatch()

//   const { isModalConfirmOpen, openConfirmModal, closeConfirmModal, handleConfirm } = useModalConfirm()

//   const [formProductData, setFormProductData] = useState(productData)
//   console.log(productData)

//   const mainCategories = useAppSelector(state => state.mainCategory.items)
//   const categories = useAppSelector(state => state.categoryByMainSlug.items)

//   const [mainId, setMainId] = useState('')
//   const [mainSlug, setMainSlug] = useState('')
//   const [categoryId, setCategoryId] = useState('')
//   const [sizesPrev, setSizesPrev] = useState(Object.values(allSizes))
//   const [previewImage, setPreviewImage] = useState([])

//   useEffect(() => {
//     if (mainCategories.length > 0) {
//       setMainSlug(productData?.genderCategory?.slug || mainCategories[0]?.slug)
//       setMainId(productData?.genderCategory?.id || mainCategories[0]?.id)
//     }
//   }, [mainCategories, productData?.genderCategory?.id, productData?.genderCategory?.slug])

//   useEffect(() => {
//     if (mainSlug) {
//       dispatch(fetchCategoryByMainSlugThunk(mainSlug))
//     }
//   }, [dispatch, mainSlug])

//   useEffect(() => {
//     if (categories.length > 0) {
//       setCategoryId(productData?.category?.id || categories[0]?.id)
//     }
//   }, [dispatch, categories, productData?.category?.id])

//   const handleChangeMain = e => {
//     setMainId(e.target.value)
//     const mainCategory = mainCategories.find(mainCategory => mainCategory.id === e.target.value)
//     setMainSlug(mainCategory.slug)
//   }

//   const handleChangeCategory = e => {
//     setCategoryId(e.target.value)
//     const category = categories.find(category => category.id === e.target.value)
//     setCategoryId(category.id)
//   }

//   const handleInputChange = e => {
//     const { name, value } = e.target
//     setFormProductData({ ...formProductData, [name]: value })
//   }

//   const handleInputSizeChange = e => {
//     const { value } = e.target
//     const isSelected = formProductData?.sizeList.includes(value)

//     if (isSelected) {
//       setFormProductData(prevProduct => ({
//         ...prevProduct,
//         sizeList: prevProduct.sizeList.filter(size => size !== value),
//       }))
//     } else {
//       setFormProductData(prevProduct => ({
//         ...prevProduct,
//         sizeList: [...prevProduct.sizeList, value],
//       }))
//     }
//   }

//   const checkedSize = el => {
//     return formProductData?.sizeList?.includes(el)
//   }

//   const handleImageUpload = e => {
//     const { files } = e.target

//     // Перетворюємо FileList у масив
//     const fileArray = Array.from(files)

//     const newPreviewImages = fileArray.map(file => URL.createObjectURL(file))
//     setPreviewImage(prevImages => [...prevImages, ...newPreviewImages])

//     setFormProductData(prevData => ({
//       ...prevData,
//       newImage: prevData.newImage ? [...prevData.newImage, ...fileArray] : fileArray,
//     }))
//   }

//   const handleImageDelete = (id, idFileCloud) => {
//     openConfirmModal(() => {
//       dispatch(removeProductImageThunk({ id, idFileCloud })).then(data =>
//         setFormProductData({ ...formProductData, productImage: data.payload.updateProduct.image }),
//       )
//     })
//   }

//   const handlePreviewImageDelete = (file, index) => {
//     openConfirmModal(() => {
//       const newPreviewImage = previewImage.filter(el => el !== file)
//       setPreviewImage(newPreviewImage)

//       handleNewImageDelete(index)
//     })
//   }

//   const handleNewImageDelete = index => {
//     const newImage = formProductData.newImage.filter((el, i) => i !== index)
//     setFormProductData({ ...formProductData, newImage })
//   }

//   useEffect(() => {
//     if (productData) {
//       setFormProductData(prevProduct => ({
//         ...prevProduct,
//         id: productData?.id || '',
//         mainCategory: productData?.genderCategory?.id || mainId,
//         category: productData?.category?.id || categoryId,
//         name: productData?.name || '',
//         description: productData?.description || '',
//         sizeList: productData?.sizeList || [],
//         color: productData?.color || '',
//         quantity: productData?.quantity || '',
//         price: productData?.price || '',
//         productImage: productData?.image || [],
//         newImage: [],
//       }))
//     }
//   }, [categoryId, mainId, productData])

//   const handleSubmit = e => {
//     e.preventDefault()

//     const { name, quantity, color, sizeList, price, description, newImage, id } = formProductData
//     const formData = new FormData()
//     formData.append('genderCategory', mainId)
//     formData.append('category', categoryId)
//     formData.append('name', name)
//     formData.append('quantity', quantity)
//     for (const size of sizeList) {
//       formData.append('sizeList', size)
//     }
//     formData.append('color', color)
//     formData.append('price', price)
//     formData.append('description', description)
//     for (const key of Object.keys(newImage)) {
//       formData.append('image', newImage[key])
//     }

//     onSubmit(id, formData)
//     setFormProductData({})
//     onClose()
//   }

//   useEffect(() => {
//     if (isOpen) {
//       setPreviewImage([])
//     }
//   }, [isOpen])

//   if (!isOpen) return null

//   return (
//     <>
//       <ModalConfirm
//         isModalConfirmOpen={isModalConfirmOpen}
//         handleConfirm={handleConfirm}
//         closeConfirmModal={closeConfirmModal}
//       />

//       <div onClick={onClose} className={s.modal_overlay}></div>
//       <div className={s.modal}>
//         <h1 className={s.title}>Додати товар до магазину</h1>
//         <div className={s.form_container}>
//           <form onSubmit={handleSubmit}>
//             <div className={s.form_group}>
//               <label>Головна категорія</label>
//               <select name="mainId" value={mainId} onChange={handleChangeMain} className={s.form_control}>
//                 {mainCategories?.map(el => (
//                   <option key={el.id} value={el.id} className={s.option}>
//                     {el.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={s.form_group}>
//               <label>Категорія</label>
//               <select name="categoryId" value={categoryId} onChange={handleChangeCategory} className={s.form_control}>
//                 {categories
//                   ? categories.map(el => (
//                       <option key={el.id} value={el.id}>
//                         {el.title}
//                       </option>
//                     ))
//                   : null}
//               </select>
//             </div>

//             <div className={s.form_group}>
//               <label>Зображення</label>
//               <input type="file" name="productImage" onChange={handleImageUpload} className={s.form_control} multiple />
//             </div>

//             {/* <div> */}
//             {previewImage.length > 0 && (
//               <div>
//                 <p>Нові зображення</p>
//                 <ul className={s.images_box}>
//                   {previewImage.map((file, index) => (
//                     <li key={index} className={s.itemImg}>
//                       <Image src={file} alt={file} className={s.image} width={50} height={50} />
//                       <button type="button" onClick={() => handlePreviewImageDelete(file, index)}>
//                         Видалити зображення
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             {/* </div> */}

//             <div>
//               {productData.length > 0 && (
//                 <div>
//                   <p>Завантажені зображення</p>
//                   <ul className={s.images_box}>
//                     {formProductData?.image?.map((file, index) => (
//                       <li key={index} className={s.itemImg}>
//                         <Image src={file.url} alt={file} className={s.image} width={50} height={50} />
//                         <button type="button" onClick={() => handleImageDelete(productData.id, file.idFileCloud)}>
//                           Видалити зображення з сервера
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             <div className={s.form_group}>
//               <label>Назва</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formProductData?.name}
//                 onChange={handleInputChange}
//                 className={s.form_control}
//               />
//             </div>

//             <div className={s.form_group}>
//               <label>Опис</label>
//               <input
//                 type="text"
//                 name="description"
//                 value={formProductData?.description}
//                 onChange={handleInputChange}
//                 className={s.form_control}
//               />
//             </div>

//             <div className={s.form_group}>
//               <p>Розмір</p>
//               <ul>
//                 {sizesPrev
//                   ? sizesPrev.map((el, index) => (
//                       <li key={index} value={formProductData?.sizeList}>
//                         <label>{el}</label>
//                         <input
//                           type="checkbox"
//                           name="size"
//                           value={el}
//                           checked={checkedSize(el)}
//                           onChange={handleInputSizeChange}
//                           className={s.form_control}
//                         />
//                       </li>
//                     ))
//                   : null}
//               </ul>
//             </div>

//             <div className={s.form_group}>
//               <label>Колір</label>
//               <input
//                 type="text"
//                 name="color"
//                 value={formProductData?.color}
//                 onChange={handleInputChange}
//                 className={s.form_control}
//               />
//             </div>

//             <div className={s.form_group}>
//               <label>Кількість</label>
//               <input
//                 type="text"
//                 name="quantity"
//                 value={formProductData?.quantity}
//                 onChange={handleInputChange}
//                 className={s.form_control}
//               />
//             </div>

//             <div className={s.form_group}>
//               <label>Ціна</label>
//               <input
//                 type="text"
//                 name="price"
//                 value={formProductData?.price}
//                 onChange={handleInputChange}
//                 className={s.form_control}
//               />
//             </div>

//             <button type="submit" className={s.btn}>
//               {isEditing ? 'Оновити товар' : 'Додати товар'}
//             </button>
//             <button type="button" onClick={onClose}>
//               Скасувати
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   )
// }
