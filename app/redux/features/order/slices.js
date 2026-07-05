import { createListSlice } from '../../helpers/createListSlice'
import { fetchAllOrderThunk, fetchOrderByUserThunk, createOrderThunk } from './thunks'

const orderAllSlice = createListSlice({
  name: 'allOrder',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    message: null,
  },
  cases: [
    {
      thunk: fetchAllOrderThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload.orders
      },
    },
    {
      thunk: createOrderThunk,
      onFulfilled: (state, action) => {
        state.items = [action.payload.order, ...state.items]
        state.message = action.payload.message
      },
    },
  ],
})

const orderByUserSlice = createListSlice({
  name: 'orderByUser',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    message: null,
  },
  cases: [
    {
      thunk: fetchOrderByUserThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload.orders
      },
    },
  ],
})

export const orderAllReducer = orderAllSlice.reducer
export const orderByUserReducer = orderByUserSlice.reducer
