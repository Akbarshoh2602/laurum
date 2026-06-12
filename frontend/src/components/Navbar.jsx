import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Marquee strip */}
      <div className="bg-ink text-cream overflow-hidden py-2 border-b-2 border-gold">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {[
                'FREE SHIPPING OVER $150',
                'NEW DROPS EVERY WEEK',
                "MEN'S WEAR THAT HITS DIFFERENT",
                'FRESH FITS · NO CAP',
                'LAURA STORE — BUILT FOR GUYS',
              ].map((text) => (
                <span key={text} className="mx-8 text-xs font-bold uppercase tracking-widest flex items-center gap-8">
                  {text}
                  <span className="text-gold">★</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-cream border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gold border-2 border-ink shadow-pop-sm flex items-center justify-center
                            group-hover:rotate-3 transition-transform">
              <span className="font-display text-2xl text-cream leading-none">L</span>
            </div>
            <div className="leading-none">
              <span className="font-display text-2xl sm:text-3xl text-ink block">LAURA</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-dark">Men&apos;s Store</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Shop</Link>
            {isAuthenticated && !isAdmin && (
              <Link to="/profile" className="nav-link">Account</Link>
            )}
            {isAdmin && (
              <Link to="/admin/dashboard" className="nav-link">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {!isAdmin && (
              <Link
                to="/cart"
                className="relative flex items-center gap-2 bg-ink text-cream font-bold uppercase text-xs
                           tracking-wider px-4 py-2 border-2 border-ink shadow-pop-sm
                           hover:bg-gold hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Cart
                {cart.totalItems > 0 && (
                  <span className="bg-electric text-ink text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-ink">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block nav-link"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="hidden sm:block btn-ghost py-2 px-4 text-xs shadow-pop-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
