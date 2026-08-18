import { Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart } from 'react-icons/fi'
import RestaurantCard from '../components/RestaurantCard'
import FoodCard from '../components/FoodCard'
import { useFavorites } from '../context/FavoritesContext'
import { useWishlist } from '../context/WishlistContext'
import { foods, restaurants } from '../data/mockData'

export default function Favorites() {
  const { favoriteIds } = useFavorites()
  const { wishlistIds } = useWishlist()

  const favoriteRestaurants = restaurants.filter((r) =>
    favoriteIds.includes(r.id),
  )
  const wishFoods = foods.filter((f) => wishlistIds.includes(f.id)).slice(0, 8)

  return (
    <div className="container-app py-8 sm:py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <FiArrowLeft /> Back to home
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Favorites
          </h1>
          <p className="mt-2 text-muted">
            Favorite restaurants and a peek at your food wishlist
          </p>
        </div>
        <Link
          to="/wishlist"
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-brand/40"
        >
          <FiHeart className="text-brand" /> Full wishlist
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-ink">
          Favorite restaurants
        </h2>
        {favoriteRestaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-card py-14 text-center">
            <FiHeart className="mx-auto mb-3 text-muted" size={28} />
            <p className="font-semibold text-ink">No favorite restaurants yet</p>
            <p className="mt-1 text-sm text-muted">
              Tap the heart on any restaurant card to save it here.
            </p>
            <Link
              to="/restaurants"
              className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              Browse restaurants
            </Link>
          </div>
        ) : (
          <div className="card-grid card-grid-3">
            {favoriteRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-ink">
            Wishlist preview
          </h2>
          <Link to="/wishlist" className="text-sm font-semibold text-brand">
            View all
          </Link>
        </div>
        {wishFoods.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-card py-10 text-center text-sm text-muted">
            No wishlist dishes yet — heart a food item to save it.
          </p>
        ) : (
          <div className="card-grid card-grid-4">
            {wishFoods.map((food) => (
              <FoodCard key={food.id} food={food} showRestaurant />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
