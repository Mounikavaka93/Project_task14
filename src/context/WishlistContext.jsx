import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const WishlistContext = createContext(null)
const KEY = 'cravecart-food-wishlist'

function loadIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(loadIds)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(wishlistIds))
  }, [wishlistIds])

  const isWishlisted = useCallback(
    (id) => wishlistIds.includes(id),
    [wishlistIds],
  )

  const toggleWishlist = useCallback((id) => {
    setWishlistIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      return [...prev, id]
    })
  }, [])

  const value = useMemo(
    () => ({
      wishlistIds,
      isWishlisted,
      toggleWishlist,
      count: wishlistIds.length,
    }),
    [wishlistIds, isWishlisted, toggleWishlist],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
