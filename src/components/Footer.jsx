import { FaEnvelope, FaHeadset, FaHandshake, FaFileAlt, FaPhone } from 'react-icons/fa'
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: FaInstagram,
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/',
    icon: FaXTwitter,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: FaFacebookF,
  },
]

const supportLinks = [
  {
    label: 'Help Center',
    to: '/support#help',
    icon: FaHeadset,
  },
  {
    label: 'Partner with us',
    to: '/support#partner',
    icon: FaHandshake,
  },
  {
    label: 'Terms & Privacy',
    to: '/support#terms',
    icon: FaFileAlt,
  },
]

export default function Footer() {
  const openExternal = (event, href) => {
    event.preventDefault()
    window.open(href, '_blank', 'noopener,noreferrer')
  }

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
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={(e) => openExternal(e, href)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-brand hover:bg-brand hover:text-white active:scale-95"
                aria-label={label}
                title={label}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </button>
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
          <ul className="space-y-3 text-sm text-white/80">
            {supportLinks.map(({ label, to, icon: Icon }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="inline-flex items-center gap-2.5 transition hover:text-brand"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20 text-brand">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2.5 transition hover:text-brand"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20 text-brand">
                  <FaPhone className="h-3.5 w-3.5" aria-hidden />
                </span>
                +91 98765 43210
              </a>
            </li>
            <li>
              <a
                href="mailto:support@cravecart.in"
                className="inline-flex items-center gap-2.5 transition hover:text-brand"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20 text-brand">
                  <FaEnvelope className="h-3.5 w-3.5" aria-hidden />
                </span>
                support@cravecart.in
              </a>
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
