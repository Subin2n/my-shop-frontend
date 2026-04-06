import axiosClient from './axiosClient'

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