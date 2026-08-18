import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import ToastViewport from './ToastViewport'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Navbar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      <div className="pb-mobile-nav">
        <Footer />
      </div>
      <BottomNav />
      <ToastViewport />
    </div>
  )
}
