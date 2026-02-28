import { createSlice } from '@reduxjs/toolkit'
import { registerThunk, loginThunk, currentThunk, logoutThunk } from './thunks'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: { firstName: '', lastName: '', phone: '', email: '', avatarUrl: '', role: '', id: '' },
    token: '',
    error: null,
    isLoading: false,
    isAuth: false,
  },

  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerThunk.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data
        state.token = action.payload.data.token
        state.isAuth = true
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(loginThunk.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.data.token
        state.isAuth = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.error
        state.isAuth = false
      })

      .addCase(currentThunk.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(currentThunk.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.isLoading = false
          state.isAuth = false
          state.user = { firstName: '', lastName: '', phone: '', email: '', avatarUrl: '', role: '', id: '' }
          state.token = ''
        }
        state.isLoading = false
        state.isAuth = true
        state.user = action.payload?.data
      })
      .addCase(currentThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload?.error
        state.user = { firstName: '', lastName: '', phone: '', email: '', avatarUrl: '', role: '', id: '' }
        state.token = ''
        state.isAuth = false
      })

      .addCase(logoutThunk.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = { firstName: '', lastName: '', phone: '', email: '', avatarUrl: '', role: '', id: '' }
        state.token = ''
        state.isAuth = false
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export default authSlice.reducer
