import { useEffect, useState, useCallback, Fragment } from 'react'
import client, { unwrap } from '../../api/client'

const STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']

const statusClasses = (s) =>
  s === 'COMPLETED' ? 'bg-green-100 text-green-800'
  : s === 'CANCELLED' ? 'bg-red-100 text-red-800'
  : s === 'PROCESSING' ? 'bg-blue-100 text-blue-800'
  : 'bg-amber-100 text-amber-800'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(() => {
    const params = { page, size: 10 }
    if (status) params.status = status
    if (search) params.search = search
    client.get('/admin/orders', { params }).then((r) => {
      const d = unwrap(r)
      setOrders(d?.content || [])
      setTotalPages(d?.totalPages || 0)
    })
  }, [page, status, search])

  useEffect(() => { load() }, [load])

  const changeStatus = async (id, newStatus) => {
    try {
      await client.patch(`/admin/orders/${id}/status?status=${newStatus}`)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-6">Orders</h2>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <form onSubmit={(e) => { e.preventDefault(); setPage(0); setSearch(input) }} className="flex gap-2">
          <input className="input w-64" placeholder="Search by name, phone, #id…" value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="btn-ghost px-5">Search</button>
        </form>
        <select className="input w-44" value={status} onChange={(e) => { setPage(0); setStatus(e.target.value) }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left uppercase text-xs tracking-widest text-neutral-500">
            <tr>
              <th className="p-3">#</th><th className="p-3">Customer</th><th className="p-3">Phone</th>
              <th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Set Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((o) => (
              <Fragment key={o.id}>
                <tr className="hover:bg-neutral-50 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                  <td className="p-3 font-medium">#{o.id}</td>
                  <td className="p-3">{o.fullName}</td>
                  <td className="p-3 text-neutral-500">{o.phone}</td>
                  <td className="p-3">${Number(o.totalAmount).toFixed(2)}</td>
                  <td className="p-3"><span className={`badge ${statusClasses(o.status)}`}>{o.status}</span></td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select className="border border-neutral-300 px-2 py-1 text-xs" value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr className="bg-neutral-50">
                    <td colSpan={6} className="p-4">
                      <div className="text-sm text-neutral-600 mb-2">Delivery: {o.deliveryAddress}</div>
                      <table className="w-full text-sm">
                        <tbody>
                          {o.items.map((it) => (
                            <tr key={it.id}>
                              <td className="py-1">{it.productName}</td>
                              <td className="py-1 text-neutral-500">× {it.quantity}</td>
                              <td className="py-1 text-right">${Number(it.lineTotal).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-neutral-400">No orders.</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`w-9 h-9 border ${i === page ? 'bg-ink text-gold' : 'border-neutral-300'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  )
}
