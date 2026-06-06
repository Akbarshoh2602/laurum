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
    return <div className="max-w-7xl mx-auto px-6 py-20 text-neutral-500">Loading…</div>
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
      setMsg('Added to cart')
    } catch (err) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/products" className="text-sm text-neutral-500 hover:text-gold">← Back to shop</Link>
      <div className="grid md:grid-cols-2 gap-12 mt-6">
        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">No image</div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {product.categoryName} {product.brandName && `· ${product.brandName}`}
          </p>
          <h1 className="font-display text-5xl mt-2">{product.name}</h1>
          <div className="text-2xl mt-4">${Number(product.sellingPrice).toFixed(2)}</div>

          <p className="text-neutral-600 leading-relaxed mt-6">{product.description}</p>

          <dl className="grid grid-cols-2 gap-4 mt-8 text-sm">
            {product.size && (<div><dt className="label">Size</dt><dd>{product.size}</dd></div>)}
            {product.color && (<div><dt className="label">Color</dt><dd>{product.color}</dd></div>)}
            <div><dt className="label">Availability</dt>
              <dd className={outOfStock ? 'text-red-600' : 'text-green-700'}>
                {outOfStock ? 'Out of stock' : `${product.quantity} in stock`}
              </dd>
            </div>
            {product.productCode && (<div><dt className="label">Code</dt><dd>{product.productCode}</dd></div>)}
          </dl>

          {!isAdmin && (
            <div className="mt-8">
              <div className="flex items-center gap-4">
                <div className="flex border border-neutral-300">
                  <button className="px-4 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
                  <button
                    className="px-4 py-2"
                    onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                  >
                    +
                  </button>
                </div>
                <button onClick={handleAdd} disabled={busy || outOfStock} className="btn-gold flex-1">
                  {outOfStock ? 'Unavailable' : 'Add to Cart'}
                </button>
              </div>
              {msg && <p className="mt-3 text-sm text-gold-dark">{msg}</p>}
              {!isAuthenticated && (
                <p className="mt-3 text-sm text-neutral-500">
                  You can browse freely, but you'll need to log in to check out.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
