import { NavLink } from 'react-router-dom'
import {
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiClipboard,
  FiUser,
} from 'react-icons/fi'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Home', icon: FiHome, end: true },
  { to: '/restaurants', label: 'Browse', icon: FiClipboard },
  { to: '/cart', label: 'Cart', icon: FiShoppingBag, cart: true },
  { to: '/favorites', label: 'Favorites', icon: FiHeart, heartOnly: true },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

export default function BottomNav() {
  const { totals } = useCart()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5 items-stretch">
        {links.map(({ to, label, icon: Icon, end, cart, heartOnly }) => (
          <li key={to} className="min-w-0">
            <NavLink
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                `relative flex h-full flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold transition ${
                  isActive ? 'text-brand' : 'text-muted hover:text-ink'
                }`
              }
            >
              <span className="relative inline-flex h-6 w-6 items-center justify-center">
                <Icon
                  size={heartOnly ? 22 : 20}
                  className={heartOnly ? 'fill-current' : undefined}
                  aria-hidden
                />
                {cart && totals.itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-md bg-brand px-0.5 text-[9px] font-bold text-white">
                    {totals.itemCount}
                  </span>
                )}
              </span>
              {/* Keep label slot for alignment; hide text for heart-only */}
              <span
                className={`leading-none ${heartOnly ? 'sr-only' : ''}`}
              >
                {label}
              </span>
              {heartOnly && <span className="h-2.5" aria-hidden />}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
