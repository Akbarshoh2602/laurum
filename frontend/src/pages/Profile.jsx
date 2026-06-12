import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import client, { unwrap } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('all')
  const [msg, setMsg] = useState('')
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      address: user?.address,
      newPassword: '',
    },
  })

  useEffect(() => {
    client.get('/profile/orders', { params: { size: 50 } })
      .then((r) => setOrders(unwrap(r)?.content || []))
      .catch(() => {})
  }, [])

  const onSubmit = async (data) => {
    setMsg('')
    try {
      const res = await client.put('/profile', data)
      updateUser(unwrap(res))
      setMsg('Profile updated! ✓')
    } catch (err) {
      setMsg(err.message)
    }
  }

  const filtered = orders.filter((o) => {
    if (tab === 'pending') return o.status === 'PENDING' || o.status === 'PROCESSING'
    if (tab === 'completed') return o.status === 'COMPLETED'
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <span className="badge bg-electric mb-3 inline-block">My Account</span>
        <h1 className="font-display text-6xl">HEY, {user?.firstName?.toUpperCase()}</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="card p-6">
          <h2 className="font-display text-3xl mb-6 pb-3 border-b-2 border-ink">Profile</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">First Name</label><input className="input" {...register('firstName')} /></div>
              <div><label className="label">Last Name</label><input className="input" {...register('lastName')} /></div>
            </div>
            <div><label className="label">Email</label><input className="input bg-pearl cursor-not-allowed" value={user?.email} disabled /></div>
            <div><label className="label">Phone</label><input className="input" {...register('phone')} /></div>
            <div><label className="label">Address</label><textarea rows={2} className="input resize-none" {...register('address')} /></div>
            <div><label className="label">New Password (optional)</label><input type="password" className="input" {...register('newPassword')} /></div>
            {msg && <p className="text-sm font-bold text-forest">{msg}</p>}
            <button className="btn-gold">Save Changes</button>
          </form>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-3xl mb-6 pb-3 border-b-2 border-ink">Orders</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            {['all', 'pending', 'completed'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`badge capitalize transition-all ${
                  tab === t ? 'bg-gold text-cream shadow-pop-sm' : 'bg-pearl hover:bg-mist'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-slate font-medium">No orders yet. Go treat yourself!</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((o) => (
                <div key={o.id} className="p-4 bg-pearl border-2 border-ink">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-xl">Order #{o.id}</span>
                    <span className={`badge ${
                      o.status === 'COMPLETED' ? 'bg-forest text-cream'
                      : o.status === 'CANCELLED' ? 'bg-red-600 text-cream'
                      : 'bg-gold text-cream'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate font-medium mt-1">
                    {o.items?.length} item(s) · ${Number(o.totalAmount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
