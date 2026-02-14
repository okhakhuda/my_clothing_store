import s from './page.module.scss'
import { makeStore } from './redux/store'
import { fetchMainCategoryThunk } from './redux/features/mainCategories/thunks'
import { fetchNewProductsThunk } from './redux/features/products/thunks'
import StoreProvider from './StoreProvider'
import HomePageContent from './components/HomePageContent/HomePageContent'
import Header from './components/Header/Header'

const Home = async () => {
  const store = makeStore()

  await store.dispatch(fetchMainCategoryThunk())
  await store.dispatch(fetchNewProductsThunk())

  const state = store.getState()

  return (
    <>
      <StoreProvider preloadedState={state}>
        <Header />
        <HomePageContent />
      </StoreProvider>
    </>
  )
}

export default Home
