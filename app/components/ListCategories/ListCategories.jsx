'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import s from './ListCategories.module.scss'
import { useEffect } from 'react'
import { fetchCategoryByMainSlugThunk } from '../../redux/features/categories/thunks'

const ListCategories = ({ mainSlug }) => {
  const {items} = useAppSelector(state => state.categoryByMainSlug)

  const dispatch = useAppDispatch()

  useEffect(() => { 
    dispatch(fetchCategoryByMainSlugThunk(mainSlug))
  }, [dispatch, mainSlug])

  return (
    <>
      {/* <Header /> */}
      <div className={s.category}>
        <ul className={s.list_category}>
          <li className={s.category_item}>
            <Link className={s.link} rel="preload" href={`/${mainSlug}/all`}>
              <p className={`${s.title} ${s.all_title}`}>ALL</p>
            </Link>
          </li>
          {items.length > 0 ? (
            items.map(category => (
              <li className={s.category_item} key={category.id}>
                <Link className={s.link} rel="preload" href={category.slug}>
                  <div className={s.image_block}>
                    <Image className={s.image} src={category.image} alt="category" width={50} height={70} priority />
                  </div>
                  <p className={s.title}>{category.title.toUpperCase()}</p>
                </Link>
              </li>
            ))
          ) : (
            <div>Категорії не знайдено</div>
          )}
        </ul>
      </div>
    </>
  )
}

export default ListCategories
