'use client'

import s from './NewProducts.module.scss'
import Slider from '../Slider/Slider'
import { useAppSelector } from '../../redux/hooks'
import React from 'react'

const NewProducts = () => {
  const newProducts = useAppSelector(state => state.productsNew.items)

  // Expected server HTML to contain a matching <div> in <div>. Error Component Stack

  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) return null

  return (
    <>
      {newProducts && (
        <div className={s.slider}>
          <h2 className={s.title}>Новинки</h2>
          <Slider products={newProducts} />
        </div>
      )}
    </>
  )
}

export default NewProducts
