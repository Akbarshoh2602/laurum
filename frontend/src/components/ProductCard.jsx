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
      setMsg('Added')
      setTimeout(() => setMsg(''), 1500)
    } catch (err) {
      setMsg(err.message)
      setTimeout(() => setMsg(''), 2500)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="group block card overflow-hidden">
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            No image
          </div>
        )}
        {product.newArrival && (
          <span className="badge absolute top-3 left-3 bg-ink text-gold">New</span>
        )}
        {outOfStock && (
          <span className="badge absolute top-3 right-3 bg-red-700 text-white">Sold out</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">
          {product.categoryName || 'AURUM'}
        </div>
        <h3 className="font-display text-xl leading-snug mt-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg">${Number(product.sellingPrice).toFixed(2)}</span>
          <span className="text-xs text-neutral-400">
            {product.size && `Size ${product.size}`} {product.color && `· ${product.color}`}
          </span>
        </div>
        {!isAdmin && (
          <button
            onClick={handleAdd}
            disabled={busy || outOfStock}
            className="btn-gold w-full mt-4 py-2 text-xs"
          >
            {msg || (outOfStock ? 'Unavailable' : 'Add to Cart')}
          </button>
        )}
      </div>
    </Link>
  )
}
