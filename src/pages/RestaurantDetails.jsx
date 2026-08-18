import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiClock,
  FiStar,
  FiTruck,
  FiMapPin,
  FiInfo,
} from 'react-icons/fi'
import FoodCard from '../components/FoodCard'
import { foods, restaurants } from '../data/mockData'
import { formatPrice } from '../utils/format'

const CATEGORY_ORDER = [
  'Starters',
  'Tandoor',
  'Pizzas',
  'Slices',
  'Pies',
  'Burgers',
  'Sandwiches',
  'BBQ',
  'Nigiri',
  'Rolls',
  'Ramen',
  'Mains',
  'Bento',
  'Poke',
  'Pastas',
  'Curries',
  'Rice & Biryani',
  'Biryani',
  'Street Food',
  'Tiffin',
  'Breads',
  'Bowls',
  'Plates',
  'Wraps',
  'Salads',
  'Light Bites',
  'Sides',
  'Cakes',
  'Cupcakes',
  'Cookies',
  'Bakery',
  'Pastries',
  'Scoops',
  'Sundaes',
  'Ice Cream',
  'Specialty',
  'Snacks',
  'Shakes',
  'Smoothies',
  'Juices',
  'Shots',
  'Coffee',
  'Tea',
  'Milk Tea',
  'Fruit Tea',
  'Refreshers',
  'Desserts',
  'Drinks',
]

function buildSampleReviews(restaurant) {
  const base = [
    {
      name: 'Ananya K.',
      rating: 5,
      text: 'Great taste and packaging. Arrived hot and fresh!',
    },
    {
      name: 'Rohan M.',
      rating: 4,
      text: 'Solid portions and quick delivery. Will order again.',
    },
    {
      name: 'Priya S.',
      rating: 5,
      text: 'One of the best spots in this area. Highly recommended.',
    },
  ]
  return base.map((review, index) => ({
    ...review,
    id: `${restaurant.id}-rev-${index}`,
  }))
}

export default function RestaurantDetails() {
  const { id } = useParams()
  const restaurant = restaurants.find((r) => r.id === id)
  const menu = useMemo(
    () => foods.filter((f) => f.restaurantId === id),
    [id],
  )

  const menuCategories = useMemo(() => {
    const unique = [...new Set(menu.map((item) => item.menuCategory))]
    unique.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a)
      const bi = CATEGORY_ORDER.indexOf(b)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    return ['All', ...unique]
  }, [menu])

  const [activeMenu, setActiveMenu] = useState('All')

  useEffect(() => {
    setActiveMenu('All')
  }, [id])

  const categoryCounts = useMemo(() => {
    const counts = { All: menu.length }
    menu.forEach((item) => {
      counts[item.menuCategory] = (counts[item.menuCategory] || 0) + 1
    })
    return counts
  }, [menu])

  const visibleMenu = useMemo(() => {
    if (activeMenu === 'All') return menu
    return menu.filter((item) => item.menuCategory === activeMenu)
  }, [menu, activeMenu])

  const groupedMenu = useMemo(() => {
    if (activeMenu !== 'All') {
      return [{ category: activeMenu, items: visibleMenu }]
    }
    return menuCategories
      .filter((cat) => cat !== 'All')
      .map((category) => ({
        category,
        items: menu.filter((item) => item.menuCategory === category),
      }))
      .filter((group) => group.items.length > 0)
  }, [activeMenu, visibleMenu, menuCategories, menu])

  if (!restaurant) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Restaurant not found</h1>
        <Link
          to="/restaurants"
          className="mt-4 inline-flex items-center gap-2 text-brand hover:underline"
        >
          <FiArrowLeft /> Back to restaurants
        </Link>
      </div>
    )
  }

  const reviews = buildSampleReviews(restaurant)

  return (
    <div>
      {/* Restaurant banner */}
      <div className="relative h-52 overflow-hidden sm:h-64 md:h-80">
        <img
          src={restaurant.banner}
          alt={`${restaurant.name} banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" />
        <div className="container-app absolute inset-x-0 bottom-0 pb-6">
          <Link
            to="/restaurants"
            className="mb-3 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/25"
          >
            <FiArrowLeft /> All restaurants
          </Link>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {restaurant.name}
          </h1>
          <p className="mt-1 text-white/85">{restaurant.cuisine}</p>
          {restaurant.location && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/80">
              <FiMapPin className="text-brand" />
              {restaurant.location}
            </p>
          )}
        </div>
      </div>

      <div className="container-app py-8">
        {/* Restaurant information */}
        <section className="mb-8 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <FiInfo className="text-brand" />
            <h2 className="font-display text-xl font-bold text-ink">
              Restaurant information
            </h2>
          </div>
          <p className="max-w-3xl leading-relaxed text-muted">
            {restaurant.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(restaurant.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand"
              >
                {tag}
              </span>
            ))}
            <span className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink">
              Price range {restaurant.priceRange}
            </span>
            <span className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-ink">
              {menu.length} menu items
            </span>
          </div>
        </section>

        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          {/* Rating and reviews */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">
              Rating and reviews
            </h2>
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-success text-white">
                <span className="text-xl font-bold">{restaurant.rating}</span>
                <FiStar className="fill-current" size={14} />
              </div>
              <div>
                <p className="font-semibold text-ink">
                  {restaurant.reviews.toLocaleString('en-IN')} reviews
                </p>
                <p className="text-sm text-muted">
                  Based on recent customer feedback
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-xl border border-line bg-surface p-3"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                      <FiStar className="fill-current" size={12} />
                      {review.rating}.0
                    </span>
                  </div>
                  <p className="text-sm text-muted">{review.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Delivery information */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-bold text-ink">
              Delivery information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <FiClock />
                </span>
                <div>
                  <p className="text-sm text-muted">Estimated delivery time</p>
                  <p className="font-bold text-ink">{restaurant.deliveryTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <FiTruck />
                </span>
                <div>
                  <p className="text-sm text-muted">Delivery fee</p>
                  <p className="font-bold text-ink">
                    {formatPrice(restaurant.deliveryFee)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <FiMapPin />
                </span>
                <div>
                  <p className="text-sm text-muted">Serving area</p>
                  <p className="font-bold text-ink">
                    {restaurant.location || 'Selected city'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted">
                Orders are prepared fresh and handed to delivery partners as soon
                as ready. Track your order after checkout.
              </p>
            </div>
          </section>
        </div>

        {/* Food categories */}
        <section className="mb-6" id="food-categories">
          <div className="mb-4">
            <h2 className="font-display text-2xl font-bold text-ink">
              Food categories
            </h2>
            <p className="mt-1 text-sm text-muted">
              Filter the menu by category, then add items to your cart
            </p>
          </div>

          <div className="sticky top-16 z-30 -mx-4 border-y border-line bg-surface/95 px-4 py-3 backdrop-blur md:top-[4.5rem] md:mx-0 md:rounded-2xl md:border md:px-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {menuCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveMenu(cat)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                    activeMenu === cat
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-white text-ink hover:border-brand/40'
                  }`}
                >
                  {cat}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                      activeMenu === cat
                        ? 'bg-white/20 text-white'
                        : 'bg-surface text-muted'
                    }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu items + Add to cart */}
        <section id="menu-items">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold text-ink">
              Menu items
            </h2>
            <p className="mt-1 text-sm text-muted">
              {visibleMenu.length} item{visibleMenu.length === 1 ? '' : 's'} with
              Add to Cart on each card
            </p>
          </div>

          {groupedMenu.length > 0 ? (
            <div className="space-y-10">
              {groupedMenu.map((group) => (
                <div key={group.category} id={`menu-${group.category}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <h3 className="font-display text-xl font-bold text-ink">
                      {group.category}
                    </h3>
                    <span className="rounded-lg bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand">
                      {group.items.length}
                    </span>
                  </div>
                  <div className="card-grid card-grid-3">
                    {group.items.map((foodItem) => (
                      <FoodCard key={foodItem.id} food={foodItem} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-white py-12 text-center text-muted">
              No menu items in this category.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
