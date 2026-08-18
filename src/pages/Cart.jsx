import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import CartItem from '../components/CartItem'
import OrderSummary from '../components/OrderSummary'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Cart() {
  const { items, totals, clearCart } = useCart()
  const { pushToast } = useToast()

  if (items.length === 0) {
    return (
      <div className="container-app flex flex-col items-center py-16 text-center sm:py-20">
        <span className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-dashed border-line bg-brand-soft text-brand">
          <FiShoppingBag size={34} />
        </span>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Nothing here yet. Browse restaurants, save dishes to your wishlist, or
          reorder from past orders.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Explore restaurants
          </Link>
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand/40"
          >
            <FiHeart className="text-brand" /> Open wishlist
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Shopping cart
          </h1>
          <p className="mt-2 text-muted">
            {totals.itemCount} selected food item
            {totals.itemCount === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearCart()
            pushToast('Cart cleared', 'info')
          }}
          className="text-sm font-semibold text-nonveg hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section aria-label="Selected food items">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Selected food items
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </section>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary totals={totals}>
            <Link
              to="/checkout"
              className="flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/restaurants"
              className="flex w-full items-center justify-center rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand/40"
            >
              Continue shopping
            </Link>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}
