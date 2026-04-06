import { useEffect, useState } from 'react'
import {
  createProductApi,
  getAllProductsForManageApi,
  updateProductActiveApi,
  updateProductApi,
} from '../api/productApi'
import {
  createCategoryApi,
  getAllCategoriesForManageApi,
} from '../api/categoryApi'

const defaultForm = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  stockQuantity: '',
  imageUrl: '',
  isActive: true,
  isFlashSale: false,
  categoryId: '',
}

const defaultCategoryForm = {
  name: '',
  icon: '',
  isActive: true,
  displayOrder: 0,
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categoryForm, setCategoryForm] = useState(defaultCategoryForm)
  const [savingCategory, setSavingCategory] = useState(false)

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getAllProductsForManageApi(),
        getAllCategoriesForManageApi(),
      ])

      setProducts(productsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Lỗi lấy dữ liệu sản phẩm:', error)
      setMsg('Không thể tải dữ liệu sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCategoryChange = (e) => {
    const { name, value, type, checked } = e.target
    setCategoryForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId(null)
  }

  const resetCategoryForm = () => {
    setCategoryForm(defaultCategoryForm)
    setShowCategoryForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setSaving(true)

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stockQuantity: Number(form.stockQuantity),
        imageUrl: form.imageUrl,
        isActive: form.isActive,
        isFlashSale: form.isFlashSale,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      }

      if (editingId) {
        await updateProductApi(editingId, payload)
        setMsg('Cập nhật sản phẩm thành công')
      } else {
        await createProductApi(payload)
        setMsg('Thêm sản phẩm thành công')
      }

      resetForm()
      await fetchData()
    } catch (error) {
      console.error('Lỗi lưu sản phẩm:', error)
      const errorMsg = error.response?.data?.message || 'Lưu sản phẩm thất bại'
      setMsg(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateCategoryInline = async (e) => {
    e.preventDefault()
    setMsg('')
    setSavingCategory(true)

    try {
      await createCategoryApi({
        name: categoryForm.name,
        icon: categoryForm.icon,
        isActive: categoryForm.isActive,
        displayOrder: Number(categoryForm.displayOrder),
      })

      const categoriesRes = await getAllCategoriesForManageApi()
      const newCategories = categoriesRes.data || []
      setCategories(newCategories)

      const createdCategory = [...newCategories]
        .sort((a, b) => b.id - a.id)[0]

      if (createdCategory) {
        setForm((prev) => ({
          ...prev,
          categoryId: createdCategory.id,
        }))
      }

      setMsg('Thêm danh mục thành công')
      resetCategoryForm()
    } catch (error) {
      console.error('Lỗi thêm danh mục nhanh:', error)
      const errorMsg =
        error.response?.data?.message || 'Thêm danh mục thất bại'
      setMsg(errorMsg)
    } finally {
      setSavingCategory(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      oldPrice: product.oldPrice ?? '',
      stockQuantity: product.stockQuantity ?? '',
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
      isFlashSale: product.isFlashSale,
      categoryId: product.categoryId ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleActive = async (product) => {
    setMsg('')

    try {
      await updateProductActiveApi(product.id, { isActive: !product.isActive })

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isActive: !product.isActive } : item
        )
      )

      setMsg(`${!product.isActive ? 'Hiện' : 'Ẩn'} sản phẩm thành công`)
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái sản phẩm:', error)
      const errorMsg =
        error.response?.data?.message || 'Cập nhật trạng thái thất bại'
      setMsg(errorMsg)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý sản phẩm</h1>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-gray-100 text-gray-700">
          {msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <div className="flex gap-2">
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowCategoryForm((prev) => !prev)}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Thêm
            </button>
          </div>
        </div>

        {showCategoryForm && (
          <div className="md:col-span-2 border rounded-xl p-4 bg-gray-50">
            <h2 className="font-semibold text-gray-800 mb-3">Thêm nhanh danh mục</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryChange}
                placeholder="Tên danh mục"
                className="border rounded-lg px-4 py-2"
              />

              <input
                name="icon"
                value={categoryForm.icon}
                onChange={handleCategoryChange}
                placeholder="Icon emoji, vd: 🏸"
                className="border rounded-lg px-4 py-2"
              />

              <input
                name="displayOrder"
                type="number"
                value={categoryForm.displayOrder}
                onChange={handleCategoryChange}
                placeholder="Thứ tự hiển thị"
                className="border rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={categoryForm.isActive}
                  onChange={handleCategoryChange}
                />
                Hiển thị ngay
              </label>

              <button
                type="button"
                onClick={handleCreateCategoryInline}
                disabled={savingCategory || !categoryForm.name.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                {savingCategory ? 'Đang thêm...' : 'Lưu danh mục'}
              </button>

              <button
                type="button"
                onClick={resetCategoryForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Giá</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Giá gốc</label>
          <input
            name="oldPrice"
            type="number"
            value={form.oldPrice}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Số lượng tồn</label>
          <input
            name="stockQuantity"
            type="number"
            value={form.stockQuantity}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ảnh URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange}
            />
            Hiển thị sản phẩm
          </label>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              id="isFlashSale"
              name="isFlashSale"
              type="checkbox"
              checked={form.isFlashSale}
              onChange={handleChange}
            />
            Đưa vào flash sale
          </label>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            {saving
              ? 'Đang lưu...'
              : editingId
              ? 'Cập nhật sản phẩm'
              : 'Thêm sản phẩm'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
            >
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Đang tải sản phẩm...</div>
      ) : (
        <div className="bg-white border rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Tên</th>
                  <th className="text-left px-4 py-3">Danh mục</th>
                  <th className="text-left px-4 py-3">Giá</th>
                  <th className="text-left px-4 py-3">Tồn kho</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.categoryName || '-'}</td>
                    <td className="px-4 py-3">{Number(product.price).toLocaleString()} đ</td>
                    <td className="px-4 py-3">{product.stockQuantity}</td>
                    <td className="px-4 py-3">
                      {product.isActive ? 'Đang hiện' : 'Đang ẩn'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-3 py-2 rounded-lg text-white text-xs ${
                            product.isActive
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {product.isActive ? 'Ẩn' : 'Hiện'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}