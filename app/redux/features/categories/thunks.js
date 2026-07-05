import axios from 'axios'
import { createApiThunk } from '../../helpers/createApiThunk'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_NEXT_API_URL

export const fetchCategoryThunk = createApiThunk('category/fetchCategory', async () => {
  const { data } = await axios.get('/api/categories/')
  return data.categories
})

export const fetchCategoryByMainSlugThunk = createApiThunk('category/fetchCategoryByMainSlug', async slug => {
  const { data } = await axios.get(`/api/categories/slug/${slug}`)
  return data.result.items
})

export const addCategoryThunk = createApiThunk(
  'category/addCategory',
  async (categoryData, token) => {
    const { data } = await axios.post('/api/categories', categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },
  { withAuth: true },
)

export const updateCategoryThunk = createApiThunk(
  'category/updateCategory',
  async ({ id, formData }, token) => {
    const { data } = await axios.put(`/api/categories/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },
  { withAuth: true },
)

export const removeCategoryThunk = createApiThunk(
  'category/removeCategory',
  async (id, token) => {
    const { data } = await axios.delete(`/api/categories/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  },
  { withAuth: true },
)
