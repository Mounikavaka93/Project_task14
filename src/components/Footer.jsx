import { Link } from 'react-router-dom'
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
} from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="font-display text-2xl font-bold">
            Crave<span className="text-brand">Cart</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Fresh meals from your favorite restaurants, delivered fast to your
            door.
          </p>
          <div className="mt-5 flex gap-3">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/80 transition hover:border-brand hover:bg-brand hover:text-white"
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li>
              <Link to="/" className="transition hover:text-brand">
                Home
              </Link>
            </li>
            <li>
              <Link to="/restaurants" className="transition hover:text-brand">
                Restaurants
              </Link>
            </li>
            <li>
              <Link to="/orders" className="transition hover:text-brand">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="transition hover:text-brand">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
            Support
          </h3>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li>
              <a href="#" className="transition hover:text-brand">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-brand">
                Partner with us
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-brand">
                Terms & Privacy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <FiPhone className="text-brand" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-brand" />
              support@cravecart.in
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col gap-2 py-5 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} CraveCart. All rights reserved.</p>
          <p>Crafted for fast, friendly food delivery.</p>
        </div>
      </div>
    </footer>
  )
}
