import { FiCheckCircle, FiClock, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi'
import { formatTime, isArrivalComplete, ORDER_STATUS } from '../utils/orders'

const STEPS = [
  { key: 'placed', label: 'Order placed', icon: FiPackage },
  { key: 'preparing', label: 'Preparing', icon: FiClock },
  { key: 'on_the_way', label: 'On the way', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
]

function getActiveStepIndex(order, now = Date.now()) {
  if (!order) return 0
  if (isArrivalComplete(order, now) || order.status === ORDER_STATUS.DELIVERED) {
    return 3
  }
  const created = new Date(order.createdAt).getTime()
  const arriveFrom = new Date(order.arriveFrom).getTime()
  const arriveTo = new Date(order.arriveTo).getTime()
  const prepEnd = created + (arriveFrom - created) * 0.35

  if (now >= arriveFrom) return 2
  if (now >= prepEnd) return 1
  return 0
}

export default function OrderTracking({ order }) {
  if (!order) return null

  const active = getActiveStepIndex(order)
  const delivered = active >= 3

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            Order tracking
          </h3>
          <p className="text-sm text-muted">
            {delivered
              ? 'Your order has been delivered'
              : `ETA ${formatTime(order.arriveFrom)} – ${formatTime(order.arriveTo)}`}
          </p>
        </div>
        <span
          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
            delivered
              ? 'bg-success/10 text-success'
              : 'bg-brand-soft text-brand'
          }`}
        >
          {delivered ? ORDER_STATUS.DELIVERED : ORDER_STATUS.ON_THE_WAY}
        </span>
      </div>

      <ol className="space-y-0">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const done = index <= active
          const current = index === active
          return (
            <li key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    done
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-surface text-muted'
                  } ${current && !delivered ? 'animate-pulse-soft' : ''}`}
                >
                  <Icon size={16} />
                </span>
                {index < STEPS.length - 1 && (
                  <span
                    className={`my-1 w-0.5 flex-1 min-h-6 ${
                      index < active ? 'bg-brand' : 'bg-line'
                    }`}
                  />
                )}
              </div>
              <div className="pb-5 pt-1.5">
                <p
                  className={`text-sm font-semibold ${
                    done ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {step.label}
                </p>
                {current && step.key === 'on_the_way' && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <FiMapPin className="text-brand" />
                    Rider heading to your address
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
