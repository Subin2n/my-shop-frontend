import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const location = useLocation()

  // chua dang nhap thi ve trang login
  if (!token || !userRaw) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const user = JSON.parse(userRaw)

  // neu co phan quyen role thi kiem tra role
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}