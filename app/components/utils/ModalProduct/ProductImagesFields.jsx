import Image from 'next/image'
import s from './ModalProduct.module.scss'

export const NewImagesPreview = ({ previewImages, onDelete }) => {
  if (previewImages.length === 0) return null

  return (
    <section className={s.imagesSection}>
      <h3 className={s.sectionTitle}>Нові зображення</h3>
      <ul className={s.imagesList} role="list">
        {previewImages.map((imageUrl, index) => (
          <li key={imageUrl} className={s.imageItem}>
            <div className={s.imageWrapper}>
              <Image src={imageUrl} alt="Попередній перегляд" width={80} height={80} className={s.previewImage} />
            </div>
            <button
              type="button"
              className={s.deleteBtn}
              onClick={() => onDelete(imageUrl, index)}
              aria-label="Видалити зображення"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export const ExistingImagesList = ({ images, onDelete }) => {
  if (!images || images.length === 0) return null

  return (
    <section className={s.imagesSection}>
      <h3 className={s.sectionTitle}>Поточні зображення</h3>
      <ul className={s.imagesList} role="list">
        {images.map((image, index) => (
          <li key={image.id || index} className={s.imageItem}>
            <div className={s.imageWrapper}>
              <Image src={image.url} alt="Зображення товару" width={80} height={80} className={s.previewImage} />
            </div>
            <button
              type="button"
              className={s.deleteBtn}
              onClick={() => onDelete(image.idFileCloud)}
              aria-label="Видалити зображення з сервера"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
