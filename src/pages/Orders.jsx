import { Link, Navigate } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiMapPin, FiPackage } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import {
  formatDateTime,
  formatTime,
  formatDeliveryLocation,
  ORDER_STATUS,
} from '../utils/orders'
import { formatPrice } from '../utils/format'

function StatusBadge({ status }) {
  const isPast = status === ORDER_STATUS.DELIVERED
  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
        isPast
          ? 'bg-success/10 text-success'
          : 'bg-brand-soft text-brand'
      }`}
    >
      {status}
    </span>
  )
}

function OrderCard({ order, status }) {
  const total = Math.max(
    (order.totals?.total || 0) - (order.promoDiscount || 0),
    0,
  )
  const isPast = status === ORDER_STATUS.DELIVERED

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 sm:px-5">
        <div>
          <p className="font-bold text-ink">Order {order.id}</p>
          <p className="text-xs text-muted">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <FiClock className="text-brand" />
            {isPast ? 'Delivered by' : 'Arrival time'}
          </p>
          <p className="font-bold text-ink">
            {formatTime(order.arriveFrom)} – {formatTime(order.arriveTo)}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {isPast
              ? 'Moved to past orders after arrival window'
              : `ETA ${order.estimatedDelivery || order.estimatedDeliveryLabel}`}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <FiMapPin className="text-brand" /> Delivery location
          </p>
          <p className="text-sm font-medium leading-relaxed text-ink">
            {formatDeliveryLocation(order.customer)}
          </p>
          {order.customer?.phone && (
            <p className="mt-1 text-sm text-muted">{order.customer.phone}</p>
          )}
        </div>
      </div>

      <ul className="space-y-2 border-t border-line px-4 py-4 sm:px-5">
        {order.items?.map((item) => (
          <li key={item.id} className="flex items-center gap-3 text-sm">
            <img
              src={item.image}
              alt={item.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{item.name}</p>
              <p className="text-muted">Qty {item.quantity}</p>
            </div>
            <p className="font-bold">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-line px-4 py-3 sm:px-5">
        <span className="text-sm text-muted">
          Paid via {(order.paymentMethod || 'upi').toUpperCase()}
        </span>
        <span className="text-lg font-bold">{formatPrice(total)}</span>
      </div>
    </article>
  )
}

function OrderSection({ title, description, orders, resolveStatus, emptyText }) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-10 text-center">
          <p className="text-sm text-muted">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              status={resolveStatus(order)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function Orders() {
  const { user, isLoggedIn } = useAuth()
  const { getOrdersForUser, getSplitOrdersForUser, resolveStatus } = useOrders()

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: '/orders' }} />
  }

  const allOrders = getOrdersForUser(user.email)
  const { active, past } = getSplitOrdersForUser(user.email)

  return (
    <div className="container-app py-8 sm:py-10">
      <Link
        to="/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <FiArrowLeft /> Back to profile
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">My orders</h1>
        <p className="mt-1 text-muted">
          Active orders move to past automatically when the arrival time ends
        </p>
      </div>

      {allOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <FiPackage className="mx-auto mb-3 text-muted" size={32} />
          <p className="font-semibold text-ink">No orders placed yet</p>
          <Link
            to="/restaurants"
            className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Order now
          </Link>
        </div>
      ) : (
        <>
          <OrderSection
            title="Active orders"
            description="On the way — waiting for the estimated arrival window"
            orders={active}
            resolveStatus={resolveStatus}
            emptyText="No active orders right now"
          />
          <OrderSection
            title="Past orders"
            description="Delivered after the arrival time was completed"
            orders={past}
            resolveStatus={resolveStatus}
            emptyText="No past orders yet"
          />
        </>
      )}
    </div>
  )
}
