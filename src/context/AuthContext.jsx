import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { formatPhoneDisplay } from '../utils/validation'

const AuthContext = createContext(null)

const USERS_KEY = 'cravecart-users-v1'
const SESSION_KEY = 'cravecart-session-v1'

export const DEMO_USER = {
  id: 'u-demo',
  fullName: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  password: 'Crave@123',
  address: 'B-204, Green Valley Apartments, MG Road',
  landmark: 'Near City Mall',
  city: 'Bengaluru',
  state: 'Karnataka',
  zip: '560038',
  createdAt: '2026-01-15T10:00:00.000Z',
}

function loadUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (!saved.find((u) => u.email === DEMO_USER.email)) {
      return [DEMO_USER, ...saved]
    }
    return saved
  } catch {
    return [DEMO_USER]
  }
}

function loadSession(users) {
  try {
    const email = localStorage.getItem(SESSION_KEY)
    if (email) {
      const found = users.find((u) => u.email === email)
      if (found) return found
    }
  } catch {
    /* ignore */
  }
  // App opens logged in with demo profile by default
  return DEMO_USER
}

function publicUser(user) {
  if (!user) return null
  const { password, ...rest } = user
  return {
    ...rest,
    phone: formatPhoneDisplay(rest.phone),
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [user, setUser] = useState(() => publicUser(loadSession(loadUsers())))

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(SESSION_KEY, user.email)
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  const signUp = ({ fullName, email, phone, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists' }
    }
    const newUser = {
      id: `u-${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: formatPhoneDisplay(phone),
      password,
      address: '',
      landmark: '',
      city: '',
      state: '',
      zip: '',
      createdAt: new Date().toISOString(),
    }
    setUsers((prev) => [...prev, newUser])
    setUser(publicUser(newUser))
    return { ok: true }
  }

  const signIn = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const found = users.find((u) => u.email === normalizedEmail)
    if (!found) {
      return { ok: false, error: 'No account found with this email' }
    }
    if (found.password !== password) {
      return { ok: false, error: 'Incorrect password' }
    }
    setUser(publicUser(found))
    return { ok: true }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  const updateProfile = (updates) => {
    if (!user) return { ok: false, error: 'Please sign in first' }
    setUsers((prev) =>
      prev.map((u) =>
        u.email === user.email
          ? {
              ...u,
              ...updates,
              email: u.email,
              phone: updates.phone
                ? formatPhoneDisplay(updates.phone)
                : u.phone,
            }
          : u,
      ),
    )
    setUser((prev) =>
      publicUser({
        ...prev,
        ...updates,
        email: prev.email,
        phone: updates.phone ? formatPhoneDisplay(updates.phone) : prev.phone,
        password: users.find((u) => u.email === prev.email)?.password,
      }),
    )
    return { ok: true }
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      signIn,
      signUp,
      signOut,
      updateProfile,
      demoCredentials: {
        email: DEMO_USER.email,
        password: DEMO_USER.password,
      },
    }),
    [user, users],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
