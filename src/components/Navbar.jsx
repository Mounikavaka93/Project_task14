import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  FiMapPin,
  FiMenu,
  FiShoppingBag,
  FiX,
  FiChevronDown,
  FiUser,
  FiMoon,
  FiSun,
  FiHeart,
} from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLocationStore } from '../context/LocationContext'
import { useTheme } from '../context/ThemeContext'
import { useFavorites } from '../context/FavoritesContext'
import SearchBar from './SearchBar'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/orders', label: 'Orders' },
]

export default function Navbar() {
  const { totals, cartBump } = useCart()
  const { user, isLoggedIn } = useAuth()
  const { locations, selectedLocation, setSelectedLocation } =
    useLocationStore()
  const { isDark, toggleTheme } = useTheme()
  const { count: favCount } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    setOpen(false)
    setLocationOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!locationOpen) return undefined
    const onPointerDown = (e) => {
      if (!e.target.closest('[data-location-picker]')) {
        setLocationOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [locationOpen])

  useEffect(() => {
    if (!cartBump) return undefined
    setBounce(true)
    const id = window.setTimeout(() => setBounce(false), 560)
    return () => window.clearTimeout(id)
  }, [cartBump])

  const handleSearch = (value) => {
    setQuery(value)
    navigate(`/restaurants?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-card/95 backdrop-blur">
      <div className="container-app">
        <div className="flex h-16 items-center gap-2 sm:gap-3 md:h-[4.5rem] md:gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-ink transition hover:bg-brand-soft active:scale-95 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M5 16c0-4 3.2-7 7-7s7 3 7 7"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="8" r="2.2" fill="currentColor" />
              </svg>
            </span>
            <span className="truncate font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              Crave<span className="text-brand">Cart</span>
            </span>
          </Link>

          <div className="relative hidden md:block" data-location-picker>
            <button
              type="button"
              onClick={() => setLocationOpen((v) => !v)}
              className="flex max-w-[200px] items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-left transition hover:border-brand/40 lg:max-w-[220px]"
            >
              <FiMapPin className="shrink-0 text-brand" />
              <span className="truncate text-sm font-medium">{selectedLocation}</span>
              <FiChevronDown className="shrink-0 text-muted" />
            </button>
            {locationOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-card shadow-lg">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-brand-soft ${
                      loc === selectedLocation
                        ? 'bg-brand-soft font-semibold text-brand'
                        : ''
                    }`}
                    onClick={() => {
                      setSelectedLocation(loc)
                      setLocationOpen(false)
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mx-4 hidden min-w-0 flex-1 lg:block lg:max-w-md">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="Search food or restaurants..."
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <nav className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `rounded-xl px-2.5 py-2 text-sm font-medium transition lg:px-3 ${
                      isActive
                        ? 'bg-brand-soft text-brand'
                        : 'text-muted hover:bg-surface hover:text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition hover:bg-brand-soft md:inline-flex"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <Link
              to="/favorites"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition hover:bg-brand-soft md:inline-flex"
              aria-label="Favorites"
              title="Favorites"
            >
              <FiHeart size={18} />
              {favCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-md bg-brand px-0.5 text-[10px] font-bold text-white">
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              to={isLoggedIn ? '/profile' : '/signin'}
              className="hidden items-center gap-2 rounded-xl border border-line px-2.5 py-2 text-sm font-semibold text-ink transition hover:border-brand/40 lg:inline-flex lg:px-3"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand">
                {isLoggedIn ? (
                  user.fullName?.charAt(0)?.toUpperCase() || 'U'
                ) : (
                  <FiUser size={14} />
                )}
              </span>
              <span className="hidden max-w-[90px] truncate xl:inline">
                {isLoggedIn ? user.fullName?.split(' ')[0] : 'Sign in'}
              </span>
            </Link>

            <Link
              to="/cart"
              className={`relative inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-3 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] ${
                bounce ? 'animate-cart-bounce' : ''
              }`}
            >
              <FiShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              {totals.itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md bg-ink px-1 text-[11px] font-bold text-white dark:bg-brand-dark">
                  {totals.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="pb-3 lg:hidden">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search food or restaurants..."
          />
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-card md:hidden">
          <div className="container-app space-y-1 py-3" data-location-picker>
            <button
              type="button"
              onClick={() => setLocationOpen((v) => !v)}
              className="flex w-full items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-left text-sm"
            >
              <FiMapPin className="text-brand" />
              <span className="flex-1 truncate font-medium">{selectedLocation}</span>
              <FiChevronDown />
            </button>
            {locationOpen && (
              <div className="overflow-hidden rounded-xl border border-line">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className="block w-full border-b border-line px-3 py-2 text-left text-sm last:border-b-0 hover:bg-brand-soft"
                    onClick={() => {
                      setSelectedLocation(loc)
                      setLocationOpen(false)
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-soft text-brand' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-soft text-brand' : 'text-ink'
                }`
              }
            >
              <FiHeart /> Favorites
            </NavLink>
            <NavLink
              to={isLoggedIn ? '/profile' : '/signin'}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-soft text-brand' : 'text-ink'
                }`
              }
            >
              {isLoggedIn ? 'Profile' : 'Sign in'}
            </NavLink>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink"
            >
              {isDark ? <FiSun /> : <FiMoon />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
