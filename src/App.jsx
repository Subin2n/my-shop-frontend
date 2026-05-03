import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartToast from './components/CartToast'
import ProtectedRoute from './components/ProtectedRoute'
import AdminCategoriesPage from './pages/AdminCategoriesPage'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import AdminUsersPage from './pages/AdminUsersPage'
import ManageProductsPage from './pages/ManageProductsPage'
import ManageOrdersPage from './pages/ManageOrdersPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ManageBannersPage from './pages/ManageBannersPage'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <CartToast />
      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['Customer']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute roles={['Admin', 'Staff']}>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute roles={['Admin', 'Staff']}>
                <ManageBannersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['Customer', 'Staff', 'Admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['Admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['Admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage/products"
            element={
              <ProtectedRoute roles={['Admin', 'Staff']}>
                <ManageProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage/orders"
            element={
              <ProtectedRoute roles={['Admin', 'Staff']}>
                <ManageOrdersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
