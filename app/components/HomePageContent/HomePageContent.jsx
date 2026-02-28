'use client'

import React from 'react'
import Hero from '../Hero/Hero'
import MainCategories from '../MainCategories/MainCategories'
import NewProducts from '../NewProducts/NewProducts'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { currentThunk } from '../../redux/features/auth/thunks'
import { useEffect } from 'react'

const HomePageContent = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(currentThunk(token))
    }
  }, [dispatch, token])

  return (
    <>
      <Hero />
      <MainCategories />
      <NewProducts />
    </>
  )
}
export default HomePageContent
