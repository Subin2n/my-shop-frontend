import axiosClient from './axiosClient'

export const getMyOrdersApi = () => {
  return axiosClient.get('/Orders/my-orders')
}

export const createOrderApi = (data) => {
  return axiosClient.post('/Orders', data)
}

export const getOrdersForManageApi = ({
  keyword = '',
  page = 1,
  pageSize = 5,
} = {}) => {
  return axiosClient.get('/Orders/manage', {
    params: { keyword, page, pageSize },
  })
}

export const updateOrderStatusApi = (id, data) => {
  return axiosClient.put(`/Orders/${id}/status`, data)
}