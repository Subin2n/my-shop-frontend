import { useEffect, useState } from 'react'
import {
  getOrdersForManageApi,
  updateOrderStatusApi,
} from '../api/orderApi'

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchOrders = async (customPage = page, customKeyword = keyword) => {
    setLoading(true)

    try {
      const res = await getOrdersForManageApi({
        keyword: customKeyword,
        page: customPage,
        pageSize,
      })

      setOrders(res.data.items || [])
      setPage(res.data.page || 1)
      setTotalPages(res.data.totalPages || 1)
      setTotalItems(res.data.totalItems || 0)
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error)
      setMsg('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(1, '')
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setKeyword(searchInput.trim())
    await fetchOrders(1, searchInput.trim())
  }

  const handleClearSearch = async () => {
    setSearchInput('')
    setKeyword('')
    await fetchOrders(1, '')
  }

  const handleChangeStatus = async (orderId, status) => {
    setMsg('')

    try {
      await updateOrderStatusApi(orderId, { status })
      setMsg(`Cập nhật trạng thái đơn #${orderId} thành công`)
      await fetchOrders(page, keyword)
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error)
      const errorMsg =
        error.response?.data?.message || 'Cập nhật trạng thái thất bại'
      setMsg(errorMsg)
    }
  }

  const goToPage = async (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    await fetchOrders(newPage, keyword)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng đơn hàng: {totalItems}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo mã đơn, vd: #2"
            className="w-64 border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Tìm
          </button>

          <button
            type="button"
            onClick={handleClearSearch}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm"
          >
            Xóa
          </button>
        </form>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-gray-100 text-gray-700">
          {msg}
        </div>
      )}

      {loading ? (
        <div>Đang tải đơn hàng...</div>
      ) : (
        <>
          <div className="bg-white border rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3">Mã đơn</th>
                    <th className="text-left px-4 py-3">Khách hàng</th>
                    <th className="text-left px-4 py-3">Tài khoản</th>
                    <th className="text-left px-4 py-3">Tổng tiền</th>
                    <th className="text-left px-4 py-3">Trạng thái</th>
                    <th className="text-left px-4 py-3">Ngày tạo</th>
                    <th className="text-left px-4 py-3">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="px-4 py-3 font-medium">#{order.id}</td>

                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.phoneNumber}</p>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{order.userEmail || '-'}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {order.shippingAddress}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-semibold text-red-600">
                          {Number(order.totalAmount).toLocaleString()} đ
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-700'
                                : order.status === 'Shipping'
                                ? 'bg-purple-100 text-purple-700'
                                : order.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </td>

                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleChangeStatus(order.id, e.target.value)
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="Pending">Chưa giải quyết</option>
                            <option value="Confirmed">Đã xác nhận</option>
                            <option value="Shipping">Đang giao hàng</option>
                            <option value="Completed">Giao thành công</option>
                            <option value="Cancelled">Đã hủy</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-4 py-2 rounded-lg border ${
                    pageNumber === page
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}