import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAllOrderThunk = createAsyncThunk(
  'allOrder/fetchAllOrder',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token

      const data = await axios.get(`/api/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // console.log(data.data)
      return data.data
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)
export const fetchOrderByUserThunk = createAsyncThunk(
  'order/fetchOrderByUser',
  async (userId, { rejectWithValue, getState }) => {
    const state = getState()
    const token = state.auth.token
    // console.log(token)

    try {
      const data = await axios.get(`/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(data.data)

      return data.data
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    const state = getState()
    const token = state.auth.token

    try {
      const { data } = await axios.post(`/api/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      return data
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)
