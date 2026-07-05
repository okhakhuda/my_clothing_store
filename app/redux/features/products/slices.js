import { createListSlice } from '../../helpers/createListSlice'
import {
  fetchProductsThunk,
  fetchNewProductsThunk,
  fetchProductsByMainCatThunk,
  fetchProductsByCatThunk,
  fetchProductByIdThunk,
  addProductThunk,
  updateProductThunk,
  removeProductThunk,
  removeProductImageThunk,
} from './thunks'

const productsSlice = createListSlice({
  name: 'products',
  initialState: {
    items: [],
    message: null,
    error: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchProductsThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
    {
      thunk: addProductThunk,
      onFulfilled: (state, action) => {
        state.items = [action.payload, ...state.items]
        state.message = action.payload.message
      },
    },
    {
      thunk: updateProductThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.map(el =>
          el.id === action.payload.updateProduct.id ? action.payload.updateProduct : el,
        )
        state.message = action.payload.message
      },
    },
    {
      thunk: removeProductThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.filter(el => el.id !== action.payload.product.id)
        state.message = action.payload.message
      },
    },
    {
      thunk: removeProductImageThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.map(el =>
          el.id === action.payload.updateProduct.id ? action.payload.updateProduct : el,
        )
        state.message = action.payload.message
      },
    },
  ],
})

const newProductsSlice = createListSlice({
  name: 'newProducts',
  initialState: {
    items: [],
    message: null,
    error: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchNewProductsThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
  ],
})

const productsByMainCatSlice = createListSlice({
  name: 'productsByMainCat',
  initialState: {
    items: [],
    error: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchProductsByMainCatThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
  ],
})

const productsByCatSlice = createListSlice({
  name: 'productsByCat',
  initialState: {
    items: [],
    error: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchProductsByCatThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
  ],
})

const productByIdSlice = createListSlice({
  name: 'productById',
  initialState: {
    items: [],
    error: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchProductByIdThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
  ],
})

export const productsReducer = productsSlice.reducer
export const productsNewReducer = newProductsSlice.reducer
export const productsByMainCatReducer = productsByMainCatSlice.reducer
export const productsByCatReducer = productsByCatSlice.reducer
export const productByIdReducer = productByIdSlice.reducer
