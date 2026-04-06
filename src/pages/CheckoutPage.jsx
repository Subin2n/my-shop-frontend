import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrderApi } from '../api/orderApi'
import { meApi } from '../api/authApi'
import { clearCart, getCart } from '../utils/cart'

export default function CheckoutPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    shippingAddress: '',
  })

  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const cartData = getCart()
    setCart(cartData)

    const fetchProfile = async () => {
      try {
        const res = await meApi()
        const data = res.data

        setForm((prev) => ({
          ...prev,
          customerName: data.fullName || '',
          phoneNumber: data.phoneNumber || '',
          shippingAddress: data.address || '',
        }))
      } catch (error) {
        console.error('Lỗi lấy profile checkout:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')

    const cartItems = getCart().map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    if (cartItems.length === 0) {
      setMsg('Giỏ hàng rỗng')
      return
    }

    setLoading(true)

    try {
      await createOrderApi({
        customerName: form.customerName,
        phoneNumber: form.phoneNumber,
        shippingAddress: form.shippingAddress,
        items: cartItems,
      })

      clearCart()
      setMsg('Đặt hàng thành công')

      setTimeout(() => {
        navigate('/orders')
      }, 800)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đặt hàng thất bại'
      setMsg(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      {msg && (
        <div className="mb-4 p-3 rounded bg-gray-100 text-sm">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow border space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Tên người nhận</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng</label>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? 'Đang đặt hàng...' : 'Đặt hàng'}
          </button>
        </form>

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Giỏ hàng rỗng.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-4 border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-red-600">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <p className="font-semibold text-gray-700">Tổng cộng</p>
                <p className="text-xl font-bold text-red-600">
                  {total.toLocaleString()} đ
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}