import { useEffect, useState } from 'react'
import {
  createCategoryApi,
  getAllCategoriesForManageApi,
  updateCategoryActiveApi,
  updateCategoryApi,
} from '../api/categoryApi'

const defaultForm = {
  name: '',
  icon: '',
  isActive: true,
  displayOrder: 0,
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)

  const fetchCategories = async () => {
    try {
      const res = await getAllCategoriesForManageApi()
      setCategories(res.data)
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error)
      setMsg('Không thể tải danh sách danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setSaving(true)

    try {
      const payload = {
        name: form.name,
        icon: form.icon,
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder),
      }

      if (editingId) {
        await updateCategoryApi(editingId, payload)
        setMsg('Cập nhập danh mục thành công')
      } else {
        await createCategoryApi(payload)
        setMsg('Thêm danh mục thành công')
      }

      resetForm()
      await fetchCategories()
    } catch (error) {
      console.error('Lỗi lưu danh mục:', error)
      const errorMsg = error.response?.data?.message || 'Lưu danh mục thất bại'
      setMsg(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name || '',
      icon: category.icon || '',
      isActive: category.isActive,
      displayOrder: category.displayOrder ?? 0,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleActive = async (category) => {
    setMsg('')

    try {
      await updateCategoryActiveApi(category.id, { isActive: !category.isActive })

      setCategories((prev) =>
        prev.map((item) =>
          item.id === category.id ? { ...item, isActive: !category.isActive } : item
        )
      )

      setMsg(`${!category.isActive ? 'Hiện' : 'Ẩn'} danh mục thành công`)
    } catch (error) {
      console.error('Lỗi cập nhập trạng thái danh mục:', error)
      const errorMsg =
        error.response?.data?.message || 'Cập nhập trạng thái thất bại'
      setMsg(errorMsg)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý danh mục</h1>

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
          <label className="block text-sm font-medium mb-1">Tên danh mục</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Icon emoji</label>
          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="Vi du: 🏸"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
          <input
            name="displayOrder"
            type="number"
            value={form.displayOrder}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-3 mt-7">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Hiển thị danh mục
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
              ? 'Cập nhập danh mục'
              : 'Thêm danh mục'}
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
        <div>Đang tải danh mục...</div>
      ) : (
        <div className="bg-white border rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Icon</th>
                  <th className="text-left px-4 py-3">Tên</th>
                  <th className="text-left px-4 py-3">Thứ tự</th>
                  <th className="text-left px-4 py-3">Số sản phẩm</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t">
                    <td className="px-4 py-3">{category.id}</td>
                    <td className="px-4 py-3 text-2xl">{category.icon || '📁'}</td>
                    <td className="px-4 py-3">{category.name}</td>
                    <td className="px-4 py-3">{category.displayOrder}</td>
                    <td className="px-4 py-3">{category.productCount}</td>
                    <td className="px-4 py-3">
                      {category.isActive ? (
                        <span className="text-green-600 font-medium">Đang hiện</span>
                      ) : (
                        <span className="text-red-600 font-medium">Đang ẩn</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => handleToggleActive(category)}
                          className={`px-3 py-2 rounded-lg text-white text-xs ${
                            category.isActive
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {category.isActive ? 'Ẩn' : 'Hiện'}
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