import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl tracking-wide text-gold">AURUM</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/60">Clothing</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
          <Link to="/" className="hover:text-gold transition">Home</Link>
          <Link to="/products" className="hover:text-gold transition">Shop</Link>
          {isAuthenticated && !isAdmin && (
            <Link to="/profile" className="hover:text-gold transition">Profile</Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" className="hover:text-gold transition">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-5 text-sm">
          {!isAdmin && (
            <Link to="/cart" className="relative hover:text-gold transition">
              Cart
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-4 bg-gold text-ink text-[11px] rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="uppercase tracking-widest hover:text-gold transition">
              Logout
            </button>
          ) : (
            <Link to="/login" className="uppercase tracking-widest hover:text-gold transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
