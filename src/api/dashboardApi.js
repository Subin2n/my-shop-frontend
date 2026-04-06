import axiosClient from './axiosClient'

export const getDashboardSummaryApi = () => {
  return axiosClient.get('/Dashboard/summary')
}