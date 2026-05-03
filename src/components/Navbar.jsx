import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCartCount } from '../utils/cart'

const getStoredUser = () => {
  const userRaw = localStorage.getItem('user')
  return userRaw ? JSON.parse(userRaw) : null
}

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [cartCount, setCartCount] = useState(() => getCartCount())

  const navigate = useNavigate()
  useLocation()
  const menuRef = useRef(null)
  const currentUser = getStoredUser()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getCartCount())
    }

    window.addEventListener('cart-changed', syncCartCount)

    return () => {
      window.removeEventListener('cart-changed', syncCartCount)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setShowMenu(false)
    navigate('/login')
  }

  const role = currentUser?.role

  const handleSearch = () => {
    const keyword = search.trim()

    if (!keyword) {
      navigate('/products')
      return
    }

    navigate(`/products?keyword=${encodeURIComponent(keyword)}`)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-red-600 text-white text-xs py-1.5 text-center">
        Web bán hàng MyShop - bán mọi thứ bạn muốn - Liên hệ qua Email - Thuyvit102827@gmail.com
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-black text-red-600">
            MY<span className="text-gray-800">SHOP</span>
          </span>
        </Link>

        <div className="flex-1 flex">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:border-red-400"
          />
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-r-lg text-sm font-medium transition-colors"
          >
            Tìm
          </button>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                  {currentUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800 max-w-[140px] truncate">
                    {currentUser.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {currentUser.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  {role === 'Customer' && (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/profile')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Thông tin tài khoản
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/orders')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Lịch sử đặt hàng
                      </button>
                    </>
                  )}

                  {(role === 'Staff' || role === 'Admin') && (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/admin/categories')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Quản lý danh mục
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/admin/banners')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Quản lý banner
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/manage/products')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Quản lý sản phẩm
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/manage/orders')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Quản lý đơn hàng
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/profile')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Thông tin tài khoản
                      </button>
                    </>
                  )}

                  {role === 'Admin' && (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/admin/dashboard')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Bảng hiển thị 
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate('/admin/users')
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        Quản lý tài khoản
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t"
                  >
                    Đăng xuất 
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm text-gray-700 hover:text-red-600 font-medium hidden md:block"
            >
              Đăng nhập
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            🛒 Giỏ hàng
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      <nav className="border-t">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-1 overflow-x-auto">
            {[
              { label: 'Trang chủ', path: '/' },
              { label: 'Sản phẩm', path: '/products' },
              { label: 'Giảm giá - WIP 🔥', path: '/products' },
              { label: 'Tin tức - WIP', path: '/' },
              { label: 'Liên hệ - WIP', path: '/' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 whitespace-nowrap transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
