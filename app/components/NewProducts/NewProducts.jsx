'use client'

import s from './NewProducts.module.scss'
import Slider from '../Slider/Slider'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import React, { use } from 'react'
import { useEffect } from 'react'
import { fetchNewProductsThunk } from '../../redux/features/products/thunks'

const NewProducts = () => {
  const newProducts = useAppSelector(state => state.productsNew.items)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!newProducts || newProducts.length === 0) {
      dispatch(fetchNewProductsThunk())
    }
  }, [dispatch, newProducts])

  // Expected server HTML to contain a matching <div> in <div>. Error Component Stack

  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) return null

  return (
    <section className={s.section}>
      {newProducts && (
        <div className={s.slider}>
          <h2 className={s.title}>Новинки</h2>
          <Slider products={newProducts} />
        </div>
      )}
    </section>
  )
}

export default NewProducts
