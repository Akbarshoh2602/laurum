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
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl mb-4">Your Cart</h1>
        <p className="text-neutral-600 mb-6">Please log in to view your cart and complete your order.</p>
        <Link to="/login" state={{ from: '/cart' }} className="btn-gold">Log in</Link>
      </div>
    )
  }

  if (!cart.items.length) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="btn-gold">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="card flex items-center gap-4 p-4">
            <div className="w-20 h-24 bg-neutral-100 overflow-hidden flex-shrink-0">
              {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl">{item.productName}</h3>
              <p className="text-sm text-neutral-500">${Number(item.unitPrice).toFixed(2)} each</p>
            </div>
            <div className="flex border border-neutral-300">
              <button className="px-3 py-1" onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
              <span className="px-3 py-1 min-w-[2.5rem] text-center">{item.quantity}</span>
              <button className="px-3 py-1" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
            </div>
            <div className="w-24 text-right font-medium">${Number(item.lineTotal).toFixed(2)}</div>
            <button onClick={() => remove(item.productId)} className="text-neutral-400 hover:text-red-600 text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-10">
        <div className="w-full md:w-80">
          <div className="flex justify-between text-lg border-t border-ink pt-4">
            <span className="uppercase tracking-widest text-sm self-center">Grand Total</span>
            <span className="font-display text-3xl">${Number(cart.grandTotal).toFixed(2)}</span>
          </div>
          <button onClick={goCheckout} className="btn-gold w-full mt-6">Checkout</button>
        </div>
      </div>
    </div>
  )
}
