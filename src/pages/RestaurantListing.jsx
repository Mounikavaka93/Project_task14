import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiMapPin, FiX } from 'react-icons/fi'
import CategoryCard from '../components/CategoryCard'
import RestaurantCard from '../components/RestaurantCard'
import SearchBar from '../components/SearchBar'
import { useLocationStore } from '../context/LocationContext'
import { categories, getRestaurantsByLocation } from '../data/mockData'

export default function RestaurantListing() {
  const { selectedLocation } = useLocationStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  // Reset category filter when delivery location changes
  useEffect(() => {
    setActiveCategory('all')
  }, [selectedLocation])

  const locationRestaurants = useMemo(
    () => getRestaurantsByLocation(selectedLocation),
    [selectedLocation],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return locationRestaurants.filter((restaurant) => {
      const matchesCategory =
        activeCategory === 'all' || restaurant.category === activeCategory
      const matchesQuery =
        !q ||
        restaurant.name.toLowerCase().includes(q) ||
        restaurant.cuisine.toLowerCase().includes(q) ||
        restaurant.tags?.some((tag) => tag.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory, locationRestaurants])

  const handleSearch = (value) => {
    const next = value.trim()
    setQuery(value)
    if (next) {
      setSearchParams({ q: next })
    } else {
      setSearchParams({})
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
  }

  const resetFilters = () => {
    setQuery('')
    setActiveCategory('all')
    setSearchParams({})
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Restaurant listing
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-muted">
          <FiMapPin className="text-brand" />
          {selectedLocation} · Search and filter restaurants below
        </p>
      </div>

      {/* Search functionality */}
      <div className="mb-6 flex max-w-xl flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value)
              if (!value.trim()) setSearchParams({})
            }}
            onSubmit={handleSearch}
            placeholder="Search restaurants or cuisine..."
          />
        </div>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-line px-3 py-2.5 text-sm font-medium text-muted transition hover:border-brand/40 hover:text-ink"
          >
            <FiX size={16} /> Clear
          </button>
        )}
      </div>

      {/* Category / filter buttons */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Category filters
        </h2>
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
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Showing{' '}
          <span className="font-semibold text-ink">{filtered.length}</span>{' '}
          restaurant{filtered.length === 1 ? '' : 's'}
          {activeCategory !== 'all' && (
            <>
              {' '}
              in{' '}
              <span className="font-semibold text-brand">
                {categories.find((c) => c.id === activeCategory)?.name}
              </span>
            </>
          )}
          {query.trim() && (
            <>
              {' '}
              for “<span className="font-semibold text-ink">{query.trim()}</span>”
            </>
          )}
        </p>
        {(query || activeCategory !== 'all') && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Restaurant cards grid */}
      {filtered.length > 0 ? (
        <div className="card-grid card-grid-3">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <p className="font-semibold text-ink">No restaurants found</p>
          <p className="mt-1 text-sm text-muted">
            Try another search, category, or change your delivery location.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
