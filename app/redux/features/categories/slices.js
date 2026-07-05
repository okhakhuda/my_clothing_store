import { createListSlice } from '../../helpers/createListSlice'
import {
  fetchCategoryThunk,
  fetchCategoryByMainSlugThunk,
  updateCategoryThunk,
  addCategoryThunk,
  removeCategoryThunk,
} from './thunks'

const categorySlice = createListSlice({
  name: 'category',
  initialState: {
    items: [],
    error: null,
    message: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchCategoryThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
    {
      thunk: updateCategoryThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.map(item =>
          item.id === action.payload.updateCategory.id ? action.payload.updateCategory : item,
        )
        state.message = action.payload.message
      },
    },
    {
      thunk: addCategoryThunk,
      onFulfilled: (state, action) => {
        const added = action.payload.result
        state.items = Array.isArray(added) ? [...state.items, ...added] : [...state.items, added]
        state.message = action.payload.message
      },
    },
    {
      thunk: removeCategoryThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.filter(el => el.id !== action.payload.category.id)
        state.message = action.payload.message
      },
    },
  ],
})

const categoryByMainSlugSlice = createListSlice({
  name: 'categoryByMainSlug',
  initialState: {
    items: [],
    error: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchCategoryByMainSlugThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
  ],
})

export const categoryReducer = categorySlice.reducer
export const categoryByMainSlugReducer = categoryByMainSlugSlice.reducer
