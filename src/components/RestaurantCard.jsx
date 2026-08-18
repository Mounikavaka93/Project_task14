import { Link } from 'react-router-dom'
import { FiClock, FiMapPin, FiStar, FiTruck } from 'react-icons/fi'
import { formatPrice } from '../utils/format'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
    >
      {/* Restaurant image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {restaurant.tags?.[0] && (
          <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink">
            {restaurant.tags[0]}
          </span>
        )}
        {/* Rating badge on image */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-success px-2 py-1 text-xs font-bold text-white">
          <FiStar className="fill-current" size={12} />
          {restaurant.rating}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Restaurant name */}
        <h3 className="text-base font-bold leading-snug text-ink sm:text-lg">
          {restaurant.name}
        </h3>

        {/* Cuisine type */}
        <p className="text-sm text-muted">{restaurant.cuisine}</p>

        {restaurant.location && (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-brand">
            <FiMapPin size={12} />
            {restaurant.location}
          </p>
        )}

        {/* Delivery time · Delivery fee · Price range */}
        <div className="mt-auto grid grid-cols-3 gap-1.5 border-t border-line pt-3 text-center">
          <div className="min-w-0">
            <p className="mb-0.5 inline-flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-muted">
              <FiClock size={11} className="shrink-0 text-brand" />
              Time
            </p>
            <p className="truncate text-xs font-semibold text-ink sm:text-sm">
              {restaurant.deliveryTime}
            </p>
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 inline-flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-muted">
              <FiTruck size={11} className="shrink-0 text-brand" />
              Fee
            </p>
            <p className="truncate text-xs font-semibold text-ink sm:text-sm">
              {formatPrice(restaurant.deliveryFee)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] uppercase tracking-wide text-muted">
              Price
            </p>
            <p className="truncate text-xs font-semibold text-ink sm:text-sm">
              {restaurant.priceRange}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
