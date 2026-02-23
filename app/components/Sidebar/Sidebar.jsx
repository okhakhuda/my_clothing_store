'use client'

import React, { use } from 'react'
import { useEffect, useState } from 'react'
import { CiMenuFries } from 'react-icons/ci'
import { AiOutlineClose } from 'react-icons/ai'
import s from './Sidebar.module.scss'
import Link from 'next/link'
import Logo from '../Logo/Logo'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { logoutThunk } from '@/app/redux/features/auth/thunks'

const Sidebar = () => {
  const [toggle, setToggle] = useState(false)
  const isAuth = useAppSelector(state => state.auth.isAuth)
  // console.log('isAuth', isAuth)
  const isAuthAdmin = useAppSelector(state => state.auth.user?.role)
  // console.log('isAuthAdmin', isAuthAdmin)
  const dispatch = useAppDispatch()


  const toggleSidebar = () => {
    setToggle(!toggle)
  }

  const handleClick = () => {
    dispatch(logoutThunk())
  }

  return (
    <div className={s.sidebar_block}>
      <button type="button" className={s.sidebar_icon} onClick={toggleSidebar}>
        <CiMenuFries />
      </button>

      <>
        <div onClick={toggleSidebar} className={`${s.sidebar_overlay} ${toggle ? s['is-open'] : ''}`}></div>
        <div className={`${s.sidebar} ${toggle ? s['is-open'] : ''}`}>
          <div className={s.sidebar_global}>
            <h3 className={s.sidebar_logo}>
              <Logo />
            </h3>
          </div>
          <p className={s.sidebar_desc}>Магазин доступного одягу</p>
          <button type="button" className={s.sidebar_btn_close} onClick={toggleSidebar}>
            <AiOutlineClose size={20} />
          </button>
          
          {isAuth ? (
            <ul>
              <li>
                {isAuth && isAuthAdmin === 'administrator' ? (
                  <Link onClick={toggleSidebar} href={'../../dashboard/orders'} rel="preload">
                    Панель керування
                  </Link>
                ) : (
                  <Link onClick={toggleSidebar} href={'./profile'} rel="preload">
                    Особистий кабінет
                  </Link>
                )}
              </li>
              <li>
                <button type="button" onClick={handleClick}>
                  Вийти
                </button>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link onClick={toggleSidebar} href={'./login'} rel="preload">
                  Логін
                </Link>
              </li>
              <li>
                <Link onClick={toggleSidebar} href={'./register'} rel="preload">
                  Реєстрація
                </Link>
              </li>
            </ul>
          )}
        </div>
      
      </>
    </div>
  )
}

export default Sidebar
