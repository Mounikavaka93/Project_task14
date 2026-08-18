import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiMapPin, FiTag } from 'react-icons/fi'
import CategoryCard from '../components/CategoryCard'
import RestaurantCard from '../components/RestaurantCard'
import FoodCard from '../components/FoodCard'
import { useLocationStore } from '../context/LocationContext'
import {
  categories,
  getFoodsByLocation,
  getRestaurantsByLocation,
  offers,
} from '../data/mockData'

export default function Home() {
  const { selectedLocation } = useLocationStore()
  const [activeCategory, setActiveCategory] = useState('all')

  const locationRestaurants = useMemo(
    () => getRestaurantsByLocation(selectedLocation),
    [selectedLocation],
  )

  const locationFoods = useMemo(
    () => getFoodsByLocation(selectedLocation),
    [selectedLocation],
  )

  const filteredRestaurants = useMemo(() => {
    if (activeCategory === 'all') return locationRestaurants
    return locationRestaurants.filter((r) => r.category === activeCategory)
  }, [activeCategory, locationRestaurants])

  const popularRestaurants = locationRestaurants.slice(0, 8)
  const recommended = locationFoods.filter((f) => f.popular).slice(0, 8)

  const categoryFoods = useMemo(() => {
    if (activeCategory === 'all') return recommended
    return locationFoods
      .filter((f) => f.category === activeCategory)
      .slice(0, 8)
  }, [activeCategory, recommended, locationFoods])

  const restaurantsToShow =
    activeCategory === 'all' ? popularRestaurants : filteredRestaurants

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" />
        <div className="container-app relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[480px] sm:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            CraveCart
          </p>
          <h1 className="max-w-xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Cravings delivered in minutes
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/80 sm:text-lg">
            Discover restaurants near{' '}
            <span className="font-semibold text-white">{selectedLocation}</span>
            , filter by cuisine, and order with ease.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Browse restaurants
              <FiArrowRight />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Explore categories
            </a>
          </div>
        </div>
      </section>

      {/* Food categories */}
      <section className="container-app py-10 sm:py-12" id="categories">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Food categories
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tap a category to filter restaurants and dishes in{' '}
            {selectedLocation.split(',')[0]}
          </p>
        </div>
        <div className="scroll-row">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </section>

      {/* Popular restaurants */}
      <section className="bg-card py-10 sm:py-12" id="popular-restaurants">
        <div className="container-app">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Popular restaurants
              </h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                <FiMapPin className="text-brand" />
                {selectedLocation} · {restaurantsToShow.length} places
              </p>
            </div>
            <Link
              to="/restaurants"
              className="hidden items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-dark sm:inline-flex"
            >
              View all <FiArrowRight />
            </Link>
          </div>

          {restaurantsToShow.length > 0 ? (
            <div className="card-grid card-grid-4">
              {restaurantsToShow.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-surface py-10 text-center text-muted">
              No restaurants in this category for {selectedLocation}. Try
              another category or location.
            </p>
          )}
        </div>
      </section>

      {/* Recommended dishes */}
      <section className="container-app py-10 sm:py-14" id="recommended-dishes">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Recommended dishes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Customer favorites from restaurants in{' '}
            {selectedLocation.split(',')[0]}
          </p>
        </div>

        {categoryFoods.length > 0 ? (
          <div className="card-grid card-grid-4">
            {categoryFoods.map((foodItem) => (
              <FoodCard key={foodItem.id} food={foodItem} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-card py-10 text-center text-muted">
            No dishes found for this category in your location.
          </p>
        )}
      </section>

      {/* Promotional / offer section */}
      <section className="border-t border-line bg-card py-10 sm:py-12" id="offers">
        <div className="container-app">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Promotional offers
            </h2>
            <p className="mt-1 text-sm text-muted">
              Limited-time deals on your next meal
            </p>
          </div>
          <div className="card-grid card-grid-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-2xl bg-gradient-to-br ${offer.tone} p-5 text-white shadow-sm transition duration-200 hover:scale-[1.01]`}
              >
                <FiTag className="mb-3 opacity-90" size={22} />
                <h3 className="text-lg font-bold">{offer.title}</h3>
                <p className="mt-1 text-sm text-white/85">{offer.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
