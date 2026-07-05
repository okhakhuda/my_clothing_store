import { createSlice } from '@reduxjs/toolkit'

export const createListSlice = ({ name, initialState, cases }) =>
  createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: builder => {
      cases.forEach(({ thunk, onFulfilled }) => {
        builder
          .addCase(thunk.pending, state => {
            state.isLoading = true
          })
          .addCase(thunk.fulfilled, (state, action) => {
            state.isLoading = false
            onFulfilled(state, action)
          })
          .addCase(thunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload
          })
      })
    },
  })
