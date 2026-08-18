import { Link } from 'react-router-dom'
import { FiClock, FiHeart, FiMapPin, FiStar, FiTruck } from 'react-icons/fi'
import { formatPrice } from '../utils/format'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'

export default function RestaurantCard({ restaurant }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { pushToast } = useToast()
  const liked = isFavorite(restaurant.id)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(restaurant.id)
    pushToast(
      liked
        ? `Removed ${restaurant.name} from favorites`
        : `Added ${restaurant.name} to favorites`,
      liked ? 'info' : 'success',
    )
  }

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-line">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {restaurant.tags?.[0] && (
          <span className="absolute left-3 top-3 rounded-lg bg-card/95 px-2.5 py-1 text-xs font-semibold text-ink">
            {restaurant.tags[0]}
          </span>
        )}
        <button
          type="button"
          onClick={handleFavorite}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            liked
              ? 'border-brand bg-brand text-white'
              : 'border-line bg-card/95 text-ink hover:text-brand'
          }`}
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart className={liked ? 'fill-current' : ''} size={16} />
        </button>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-success px-2 py-1 text-xs font-bold text-white">
          <FiStar className="fill-current" size={12} />
          {restaurant.rating}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-bold leading-snug text-ink sm:text-lg">
          {restaurant.name}
        </h3>
        <p className="text-sm text-muted">{restaurant.cuisine}</p>

        {restaurant.location && (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-brand">
            <FiMapPin size={12} />
            {restaurant.location}
          </p>
        )}

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
