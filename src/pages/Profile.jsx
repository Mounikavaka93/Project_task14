import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  FiEdit2,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSave,
  FiUser,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatPrice } from '../utils/format'
import {
  formatDateTime,
  formatTime,
  formatDeliveryLocation,
  ORDER_STATUS,
} from '../utils/orders'
import {
  validateName,
  validatePhone,
  validatePin,
  validateRequired,
} from '../utils/validation'

export default function Profile() {
  const { user, isLoggedIn, signOut, updateProfile } = useAuth()
  const { getOrdersForUser, resolveStatus } = useOrders()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
  })

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        landmark: user.landmark || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      })
    }
  }, [user])

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: '/profile' }} />
  }

  const orders = getOrdersForUser(user.email)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {
      fullName: validateName(form.fullName),
      phone: validatePhone(form.phone),
      address: validateRequired(form.address, 'Address'),
      city: validateRequired(form.city, 'City'),
      state: validateRequired(form.state, 'State'),
      zip: validatePin(form.zip),
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    updateProfile(form)
    setEditing(false)
    setMessage('Profile updated successfully')
    setTimeout(() => setMessage(''), 2500)
  }

  const inputClass = (hasError) =>
    `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand/20 ${
      hasError
        ? 'border-nonveg focus:border-nonveg'
        : 'border-line focus:border-brand'
    }`

  return (
    <div className="container-app py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Profile</h1>
          <p className="mt-1 text-muted">Manage your account and recent orders</p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut()
            navigate('/signin')
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-nonveg/40 hover:text-nonveg"
        >
          <FiLogOut /> Sign out
        </button>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          {message}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white">
                {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">{user.fullName}</h2>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            </div>
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold transition hover:border-brand/40"
              >
                <FiEdit2 size={14} /> Edit
              </button>
            ) : null}
          </div>

          {!editing ? (
            <dl className="space-y-4 text-sm">
              <div className="flex gap-3">
                <FiPhone className="mt-0.5 text-brand" />
                <div>
                  <dt className="text-muted">Mobile</dt>
                  <dd className="font-medium">{user.phone || '—'}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <FiMapPin className="mt-0.5 text-brand" />
                <div>
                  <dt className="text-muted">Saved address</dt>
                  <dd className="font-medium leading-relaxed">
                    {formatDeliveryLocation(user)}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <FiUser className="mt-0.5 text-brand" />
                <div>
                  <dt className="text-muted">Member since</dt>
                  <dd className="font-medium">
                    {formatDateTime(user.createdAt).split(',').slice(0, 2).join(',')}
                  </dd>
                </div>
              </div>
            </dl>
          ) : (
            <form onSubmit={handleSave} className="space-y-3" noValidate>
              {[
                ['fullName', 'Full name', 'Rahul Sharma'],
                ['phone', 'Mobile number', '+91 98765 43210'],
                ['address', 'Flat / Street', 'B-204, MG Road'],
                ['landmark', 'Landmark (optional)', 'Near City Mall'],
                ['city', 'City', 'Bengaluru'],
                ['state', 'State', 'Karnataka'],
                ['zip', 'PIN code', '560038'],
              ].map(([name, label, placeholder]) => (
                <label key={name} className="block text-sm font-medium">
                  {label}
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={inputClass(errors[name])}
                  />
                  {errors[name] && (
                    <span className="mt-1 block text-xs text-nonveg">
                      {errors[name]}
                    </span>
                  )}
                </label>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  <FiSave /> Save changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setErrors({})
                    setForm({
                      fullName: user.fullName || '',
                      phone: user.phone || '',
                      address: user.address || '',
                      landmark: user.landmark || '',
                      city: user.city || '',
                      state: user.state || '',
                      zip: user.zip || '',
                    })
                  }}
                  className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-ink">
              Your orders
            </h2>
            <Link
              to="/orders"
              className="text-sm font-semibold text-brand hover:underline"
            >
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white py-12 text-center">
              <FiPackage className="mx-auto mb-3 text-muted" size={28} />
              <p className="font-semibold text-ink">No orders yet</p>
              <p className="mt-1 text-sm text-muted">
                Place an order to see arrival time and delivery location here.
              </p>
              <Link
                to="/restaurants"
                className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
              >
                Browse restaurants
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => {
                const status = resolveStatus(order)
                const isPast = status === ORDER_STATUS.DELIVERED
                return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-line bg-white p-4 sm:p-5"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-ink">Order {order.id}</p>
                      <p className="text-xs text-muted">
                        Placed {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                        isPast
                          ? 'bg-success/10 text-success'
                          : 'bg-brand-soft text-brand'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="mb-3 space-y-1.5 text-sm">
                    <p>
                      <span className="text-muted">
                        {isPast ? 'Delivered by: ' : 'Arrives between: '}
                      </span>
                      <span className="font-semibold">
                        {formatTime(order.arriveFrom)} – {formatTime(order.arriveTo)}
                      </span>
                    </p>
                    <p className="flex gap-1.5">
                      <FiMapPin className="mt-0.5 shrink-0 text-brand" />
                      <span className="text-ink">
                        {formatDeliveryLocation(order.customer)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
                    <span className="text-muted">
                      {order.items?.length || 0} item(s)
                      {isPast ? ' · Past order' : ' · Active'}
                    </span>
                    <span className="font-bold">
                      {formatPrice(
                        Math.max(
                          (order.totals?.total || 0) - (order.promoDiscount || 0),
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </article>
              )})}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
