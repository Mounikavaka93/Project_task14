import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const lineTotal = item.price * item.quantity

  return (
    <div className="flex gap-3 rounded-2xl border border-line bg-card p-3 sm:gap-4 sm:p-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-line sm:h-24 sm:w-24">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`inline-block h-3 w-3 shrink-0 rounded-sm border-2 ${
                  item.isVeg ? 'border-veg' : 'border-nonveg'
                }`}
                title={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
              >
                <span
                  className={`m-[2px] block h-1 w-1 rounded-[1px] ${
                    item.isVeg ? 'bg-veg' : 'bg-nonveg'
                  }`}
                />
              </span>
              <h3 className="truncate font-bold text-ink">{item.name}</h3>
            </div>

            {/* Item price */}
            <p className="text-sm text-muted">
              Item price:{' '}
              <span className="font-semibold text-ink">
                {formatPrice(item.price)}
              </span>
            </p>
          </div>

          {/* Remove item */}
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-2 text-xs font-semibold text-muted transition hover:border-nonveg/40 hover:bg-red-50 hover:text-nonveg sm:px-3"
            aria-label={`Remove ${item.name}`}
          >
            <FiTrash2 size={15} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quantity increase / decrease */}
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Quantity
            </p>
            <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-card"
                aria-label="Decrease quantity"
              >
                <FiMinus size={14} />
              </button>
              <span className="min-w-8 text-center text-sm font-bold">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark"
                aria-label="Increase quantity"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              Line total
            </p>
            <p className="text-base font-bold text-ink">
              {formatPrice(lineTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
