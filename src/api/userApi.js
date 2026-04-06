import axiosClient from './axiosClient'

// lay tat ca tai khoan
export const getAllUsersApi = () => {
  return axiosClient.get('/Users')
}

// doi role tai khoan
export const updateUserRoleApi = (id, data) => {
  return axiosClient.put(`/Users/${id}/role`, data)
}

// khoa mo tai khoan
export const updateUserActiveApi = (id, data) => {
  return axiosClient.put(`/Users/${id}/active`, data)
}