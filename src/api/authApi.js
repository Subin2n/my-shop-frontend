import axiosClient from './axiosClient'

// api dang ky
export const registerApi = (data) => {
  return axiosClient.post('/Auth/register', data)
}

// api dang nhap
export const loginApi = (data) => {
  return axiosClient.post('/Auth/login', data)
}

// api lay thong tin user hien tai
export const meApi = () => {
  return axiosClient.get('/Auth/me')
}

// api cap nhat thong tin tai khoan
export const updateProfileApi = (data) => {
  return axiosClient.put('/Auth/profile', data)
}