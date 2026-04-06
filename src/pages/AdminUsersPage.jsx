import { useEffect, useState } from 'react'
import {
  getAllUsersApi,
  updateUserRoleApi,
  updateUserActiveApi,
} from '../api/userApi'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const roleOptions = ['Admin', 'Staff', 'Customer']

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersApi()
      setUsers(res.data)
    } catch (error) {
      console.error('Lỗi lấy danh sách tài khoản:', error)
      setMsg('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateRole = async (userId, newRole) => {
    setMsg('')

    try {
      await updateUserRoleApi(userId, { role: newRole })

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      )

      setMsg(`Cập nhập role tài khoản #${userId} thành công`)
    } catch (error) {
      console.error('Lỗi cập nhập:', error)
      const errorMsg =
        error.response?.data?.message || 'Cập nhập thất bại'
      setMsg(errorMsg)
    }
  }

  const handleToggleActive = async (userId, currentActive) => {
    setMsg('')

    try {
      await updateUserActiveApi(userId, { isActive: !currentActive })

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !currentActive } : user
        )
      )

      setMsg(
        `${!currentActive ? 'Mở' : 'Khóa'} tài khoản #${userId} thành công`
      )
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái tài khoản:', error)
      const errorMsg =
        error.response?.data?.message || 'Cập nhật trạng thái thất bại'
      setMsg(errorMsg)
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-10">Đang tải tài khoản...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý tài khoản</h1>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-gray-100 text-gray-700">
          {msg}
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 shadow text-gray-600">
          Chưa có tài khỏan nào.
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Họ tẻn</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3">Ngày tạo</th>
                  <th className="text-left px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>

                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <span className="text-green-600 font-medium">Đang họat động</span>
                      ) : (
                        <span className="text-red-600 font-medium">Đã khóa</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={`px-4 py-2 rounded-lg text-white text-sm ${
                          user.isActive
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {user.isActive ? 'Khóa tài khoản' : 'Mở tài khoản'}
                      </button>
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