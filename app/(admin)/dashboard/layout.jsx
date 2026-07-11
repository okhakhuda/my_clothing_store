'use client'

import React from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { currentThunk } from '@/app/redux/features/auth/thunks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import s from './layout.module.scss'

export default function DashboardLayout({ children }) {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const token = useAppSelector(state => state.auth.token)

  const pathname = usePathname()
  const router = useRouter()
  const role = useAppSelector(state => state.auth.user?.role)

  useEffect(() => {
    if (token) {
      dispatch(currentThunk(token)).then(res => {
        if (res.payload.status !== 'success' && !isAuth && role !== 'administrator') {
          router.push('/login')
        }
      })
    }
  }, [dispatch, token, isAuth, role, router])

  const isActive = path => {
    return pathname === path ? s.active : ''
  }

  return (
    <div className={s.dashboard}>
      <nav className={s.sidebar}>
        <ul className={s.menu}>
          <li>
            <Link href="/dashboard/orders" className={isActive('/dashboard/orders')}>
              Замовлення
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products" className={isActive('/dashboard/products')}>
              Продукти
            </Link>
          </li>
          <li>
            <Link href="/dashboard/categories" className={isActive('/dashboard/categories')}>
              Категорії
            </Link>
          </li>
          <li>
            <Link href="/dashboard/mainCategories" className={isActive('/dashboard/mainCategories')}>
              Головні категорії
            </Link>
          </li>
        </ul>
      </nav>
      <main className={s.content}>{children}</main>
    </div>
  )
}
