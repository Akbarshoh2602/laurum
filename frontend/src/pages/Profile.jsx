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
      setMsg('Profile updated')
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl mb-10">My Account</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <section>
          <h2 className="font-display text-2xl mb-4">Personal Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">First Name</label><input className="input" {...register('firstName')} /></div>
              <div><label className="label">Last Name</label><input className="input" {...register('lastName')} /></div>
            </div>
            <div><label className="label">Email</label><input className="input bg-neutral-100" value={user?.email} disabled /></div>
            <div><label className="label">Phone</label><input className="input" {...register('phone')} /></div>
            <div><label className="label">Address</label><textarea rows={2} className="input" {...register('address')} /></div>
            <div><label className="label">New Password (optional)</label><input type="password" className="input" {...register('newPassword')} /></div>
            {msg && <p className="text-sm text-gold-dark">{msg}</p>}
            <button className="btn-gold">Save Changes</button>
          </form>
        </section>

        <section>
          <h2 className="font-display text-2xl mb-4">Order History</h2>
          <div className="flex gap-2 mb-4">
            {['all', 'pending', 'completed'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`badge border px-3 py-1 capitalize ${tab === t ? 'bg-ink text-gold' : 'border-neutral-300'}`}>
                {t}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((o) => (
                <div key={o.id} className="card p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Order #{o.id}</span>
                    <span className={`badge ${
                      o.status === 'COMPLETED' ? 'bg-green-100 text-green-800'
                      : o.status === 'CANCELLED' ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">
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
