import axiosClient from './axiosClient'

export const getBannersApi = () => {
  return axiosClient.get('/Banners')
}

export const getAllBannersApi = () => {
  return axiosClient.get('/Banners/manage')
}

export const createBannerApi = (data) => {
  return axiosClient.post('/Banners', data)
}

export const updateBannerApi = (id, data) => {
  return axiosClient.put(`/Banners/${id}`, data)
}

export const deleteBannerApi = (id) => {
  return axiosClient.delete(`/Banners/${id}`)
}