import axios from 'axios'
import { createApiThunk } from '../../helpers/createApiThunk'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_NEXT_API_URL

export const fetchMainCategoryThunk = createApiThunk('mainCategory/fetchMainCategory', async () => {
  const { data } = await axios.get('api/gendercategories')
  return data.categories
})

export const addMainCategoryThunk = createApiThunk(
  'mainCategory/addMainCategory',
  async (formData, token) => {
    const { data } = await axios.post('/api/gendercategories/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },
  { withAuth: true },
)

export const updateMainCategoryThunk = createApiThunk(
  'mainCategory/updateMainCategory',
  async ({ id, formData }, token) => {
    const { data } = await axios.put(`/api/gendercategories/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },
  { withAuth: true },
)

export const removeMainCategoryThunk = createApiThunk(
  'mainCategory/removeMainCategory',
  async (id, token) => {
    const { data } = await axios.delete(`/api/gendercategories/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  },
  { withAuth: true },
)
