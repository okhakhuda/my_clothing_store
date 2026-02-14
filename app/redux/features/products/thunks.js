import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProductsThunk = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products/allProducts')

    return data.products.data
  } catch (error) {
    console.log(error)

    return rejectWithValue(error.message)
  }
})

export const fetchNewProductsThunk = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products/newproducts')

    return data.products
  } catch (error) {
    console.log(error)

    return rejectWithValue(error.message)
  }
})

export const fetchProductsByMainCatThunk = createAsyncThunk(
  'products/fetchProductsByMainCat',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axios(`/api/products/genderCategory/${slug}`)

      return data.data.products
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const fetchProductsByCatThunk = createAsyncThunk(
  'products/fetchProductsByCat',
  async ({ mainSlug, categorySlug }, { rejectWithValue }) => {
    try {
      const { data } = await axios(`/api/products/category/${mainSlug}/${categorySlug}`)
      // console.log('data', data)

      return data.data.products
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const fetchProductByIdThunk = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`)

      return data.product
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const addProductThunk = createAsyncThunk(
  'products/addProduct',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token

      const { data } = await axios.post('/api/products/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(data)

      return data.result
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async (prop, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token

      const { data } = await axios.put(`/api/products/update/${prop.id}`, prop.formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      return data
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const removeProductThunk = createAsyncThunk(
  'products/removeProduct',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token

      const { data } = await axios.delete(`/api/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(data)

      return data
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)

export const removeProductImageThunk = createAsyncThunk(
  'products/removeProductImage',
  async (props, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const token = state.auth.token

      const { data } = await axios.put(`/api/products/deleteImage/${props.id}?public_id=${props.idFileCloud}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return data
    } catch (error) {
      console.log(error)

      return rejectWithValue(error.message)
    }
  },
)
