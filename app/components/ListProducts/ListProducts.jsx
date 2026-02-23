'use client'

import Image from 'next/image'
import Link from 'next/link'
import s from './ListProducts.module.scss'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { useState, useEffect } from 'react'
import { fetchProductsByMainCatThunk } from '../../redux/features/products/thunks'
import { fetchProductsByCatThunk } from '../../redux/features/products/thunks'

const ListProducts = ({ mainSlug, categorySlug }) => {
  
  const productsByCat = useAppSelector(state => state.productsByCat.items)
  const productsByMainCat = useAppSelector(state => state.productsByMainCat.items)

  const dispatch = useAppDispatch()

   const [products, setProducts] = useState([])
  
  useEffect(() => {
    if (categorySlug === undefined) {
      dispatch(fetchProductsByMainCatThunk(mainSlug))
    } else {
      dispatch(fetchProductsByCatThunk({ mainSlug, categorySlug }))
    }
  }, [dispatch, mainSlug, categorySlug])

 
  useEffect(() => {
    if (categorySlug === undefined) {
      setProducts(productsByMainCat)
    } else {
      setProducts(productsByCat)
    }
  }, [productsByMainCat, productsByCat, categorySlug])

  return (
    <div>
      <ul>
        {products.length > 0 ? (
          products.map(product => (
            <li className={s.item} key={product.id}>
              <Link rel="preload" href={`/${product.genderCategory.slug}/${product.category.slug}/${product.id}`}>
                <Image
                  className={s.image}
                  src={product.image[0].url}
                  alt="product"
                  width="0"
                  height="0"
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  priority
                />
                <div className={s.info}>
                  <h2 className={s.name}>{product.name}</h2>
                  <p className={s.price}>{product.price} ₴</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className={s.empty}>Покищо товарів в цій категорії немає! Додамо найближчим часом</p>
        )}
      </ul>
    </div>
  )
}

export default ListProducts
