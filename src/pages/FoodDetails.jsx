import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiMinus, FiPlus, FiStar } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
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

  const related = foods
    .filter((f) => f.restaurantId === food.restaurantId && f.id !== food.id)
    .slice(0, 3)

  const handleAdd = () => {
    addToCart(food, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <Link
        to={restaurant ? `/restaurants/${restaurant.id}` : '/restaurants'}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <FiArrowLeft /> Back to restaurant
      </Link>

      <div className="grid gap-8 rounded-2xl border border-line bg-white p-4 sm:p-6 lg:grid-cols-2 lg:items-start lg:p-8">
        {/* Food image */}
        <div className="relative overflow-hidden rounded-2xl bg-line">
          <img
            src={food.image}
            alt={food.name}
            className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
          />
          {/* Veg/Non-veg indicator on image */}
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border-2 bg-white px-2 py-1 text-xs font-bold ${
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
        </div>

        <div className="flex flex-col">
          {/* Veg/Non-veg + Rating */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border-2 bg-white px-2 py-1 text-xs font-bold ${
                food.isVeg ? 'border-veg text-veg' : 'border-nonveg text-nonveg'
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-sm ${
                  food.isVeg ? 'bg-veg' : 'bg-nonveg'
                }`}
              />
              {food.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
              <FiStar className="fill-current" size={14} />
              Rating {food.rating}
            </span>
          </div>

          {/* Food name */}
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {food.name}
          </h1>

          {restaurant && (
            <Link
              to={`/restaurants/${restaurant.id}`}
              className="mt-2 text-sm font-semibold text-brand hover:underline"
            >
              {restaurant.name}
              {restaurant.location ? ` · ${restaurant.location}` : ''}
            </Link>
          )}

          {/* Description */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Description
            </p>
            <p className="mt-1 text-base leading-relaxed text-ink/80">
              {food.description}
            </p>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Price
            </p>
            <p className="mt-1 text-3xl font-bold text-ink">
              {formatPrice(food.price * qty)}
            </p>
            <p className="text-sm text-muted">
              {formatPrice(food.price)} each
              {qty > 1 ? ` × ${qty}` : ''}
            </p>
          </div>

          {/* Quantity controls */}
          <div className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Quantity
            </p>
            <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-white"
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span className="min-w-10 text-center text-lg font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark"
                aria-label="Increase quantity"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98]"
            >
              {added ? 'Added to Cart!' : 'Add to Cart'}
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
