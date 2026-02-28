'use client'

import Image from 'next/image'
import Link from 'next/link'
import s from './MainCategories.module.scss'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import Loader from '../Loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchMainCategoryThunk } from '../../redux/features/mainCategories/thunks'

const MainCategories = () => {
  const { items, isLoading } = useAppSelector(state => state.mainCategory)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchMainCategoryThunk())
    }
  }, [dispatch, items])

  // const isLoading = useAppSelector(state => state.mainCategory.isLoading)

  // Expected server HTML to contain a matching <div> in <div>. Error Component Stack

  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) return null

  return (
    <section className={s.main_categories}>
      <h2 className={s.title}>Обирай одяг для всієї сім&#39;ї</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <ul className={s.category_list}>
          {items ? (
            items.map(category => (
              <li className={s.category_item} key={category.id}>
                <Link rel="preload" className={s.category_link} href={`${String(category.slug)}/all`}>
                  <Image
                    className={s.category_image}
                    src={category.image}
                    alt="category"
                    width={600}
                    height={450}
                    priority={true}
                  />
                  <h2 className={s.category_title}>{category.title}</h2>
                </Link>
              </li>
            ))
          ) : (
            <div>Щось пішло не так! Спробуйте перезавантажити сторінку.</div>
          )}
        </ul>
      )}
    </section>
  )
}

export default MainCategories
