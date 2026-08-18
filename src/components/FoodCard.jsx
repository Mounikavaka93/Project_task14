import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiMinus, FiPlus, FiStar } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'

export default function FoodCard({ food, showRestaurant = false }) {
  const { items, addToCart, updateQuantity } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { pushToast } = useToast()
  const cartItem = items.find((item) => item.id === food.id)
  const inCartQty = cartItem?.quantity || 0
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const wished = isWishlisted(food.id)

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(food, qty)
    setJustAdded(true)
    pushToast(`Added ${food.name} to cart`, 'success')
    setTimeout(() => setJustAdded(false), 1200)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(food.id)
    pushToast(
      wished
        ? `Removed ${food.name} from wishlist`
        : `Saved ${food.name} to wishlist`,
      wished ? 'info' : 'success',
    )
  }

  const bumpCart = (e, nextQty) => {
    e.preventDefault()
    e.stopPropagation()
    updateQuantity(food.id, nextQty)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition duration-200 hover:border-brand/30 hover:shadow-md">
      <Link
        to={`/food/${food.id}`}
        className="relative aspect-[4/3] overflow-hidden bg-line"
      >
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-md border-2 bg-card px-1.5 py-0.5 text-[10px] font-bold ${
            food.isVeg ? 'border-veg text-veg' : 'border-nonveg text-nonveg'
          }`}
          title={food.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
        >
          <span
            className={`h-2 w-2 rounded-sm ${food.isVeg ? 'bg-veg' : 'bg-nonveg'}`}
          />
          {food.isVeg ? 'VEG' : 'NON-VEG'}
        </span>
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            wished
              ? 'border-brand bg-brand text-white'
              : 'border-line bg-card/95 text-ink hover:text-brand'
          }`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart className={wished ? 'fill-current' : ''} size={16} />
        </button>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-card/95 px-2 py-1 text-xs font-bold text-ink">
          <FiStar className="fill-amber-400 text-amber-400" size={12} />
          {food.rating}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/food/${food.id}`}>
          <h3 className="font-bold leading-snug text-ink transition hover:text-brand">
            {food.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted">{food.description}</p>
        {showRestaurant && food.restaurantName && (
          <p className="text-xs font-medium text-brand">{food.restaurantName}</p>
        )}
        <p className="mt-1 text-lg font-bold text-ink">
          {formatPrice(food.price)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-line bg-surface p-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQty((q) => Math.max(1, q - 1))
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink transition hover:bg-card"
            >
              <FiMinus size={14} />
            </button>
            <span className="min-w-6 text-center text-sm font-bold">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQty((q) => q + 1)
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="min-w-0 flex-1 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] sm:flex-none sm:px-3.5"
          >
            {justAdded ? 'Added!' : 'Add to Cart'}
          </button>
        </div>

        {inCartQty > 0 && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-brand-soft px-2.5 py-1.5 text-xs font-semibold text-brand">
            <span>In cart: {inCartQty}</span>
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                aria-label="Decrease cart quantity"
                onClick={(e) => bumpCart(e, inCartQty - 1)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-card"
              >
                <FiMinus size={12} />
              </button>
              <button
                type="button"
                aria-label="Increase cart quantity"
                onClick={(e) => bumpCart(e, inCartQty + 1)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white"
              >
                <FiPlus size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
