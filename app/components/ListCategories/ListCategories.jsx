'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector } from '@/app/redux/hooks'
import Loader from '../Loader/Loader'
import s from './ListCategories.module.scss'
import Header from '../Header/Header'

const ListCategories = ({ mainSlug }) => {
  const { items, isLoading } = useAppSelector(state => state.categoryByMainSlug)

  const productsByCat = useAppSelector(state => state.productsByCat.items)
  console.log('productsByCat', productsByCat)

  // if (isLoading) {
  //   return <Loader />
  // }

  return (
    <>
      <Header />
      <div className={s.category}>
        <ul className={s.list_category}>
          <li className={s.category_item}>
            <Link className={s.link} rel="preload" href={`/${mainSlug}/all`}>
              <p className={`${s.title} ${s.all_title}`}>ALL</p>
            </Link>
          </li>
          {items ? (
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
