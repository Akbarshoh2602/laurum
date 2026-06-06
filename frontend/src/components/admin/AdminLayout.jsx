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
    <div className="min-h-screen flex bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-60 bg-ink text-cream flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-cream/10">
          <span className="font-display text-2xl text-gold">AURUM</span>
          <span className="ml-2 text-[10px] uppercase tracking-widest text-cream/50">CRM</span>
        </div>
        <nav className="flex-1 py-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-6 py-3 text-sm uppercase tracking-widest transition border-l-2 ${
                  isActive
                    ? 'border-gold text-gold bg-charcoal'
                    : 'border-transparent text-cream/70 hover:text-gold'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-cream/10">
          <Link to="/" className="block text-xs text-cream/50 hover:text-gold mb-2">← Storefront</Link>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-cream/70 hover:text-gold">
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8">
          <h1 className="font-display text-2xl">Management Console</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold text-ink flex items-center justify-center font-medium">A</div>
            <span className="text-sm text-neutral-600">Administrator</span>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
