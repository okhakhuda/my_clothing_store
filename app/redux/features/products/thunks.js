import axios from 'axios'
import { createApiThunk } from '../../helpers/createApiThunk'

export const fetchNewProductsThunk = createApiThunk('products/fetchNewProducts', async () => {
  const { data } = await axios.get('/api/products/newproducts')
  return data.products
})

export const fetchProductsThunk = createApiThunk('products/fetchProducts', async ({ page = 1, limit } = {}) => {
  const skip = (page - 1) * limit
  const { data } = await axios.get(`/api/products/allProducts?&limit=${limit}&skip=${skip}`)

  return data.products
})

export const fetchProductsByMainCatThunk = createApiThunk(
  'products/fetchProductsByMainCat',
  async ({ slug, page = 1, limit }) => {
    const skip = (page - 1) * limit
    const { data } = await axios(`/api/products/genderCategory/${slug}?skip=${skip}&limit=${limit}`)
    return data.data
  },
)

export const fetchProductsByCatThunk = createApiThunk(
  'products/fetchProductsByCat',
  async ({ mainSlug, categorySlug, page = 1, limit }) => {
    const skip = (page - 1) * limit
    const { data } = await axios(`/api/products/category/${mainSlug}/${categorySlug}?skip=${skip}&limit=${limit}`)
    return data.data
  },
)

export const fetchProductByIdThunk = createApiThunk('products/fetchProductById', async productId => {
  const { data } = await axios.get(`/api/products/${productId}`)
  return data.product
})

export const addProductThunk = createApiThunk(
  'products/addProduct',
  async (formData, token) => {
    const { data } = await axios.post('/api/products/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data.result
  },
  { withAuth: true },
)

export const updateProductThunk = createApiThunk(
  'products/updateProduct',
  async (prop, token) => {
    const { data } = await axios.put(`/api/products/update/${prop.id}`, prop.formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return data
  },
  { withAuth: true },
)

export const removeProductThunk = createApiThunk(
  'products/removeProduct',
  async (productId, token) => {
    const { data } = await axios.delete(`/api/products/delete/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  },
  { withAuth: true },
)

export const removeProductImageThunk = createApiThunk(
  'products/removeProductImage',
  async (props, token) => {
    const { data } = await axios.put(`/api/products/deleteImage/${props.id}?public_id=${props.idFileCloud}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  },
  { withAuth: true },
)
