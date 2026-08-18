import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiMinus, FiPlus, FiStar } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { foods, restaurants } from '../data/mockData'
import FoodCard from '../components/FoodCard'
import { formatPrice } from '../utils/format'

export default function FoodDetails() {
  const { id } = useParams()
  const food = foods.find((f) => f.id === id)
  const restaurant = food
    ? restaurants.find((r) => r.id === food.restaurantId)
    : null
  const { items, addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { pushToast } = useToast()
  const cartItem = items.find((item) => item.id === food?.id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!food) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Dish not found</h1>
        <Link to="/" className="mt-4 inline-flex text-brand hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  const wished = isWishlisted(food.id)
  const related = foods
    .filter((f) => f.restaurantId === food.restaurantId && f.id !== food.id)
    .slice(0, 3)

  const handleAdd = () => {
    addToCart(food, qty)
    setAdded(true)
    pushToast(`Added ${food.name} to cart`, 'success')
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = () => {
    toggleWishlist(food.id)
    pushToast(
      wished
        ? `Removed ${food.name} from wishlist`
        : `Saved ${food.name} to wishlist`,
      wished ? 'info' : 'success',
    )
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <Link
        to={restaurant ? `/restaurants/${restaurant.id}` : '/restaurants'}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <FiArrowLeft /> Back to restaurant
      </Link>

      <div className="grid gap-8 rounded-2xl border border-line bg-card p-4 sm:p-6 lg:grid-cols-2 lg:items-start lg:p-8">
        <div className="relative overflow-hidden rounded-2xl bg-line">
          <img
            src={food.image}
            alt={food.name}
            className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
          />
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border-2 bg-card px-2 py-1 text-xs font-bold ${
              food.isVeg ? 'border-veg text-veg' : 'border-nonveg text-nonveg'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${
                food.isVeg ? 'bg-veg' : 'bg-nonveg'
              }`}
            />
            {food.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              wished
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-card/95 text-ink'
            }`}
            aria-label="Toggle wishlist"
          >
            <FiHeart className={wished ? 'fill-current' : ''} size={18} />
          </button>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border-2 bg-card px-2 py-1 text-xs font-bold ${
                food.isVeg ? 'border-veg text-veg' : 'border-nonveg text-nonveg'
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-sm ${
                  food.isVeg ? 'bg-veg' : 'bg-nonveg'
                }`}
              />
              {food.isVeg ? 'VEG' : 'NON-VEG'}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-bold">
              <FiStar className="fill-amber-400 text-amber-400" size={14} />
              {food.rating}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {food.name}
          </h1>
          {restaurant && (
            <Link
              to={`/restaurants/${restaurant.id}`}
              className="mt-2 text-sm font-semibold text-brand hover:underline"
            >
              {restaurant.name}
            </Link>
          )}
          <p className="mt-4 leading-relaxed text-muted">{food.description}</p>
          <p className="mt-6 text-3xl font-bold text-ink">
            {formatPrice(food.price)}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-card"
              >
                <FiMinus />
              </button>
              <span className="min-w-8 text-center font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark"
              >
                <FiPlus />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {added ? 'Added to cart!' : 'Add to Cart'}
            </button>
            {cartItem && (
              <Link
                to="/cart"
                className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand/40"
              >
                View cart ({cartItem.quantity})
              </Link>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl font-bold text-ink">
            More from {restaurant?.name}
          </h2>
          <div className="card-grid card-grid-3">
            {related.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
