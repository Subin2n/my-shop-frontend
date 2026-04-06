import { useEffect, useState } from 'react'
import { meApi, updateProfileApi } from '../api/authApi'

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: '',
    phoneNumber: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await meApi()
        const data = res.data

        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          role: data.role || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
        })
      } catch (error) {
        console.error('Lỗi lấy user:', error)
        setMsg('Không thể tải thông tin tài khoản')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setSaving(true)

    try {
      const res = await updateProfileApi({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      })

      const data = res.data

      // cập nhật lại localStorage để navbar đổi tên ngay
      const userRaw = localStorage.getItem('user')
      const oldUser = userRaw ? JSON.parse(userRaw) : {}

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...oldUser,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      )

      setMsg('Cập nhật thông tin thành công')
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error)
      const errorMsg =
        error.response?.data?.message || 'Cập nhật thông tin thất bại'
      setMsg(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-10">Đang tải dữ liệu...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thông tin tài khoản</h1>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-gray-100 text-gray-700">
          {msg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ tên
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            value={form.email}
            disabled
            className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vai trò
          </label>
          <input
            value={form.role}
            disabled
            className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2.5 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg"
        >
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </form>
    </div>
  )
}