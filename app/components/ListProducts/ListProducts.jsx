'use client'

import Image from 'next/image'
import Link from 'next/link'
import s from './ListProducts.module.scss'
import { useAppSelector } from '@/app/redux/hooks'

const ListProducts = () => {
  const productsByCat = useAppSelector(state => state.productsByCat.items)
  const productsByMainCat = useAppSelector(state => state.productsByMainCat.items)

  console.log('productsByCat:', productsByCat)
  console.log('productsByMainCat:', productsByMainCat)

  let products = []
  if (productsByCat.length === 0) {
    products = productsByMainCat
  } else {
    products = productsByCat
  }

  return (
    <div>
      <ul>
        {products ? (
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
