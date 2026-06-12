import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import client, { unwrap } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { cart, refresh } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      phone: user?.phone || '',
      deliveryAddress: user?.address || '',
    },
  })

  const onSubmit = async (data) => {
    setError('')
    try {
      const res = await client.post('/orders/checkout', data)
      const order = unwrap(res)
      await refresh()
      setPlaced(order)
    } catch (err) {
      setError(err.message)
    }
  }

  if (placed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <span className="badge-hot mb-4 inline-block">Order Placed</span>
        <h1 className="font-display text-5xl mb-2">YOU&apos;RE SET!</h1>
        <p className="font-display text-3xl text-gold mb-4">Order #{placed.id}</p>
        <p className="text-slate font-medium">
          Status: <span className="font-bold uppercase">{placed.status}</span>
          {' · '}${Number(placed.totalAmount).toFixed(2)}
        </p>
        <p className="text-slate mt-3">We&apos;re packing your gear now. It&apos;ll be on its way soon.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <button onClick={() => navigate('/profile')} className="btn-ghost">My Orders</button>
          <button onClick={() => navigate('/products')} className="btn-gold">Keep Shopping</button>
        </div>
      </div>
    )
  }

  if (!cart.items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-5xl mb-4">NOTHING HERE</h1>
        <button onClick={() => navigate('/products')} className="btn-gold">Browse Shop</button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <span className="badge bg-electric mb-3 inline-block">Almost There</span>
        <h1 className="font-display text-6xl">CHECKOUT</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="card p-6">
          <h2 className="font-display text-3xl mb-6">Delivery Info</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <input className="input" {...register('fullName', { required: 'Required' })} />
              {errors.fullName && <p className="text-red-600 text-xs mt-1 font-medium">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" {...register('phone', { required: 'Required' })} />
              {errors.phone && <p className="text-red-600 text-xs mt-1 font-medium">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label">Delivery Address</label>
              <textarea rows={3} className="input resize-none" {...register('deliveryAddress', { required: 'Required' })} />
              {errors.deliveryAddress && <p className="text-red-600 text-xs mt-1 font-medium">{errors.deliveryAddress.message}</p>}
            </div>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <button disabled={isSubmitting} className="btn-gold w-full">
              {isSubmitting ? 'Placing Order…' : 'Place Order →'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display text-3xl mb-6">Order Summary</h2>
          <div className="card divide-y-2 divide-ink/10">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between p-4 text-sm">
                <span className="font-medium">{item.productName} × {item.quantity}</span>
                <span className="font-bold">${Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between p-5 bg-ink text-cream">
              <span className="font-display text-xl text-gold">Total</span>
              <span className="font-display text-3xl">${Number(cart.grandTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
