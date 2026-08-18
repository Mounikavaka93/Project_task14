import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiMapPin,
  FiUser,
  FiTag,
} from 'react-icons/fi'
import OrderSummary from '../components/OrderSummary'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatPrice } from '../utils/format'
import {
  validateEmail,
  validateName,
  validatePhone,
  validatePin,
  validateRequired,
} from '../utils/validation'

const paymentMethods = [
  { id: 'upi', label: 'UPI / Wallet', icon: FiSmartphone },
  { id: 'card', label: 'Credit / Debit Card', icon: FiCreditCard },
  { id: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
]

export default function Checkout() {
  const { items, totals, placeOrder } = useCart()
  const { user, isLoggedIn, updateProfile } = useAuth()
  const { addOrder } = useOrders()
  const navigate = useNavigate()
  const [payment, setPayment] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [promo, setPromo] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        landmark: user.landmark || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [items.length, navigate])

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: '/checkout' }} />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const applyPromo = () => {
    const code = promo.trim().toUpperCase()
    if (code === 'CRAVE50') {
      const discount = Math.min(totals.subtotal * 0.5, 150)
      setPromoDiscount(discount)
      setPromoMessage(
        `Promo applied − ${formatPrice(discount)} (max ₹150)`,
      )
    } else if (code === 'FREEDEL') {
      setPromoDiscount(totals.deliveryFee)
      setPromoMessage('Delivery fee waived')
    } else if (!code) {
      setPromoDiscount(0)
      setPromoMessage('Enter a promo code')
    } else {
      setPromoDiscount(0)
      setPromoMessage('Invalid promo code')
    }
  }

  const clearPromo = () => {
    setPromo('')
    setPromoDiscount(0)
    setPromoMessage('')
  }

  const validate = () => {
    const next = {
      fullName: validateName(form.fullName),
      phone: validatePhone(form.phone),
      email: validateEmail(form.email),
      address: validateRequired(form.address, 'Address'),
      city: validateRequired(form.city, 'City'),
      state: validateRequired(form.state, 'State'),
      zip: validatePin(form.zip),
    }

    if (payment === 'upi' && !upiId.trim()) {
      next.upiId = 'UPI ID is required'
    }
    if (payment === 'card') {
      if (!/^\d{12,19}$/.test(card.number.replace(/\s/g, ''))) {
        next.cardNumber = 'Enter a valid card number'
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry.trim())) {
        next.cardExpiry = 'Use MM/YY format'
      }
      if (!/^\d{3,4}$/.test(card.cvv.trim())) {
        next.cardCvv = 'Enter a valid CVV'
      }
    }

    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    updateProfile({
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      landmark: form.landmark,
      city: form.city,
      state: form.state,
      zip: form.zip,
    })

    const order = placeOrder({
      customer: form,
      userEmail: user.email,
      paymentMethod: payment,
      promoCode: promo.trim() || null,
      promoDiscount,
    })
    addOrder(order)
    navigate('/order-confirmation', { state: { orderId: order.id } })
  }

  if (items.length === 0) return null

  const finalTotal = Math.max(totals.total - promoDiscount, 0)

  const fieldClass = (hasError) =>
    `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand/20 ${
      hasError
        ? 'border-nonveg focus:border-nonveg'
        : 'border-line focus:border-brand'
    }`

  return (
    <div className="container-app py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-2 text-muted">
          Confirm delivery details, payment, and place your order
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_360px]"
        noValidate
      >
        <div className="space-y-6">
          {/* Delivery address */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <FiMapPin className="text-brand" />
              Delivery address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-medium text-ink">
                Flat / House no. & Street
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="B-204, Green Valley Apartments, MG Road"
                  className={fieldClass(errors.address)}
                />
                {errors.address && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.address}
                  </span>
                )}
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-ink">
                Landmark
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  placeholder="Near City Mall / Opposite Metro Station"
                  className={fieldClass(false)}
                />
              </label>
              <label className="text-sm font-medium text-ink">
                City
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  className={fieldClass(errors.city)}
                />
                {errors.city && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.city}
                  </span>
                )}
              </label>
              <label className="text-sm font-medium text-ink">
                State
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className={fieldClass(errors.state)}
                />
                {errors.state && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.state}
                  </span>
                )}
              </label>
              <label className="text-sm font-medium text-ink">
                PIN code
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="560038"
                  maxLength={6}
                  inputMode="numeric"
                  className={fieldClass(errors.zip)}
                />
                {errors.zip && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.zip}
                  </span>
                )}
              </label>
              <label className="text-sm font-medium text-ink">
                Delivery notes (optional)
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Ring the bell / Leave at gate"
                  className={fieldClass(false)}
                />
              </label>
            </div>
          </section>

          {/* Contact information */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <FiUser className="text-brand" />
              Contact information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-medium text-ink">
                Full name
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className={fieldClass(errors.fullName)}
                />
                {errors.fullName && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.fullName}
                  </span>
                )}
              </label>
              <label className="text-sm font-medium text-ink">
                Mobile number
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={fieldClass(errors.phone)}
                />
                {errors.phone && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.phone}
                  </span>
                )}
              </label>
              <label className="text-sm font-medium text-ink">
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul.sharma@email.com"
                  className={fieldClass(errors.email)}
                />
                {errors.email && (
                  <span className="mt-1 block text-xs text-nonveg">
                    {errors.email}
                  </span>
                )}
              </label>
            </div>
          </section>

          {/* Payment method UI */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-bold">
              Payment method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                    payment === id
                      ? 'border-brand bg-brand-soft'
                      : 'border-line hover:border-brand/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={payment === id}
                    onChange={() => setPayment(id)}
                    className="accent-[var(--color-brand)]"
                  />
                  <Icon className="text-brand" />
                  <span className="text-sm font-semibold">{label}</span>
                </label>
              ))}
            </div>

            {payment === 'upi' && (
              <div className="mt-4">
                <label className="text-sm font-medium text-ink">
                  UPI ID
                  <input
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value)
                      setErrors((prev) => ({ ...prev, upiId: '' }))
                    }}
                    placeholder="e.g. rahul@oksbi"
                    className={fieldClass(errors.upiId)}
                  />
                  {errors.upiId && (
                    <span className="mt-1 block text-xs text-nonveg">
                      {errors.upiId}
                    </span>
                  )}
                </label>
              </div>
            )}

            {payment === 'card' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2 text-sm font-medium text-ink">
                  Card number
                  <input
                    value={card.number}
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, number: e.target.value }))
                    }
                    placeholder="XXXX XXXX XXXX XXXX"
                    className={fieldClass(errors.cardNumber)}
                  />
                  {errors.cardNumber && (
                    <span className="mt-1 block text-xs text-nonveg">
                      {errors.cardNumber}
                    </span>
                  )}
                </label>
                <label className="text-sm font-medium text-ink">
                  Expiry (MM/YY)
                  <input
                    value={card.expiry}
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, expiry: e.target.value }))
                    }
                    placeholder="MM/YY"
                    className={fieldClass(errors.cardExpiry)}
                  />
                  {errors.cardExpiry && (
                    <span className="mt-1 block text-xs text-nonveg">
                      {errors.cardExpiry}
                    </span>
                  )}
                </label>
                <label className="text-sm font-medium text-ink">
                  CVV
                  <input
                    value={card.cvv}
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, cvv: e.target.value }))
                    }
                    placeholder="***"
                    className={fieldClass(errors.cardCvv)}
                  />
                  {errors.cardCvv && (
                    <span className="mt-1 block text-xs text-nonveg">
                      {errors.cardCvv}
                    </span>
                  )}
                </label>
              </div>
            )}

            {payment === 'cod' && (
              <p className="mt-3 rounded-xl bg-surface px-3 py-2 text-sm text-muted">
                Pay in cash when your order arrives at your doorstep.
              </p>
            )}
          </section>

          {/* Promo code */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <FiTag className="text-brand" />
              Promo code
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Try CRAVE50 or FREEDEL"
                className={`${fieldClass(false)} mt-0 flex-1`}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-brand hover:text-brand"
              >
                Apply
              </button>
              {promoDiscount > 0 && (
                <button
                  type="button"
                  onClick={clearPromo}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-nonveg hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {promoMessage && (
              <p
                className={`mt-2 text-sm ${
                  promoDiscount > 0 ? 'text-success' : 'text-nonveg'
                }`}
              >
                {promoMessage}
              </p>
            )}
          </section>
        </div>

        {/* Order summary + Price breakdown + Place Order */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            totals={totals}
            promoDiscount={promoDiscount}
            items={items}
            showTitle
          >
            {/* Explicit price breakdown reminder */}
            <div className="rounded-xl bg-surface px-3 py-2 text-xs text-muted">
              Price breakdown includes subtotal, delivery fee, taxes, and any
              promo discount. Payable total:{' '}
              <span className="font-bold text-ink">{formatPrice(finalTotal)}</span>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Place Order · {formatPrice(finalTotal)}
            </button>
            <Link
              to="/cart"
              className="block text-center text-sm font-medium text-muted transition hover:text-brand"
            >
              Return to cart
            </Link>
          </OrderSummary>
        </div>
      </form>
    </div>
  )
}
