import { createListSlice } from '../../helpers/createListSlice'
import {
  fetchMainCategoryThunk,
  addMainCategoryThunk,
  updateMainCategoryThunk,
  removeMainCategoryThunk,
} from './thunks'

const mainCategorySlice = createListSlice({
  name: 'mainCategory',
  initialState: {
    items: [],
    error: null,
    message: null,
    isLoading: false,
  },
  cases: [
    {
      thunk: fetchMainCategoryThunk,
      onFulfilled: (state, action) => {
        state.items = action.payload
      },
    },
    {
      thunk: addMainCategoryThunk,
      onFulfilled: (state, action) => {
        const added = action.payload.result
        state.items = Array.isArray(added) ? [...state.items, ...added] : [...state.items, added]
        state.message = action.payload.message
      },
    },
    {
      thunk: updateMainCategoryThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.map(item =>
          item.id === action.payload.updateCategory.id ? action.payload.updateCategory : item,
        )
        state.message = action.payload.message
      },
    },
    {
      thunk: removeMainCategoryThunk,
      onFulfilled: (state, action) => {
        state.items = state.items.filter(el => el.id !== action.payload.category.id)
        state.message = action.payload.message
      },
    },
  ],
})

export const mainCategoryReducer = mainCategorySlice.reducer
