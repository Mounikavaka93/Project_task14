import { formatPrice } from '../utils/format'

export default function OrderSummary({
  totals,
  promoDiscount = 0,
  showTitle = true,
  items = null,
  children,
}) {
  const finalTotal = Math.max(totals.total - promoDiscount, 0)

  return (
    <aside className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      {showTitle && (
        <h2 className="mb-1 font-display text-xl font-bold text-ink">
          Order Summary
        </h2>
      )}
      {showTitle && (
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
          Price breakdown
        </p>
      )}

      {items?.length > 0 && (
        <ul className="mb-4 max-h-48 space-y-3 overflow-y-auto border-b border-line pb-4 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="text-muted">
                {item.quantity}× {item.name}
              </span>
              <span className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-ink">
            {formatPrice(totals.subtotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Delivery fee</dt>
          <dd className="font-medium text-ink">
            {formatPrice(totals.deliveryFee)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Taxes (GST 5%)</dt>
          <dd className="font-medium text-ink">{formatPrice(totals.tax)}</dd>
        </div>
        {promoDiscount > 0 && (
          <div className="flex items-center justify-between text-success">
            <dt>Promo discount</dt>
            <dd className="font-medium">−{formatPrice(promoDiscount)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-3 text-base">
          <dt className="font-bold text-ink">Total amount</dt>
          <dd className="font-bold text-ink">{formatPrice(finalTotal)}</dd>
        </div>
      </dl>

      {children && <div className="mt-5 space-y-3">{children}</div>}
    </aside>
  )
}
