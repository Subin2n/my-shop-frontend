import axiosClient from './axiosClient'

export const getProductsApi = ({
  keyword = '',
  categoryId = '',
  priceRange = '',
  inStock = false,
  flashSale = false,
  sortBy = '',
} = {}) => {
  return axiosClient.get('/Products', {
    params: {
      keyword,
      categoryId,
      priceRange,
      inStock,
      flashSale,
      sortBy,
    },
  })
}

export const getProductByIdApi = (id) => {
  return axiosClient.get(`/Products/${id}`)
}

export const getFlashSaleProductsApi = () => {
  return axiosClient.get('/Products/flash-sale')
}

export const getCategoriesApi = () => {
  return axiosClient.get('/Categories')
}

export const getAllCategoriesForManageApi = () => {
  return axiosClient.get('/Categories/manage/all')
}

export const createCategoryApi = (data) => {
  return axiosClient.post('/Categories', data)
}

export const updateCategoryApi = (id, data) => {
  return axiosClient.put(`/Categories/${id}`, data)
}

export const updateCategoryActiveApi = (id, data) => {
  return axiosClient.put(`/Categories/${id}/active`, data)
}

export const getAllProductsForManageApi = () => {
  return axiosClient.get('/Products/manage/all')
}

export const createProductApi = (data) => {
  return axiosClient.post('/Products', data)
}

export const updateProductApi = (id, data) => {
  return axiosClient.put(`/Products/${id}`, data)
}

export const updateProductActiveApi = (id, data) => {
  return axiosClient.put(`/Products/${id}/active`, data)
}