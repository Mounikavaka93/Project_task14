export function validateName(name) {
  const value = name?.trim() || ''
  if (!value) return 'Full name is required'
  if (value.length < 2) return 'Name must be at least 2 characters'
  if (!/^[a-zA-Z\s.]+$/.test(value)) return 'Name can only contain letters'
  return ''
}

export function validateEmail(email) {
  const value = email?.trim() || ''
  if (!value) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
  return ''
}

export function validatePassword(password, { required = true } = {}) {
  if (!password) return required ? 'Password is required' : ''
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Include at least one number'
  return ''
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return ''
}

export function validatePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  if (!digits) return 'Mobile number is required'
  const normalized = digits.startsWith('91') && digits.length === 12
    ? digits.slice(2)
    : digits
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return 'Enter a valid 10-digit Indian mobile number'
  }
  return ''
}

export function validatePin(pin) {
  const value = (pin || '').trim()
  if (!value) return 'PIN code is required'
  if (!/^\d{6}$/.test(value)) return 'PIN code must be 6 digits'
  return ''
}

export function validateRequired(value, label = 'This field') {
  if (!String(value || '').trim()) return `${label} is required`
  return ''
}

export function formatPhoneDisplay(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  const ten =
    digits.startsWith('91') && digits.length === 12
      ? digits.slice(2)
      : digits.slice(-10)
  if (ten.length !== 10) return phone
  return `+91 ${ten.slice(0, 5)} ${ten.slice(5)}`
}
