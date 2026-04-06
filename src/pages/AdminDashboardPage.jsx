import { useEffect, useState } from 'react'
import { getDashboardSummaryApi } from '../api/dashboardApi'

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getDashboardSummaryApi()
        setData(res.data)
      } catch (error) {
        console.error('Lỗi lấy Bảng:', error)
        setMsg('Không thể tải dũ liệu bảng')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-10">Đang tải bảng...</div>
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-red-600">
        {msg || 'Không có dữ liệu bảng'}
      </div>
    )
  }

  const cards = [
    { label: 'Tổng tài khoản', value: data.totalUsers },
    { label: 'Tổng sản phẩm', value: data.totalProducts },
    { label: 'Tổng đơn hàng', value: data.totalOrders },
    { label: 'Tổng doanh thu', value: `${Number(data.totalRevenue).toLocaleString()} đ` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bảng tổng hợp</h1>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-gray-100 text-gray-700">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê trạng thái đơn hàng</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <span>Chưa giải quyết</span>
              <span className="font-semibold">{data.orderStatus.pending}</span>
            </div>

            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <span>Đã xác nhận</span>
              <span className="font-semibold">{data.orderStatus.confirmed}</span>
            </div>

            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <span>Đang giao hàng</span>
              <span className="font-semibold">{data.orderStatus.shipping}</span>
            </div>

            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <span>Giao thành công</span>
              <span className="font-semibold">{data.orderStatus.completed}</span>
            </div>

            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <span>Đã hủy</span>
              <span className="font-semibold">{data.orderStatus.cancelled}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm sắp hết hàng</h2>

          {data.lowStockProducts.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm nào sắp hết.</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Gia: {Number(product.price).toLocaleString()} đ
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Ton kho</p>
                    <p className="font-semibold text-red-600">{product.stockQuantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}