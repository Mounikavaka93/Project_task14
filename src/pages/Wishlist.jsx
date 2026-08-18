import { Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart } from 'react-icons/fi'
import FoodCard from '../components/FoodCard'
import { useWishlist } from '../context/WishlistContext'
import { foods } from '../data/mockData'

export default function Wishlist() {
  const { wishlistIds } = useWishlist()
  const items = foods.filter((f) => wishlistIds.includes(f.id))

  return (
    <div className="container-app py-8 sm:py-10">
      <Link
        to="/favorites"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand"
      >
        <FiArrowLeft /> Back to favorites
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Food wishlist
        </h1>
        <p className="mt-2 text-muted">
          Dishes you saved for later — add them to cart anytime
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card py-16 text-center">
          <FiHeart className="mx-auto mb-3 text-muted" size={32} />
          <p className="font-semibold text-ink">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted">
            Tap the heart on any dish to add it here.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Discover dishes
          </Link>
        </div>
      ) : (
        <div className="card-grid card-grid-4">
          {items.map((food) => (
            <FoodCard key={food.id} food={food} showRestaurant />
          ))}
        </div>
      )}
    </div>
  )
}
