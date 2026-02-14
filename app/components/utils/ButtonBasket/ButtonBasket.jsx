'use client'

import React from 'react'
import { GiShoppingCart } from 'react-icons/gi'
import { addToCart } from '@/app/redux/features/cart/slices'
import { useAppDispatch } from '@/app/redux/hooks'

import s from './ButtonBasket.module.scss'

export const ButtonBasket = ({ product }) => {
  const dispatch = useAppDispatch()

  const handlAddToCart = async e => {
    e.preventDefault()
    dispatch(addToCart(product))
  }

  if (!product) return null

  return (
    <>
      <div className={s.box_btn}>
        <button className={s.button} type="submit" onClick={handlAddToCart}>
          <div className={s.btn_content}>
            <GiShoppingCart />
            <span className={s.btn_text}>В КОШИК</span>
          </div>
          <div className={s.btn_shadow}></div>
        </button>
      </div>
    </>
  )
}
