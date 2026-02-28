'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { useEffect, useMemo } from 'react'
import { fetchCategoryByMainSlugThunk } from '../../redux/features/categories/thunks'
import s from './ListCategories.module.scss'
import { MdCategory } from 'react-icons/md'
import { useParams } from 'next/navigation'
import allimage from '../../../public/all.jpg'

const ListCategories = ({ mainSlug }) => {
  const { items, loading, error } = useAppSelector(state => state.categoryByMainSlug)
  const dispatch = useAppDispatch()

  const params = useParams()

  useEffect(() => {
    if (mainSlug) {
      dispatch(fetchCategoryByMainSlugThunk(mainSlug))
    }
  }, [dispatch, mainSlug])

  const hasCategories = items.length > 0
  const allCategories = useMemo(
    () => [{ id: 'all', slug: `/${mainSlug}/all`, title: 'ВСЕ', image: allimage }, ...items],
    [items, mainSlug],
  )

  if (error) {
    return (
      <section className={s.errorSection}>
        <div className={s.errorContainer}>
          <MdCategory className={s.errorIcon} />
          <h3 className={s.errorTitle}>Помилка завантаження</h3>
          <p className={s.errorText}>Не вдалося завантажити категорії</p>
          <button className={s.retryButton} onClick={() => dispatch(fetchCategoryByMainSlugThunk(mainSlug))}>
            Спробувати ще раз
          </button>
        </div>
      </section>
    )
  }

  return (
    <nav className={s.categoriesNav} role="navigation" aria-label="Категорії">
      <ul className={s.categoriesList} role="list">
        {allCategories.map(category => (
          <li
            key={category.id}
            className={`${s.categoryItem} ${category.slug.includes(params.categorySlug) ? s.activeCategory : ''}`}
          >
            <Link
              href={category.slug}
              className={s.categoryLink}
              rel="preload"
              aria-label={`Категорія ${category.title}`}
            >
              <div className={s.categoryImageWrapper}>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={80}
                    height={100}
                    className={s.categoryImage}
                    priority
                  />
                ) : (
                  <div className={s.categoryIconWrapper}>
                    <MdCategory className={s.categoryIcon} />
                  </div>
                )}
              </div>
              <span className={s.categoryTitle}>{category.title}</span>
            </Link>
          </li>
        ))}

        {!hasCategories && !loading && (
          <li className={s.emptyState}>
            <MdCategory className={s.emptyIcon} />
            <span className={s.emptyText}>Категорії не знайдено</span>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default ListCategories
