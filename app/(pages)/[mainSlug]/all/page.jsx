import ListCategories from '@/app/components/ListCategories/ListCategories'
import ListProducts from '@/app/components/ListProducts/ListProducts'
import { makeStore } from '@/app/redux/store'
import { fetchCategoryByMainSlugThunk } from '@/app/redux/features/categories/thunks'
import { fetchProductsByMainCatThunk } from '@/app/redux/features/products/thunks'
import { fetchProductsByCatThunk } from '@/app/redux/features/products/thunks'
import StoreProvider from '@/app/StoreProvider'
import Header from '@/app/components/Header/Header'

const page = async ({ params }) => {
  const { mainSlug: mainSlug } = params

  const store = makeStore()

  await store.dispatch(fetchCategoryByMainSlugThunk(mainSlug))
  await store.dispatch(fetchProductsByMainCatThunk(mainSlug))
  //

  const state = store.getState()

  return (
    <>
      <StoreProvider preloadedState={state}>
        {/* <Header /> */}
        <ListCategories mainSlug={mainSlug} />
        <ListProducts />
      </StoreProvider>
    </>
  )
}

export default page
