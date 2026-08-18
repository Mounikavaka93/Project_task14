import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiMapPin, FiX } from 'react-icons/fi'
import CategoryCard from '../components/CategoryCard'
import RestaurantCard from '../components/RestaurantCard'
import SearchBar from '../components/SearchBar'
import { PageSkeleton } from '../components/Skeleton'
import { useLocationStore } from '../context/LocationContext'
import { categories, getRestaurantsByLocation } from '../data/mockData'

const SORT_OPTIONS = [
  { id: 'rating', label: 'Top rated' },
  { id: 'fast', label: 'Fastest delivery' },
  { id: 'fee', label: 'Lowest fee' },
]

const PRICE_OPTIONS = [
  { id: 'all', label: 'Any price' },
  { id: '₹', label: '₹' },
  { id: '₹₹', label: '₹₹' },
  { id: '₹₹₹', label: '₹₹₹' },
]

function FilterPanel({
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  priceFilter,
  setPriceFilter,
  vegOnly,
  setVegOnly,
  onClose,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 lg:block">
        <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line lg:hidden"
            aria-label="Close filters"
          >
            <FiX />
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                activeCategory === category.id
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line bg-card text-ink hover:border-brand/40'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Sort by
        </p>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSortBy(opt.id)}
              className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                sortBy === opt.id
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-line bg-card text-ink hover:border-brand/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Price range
        </p>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPriceFilter(opt.id)}
              className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                priceFilter === opt.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-card text-ink hover:border-brand/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-card px-3 py-3 text-sm font-semibold">
        <span>Veg-friendly only</span>
        <input
          type="checkbox"
          checked={vegOnly}
          onChange={(e) => setVegOnly(e.target.checked)}
          className="accent-[var(--color-brand)]"
        />
      </label>
    </div>
  )
}

export default function RestaurantListing() {
  const { selectedLocation } = useLocationStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [priceFilter, setPriceFilter] = useState('all')
  const [vegOnly, setVegOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    setActiveCategory('all')
  }, [selectedLocation])

  useEffect(() => {
    setLoading(true)
    const id = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(id)
  }, [selectedLocation, activeCategory, query, sortBy, priceFilter, vegOnly])

  const locationRestaurants = useMemo(
    () => getRestaurantsByLocation(selectedLocation),
    [selectedLocation],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = locationRestaurants.filter((restaurant) => {
      const matchesCategory =
        activeCategory === 'all' || restaurant.category === activeCategory
      const matchesQuery =
        !q ||
        restaurant.name.toLowerCase().includes(q) ||
        restaurant.cuisine.toLowerCase().includes(q) ||
        restaurant.tags?.some((tag) => tag.toLowerCase().includes(q))
      const matchesPrice =
        priceFilter === 'all' || restaurant.priceRange === priceFilter
      const matchesVeg =
        !vegOnly ||
        restaurant.tags?.some((t) => /veg/i.test(t)) ||
        /veg/i.test(restaurant.cuisine)
      return matchesCategory && matchesQuery && matchesPrice && matchesVeg
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'fast') {
        return parseInt(a.deliveryTime, 10) - parseInt(b.deliveryTime, 10)
      }
      if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee
      return b.rating - a.rating
    })
    return list
  }, [
    query,
    activeCategory,
    locationRestaurants,
    sortBy,
    priceFilter,
    vegOnly,
  ])

  const handleSearch = (value) => {
    const next = value.trim()
    setQuery(value)
    if (next) setSearchParams({ q: next })
    else setSearchParams({})
  }

  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
  }

  const resetFilters = () => {
    setQuery('')
    setActiveCategory('all')
    setSortBy('rating')
    setPriceFilter('all')
    setVegOnly(false)
    setSearchParams({})
  }

  if (loading) {
    return <PageSkeleton cards={6} />
  }

  const filterProps = {
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    priceFilter,
    setPriceFilter,
    vegOnly,
    setVegOnly,
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
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/40 lg:hidden"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="mb-6 scroll-row lg:hidden">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-card p-5">
            <FilterPanel {...filterProps} />
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 w-full rounded-xl border border-line px-3 py-2.5 text-sm font-semibold transition hover:border-brand/40"
            >
              Reset filters
            </button>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing{' '}
              <span className="font-semibold text-ink">{filtered.length}</span>{' '}
              restaurant{filtered.length === 1 ? '' : 's'}
            </p>
            {(query ||
              activeCategory !== 'all' ||
              priceFilter !== 'all' ||
              vegOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="card-grid card-grid-3">
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-card py-16 text-center">
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
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Close filter drawer"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,320px)] flex-col bg-card shadow-xl">
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                {...filterProps}
                onClose={() => setFiltersOpen(false)}
              />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => {
                  resetFilters()
                  setFiltersOpen(false)
                }}
                className="mb-2 w-full rounded-xl border border-line px-3 py-2.5 text-sm font-semibold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-xl bg-brand px-3 py-2.5 text-sm font-semibold text-white"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
