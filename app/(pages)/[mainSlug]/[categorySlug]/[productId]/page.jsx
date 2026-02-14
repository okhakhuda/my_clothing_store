import Product from '../../../../components/Product/Product'
import { makeStore } from '@/app/redux/store'
import { fetchProductByIdThunk } from '@/app/redux/features/products/thunks'
import StoreProvider from '@/app/StoreProvider'
import Header from '@/app/components/Header/Header'

const page = async ({ params }) => {
  const { productId } = params

  const store = makeStore()

  await store.dispatch(fetchProductByIdThunk(productId))

  const state = store.getState()

  return (
    <StoreProvider preloadedState={state}>
      <Product />
    </StoreProvider>
  )
}

export default page
