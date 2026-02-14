import { configureStore } from '@reduxjs/toolkit'
import { mainCategoryReducer } from './features/mainCategories/slices'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import storage from './storage.js'
import authReducer from './features/auth/slices'
import { cartReducer } from './features/cart/slices'
import {
  productsByMainCatReducer,
  productsByCatReducer,
  productsReducer,
  productByIdReducer,
} from './features/products/slices'
import { categoryReducer, categoryByMainSlugReducer } from './features/categories/slices'
import { orderAllReducer, orderByUserReducer } from './features/order/slices'

const authPersistConfig = {
  key: 'authToken',
  storage,
  whitelist: ['token'],
  blacklist: ['error'],
}

const authPersistReducer = persistReducer(authPersistConfig, authReducer)

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items'],
}
const cartPersistReducer = persistReducer(cartPersistConfig, cartReducer)

export const makeStore = preloadedState => {
  return configureStore({
    reducer: {
      auth: authPersistReducer,
      mainCategory: mainCategoryReducer,
      category: categoryReducer,
      categoryByMainSlug: categoryByMainSlugReducer,
      products: productsReducer,
      productsNew: productsReducer,
      productsByMainCat: productsByMainCatReducer,
      productsByCat: productsByCatReducer,
      productById: productByIdReducer,
      cart: cartPersistReducer,
      allOrder: orderAllReducer,
      orderByUser: orderByUserReducer,
    },
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',

    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  // const persistor = persistStore(store)
  // return { persistor }
}

// const store = makeStore().store
// export { store }

// export const persistor = persistStore(makeStore())
