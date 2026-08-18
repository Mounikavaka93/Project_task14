import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FaArrowLeft,
  FaEnvelope,
  FaFileAlt,
  FaHandshake,
  FaHeadset,
  FaPhone,
} from 'react-icons/fa'

const sections = [
  {
    id: 'help',
    title: 'Help Center',
    icon: FaHeadset,
    body: [
      'Track your order from My Orders after checkout.',
      'Need a refund or missing item? Email support with your Order ID.',
      'Delivery usually arrives within the estimated arrival window shown on confirmation.',
    ],
  },
  {
    id: 'partner',
    title: 'Partner with us',
    icon: FaHandshake,
    body: [
      'Restaurant partners can list menus and reach hungry customers nearby.',
      'Share your kitchen location, cuisine, and sample menu to get started.',
      'Write to partners@cravecart.in and our team will guide onboarding.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms & Privacy',
    icon: FaFileAlt,
    body: [
      'CraveCart is a demo food-delivery UI kit for learning and portfolio use.',
      'Order data in this demo is stored locally in your browser only.',
      'Do not enter real card details — payment fields are for UI demonstration.',
    ],
  },
]

export default function Support() {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.hash])

  return (
    <div className="container-app py-8 sm:py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <FaArrowLeft /> Back to home
      </Link>

      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Support
        </h1>
        <p className="mt-2 text-muted">
          Help, partnerships, and policy details for CraveCart.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/40"
        >
          <FaPhone className="text-brand" /> Call support
        </a>
        <a
          href="mailto:support@cravecart.in"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <FaEnvelope /> Email support
        </a>
      </div>

      <div className="space-y-5">
        {sections.map(({ id, title, icon: Icon, body }) => (
          <section
            key={id}
            id={id}
            className="scroll-mt-28 rounded-2xl border border-line bg-white p-5 sm:p-6"
          >
            <h2 className="mb-3 flex items-center gap-2.5 font-display text-xl font-bold text-ink">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              {title}
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-muted">
              {body.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
