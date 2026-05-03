import { useEffect, useState } from 'react'
import { getDashboardSummaryApi } from '../api/dashboardApi'

const formatMoney = (value) => {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

const activityLabels = {
  User: 'Tài khoản',
  Order: 'Đơn hàng',
  Product: 'Sản phẩm',
  Category: 'Danh mục',
  Banner: 'Banner',
}

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
        console.error('Lỗi lấy bảng tổng hợp:', error)
        setMsg('Không thể tải dữ liệu bảng tổng hợp')
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-10">Đang tải bảng tổng hợp...</div>
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-red-600">
        {msg || 'Không có dữ liệu bảng tổng hợp'}
      </div>
    )
  }

  const orderStatus = data.orderStatus || {}
  const lowStockProducts = data.lowStockProducts || []
  const recentActivities = data.recentActivities || []

  const cards = [
    { label: 'Tổng tài khoản', value: data.totalUsers },
    { label: 'Tổng sản phẩm', value: data.totalProducts },
    { label: 'Tổng đơn hàng', value: data.totalOrders },
    { label: 'Tổng doanh thu', value: formatMoney(data.totalRevenue) },
  ]

  const statusRows = [
    { label: 'Chờ xử lý', value: orderStatus.pending, className: 'text-yellow-700' },
    { label: 'Đã xác nhận', value: orderStatus.confirmed, className: 'text-blue-700' },
    { label: 'Đang giao hàng', value: orderStatus.shipping, className: 'text-purple-700' },
    { label: 'Đã hoàn tất', value: orderStatus.completed, className: 'text-green-700' },
    { label: 'Đã hủy', value: orderStatus.cancelled, className: 'text-red-700' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bảng tổng hợp</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tài khoản, đơn hàng, tồn kho và hoạt động gần đây.
          </p>
        </div>
      </div>

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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Thống kê trạng thái đơn hàng
          </h2>

          <div className="space-y-4">
            {statusRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border rounded-lg px-4 py-3"
              >
                <span>{row.label}</span>
                <span className={`font-semibold ${row.className}`}>
                  {row.value || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sản phẩm sắp hết hàng
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm nào sắp hết.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Giá: {formatMoney(product.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Tồn kho</p>
                    <p className="font-semibold text-red-600">{product.stockQuantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white border rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Log hoạt động trên web
            </h2>
            <p className="text-sm text-gray-500">
              Hiển thị {recentActivities.length} hoạt động trong {data.activityWindowHours || 24} giờ gần đây.
            </p>
          </div>
        </div>

        {recentActivities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            Chưa có hoạt động nào trong 24 giờ gần đây.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3">Thời gian</th>
                  <th className="text-left px-4 py-3">Người thao tác</th>
                  <th className="text-left px-4 py-3">Phân hệ</th>
                  <th className="text-left px-4 py-3">Hành động</th>
                  <th className="text-left px-4 py-3">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity, index) => (
                  <tr key={`${activity.entityType}-${activity.entityId}-${activity.createdAt}-${index}`} className="border-t">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">
                        {activity.actorName || activity.actorEmail || 'Hệ thống'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.actorEmail || '-'} {activity.actorRole ? `- ${activity.actorRole}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {activityLabels[activity.entityType] || activity.entityType}
                      {activity.entityId ? ` #${activity.entityId}` : ''}
                    </td>
                    <td className="px-4 py-3 font-medium">{activity.action}</td>
                    <td className="px-4 py-3 text-gray-600 min-w-80">
                      {activity.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
