'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import s from '../Product/Product.module.scss'
import { fetchProductByIdThunk } from '@/app/redux/features/products/thunks'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { ButtonBasket } from '../utils/ButtonBasket/ButtonBasket'

const Product = ({ productId }) => {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProductByIdThunk(productId))
  }, [dispatch, productId])

  const product = useAppSelector(state => state.productById.items)
  
  const [dataProduct, setDataProduct] = useState({})

  const [size, setSize] = useState('')

  useEffect(() => {
    if (!product) return
    const selectedSize = size || product.sizeList?.[0] || ''

    if (!size && selectedSize) {
      setSize(selectedSize)
    }

    if (product) {
      setDataProduct({
        productId: product.id,
        name: product.name,
        article: product.article || '',
        price: product.price,
        color: product.color,
        image: product.image?.[0]?.url || '',
        size: size || selectedSize,
        genderCategory: product.genderCategory?.slug || '',
        category: product.category?.slug || '',
      })
    }
  }, [product, size])

  const handleSizeChange = e => {
    setSize(e.target.value)
  }

  return (
    <>
      <div className={s.card}>
        {product && Object.keys(product).length > 0 ? (
          <>
            <div>
              <ul>
                {product.image &&
                  product.image.map((img, index) => (
                    <li key={index}>
                      <Image
                        className={s.img}
                        src={img.url}
                        alt="product"
                        width="0"
                        height="0"
                        sizes="100vh"
                        priority
                      />
                    </li>
                  ))}
              </ul>
              <p className={s.art}>арт: {product.article}</p>
              <p className={s.status}>{product.status}</p>
              <div>
                <h3 className={s.title_description}>ОПИС</h3>
                <p className={s.description}>{product.description}</p>
              </div>
            </div>
            <div className={s.desc_block}>
              <div className={s.info}>
                <p className={s.title}>{product.name}</p>
                <p className={s.price}>{product.price} ₴</p>
              </div>

              <div className={s.size_box}>
                <ul className={s.size_selector}>
                  {product.sizeList?.map((itemSize, index) => (
                    <li key={index} className={s.size_option}>
                      <label
                        htmlFor={`size-${index}`}
                        className={`${s.size_label} ${size === itemSize ? s.active : ''}`}
                      >
                        {itemSize}
                      </label>
                      <input
                        type="radio"
                        name="size"
                        id={`size-${index}`}
                        value={itemSize}
                        checked={size === itemSize}
                        onChange={handleSizeChange}
                        className={s.radio_input}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              {dataProduct && <ButtonBasket product={dataProduct} />}
            </div>
          </>
        ) : (
          <p className={s.error}>Щось пішло не так, спробуйте пізніше!</p>
        )}
      </div>
    </>
  )
}

export default Product
