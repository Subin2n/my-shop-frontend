import { useEffect, useRef, useState } from 'react'

export default function CartToast() {
  const [message, setMessage] = useState('')
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleNotification = (event) => {
      setMessage(event.detail?.message || 'Đã thêm vào giỏ hàng')

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setMessage('')
      }, 1800)
    }

    window.addEventListener('cart-notification', handleNotification)

    return () => {
      window.removeEventListener('cart-notification', handleNotification)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!message) return null

  return (
    <div className="fixed top-20 right-4 z-50 max-w-xs rounded-lg border border-green-200 bg-white px-4 py-3 text-sm font-medium text-green-700 shadow-lg">
      {message}
    </div>
  )
}
