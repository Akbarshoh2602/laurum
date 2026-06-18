import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/inventory', label: 'Inventory' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-pearl">
      <aside className="w-60 bg-ink text-cream border-r-4 border-gold flex flex-col">
        <div className="h-16 flex items-center px-6 border-b-2 border-cream/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold border-2 border-cream flex items-center justify-center">
              <span className="font-display text-lg text-cream">L</span>
            </div>
            <div>
              <span className="font-display text-xl leading-none">REMODULE</span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gold">Admin</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-6 py-3 text-xs font-bold uppercase tracking-wider transition border-l-4 ${
                  isActive
                    ? 'border-gold text-gold bg-charcoal'
                    : 'border-transparent text-cream/70 hover:text-gold hover:bg-charcoal/50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t-2 border-cream/10">
          <Link to="/" className="block text-xs font-bold uppercase tracking-wider text-cream/50 hover:text-gold mb-3">
            ← Storefront
          </Link>
          <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-wider text-cream/70 hover:text-gold">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-cream border-b-2 border-ink flex items-center justify-between px-8">
          <h1 className="font-display text-2xl">ADMIN PANEL1</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold border-2 border-ink text-cream flex items-center justify-center font-display text-lg shadow-pop-sm">
              A
            </div>
            <span className="text-sm font-bold text-slate">Administrato1r</span>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
