import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-xl mb-3">MY<span className="text-red-500">SHOP</span></h3>
          <p className="text-sm leading-relaxed">Hệ thống cửa hàng thể thao chuyên nghiệp, uy tín toàn quốc.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Danh mục</h4>
          <ul className="space-y-2 text-sm">
            {['Vợt cầu lông', 'Giày cầu lông', 'Balo', 'Phụ kiện'].map(i => (
              <li key={i}><Link to="/products" className="hover:text-red-400 transition-colors">{i}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm">
            {['Chính sách đổi trả', 'Hướng dẫn mua hàng', 'Bảo hành', 'Liên hệ'].map(i => (
              <li key={i}><Link to="/" className="hover:text-red-400 transition-colors">{i}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 0979.170.274</li>
            <li>📧 shop@gmail.com</li>
            <li>📍 Hà Nội & TP. HCM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © 2025 MyShop. Dự án sinh viên.
      </div>
    </footer>
  )
}