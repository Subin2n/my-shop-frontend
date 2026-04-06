import { useEffect, useState } from 'react'
import { getMyOrdersApi } from '../api/orderApi'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrdersApi()
        setOrders(res.data)
      } catch (error) {
        console.error('Lỗi lấy lịch sử đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Đang tải đơn hàng...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đặt hàng</h1>

      {orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 shadow text-gray-600">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-xl p-6 shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold text-gray-800">Đơn hàng #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    Ngày tạo: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="font-medium text-red-600">{order.status}</p>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Người nhận:</span> {order.customerName}</p>
                <p><span className="font-medium">Số điện thoại:</span> {order.phoneNumber}</p>
                <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3">Sản phẩm</th>
                      <th className="text-left px-4 py-3">Số lượng</th>
                      <th className="text-left px-4 py-3">Đơn giá</th>
                      <th className="text-left px-4 py-3">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3">{item.productName}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">{item.unitPrice.toLocaleString()} đ</td>
                        <td className="px-4 py-3">{item.subTotal.toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-right">
                <p className="text-sm text-gray-500">Tổng đơn</p>
                <p className="text-lg font-bold text-red-600">
                  {order.totalAmount.toLocaleString()} đ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}