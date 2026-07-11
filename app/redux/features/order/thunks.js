import axios from 'axios'
import { createApiThunk } from '../../helpers/createApiThunk'

export const fetchAllOrderThunk = createApiThunk(
  'allOrder/fetchAllOrder',
  async ({ page = 1, limit } = {}, token) => {
    const skip = (page - 1) * limit
    const { data } = await axios.get(`/api/orders/?limit=${limit}&skip=${skip}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.orders
  },
  { withAuth: true },
)

export const fetchOrderByUserThunk = createApiThunk(
  'order/fetchOrderByUser',
  async (userId, token) => {
    const { data } = await axios.get(`/api/orders/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  },
  { withAuth: true },
)

export const createOrderThunk = createApiThunk('order/createOrder', async orderData => {
  const { data } = await axios.post('/api/orders', orderData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return data
})
