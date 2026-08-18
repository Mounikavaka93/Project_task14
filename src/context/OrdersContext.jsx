import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  isArrivalComplete,
  ORDER_STATUS,
  resolveOrderStatus,
  splitOrdersByArrival,
} from '../utils/orders'

const OrdersContext = createContext(null)
const ORDERS_KEY = 'cravecart-orders-v1'

function loadOrders() {
  try {
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    return Array.isArray(stored) ? markCompletedOrders(stored) : []
  } catch {
    return []
  }
}

function markCompletedOrders(list, now = Date.now()) {
  let changed = false
  const next = list.map((order) => {
    if (
      isArrivalComplete(order, now) &&
      order.status !== ORDER_STATUS.DELIVERED
    ) {
      changed = true
      return {
        ...order,
        status: ORDER_STATUS.DELIVERED,
        deliveredAt: order.deliveredAt || new Date(now).toISOString(),
      }
    }
    return order
  })
  return changed ? next : list
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  // Re-check arrival times every 15s and promote completed orders to past
  useEffect(() => {
    const tick = () => {
      const timestamp = Date.now()
      setNow(timestamp)
      setOrders((prev) => markCompletedOrders(prev, timestamp))
    }

    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  const addOrder = useCallback((order) => {
    setOrders((prev) => [
      {
        ...order,
        status: order.status || ORDER_STATUS.ON_THE_WAY,
      },
      ...prev,
    ])
  }, [])

  const getOrderById = useCallback(
    (id) => orders.find((o) => o.id === id),
    [orders],
  )

  const getOrdersForUser = useCallback(
    (email) => {
      if (!email) return orders
      return orders.filter(
        (o) =>
          o.customer?.email?.toLowerCase() === email.toLowerCase() ||
          o.userEmail?.toLowerCase() === email.toLowerCase(),
      )
    },
    [orders],
  )

  const getSplitOrdersForUser = useCallback(
    (email) => splitOrdersByArrival(getOrdersForUser(email), now),
    [getOrdersForUser, now],
  )

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      getOrderById,
      getOrdersForUser,
      getSplitOrdersForUser,
      resolveStatus: (order) => resolveOrderStatus(order, now),
    }),
    [orders, addOrder, getOrderById, getOrdersForUser, getSplitOrdersForUser, now],
  )

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) throw new Error('useOrders must be used within OrdersProvider')
  return context
}
