import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, removeCartItem, updateCartItem } from '../utils/cart'

export default function CartPage() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  const loadCart = () => {
    setCart(getCart())
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return
    updateCartItem(item.productId, item.quantity - 1)
    loadCart()
  }

  const handleIncrease = (item) => {
    updateCartItem(item.productId, item.quantity + 1)
    loadCart()
  }

  const handleRemove = (productId) => {
    removeCartItem(productId)
    loadCart()
  }

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
        <div className="bg-white border rounded-xl p-6 shadow text-gray-600">
          Giỏ hàng rỗng.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="bg-white border rounded-xl p-4 shadow flex flex-col md:flex-row gap-4"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Không có ảnh</span>
              )}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-red-600 font-bold mt-1">
                {Number(item.price).toLocaleString()} đ
              </p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => handleDecrease(item)}
                  className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  -
                </button>

                <span className="min-w-[24px] text-center">{item.quantity}</span>

                <button
                  onClick={() => handleIncrease(item)}
                  className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end">
              <p className="font-bold text-gray-800">
                {(item.price * item.quantity).toLocaleString()} đ
              </p>

              <button
                onClick={() => handleRemove(item.productId)}
                className="text-red-600 hover:underline text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">Tổng đơn tạm tính</p>
          <p className="text-2xl font-bold text-red-600">
            {total.toLocaleString()} đ
          </p>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </div>
  )
}