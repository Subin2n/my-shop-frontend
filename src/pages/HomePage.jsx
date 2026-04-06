import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addToCart } from '../utils/cart'
import {
  getProductsApi,
  getFlashSaleProductsApi,
  getCategoriesApi,
} from '../api/productApi'
import { getBannersApi } from '../api/bannerApi'

const fmt = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ'

function ProductCard({ product, showDiscount = false }) {
  const handleAddToCart = (e) => {
    e.preventDefault()

    const result = addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || '',
        stockQuantity: product.stockQuantity ?? 0,
      },
      1
    )

    if (!result.success) {
      alert(result.message)
    }
  }

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="relative bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl">🛍️</span>
        )}

        {showDiscount && discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs text-gray-500">
          {product.categoryName || 'Chưa có danh mục'}
        </p>

        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug">
          {product.name}
        </p>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-red-600 font-bold text-base">
            {fmt(product.price)}
          </span>

          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-gray-400 text-xs line-through">
              {fmt(product.oldPrice)}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Tồn kho {product.stockQuantity ?? 0}
        </p>

        {(product.stockQuantity ?? 0) > 0 ? (
          <button
            onClick={handleAddToCart}
            className="mt-auto w-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            Thêm vào giỏ
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="mt-auto w-full bg-gray-200 text-gray-500 border border-gray-200 text-xs font-semibold py-1.5 rounded-lg cursor-not-allowed"
          >
            Hết hàng
          </button>
        )}
      </div>
    </Link>
  )
}

function useCountdown(initialSeconds) {
  const [sec, setSec] = useState(initialSeconds)

  useEffect(() => {
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const h = String(Math.floor(sec / 3600)).padStart(2, '0')
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')

  return `${h}:${m}:${s}`
}

function BannerSlider({ banners }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!banners.length) return

    const t = setInterval(() => {
      setActive((i) => (i + 1) % banners.length)
    }, 4000)

    return () => clearInterval(t)
  }, [banners])

  if (!banners.length) {
    return (
      <div className="rounded-2xl h-60 md:h-80 bg-gradient-to-r from-red-600 to-red-800 flex items-center px-8 md:px-16">
        <div>
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            MYSHOP
          </span>
          <h2 className="text-white text-2xl md:text-4xl font-black leading-tight mb-2">
            Chào mừng đến với MyShop
          </h2>
          <p className="text-white/80 text-sm md:text-base mb-5">
            Khám phá sản phẩm nổi bật và ưu đãi mới nhất
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-red-600 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-yellow-300 hover:text-red-700 transition-colors shadow-lg"
          >
            Mua ngay →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl h-60 md:h-80 select-none">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/35 z-10" />

          {b.imageUrl ? (
            <img
              src={b.imageUrl}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500" />
          )}

          <div className="relative z-20 h-full flex items-center px-8 md:px-16">
            <div className="max-w-2xl">
              {b.tag && (
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {b.tag}
                </span>
              )}

              <h2 className="text-white text-2xl md:text-4xl font-black leading-tight mb-2">
                {b.title}
              </h2>

              {b.subtitle && (
                <p className="text-white/80 text-sm md:text-base mb-5">
                  {b.subtitle}
                </p>
              )}

              <Link
                to={b.link || '/products'}
                className="inline-block bg-white text-red-600 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-yellow-300 hover:text-red-700 transition-colors shadow-lg"
              >
                {b.buttonText || 'Khám phá'} →
              </Link>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === active ? 'bg-white w-5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setActive((a) => (a - 1 + banners.length) % banners.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors"
          >
            ‹
          </button>

          <button
            onClick={() => setActive((a) => (a + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}

export default function HomePage() {
  const countdown = useCountdown(5 * 3600 + 23 * 60 + 11)

  const [products, setProducts] = useState([])
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, flashSaleRes, categoriesRes, bannersRes] =
          await Promise.all([
            getProductsApi(),
            getFlashSaleProductsApi(),
            getCategoriesApi(),
            getBannersApi(),
          ])

        setProducts(productsRes.data || [])
        setFlashSaleProducts(flashSaleRes.data || [])
        setCategories(categoriesRes.data || [])
        setBanners(bannersRes.data || [])
      } catch (error) {
        console.error('Lỗi lấy dữ liệu trang chủ:', error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = selectedCategoryId
    ? products.filter((p) => String(p.categoryId) === String(selectedCategoryId))
    : products

  const featuredProducts = filteredProducts.slice(0, 8)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        <section>
          <BannerSlider banners={banners} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-600 rounded-full inline-block"></span>
              Danh mục sản phẩm
            </h2>

            <button
              type="button"
              onClick={() => setSelectedCategoryId('')}
              className="text-sm text-red-600 hover:underline font-medium"
            >
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`group flex flex-col items-center gap-2 bg-white rounded-xl p-3 border transition-all duration-200 ${
                  String(selectedCategoryId) === String(cat.id)
                    ? 'border-red-500 shadow-md'
                    : 'border-gray-100 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {cat.icon || '📁'}
                </div>

                <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {cat.name}
                </p>

                <p className="text-[10px] text-gray-400">
                  {cat.productCount} SP
                </p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full inline-block"></span>
                {selectedCategoryId ? 'Sản phẩm theo danh mục' : 'Sản phẩm nổi bật'}
              </h2>

              {selectedCategoryId && (
                <p className="text-sm text-gray-500 mt-1">
                  Đang lọc theo danh mục đã chọn
                </p>
              )}
            </div>

            <Link
              to={selectedCategoryId ? `/products?categoryId=${selectedCategoryId}` : '/products'}
              className="text-sm text-red-600 hover:underline font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {loadingProducts ? (
            <div className="bg-white rounded-xl p-6 text-gray-500 border">
              Đang tải sản phẩm...
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-gray-500 border">
              Không có sản phẩm nào trong danh mục này.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <h2 className="text-white text-xl font-black tracking-wide">
                    FLASH SALE
                  </h2>
                  <p className="text-white/80 text-xs">
                    Giảm sốc - Số lượng có hạn
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/90 text-sm font-medium">
                  Kết thúc sau:
                </span>

                <div className="flex gap-1">
                  {countdown.split(':').map((unit, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="bg-white text-red-600 font-black text-base w-9 h-9 flex items-center justify-center rounded-lg shadow">
                        {unit}
                      </span>
                      {i < 2 && (
                        <span className="text-white font-black text-lg">:</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/products?flashSale=true"
                className="bg-white text-red-600 font-bold text-sm px-5 py-2 rounded-full hover:bg-yellow-300 transition-colors shadow"
              >
                Xem tất cả →
              </Link>
            </div>

            {flashSaleProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-gray-500">
                Chưa có sản phẩm flash sale.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {flashSaleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} showDiscount />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}