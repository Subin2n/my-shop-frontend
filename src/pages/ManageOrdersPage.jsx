import { Fragment, useCallback, useEffect, useState } from 'react'
import {
  getOrdersForManageApi,
  updateOrderStatusApi,
} from '../api/orderApi'

const statusOptions = [
  { value: 'Pending', label: 'Chờ xử lý' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Shipping', label: 'Đang giao hàng' },
  { value: 'Completed', label: 'Đã hoàn tất' },
  { value: 'Cancelled', label: 'Đã hủy' },
]

const statusClasses = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipping: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const getStatusLabel = (status) => {
  return statusOptions.find((item) => item.value === status)?.label || status
}

const formatMoney = (value) => {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchOrders = useCallback(async (customPage = 1, customKeyword = '') => {
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
  }, [pageSize])

  useEffect(() => {
    fetchOrders(1, '')
  }, [fetchOrders])

  const handleSearch = async (e) => {
    e.preventDefault()
    const cleanKeyword = searchInput.trim()
    setKeyword(cleanKeyword)
    setExpandedOrderId(null)
    await fetchOrders(1, cleanKeyword)
  }

  const handleClearSearch = async () => {
    setSearchInput('')
    setKeyword('')
    setExpandedOrderId(null)
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
    setExpandedOrderId(null)
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

        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm mã đơn, email, khách hàng, sản phẩm..."
            className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm"
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
                    <th className="text-left px-4 py-3">Tài khoản mua</th>
                    <th className="text-left px-4 py-3">Người nhận</th>
                    <th className="text-left px-4 py-3">Sản phẩm</th>
                    <th className="text-left px-4 py-3">Tổng tiền</th>
                    <th className="text-left px-4 py-3">Trạng thái</th>
                    <th className="text-left px-4 py-3">Ngày tạo</th>
                    <th className="text-left px-4 py-3">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const account = order.account || {}
                      const items = order.items || []
                      const isExpanded = expandedOrderId === order.id
                      const firstItems = items.slice(0, 2)

                      return (
                        <Fragment key={order.id}>
                          <tr className="border-t align-top">
                            <td className="px-4 py-3 font-semibold">#{order.id}</td>

                            <td className="px-4 py-3 min-w-56">
                              <p className="font-medium text-gray-800">
                                {account.fullName || 'Chưa có tên'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {account.email || order.userEmail || '-'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Vai trò: {account.role || '-'}
                              </p>
                            </td>

                            <td className="px-4 py-3 min-w-56">
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-xs text-gray-500">{order.phoneNumber}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {order.shippingAddress}
                              </p>
                            </td>

                            <td className="px-4 py-3 min-w-64">
                              {items.length === 0 ? (
                                <span className="text-gray-500">Chưa có chi tiết</span>
                              ) : (
                                <div className="space-y-1">
                                  {firstItems.map((item) => (
                                    <p key={`${order.id}-${item.productId}`} className="text-gray-700">
                                      {item.productName} x{item.quantity}
                                    </p>
                                  ))}
                                  {items.length > firstItems.length && (
                                    <p className="text-xs text-gray-500">
                                      +{items.length - firstItems.length} sản phẩm khác
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-3 font-semibold text-red-600 whitespace-nowrap">
                              {formatMoney(order.totalAmount)}
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  statusClasses[order.status] || 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleString('vi-VN')}
                            </td>

                            <td className="px-4 py-3 min-w-44">
                              <div className="space-y-2">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleChangeStatus(order.id, e.target.value)
                                  }
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                  {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedOrderId(isExpanded ? null : order.id)
                                  }
                                  className="w-full border border-gray-300 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm"
                                >
                                  {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-gray-50 border-t">
                              <td colSpan="8" className="px-4 py-4">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                  <div className="bg-white border rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                      Thông tin tài khoản
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                      <p><span className="font-medium">ID:</span> {account.id || order.appUserId}</p>
                                      <p><span className="font-medium">Họ tên:</span> {account.fullName || '-'}</p>
                                      <p><span className="font-medium">Email:</span> {account.email || order.userEmail || '-'}</p>
                                      <p><span className="font-medium">Vai trò:</span> {account.role || '-'}</p>
                                      <p><span className="font-medium">SĐT tài khoản:</span> {account.phoneNumber || '-'}</p>
                                    </div>
                                  </div>

                                  <div className="lg:col-span-2 bg-white border rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                      Sản phẩm đã mua
                                    </h3>

                                    {items.length === 0 ? (
                                      <p className="text-sm text-gray-500">
                                        Đơn hàng chưa có chi tiết sản phẩm.
                                      </p>
                                    ) : (
                                      <div className="space-y-3">
                                        {items.map((item) => (
                                          <div
                                            key={`${order.id}-${item.productId}-${item.productName}`}
                                            className="flex items-center justify-between gap-4 border rounded-lg p-3"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                {item.imageUrl ? (
                                                  <img
                                                    src={item.imageUrl}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                  />
                                                ) : (
                                                  <span className="text-xs text-gray-400">Ảnh</span>
                                                )}
                                              </div>
                                              <div>
                                                <p className="font-medium text-gray-800">
                                                  {item.productName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  Mã SP: {item.productId}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="text-right text-sm">
                                              <p>{formatMoney(item.unitPrice)} x {item.quantity}</p>
                                              <p className="font-semibold text-red-600">
                                                {formatMoney(item.subTotal)}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })
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
