export const ORDER_STATUS = {
  ON_THE_WAY: 'On the way',
  DELIVERED: 'Delivered',
}

/** Estimate arrival window from now (default 35 minutes) */
export function buildArrivalInfo(minutes = 35) {
  const now = new Date()
  const arriveFrom = new Date(now.getTime() + (minutes - 5) * 60 * 1000)
  const arriveTo = new Date(now.getTime() + (minutes + 5) * 60 * 1000)
  return {
    estimatedMinutes: minutes,
    estimatedDeliveryLabel: `${minutes - 5}-${minutes + 5} min`,
    arriveFrom: arriveFrom.toISOString(),
    arriveTo: arriveTo.toISOString(),
  }
}

/** True when the estimated arrival window end time has passed */
export function isArrivalComplete(order, now = Date.now()) {
  if (!order?.arriveTo) return false
  const end = new Date(order.arriveTo).getTime()
  return Number.isFinite(end) && end <= now
}

/** Resolve display/status based on arrival time */
export function resolveOrderStatus(order, now = Date.now()) {
  if (isArrivalComplete(order, now)) return ORDER_STATUS.DELIVERED
  return order?.status || ORDER_STATUS.ON_THE_WAY
}

export function isPastOrder(order, now = Date.now()) {
  return resolveOrderStatus(order, now) === ORDER_STATUS.DELIVERED
}

export function splitOrdersByArrival(orders = [], now = Date.now()) {
  const active = []
  const past = []
  for (const order of orders) {
    if (isPastOrder(order, now)) past.push(order)
    else active.push(order)
  }
  return { active, past }
}

export function formatDateTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatTime(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDeliveryLocation(customer = {}) {
  const parts = [
    customer.address,
    customer.landmark,
    [customer.city, customer.state].filter(Boolean).join(', '),
    customer.zip ? `PIN ${customer.zip}` : '',
  ].filter(Boolean)
  return parts.join(' · ') || 'Address not provided'
}
