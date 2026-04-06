import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProductsApi, getCategoriesApi } from '../api/productApi'

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const priceRange = searchParams.get('priceRange') || ''
  const inStock = searchParams.get('inStock') === 'true'
  const flashSale = searchParams.get('flashSale') === 'true'
  const sortBy = searchParams.get('sortBy') || ''

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProductsApi({
            keyword,
            categoryId,
            priceRange,
            inStock,
            flashSale,
            sortBy,
          }),
          getCategoriesApi(),
        ])

        setProducts(productsRes.data || [])
        setCategories(categoriesRes.data || [])
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [keyword, categoryId, priceRange, inStock, flashSale, sortBy])

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams)

    if (value === '' || value === false || value === null || value === undefined) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }

    setSearchParams(newParams)
  }

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams)

    newParams.delete('categoryId')
    newParams.delete('priceRange')
    newParams.delete('inStock')
    newParams.delete('flashSale')
    newParams.delete('sortBy')

    setSearchParams(newParams)
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-10">Đang tải sản phẩm...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white border rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Bộ lọc sản phẩm</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                <select
                  value={categoryId}
                  onChange={(e) => updateParam('categoryId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Khoảng giá</label>
                <select
                  value={priceRange}
                  onChange={(e) => updateParam('priceRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="">Tất cả mức giá</option>
                  <option value="under_100k">Dưới 100k</option>
                  <option value="under_500k">Dưới 500k</option>
                  <option value="under_1m">Dưới 1 triệu</option>
                  <option value="1m_5m">1 triệu - 5 triệu</option>
                  <option value="over_5m">Trên 5 triệu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sắp xếp</label>
                <select
                  value={sortBy}
                  onChange={(e) => updateParam('sortBy', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="">Mặc định</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A-Z</option>
                  <option value="name_desc">Tên Z-A</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                />
                Chỉ hiện còn hàng
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={flashSale}
                  onChange={(e) => updateParam('flashSale', e.target.checked ? 'true' : '')}
                />
                Chỉ hiện flash sale
              </label>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg text-sm font-medium"
                >
                  Xóa lọc
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</h1>
              {keyword && (
                <p className="text-sm text-gray-500 mt-1">
                  Kết quả tìm kiếm cho: <span className="font-medium">{keyword}</span>
                </p>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Tìm thấy: <span className="font-medium">{products.length}</span> sản phẩm
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 shadow text-gray-600">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border rounded-xl shadow overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Không có ảnh</span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {product.categoryName || 'Chưa có danh mục'}
                    </p>

                    <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[48px]">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-red-600 font-bold">
                        {Number(product.price).toLocaleString()} đ
                      </p>

                      {product.oldPrice && product.oldPrice > product.price && (
                        <p className="text-gray-400 text-sm line-through">
                          {Number(product.oldPrice).toLocaleString()} đ
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>Tồn kho: {product.stockQuantity}</span>
                      {product.isFlashSale && (
                        <span className="text-red-600 font-medium">Flash sale</span>
                      )}
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="mt-4 inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}