import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { locations } from '../data/mockData'

const LocationContext = createContext(null)
const STORAGE_KEY = 'cravecart-location-v1'

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && locations.includes(saved)) return saved
    } catch {
      /* ignore */
    }
    return locations[0]
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedLocation)
  }, [selectedLocation])

  const value = useMemo(
    () => ({
      locations,
      selectedLocation,
      setSelectedLocation,
    }),
    [selectedLocation],
  )

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  )
}

export function useLocationStore() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocationStore must be used within LocationProvider')
  }
  return context
}
