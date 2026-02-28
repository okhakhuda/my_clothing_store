'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
import { useState, useEffect, useMemo } from 'react'
import { fetchProductsByMainCatThunk } from '../../redux/features/products/thunks'
import { fetchProductsByCatThunk } from '../../redux/features/products/thunks'
import s from './ListProducts.module.scss'
import { MdInventory2 } from 'react-icons/md'
import ProductSkeleton from './ProductSkeleton' // ✅ Додано Skeleton

const ListProducts = ({ mainSlug, categorySlug }) => {
  const productsByCat = useAppSelector(state => state.productsByCat.items)
  const productsByMainCat = useAppSelector(state => state.productsByMainCat.items)
  const productsByCatLoading = useAppSelector(state => state.productsByCat.loading)
  const productsByMainCatLoading = useAppSelector(state => state.productsByMainCat.loading)
  const productsByCatError = useAppSelector(state => state.productsByCat.error)
  const productsByMainCatError = useAppSelector(state => state.productsByMainCat.error)

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

  const isLoading = categorySlug === undefined ? productsByMainCatLoading : productsByCatLoading

  const hasProducts = products.length > 0
  const isError = categorySlug === undefined ? productsByMainCatError : productsByCatError

  const visibleProducts = useMemo(() => {
    return products.slice(0, 24)
  }, [products])

  if (isError) {
    return (
      <section className={s.errorSection} aria-label="Помилка завантаження товарів">
        <div className={s.errorContainer}>
          <MdInventory2 className={s.errorIcon} />
          <h2 className={s.errorTitle}>Помилка завантаження</h2>
          <p className={s.errorText}>Не вдалося завантажити товари</p>
          <button
            className={s.retryButton}
            onClick={() => {
              if (categorySlug === undefined) {
                dispatch(fetchProductsByMainCatThunk(mainSlug))
              } else {
                dispatch(fetchProductsByCatThunk({ mainSlug, categorySlug }))
              }
            }}
          >
            Спробувати ще раз
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={s.productsSection} aria-label="Список товарів">
      <div className={s.productsGrid}>
        {isLoading ? (
          // ✅ 8 Skeleton компонентів під час завантаження
          Array.from({ length: 8 }, (_, index) => (
            <article key={`skeleton-${index}`} className={s.skeletonItem}>
              <ProductSkeleton />
            </article>
          ))
        ) : hasProducts ? (
          visibleProducts.map((product, index) => (
            <article key={product.id} className={s.productCard}>
              <Link
                href={`/${product.genderCategory.slug}/${product.category.slug}/${product.id}`}
                className={s.productLink}
                rel="preload"
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
                  <div className={s.imageOverlay}></div>
                </div>

                <div className={s.productInfo}>
                  <h3 className={s.productName}>{product.name}</h3>
                  <div className={s.productPriceWrapper}>
                    <span className={s.productPrice}>{product.price} ₴</span>
                  </div>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <div className={s.emptyState}>
            <MdInventory2 className={s.emptyIcon} />
            <h3 className={s.emptyTitle}>Покищо товарів немає!</h3>
            <p className={s.emptyText}>Додамо найближчим часом</p>
          </div>
        )}
      </div>

      {hasProducts && products.length > 24 && (
        <div className={s.loadMoreWrapper}>
          <button className={s.loadMoreButton}>Завантажити ще</button>
        </div>
      )}
    </section>
  )
}

export default ListProducts

// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import s from './ListProducts.module.scss'
// import { useAppSelector, useAppDispatch } from '@/app/redux/hooks'
// import { useState, useEffect } from 'react'
// import { fetchProductsByMainCatThunk } from '../../redux/features/products/thunks'
// import { fetchProductsByCatThunk } from '../../redux/features/products/thunks'

// const ListProducts = ({ mainSlug, categorySlug }) => {

//   const productsByCat = useAppSelector(state => state.productsByCat.items)
//   const productsByMainCat = useAppSelector(state => state.productsByMainCat.items)

//   const dispatch = useAppDispatch()

//    const [products, setProducts] = useState([])

//   useEffect(() => {
//     if (categorySlug === undefined) {
//       dispatch(fetchProductsByMainCatThunk(mainSlug))
//     } else {
//       dispatch(fetchProductsByCatThunk({ mainSlug, categorySlug }))
//     }
//   }, [dispatch, mainSlug, categorySlug])

//   useEffect(() => {
//     if (categorySlug === undefined) {
//       setProducts(productsByMainCat)
//     } else {
//       setProducts(productsByCat)
//     }
//   }, [productsByMainCat, productsByCat, categorySlug])

//   return (
//     <div>
//       <ul>
//         {products.length > 0 ? (
//           products.map(product => (
//             <li className={s.item} key={product.id}>
//               <Link rel="preload" href={`/${product.genderCategory.slug}/${product.category.slug}/${product.id}`}>
//                 <Image
//                   className={s.image}
//                   src={product.image[0].url}
//                   alt="product"
//                   width="0"
//                   height="0"
//                   sizes="100vw"
//                   style={{ width: '100%', height: 'auto' }}
//                   priority
//                 />
//                 <div className={s.info}>
//                   <h2 className={s.name}>{product.name}</h2>
//                   <p className={s.price}>{product.price} ₴</p>
//                 </div>
//               </Link>
//             </li>
//           ))
//         ) : (
//           <p className={s.empty}>Покищо товарів в цій категорії немає! Додамо найближчим часом</p>
//         )}
//       </ul>
//     </div>
//   )
// }

// export default ListProducts
