import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductByIdApi } from '../api/productApi'
import { addToCart } from '../utils/cart'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id)
        setProduct(res.data)
      } catch (error) {
        console.error('Lỗi lấy chi tiết sản phẩm:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncrease = () => {
    if (!product) return
    if ((product.stockQuantity ?? 0) <= 0) return
    setQuantity((prev) => Math.min(product.stockQuantity, prev + 1))
  }

  const handleChangeQuantity = (e) => {
    const value = Number(e.target.value)

    if (!product) return

    if (!value || value < 1) {
      setQuantity(1)
      return
    }

    if (value > product.stockQuantity) {
      setQuantity(product.stockQuantity)
      return
    }

    setQuantity(value)
  }

  const handleAddToCart = () => {
    if (!product) return

    const result = addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        stockQuantity: product.stockQuantity ?? 0,
      },
      quantity
    )

    if (result.success) {
      setMsg('')
    } else {
      setMsg(result.message)
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Đang tải chi tiết sản phẩm...</div>
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Không tìm thấy sản phẩm.</div>
  }

  const isOutOfStock = (product.stockQuantity ?? 0) <= 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-gray-100 text-gray-700">
          {msg}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">Không có ảnh</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

          <p className="text-red-600 text-2xl font-bold mt-4">
            {Number(product.price).toLocaleString()} đ
          </p>

          {product.oldPrice && product.oldPrice > product.price && (
            <p className="text-gray-400 line-through mt-1">
              {Number(product.oldPrice).toLocaleString()} đ
            </p>
          )}

          <p className="text-gray-500 mt-2">
            Tồn kho: {product.stockQuantity}
          </p>

          {isOutOfStock && (
            <p className="text-red-600 font-medium mt-2">Sản phẩm hiện đã hết hàng</p>
          )}

          <div className="mt-6">
            <h2 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Chưa có mô tả'}
            </p>
          </div>

          {!isOutOfStock && (
            <div className="mt-8">
              <p className="text-sm font-medium text-gray-700 mb-2">Số lượng</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrease}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  max={product.stockQuantity || 1}
                  value={quantity}
                  onChange={handleChangeQuantity}
                  className="w-20 text-center border border-gray-300 rounded-lg px-2 py-2"
                />

                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="mt-8 bg-gray-300 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed"
            >
              Hết hàng
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Thêm vào giỏ hàng
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
