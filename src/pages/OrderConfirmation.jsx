import { Link, useLocation } from 'react-router-dom'
import {
  FiCheckCircle,
  FiClock,
  FiHome,
  FiMapPin,
  FiNavigation,
} from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import OrderTracking from '../components/OrderTracking'
import { formatPrice } from '../utils/format'
import {
  formatDateTime,
  formatDeliveryLocation,
  formatTime,
} from '../utils/orders'

export default function OrderConfirmation() {
  const { lastOrder } = useCart()
  const location = useLocation()
  const order = lastOrder
  const orderId = order?.id || location.state?.orderId

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          No order to show
        </h1>
        <p className="mt-2 text-muted">
          Place an order from checkout to see confirmation details.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/orders"
            className="inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="inline-flex rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const finalTotal = Math.max(
    order.totals.total - (order.promoDiscount || 0),
    0,
  )

  return (
    <div className="container-app py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-line bg-card p-6 text-center sm:p-10">
          <span className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <FiCheckCircle size={36} />
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">
            Order placed successfully!
          </h1>
          <p className="mt-2 text-muted">
            Thanks
            {order.customer?.fullName ? `, ${order.customer.fullName}` : ''}.
            Your food is being prepared and will be on its way soon.
          </p>

          <div className="mt-8 grid gap-4 rounded-2xl bg-surface p-5 text-left sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Order ID
              </p>
              <p className="mt-1 font-bold text-ink">{orderId}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Placed at
              </p>
              <p className="mt-1 font-bold text-ink">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="sm:col-span-2 rounded-xl border border-line bg-card p-4">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <FiClock className="text-brand" />
                Estimated delivery time
              </p>
              <p className="font-display text-xl font-bold text-ink">
                {formatTime(order.arriveFrom)} – {formatTime(order.arriveTo)}
              </p>
              <p className="mt-1 text-sm text-muted">
                Arriving in{' '}
                {order.estimatedDelivery || order.estimatedDeliveryLabel} from
                order time
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                <FiMapPin className="text-brand" />
                Delivery location
              </p>
              <p className="text-sm font-medium leading-relaxed text-ink">
                {formatDeliveryLocation(order.customer)}
              </p>
              {order.customer?.phone && (
                <p className="mt-1 text-sm text-muted">{order.customer.phone}</p>
              )}
            </div>
          </div>

          <div className="mt-6 text-left">
            <OrderTracking order={order} />
          </div>

          <div className="mt-8 text-left">
            <h2 className="mb-4 font-display text-xl font-bold">Ordered items</h2>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-line p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-sm text-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-lg font-bold">
              <span>Total amount</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <FiNavigation /> Track Order
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand/40"
            >
              <FiHome /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
