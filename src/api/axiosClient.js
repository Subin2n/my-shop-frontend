import axios from 'axios'

// tao axios client dung chung cho toan bo du an
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5234/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// tu dong gan token vao header neu da dang nhap
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// xu ly loi chung tu backend
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // neu token het han hoac sai thi xoa localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    return Promise.reject(error)
  }
)

export default axiosClient