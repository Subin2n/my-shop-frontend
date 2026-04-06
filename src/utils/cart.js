const CART_KEY = 'cart'

const emitCartChange = () => {
  window.dispatchEvent(new Event('cart-changed'))
}

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY)
  return cart ? JSON.parse(cart) : []
}

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  emitCartChange()
}

export const addToCart = (product, quantity = 1) => {
  if (!product) return { success: false, message: 'San pham khong hop le' }

  if ((product.stockQuantity ?? 0) <= 0) {
    return { success: false, message: 'San pham da het hang' }
  }

  const cart = getCart()
  const existing = cart.find((x) => x.productId === product.id)

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    })
  }

  saveCart(cart)
  return { success: true }
}

export const updateCartItem = (productId, quantity) => {
  const cart = getCart()
  const item = cart.find((x) => x.productId === productId)

  if (item) {
    item.quantity = quantity
  }

  saveCart(cart)
}

export const removeCartItem = (productId) => {
  const cart = getCart().filter((x) => x.productId !== productId)
  saveCart(cart)
}

export const clearCart = () => {
  localStorage.removeItem(CART_KEY)
  emitCartChange()
}

export const getCartCount = () => {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}