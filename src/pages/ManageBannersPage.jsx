import { useEffect, useState } from 'react'
import {
  createBannerApi,
  deleteBannerApi,
  getAllBannersApi,
  updateBannerApi,
} from '../api/bannerApi'

const defaultForm = {
  title: '',
  subtitle: '',
  imageUrl: '',
  tag: '',
  buttonText: '',
  link: '',
  isActive: true,
  displayOrder: 0,
}

export default function ManageBannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultForm)

  const fetchBanners = async () => {
    try {
      const res = await getAllBannersApi()
      setBanners(res.data || [])
    } catch (error) {
      console.error('Lỗi lấy banner:', error)
      setMsg('Không thể tải danh sách banner')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
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
        title: form.title,
        subtitle: form.subtitle,
        imageUrl: form.imageUrl,
        tag: form.tag,
        buttonText: form.buttonText,
        link: form.link,
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder),
      }

      if (editingId) {
        await updateBannerApi(editingId, payload)
        setMsg('Cập nhật banner thành công')
      } else {
        await createBannerApi(payload)
        setMsg('Thêm banner thành công')
      }

      resetForm()
      await fetchBanners()
    } catch (error) {
      console.error('Lỗi lưu banner:', error)
      const errorMsg = error.response?.data?.message || 'Lưu banner thất bại'
      setMsg(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingId(banner.id)
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      tag: banner.tag || '',
      buttonText: banner.buttonText || '',
      link: banner.link || '',
      isActive: banner.isActive,
      displayOrder: banner.displayOrder ?? 0,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm('Bạn chắc chắn muốn xóa banner này?')
    if (!ok) return

    try {
      await deleteBannerApi(id)
      setMsg('Xóa banner thành công')
      await fetchBanners()
    } catch (error) {
      console.error('Lỗi xóa banner:', error)
      const errorMsg = error.response?.data?.message || 'Xóa banner thất bại'
      setMsg(errorMsg)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý banner</h1>

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
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tag</label>
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Ví dụ: HOT, SALE 50%"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
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

        <div>
          <label className="block text-sm font-medium mb-1">Link khi bấm</label>
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="/products hoặc /products?categoryId=1"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text nút bấm</label>
          <input
            name="buttonText"
            value={form.buttonText}
            onChange={handleChange}
            placeholder="Ví dụ: Khám phá"
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

        <div className="md:col-span-2 flex items-center gap-3">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Hiển thị banner
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
              ? 'Cập nhật banner'
              : 'Thêm banner'}
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
        <div>Đang tải banner...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border rounded-xl shadow overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {banner.imageUrl ? (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Không có ảnh</span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-500">
                  #{banner.id} · Thứ tự: {banner.displayOrder}
                </p>

                {banner.tag && (
                  <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                    {banner.tag}
                  </span>
                )}

                <h2 className="text-lg font-bold text-gray-800">{banner.title}</h2>
                <p className="text-sm text-gray-600">{banner.subtitle}</p>

                <p className="text-sm text-gray-500">
                  Nút bấm: {banner.buttonText || '-'}
                </p>

                <p className="text-sm text-gray-500 break-all">
                  Link: {banner.link || '-'}
                </p>

                <p className="text-sm">
                  Trạng thái:{' '}
                  {banner.isActive ? (
                    <span className="text-green-600 font-medium">Đang hiện</span>
                  ) : (
                    <span className="text-red-600 font-medium">Đang ẩn</span>
                  )}
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}