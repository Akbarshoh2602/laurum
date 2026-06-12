import { useEffect, useState, useCallback } from 'react'
import client, { unwrap } from '../../api/client'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  const load = useCallback(() => {
    const params = { page, size: 10 }
    if (search) params.search = search
    client.get('/admin/customers', { params }).then((r) => {
      const d = unwrap(r)
      setCustomers(d?.content || [])
      setTotalPages(d?.totalPages || 0)
    })
  }, [page, search])

  useEffect(() => { load() }, [load])

  const viewHistory = async (c) => {
    setSelected(c)
    const res = await client.get(`/admin/customers/${c.id}/orders`)
    setHistory(unwrap(res) || [])
  }

  const remove = async (id) => {
    if (!confirm('Delete this customer?')) return
    await client.delete(`/admin/customers/${id}`)
    setSelected(null)
    load()
  }

  return (
    <div>
      <h2 className="font-display text-3xl mb-6">Customers</h2>

      <form onSubmit={(e) => { e.preventDefault(); setPage(0); setSearch(input) }} className="flex gap-2 mb-4 max-w-md">
        <input className="input" placeholder="Search name, email, phone…" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn-ghost px-5">Search</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left uppercase text-xs tracking-widest text-neutral-500">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="p-3 font-medium">{c.firstName} {c.lastName}</td>
                <td className="p-3 text-neutral-500">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3 text-right space-x-3">
                  <button onClick={() => viewHistory(c)} className="text-gold-dark hover:underline">Orders</button>
                  <button onClick={() => remove(c.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-neutral-400">No customers.</td></tr>}
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

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-2xl">{selected.firstName} {selected.lastName}</h3>
                <p className="text-sm text-neutral-500">{selected.email} · {selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-neutral-400 text-xl">×</button>
            </div>
            <h4 className="label">Order History</h4>
            {history.length === 0 ? (
              <p className="text-neutral-400 text-sm">No orders.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-auto">
                {history.map((o) => (
                  <div key={o.id} className="flex justify-between border border-neutral-200 p-3 text-sm">
                    <span>#{o.id} · {o.status}</span>
                    <span>${Number(o.totalAmount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
