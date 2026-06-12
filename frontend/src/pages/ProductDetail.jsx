import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import client, { unwrap } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()
  const { add } = useCart()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    client.get(`/products/${id}`).then((r) => setProduct(unwrap(r))).catch(() => setProduct(null))
  }, [id])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="font-display text-4xl animate-pulse">LOADING…</div>
      </div>
    )
  }

  const outOfStock = product.quantity <= 0

  const handleAdd = async () => {
    if (isAdmin) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } })
      return
    }
    setBusy(true)
    setMsg('')
    try {
      await add(product.id, qty)
      setMsg('Added to cart! ✓')
    } catch (err) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/products" className="inline-flex items-center gap-2 font-bold uppercase text-sm text-slate hover:text-gold transition mb-8">
        ← Back to Shop
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="relative">
          <div className="absolute -top-3 -left-3 w-full h-full bg-gold border-2 border-ink hidden sm:block" />
          <div className="relative aspect-[3/4] bg-pearl border-2 border-ink overflow-hidden shadow-pop-lg">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate font-bold uppercase">No Image</div>
            )}
          </div>
          {product.newArrival && <span className="badge-new absolute top-4 left-4">New Drop</span>}
        </div>

        <div className="lg:py-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-pearl">{product.categoryName}</span>
            {product.brandName && <span className="badge bg-electric">{product.brandName}</span>}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl text-ink leading-none">{product.name}</h1>
          <div className="font-display text-4xl text-gold mt-4">${Number(product.sellingPrice).toFixed(2)}</div>

          <p className="text-slate leading-relaxed mt-6 text-base">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 mt-8 p-5 bg-pearl border-2 border-ink">
            {product.size && (
              <div>
                <dt className="label">Size</dt>
                <dd className="font-bold">{product.size}</dd>
              </div>
            )}
            {product.color && (
              <div>
                <dt className="label">Color</dt>
                <dd className="font-bold">{product.color}</dd>
              </div>
            )}
            <div>
              <dt className="label">Stock</dt>
              <dd className={`font-bold ${outOfStock ? 'text-red-600' : 'text-forest'}`}>
                {outOfStock ? 'Sold Out' : `${product.quantity} left`}
              </dd>
            </div>
            {product.productCode && (
              <div>
                <dt className="label">SKU</dt>
                <dd className="font-mono text-sm">{product.productCode}</dd>
              </div>
            )}
          </dl>

          {!isAdmin && (
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <div className="flex border-2 border-ink shadow-pop-sm">
                  <button className="px-4 py-3 font-bold hover:bg-pearl transition" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="px-5 py-3 min-w-[3rem] text-center font-bold border-x-2 border-ink">{qty}</span>
                  <button className="px-4 py-3 font-bold hover:bg-pearl transition" onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}>+</button>
                </div>
                <button onClick={handleAdd} disabled={busy || outOfStock} className="btn-gold flex-1">
                  {outOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>
              {msg && <p className="mt-3 text-sm font-bold text-forest">{msg}</p>}
              {!isAuthenticated && (
                <p className="mt-3 text-sm text-slate">
                  <Link to="/login" state={{ from: `/products/${id}` }} className="text-gold font-bold hover:underline">Log in</Link>
                  {' '}to add to cart and checkout.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
