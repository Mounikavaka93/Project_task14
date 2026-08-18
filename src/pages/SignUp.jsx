import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '../utils/validation'

export default function SignUp() {
  const { signUp, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isLoggedIn) {
    return <Navigate to="/profile" replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setFormError('')
  }

  const validate = () => {
    const next = {
      fullName: validateName(form.fullName),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(
        form.password,
        form.confirmPassword,
      ),
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = signUp(form)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    navigate('/profile', { replace: true })
  }

  const inputClass = (hasError) =>
    `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand/20 ${
      hasError
        ? 'border-nonveg focus:border-nonveg'
        : 'border-line focus:border-brand'
    }`

  return (
    <div className="container-app flex justify-center py-10 sm:py-14">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <FiUserPlus size={22} />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink">
            Create account
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sign up to track orders and save your address
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block text-sm font-medium text-ink">
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass(errors.fullName)}
              placeholder="Rahul Sharma"
            />
            {errors.fullName && (
              <span className="mt-1 block text-xs text-nonveg">
                {errors.fullName}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-ink">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="rahul.sharma@email.com"
            />
            {errors.email && (
              <span className="mt-1 block text-xs text-nonveg">{errors.email}</span>
            )}
          </label>

          <label className="block text-sm font-medium text-ink">
            Mobile number
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={inputClass(errors.phone)}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <span className="mt-1 block text-xs text-nonveg">{errors.phone}</span>
            )}
          </label>

          <label className="block text-sm font-medium text-ink">
            Password
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className={`${inputClass(errors.password)} pr-11`}
                placeholder="Min 8 chars, A-Z, a-z, 0-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                aria-label="Toggle password"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className="mt-1 block text-xs text-nonveg">
                {errors.password}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-ink">
            Confirm password
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClass(errors.confirmPassword)}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <span className="mt-1 block text-xs text-nonveg">
                {errors.confirmPassword}
              </span>
            )}
          </label>

          {formError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-nonveg">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
