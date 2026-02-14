'use client'

import React, { useEffect } from 'react'
import s from './Header.module.scss'
import Logo from '../Logo/Logo'
import Sidebar from '../Sidebar/Sidebar'
import Search from '../Search/Search'
import CartBtn from '../CartBtn/CartBtn'
import Link from 'next/link'
import { SlHeart } from 'react-icons/sl'
import { useAppSelector } from '@/app/redux/hooks'
import Image from 'next/image'
import { useState } from 'react'

const Header = () => {
  const [letter, setLetter] = useState('')

  // console.log('letter', letter)

  const avatar = useAppSelector(state => state.auth.user?.avatarUrl)
  const user = useAppSelector(state => state.auth.user)

  useEffect(() => {
    if (avatar === '') {
      const firstLetter = user.firstName.charAt(0).toUpperCase()
      const lastLetter = user.lastName.charAt(0).toUpperCase()
      setLetter(`${firstLetter}${lastLetter}`)
    }
  }, [avatar, user?.firstName, user?.lastName])

  return (
    <header className={s.header}>
      <div className={s.left_side}>
        <Sidebar />
        <Search />
      </div>
      <Logo />
      <div className={s.right_side}>
        <div className={s.avatar}>
          {!avatar ? (
            <p className={s.avatar_letter}>{letter}</p>
          ) : (
            <Image className={s.avatar_img} src={avatar} alt="my avatar" width="50" height="50" />
          )}
        </div>
        <div className={s.favorites}>
          <Link href="/favorite" rel="preload">
            <span className={s.favorite_icon}>
              <SlHeart />
            </span>
            <div className={s.counter}>0</div>
          </Link>
        </div>
        <CartBtn />
      </div>
    </header>
  )
}

export default Header
