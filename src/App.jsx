import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { OrdersProvider } from './context/OrdersContext'
import { LocationProvider } from './context/LocationContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import RestaurantListing from './pages/RestaurantListing'
import RestaurantDetails from './pages/RestaurantDetails'
import FoodDetails from './pages/FoodDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Support from './pages/Support'

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <OrdersProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="restaurants" element={<RestaurantListing />} />
                  <Route path="restaurants/:id" element={<RestaurantDetails />} />
                  <Route path="food/:id" element={<FoodDetails />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation" element={<OrderConfirmation />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="signup" element={<SignUp />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="support" element={<Support />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </OrdersProvider>
      </LocationProvider>
    </AuthProvider>
  )
}
