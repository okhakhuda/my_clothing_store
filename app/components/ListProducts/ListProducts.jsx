'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { useEffect, useState } from 'react'
import { fetchProductsByMainCatThunk, fetchProductsByCatThunk } from '../../redux/features/products/thunks'
import { Pagination } from '../utils/Pagination/Pagination'
import s from './ListProducts.module.scss'
import { MdInventory2 } from 'react-icons/md'
import Loader from '../Loader/Loader'

const ListProducts = ({ mainSlug, categorySlug }) => {
  const {
    items: productsByCat,
    isLoading: byCatLoading,
    error: byCatError,
    total: byCatTotal,
    limit: byCatLimit,
  } = useAppSelector(state => state.productsByCat)
  const {
    items: productsByMainCat,
    isLoading: byMainLoading,
    error: byMainError,
    total: byMainTotal,
    limit: byMainLimit,
  } = useAppSelector(state => state.productsByMainCat)

  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)

  const isByMain = categorySlug === undefined
  const products = isByMain ? productsByMainCat : productsByCat
  const isLoading = isByMain ? byMainLoading : byCatLoading
  const isError = isByMain ? byMainError : byCatError
  const total = isByMain ? byMainTotal : byCatTotal
  const limit = isByMain ? byMainLimit : byCatLimit
  const totalPages = limit && total ? Math.ceil(total / limit) : 1

  useEffect(() => {
    setPage(1)
  }, [mainSlug, categorySlug])

  useEffect(() => {
    if (isByMain) {
      dispatch(fetchProductsByMainCatThunk({ slug: mainSlug, page, limit }))
    } else {
      dispatch(fetchProductsByCatThunk({ mainSlug, categorySlug, page, limit }))
    }
  }, [dispatch, mainSlug, categorySlug, isByMain, page, limit])

  const retry = () => {
    if (isByMain) {
      dispatch(fetchProductsByMainCatThunk({ slug: mainSlug, page, limit }))
    } else {
      dispatch(fetchProductsByCatThunk({ mainSlug, categorySlug, page, limit }))
    }
  }

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <section className={s.errorSection}>
        <div className={s.errorContainer}>
          <MdInventory2 className={s.errorIcon} />
          <h2 className={s.errorTitle}>Помилка завантаження</h2>
          <p className={s.errorText}>Не вдалося завантажити товари</p>
          <button className={s.retryButton} onClick={retry}>
            Спробувати ще раз
          </button>
        </div>
      </section>
    )
  }

  if (!products.length) {
    return (
      <div className={s.emptyState}>
        <MdInventory2 className={s.emptyIcon} />
        <h3 className={s.emptyTitle}>Поки що товарів немає!</h3>
        <p className={s.emptyText}>Додамо найближчим часом</p>
      </div>
    )
  }

  return (
    <section className={s.productsSection} aria-label="Список товарів">
      <div className={s.productsGrid}>
        {products.map((product, index) => (
          <article key={product.id} className={s.productCard}>
            <Link
              href={`/${product.genderCategory.slug}/${product.category.slug}/${product.id}`}
              className={s.productLink}
              aria-label={`Переглянути ${product.name}`}
            >
              <div className={s.productImageWrapper}>
                <Image
                  className={s.productImage}
                  src={product.image[0].url}
                  alt={product.name}
                  width={400}
                  height={500}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4}
                />
                <div className={s.imageOverlay} />
              </div>
              <div className={s.productInfo}>
                <h3 className={s.productName}>{product.name}</h3>
                <div className={s.productPriceWrapper}>
                  <span className={s.productPrice}>{product.price} ₴</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
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
    </section>
  )
}

export default ListProducts
