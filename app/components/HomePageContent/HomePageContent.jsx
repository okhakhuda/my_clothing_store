'use client'

import React from 'react'
import Hero from '../Hero/Hero'
import MainCategories from '../MainCategories/MainCategories'
import NewProducts from '../NewProducts/NewProducts'
import { useAppDispatch, useAppStore } from '../../redux/hooks'
import { currentThunk } from '../../redux/features/auth/thunks'
import { useStore } from 'react-redux'
import { useEffect } from 'react'
import Header from '../Header/Header'

const HomePageContent = () => {
  const dispatch = useAppDispatch()
  const store = useAppStore()
  // const store = useStore()

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
      {/* <Header /> */}
      <Hero />
      <MainCategories />
      <NewProducts />
    </div>
  )
}
export default HomePageContent
