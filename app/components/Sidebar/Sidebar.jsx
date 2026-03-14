'use client'

import { useEffect, useState } from 'react'
import { CiMenuFries } from 'react-icons/ci'
import { AiOutlineClose } from 'react-icons/ai'
import { FaUser, FaShoppingCart, FaHeart, FaBox, FaPhone, FaEnvelope, FaQuestionCircle } from 'react-icons/fa'
import s from './Sidebar.module.scss'
import Link from 'next/link'
import Logo from '../Logo/Logo'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { fetchMainCategoryThunk } from '@/app/redux/features/mainCategories/thunks'
import { logoutThunk } from '@/app/redux/features/auth/thunks'

const Sidebar = () => {
  const [toggle, setToggle] = useState(false)
  const mainCategories = useAppSelector(state => state.mainCategory.items)
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const isAuthAdmin = useAppSelector(state => state.auth.user?.role)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (mainCategories && mainCategories.length > 0) return
    dispatch(fetchMainCategoryThunk())
  }, [dispatch, mainCategories])

  const toggleSidebar = () => {
    setToggle(!toggle)
  }

  const handleClick = () => {
    dispatch(logoutThunk())
    setToggle(false)
  }

  const sidebarLinks = isAuth
    ? [
        {
          icon: isAuthAdmin === 'administrator' ? FaBox : FaUser,
          label: isAuthAdmin === 'administrator' ? 'Панель керування' : 'Особистий кабінет',
          href: isAuthAdmin === 'administrator' ? '../../dashboard/orders' : '../../profile',
        },
        { icon: FaHeart, label: 'Обране', href: '../../favorites' },
        { icon: FaShoppingCart, label: 'Кошик', href: '../../cart' },
      ]
    : [
        { icon: null, label: 'Логін', href: '../../login' },
        { icon: null, label: 'Реєстрація', href: '../../register' },
      ]

  const footerLinks = [
    { icon: FaPhone, label: '+380 (44) 123-45-67', href: 'tel:+380441234567' },
    { icon: FaEnvelope, label: 'support@shop.ua', href: 'mailto:support@shop.ua' },
    { icon: FaQuestionCircle, label: 'Допомога', href: '../../help' },
  ]

  return (
    <aside className={s.sidebar_block} role="navigation" aria-label="Головне меню">
      <button
        type="button"
        className={s.sidebar_icon}
        onClick={toggleSidebar}
        aria-label="Відкрити меню"
        aria-expanded={toggle}
      >
        <CiMenuFries />
      </button>

      <>
        <div
          onClick={toggleSidebar}
          className={`${s.sidebar_overlay} ${toggle ? s['is-open'] : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Закрити меню"
        />

        <nav className={`${s.sidebar} ${toggle ? s['is-open'] : ''}`}>
          <div className={s.sidebar_global}>
            <h3 className={s.sidebar_logo}>
              <Logo />
            </h3>
            <p className={s.sidebar_desc}>Магазин доступного одягу</p>
          </div>

          <button type="button" className={s.sidebar_btn_close} onClick={toggleSidebar} aria-label="Закрити меню">
            <AiOutlineClose size={20} />
          </button>

          <nav className={s.sidebar_nav} role="menubar">
            <ul className={s.sidebar_list} role="menu">
              {sidebarLinks.map((link, index) => (
                <li key={index} role="none">
                  <Link
                    onClick={toggleSidebar}
                    href={link.href}
                    rel="preload"
                    className={s.sidebar_link}
                    role="menuitem"
                  >
                    {link.icon && <link.icon size={18} />}
                    {link.label}
                  </Link>
                </li>
              ))}
              {isAuth && (
                <li role="none">
                  <button type="button" className={s.sidebar_btn} onClick={handleClick} role="menuitem">
                    <FaBox size={18} />
                    Вийти
                  </button>
                </li>
              )}
            </ul>
          </nav>

          <div className={s.sidebar_categories}>
            <h4 className={s.sidebar_categories_title}>Категорії</h4>
            <ul className={s.sidebar_categories_list}>
              {mainCategories.map(category => (
                <li key={category.id}>
                  <Link href={`../../${category.slug}/all`} onClick={toggleSidebar} className={s.sidebar_category_link}>
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <footer className={s.sidebar_footer}>
            <ul className={s.footer_links}>
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={s.footer_link} rel="noopener">
                    <link.icon size={14} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        </nav>
      </>
    </aside>
  )
}

export default Sidebar
