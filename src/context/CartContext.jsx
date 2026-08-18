import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_DELIVERY_FEE, TAX_RATE } from '../data/mockData'
import { buildArrivalInfo } from '../utils/orders'

const CartContext = createContext(null)

const STORAGE_KEY = 'cravecart-cart-inr-v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [lastOrder, setLastOrder] = useState(null)
  const [cartBump, setCartBump] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const bumpCart = () => setCartBump((n) => n + 1)

  const addToCart = (food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === food.id)
      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { ...food, quantity }]
    })
    bumpCart()
  }

  const updateQuantity = (id, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.id !== id)
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
    bumpCart()
  }

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setItems([])

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const deliveryFee = items.length ? DEFAULT_DELIVERY_FEE : 0
    const tax = subtotal * TAX_RATE
    const total = subtotal + deliveryFee + tax
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return { subtotal, deliveryFee, tax, total, itemCount }
  }, [items])

  const placeOrder = (checkoutData) => {
    const arrival = buildArrivalInfo(35)
    const order = {
      id: `CC${Date.now().toString().slice(-8)}`,
      items: [...items],
      totals: { ...totals },
      ...checkoutData,
      ...arrival,
      estimatedDelivery: arrival.estimatedDeliveryLabel,
      createdAt: new Date().toISOString(),
      status: 'On the way',
    }
    setLastOrder(order)
    clearCart()
    return order
  }

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totals,
    lastOrder,
    setLastOrder,
    placeOrder,
    cartBump,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
