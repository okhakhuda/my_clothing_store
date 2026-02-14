'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore } from '../app/redux/store'
import { persistStore } from 'redux-persist'

export default function StoreProvider({ children, preloadedState }) {
  const storeRef = useRef(null)
  const persistorRef = useRef(null)

  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState)
    persistorRef.current = persistStore(storeRef.current)
  }

  // const persistor = persistStore(storeRef.current)

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  )
}
