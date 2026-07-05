import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_NEXT_API_URL

export const registerThunk = createAsyncThunk('user/register', async (user, { rejectWithValue }) => {
  try {
    const data = await axios.post('/api/auth/signup', user)
    // console.log(data)

    return data.data
  } catch (error) {
    return rejectWithValue({ error: error.message })
  }
})

export const loginThunk = createAsyncThunk('user/login', async (user, { rejectWithValue }) => {
  try {
    const data = await axios.post('/api/auth/login', user)
    // console.log(data.data)
    return data.data
  } catch (error) {
    return rejectWithValue({ error: error.response.data.message })
  }
})

export const currentThunk = createAsyncThunk('user/current', async (token, { rejectWithValue }) => {
  if (!token) return

  try {
    const data = await axios.get('/api/auth/current', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log('currentThunk', data)

    return data.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const logoutThunk = createAsyncThunk('user/logout', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState()
    const token = state.auth.token
    const data = await axios.post('/api/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // console.log(data)

    return data.data
  } catch (error) {
    rejectWithValue({ error: error.message })
  }
})
