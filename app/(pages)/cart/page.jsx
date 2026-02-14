import Cart from '@/app/components/Cart/Cart'
import { makeStore } from '@/app/redux/store'
import StoreProvider from '@/app/StoreProvider'

export default function CartPage() {
  const store = makeStore()
  const state = store.getState()
  return (
    <StoreProvider preloadedState={state}>
      <Cart />
    </StoreProvider>
  )
}
