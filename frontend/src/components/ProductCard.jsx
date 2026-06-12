import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const { add } = useCart()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const outOfStock = product.quantity <= 0

  const handleAdd = async (e) => {
    e.preventDefault()
    if (isAdmin) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/products' } })
      return
    }
    setBusy(true)
    setMsg('')
    try {
      await add(product.id, 1)
      setMsg('Added! ✓')
      setTimeout(() => setMsg(''), 1500)
    } catch (err) {
      setMsg(err.message)
      setTimeout(() => setMsg(''), 2500)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="group">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] bg-pearl border-2 border-ink overflow-hidden shadow-pop-sm
                        group-hover:shadow-pop group-hover:-translate-y-1 transition-all duration-200">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate text-xs font-bold uppercase">
              No Image
            </div>
          )}
          {product.newArrival && (
            <span className="badge-new absolute top-3 left-3">New Drop</span>
          )}
          {product.bestSeller && !product.newArrival && (
            <span className="badge-hot absolute top-3 left-3">Hot</span>
          )}
          {outOfStock && (
            <span className="badge-sold absolute top-3 right-3">Sold Out</span>
          )}
        </div>
      </Link>

      <div className="pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-dark mb-1">
          {product.categoryName || 'Laura Store'}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-display text-2xl text-ink leading-tight group-hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">${Number(product.sellingPrice).toFixed(2)}</span>
          {(product.size || product.color) && (
            <span className="text-[11px] font-bold uppercase text-slate">
              {product.size} {product.color && `· ${product.color}`}
            </span>
          )}
        </div>
        {!isAdmin && (
          <button
            onClick={handleAdd}
            disabled={busy || outOfStock}
            className="w-full mt-3 btn-ghost py-2 text-xs disabled:opacity-40"
          >
            {msg || (outOfStock ? 'Out of Stock' : 'Add to Cart →')}
          </button>
        )}
      </div>
    </div>
  )
}
