import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../api/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // cập nhật giá trị input
  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // reset form khi cần
  const resetForm = () => {
    setForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  // đổi tab đăng nhập / đăng ký
  const handleChangeTab = (nextTab) => {
    if (loading) return
    setTab(nextTab)
    setMsg('')
    resetForm()
  }

  // đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    try {
      const res = await loginApi({
        email: form.email,
        password: form.password,
      })

      const data = res.data

      // lưu token và thông tin user
      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      )

      setMsg('Đăng nhập thành công')

      // nếu có trang trước đó cần quay lại thì ưu tiên quay lại
      const redirectTo = location.state?.from?.pathname || '/'

      setTimeout(() => {
        navigate(redirectTo)
      }, 600)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại'
      setMsg(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // đăng ký
  const handleRegister = async (e) => {
    e.preventDefault()
    setMsg('')

    if (form.password !== form.confirmPassword) {
      setMsg('Mật khẩu xác nhận không khớp')
      return
    }

    if (form.password.length < 6) {
      setMsg('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      const res = await registerApi({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })

      const data = res.data

      // lưu token và thông tin user
      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      )

      setMsg('Đăng ký thành công')

      setTimeout(() => {
        navigate('/')
      }, 600)
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Đăng ký thất bại'
      setMsg(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <Link to="/">
            <span className="text-3xl font-bold text-red-600">
              MY<span className="text-gray-800">SHOP</span>
            </span>
          </Link>
        </div>

        <div className="flex border-b mb-6">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              type="button"
              disabled={loading}
              onClick={() => handleChangeTab(t)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {t === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          ))}
        </div>

        {msg && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              msg.toLowerCase().includes('thanh cong')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {msg}
          </div>
        )}

        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => setMsg('Tạm thời chưa làm chức năng quên mật khẩu')}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên
              </label>
              <input
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Nhập họ tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}