import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, updateQty, remove } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const goCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout')
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <span className="badge-hot mb-4 inline-block">Cart</span>
        <h1 className="font-display text-5xl mb-4">LOG IN FIRST</h1>
        <p className="text-slate font-medium mb-8">You need an account to view your cart and checkout.</p>
        <Link to="/login" state={{ from: '/cart' }} className="btn-gold">Log In</Link>
      </div>
    )
  }

  if (!cart.items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-5xl mb-4">CART&apos;S EMPTY</h1>
        <p className="text-slate font-medium mb-8">Time to fill it up with some fire fits.</p>
        <Link to="/products" className="btn-gold">Go Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <span className="badge bg-electric mb-3 inline-block">Your Cart</span>
        <h1 className="font-display text-6xl text-ink">YOUR GEAR</h1>
      </div>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="card flex flex-wrap sm:flex-nowrap items-center gap-4 p-4">
            <div className="w-20 h-24 bg-pearl border-2 border-ink overflow-hidden flex-shrink-0">
              {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-[140px]">
              <h3 className="font-display text-2xl">{item.productName}</h3>
              <p className="text-sm text-slate font-medium">${Number(item.unitPrice).toFixed(2)} each</p>
            </div>
            <div className="flex border-2 border-ink shadow-pop-sm">
              <button className="px-3 py-1.5 font-bold hover:bg-pearl" onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
              <span className="px-3 py-1.5 min-w-[2.5rem] text-center font-bold border-x-2 border-ink">{item.quantity}</span>
              <button className="px-3 py-1.5 font-bold hover:bg-pearl" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
            </div>
            <div className="w-24 text-right font-bold text-lg">${Number(item.lineTotal).toFixed(2)}</div>
            <button onClick={() => remove(item.productId)} className="text-slate hover:text-red-600 font-bold text-xs uppercase tracking-wider">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-ink text-cream border-2 border-ink shadow-pop-lg">
        <div className="flex justify-between items-center mb-6">
          <span className="font-display text-2xl text-gold">TOTAL</span>
          <span className="font-display text-5xl">${Number(cart.grandTotal).toFixed(2)}</span>
        </div>
        <button onClick={goCheckout} className="btn-gold w-full text-base">
          Checkout →
        </button>
      </div>
    </div>
  )
}
