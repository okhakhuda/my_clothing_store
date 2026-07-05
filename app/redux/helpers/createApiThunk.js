import { createAsyncThunk } from '@reduxjs/toolkit'

export const createApiThunk = (type, request, { withAuth = false } = {}) =>
  createAsyncThunk(type, async (arg, { rejectWithValue, getState }) => {
    try {
      const token = withAuth ? getState().auth.token : undefined
      return await request(arg, token)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  })
