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
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Thank you</p>
        <h1 className="font-display text-5xl mt-2">Order #{placed.id} Confirmed</h1>
        <p className="text-neutral-600 mt-4">
          Status: <span className="uppercase">{placed.status}</span> · Total ${Number(placed.totalAmount).toFixed(2)}
        </p>
        <p className="text-neutral-600 mt-2">We'll prepare your items for delivery shortly.</p>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={() => navigate('/profile')} className="btn-ghost">View my orders</button>
          <button onClick={() => navigate('/products')} className="btn-gold">Keep shopping</button>
        </div>
      </div>
    )
  }

  if (!cart.items.length) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl mb-4">Nothing to check out</h1>
        <button onClick={() => navigate('/products')} className="btn-gold">Browse products</button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display text-5xl mb-8">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input className="input" {...register('fullName', { required: 'Required' })} />
            {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input" {...register('phone', { required: 'Required' })} />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="label">Delivery Address</label>
            <textarea rows={3} className="input" {...register('deliveryAddress', { required: 'Required' })} />
            {errors.deliveryAddress && <p className="text-red-600 text-xs mt-1">{errors.deliveryAddress.message}</p>}
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={isSubmitting} className="btn-gold w-full">
            {isSubmitting ? 'Placing order…' : 'Confirm Order'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-4">Order Summary</h2>
        <div className="card divide-y divide-neutral-200">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between p-4 text-sm">
              <span>{item.productName} × {item.quantity}</span>
              <span>${Number(item.lineTotal).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between p-4 font-medium">
            <span>Total</span>
            <span className="font-display text-2xl">${Number(cart.grandTotal).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
