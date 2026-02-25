'use client'

import React from 'react'
import Hero from '../Hero/Hero'
import MainCategories from '../MainCategories/MainCategories'
import NewProducts from '../NewProducts/NewProducts'
import { useAppDispatch, useAppStore } from '../../redux/hooks'
import { currentThunk } from '../../redux/features/auth/thunks'
import { useEffect } from 'react'

const HomePageContent = () => {
  const dispatch = useAppDispatch()
  const store = useAppStore()

  useEffect(() => {
    const state = store.getState()
    const token = state.auth.token
    // console.log(state)

    if (token) {
      dispatch(currentThunk(token))
    }
  }, [dispatch, store])

  return (
    <div>
      <Hero />
      <MainCategories />
      <NewProducts />
    </div>
  )
}
export default HomePageContent
