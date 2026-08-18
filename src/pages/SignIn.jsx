import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { validateEmail } from '../utils/validation'

export default function SignIn() {
  const { signIn, isLoggedIn, demoCredentials } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/profile'

  const [form, setForm] = useState({
    email: demoCredentials.email,
    password: demoCredentials.password,
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isLoggedIn) {
    return <Navigate to={from} replace />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setFormError('')
  }

  const validate = () => {
    const next = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Password is required',
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = signIn(form)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    navigate(from, { replace: true })
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
            <FiLogIn size={22} />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Welcome back to CraveCart</p>
        </div>

        <div className="mb-5 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2.5 text-xs text-ink">
          Demo account is pre-filled. Password: <strong>Crave@123</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block text-sm font-medium text-ink">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="you@email.com"
            />
            {errors.email && (
              <span className="mt-1 block text-xs text-nonveg">{errors.email}</span>
            )}
          </label>

          <label className="block text-sm font-medium text-ink">
            Password
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`${inputClass(errors.password)} pr-11`}
                placeholder="Your password"
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

          {formError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-nonveg">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Sign in
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          New to CraveCart?{' '}
          <Link to="/signup" className="font-semibold text-brand hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
