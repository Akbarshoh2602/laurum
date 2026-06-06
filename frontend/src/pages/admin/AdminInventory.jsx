import { useEffect, useState, useCallback } from 'react'
import client, { unwrap } from '../../api/client'

export default function AdminInventory() {
  const [logs, setLogs] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [productId, setProductId] = useState('')
  const [change, setChange] = useState('')
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')

  const loadLogs = useCallback(() => {
    client.get('/admin/inventory/logs', { params: { page, size: 12 } }).then((r) => {
      const d = unwrap(r)
      setLogs(d?.content || [])
      setTotalPages(d?.totalPages || 0)
    })
  }, [page])

  const loadAux = () => {
    client.get('/admin/inventory/low-stock').then((r) => setLowStock(unwrap(r) || []))
    client.get('/admin/products', { params: { size: 200 } }).then((r) => setProducts(unwrap(r)?.content || []))
  }

  useEffect(() => { loadLogs() }, [loadLogs])
  useEffect(() => { loadAux() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await client.post('/admin/inventory/adjust', {
        productId: Number(productId),
        change: Number(change),
        note,
      })
      setMsg('Stock adjusted')
      setChange(''); setNote('')
      loadLogs(); loadAux()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="font-display text-3xl">Inventory</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Adjust stock */}
        <div className="bg-white border border-neutral-200 p-5">
          <h3 className="font-display text-2xl mb-4">Adjust Stock</h3>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="label">Product</label>
              <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)} required>
                <option value="">Select…</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock {p.quantity})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Change (+ add / − remove)</label>
              <input type="number" className="input" value={change} onChange={(e) => setChange(e.target.value)} placeholder="e.g. 10 or -3" required />
            </div>
            <div>
              <label className="label">Note</label>
              <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Restock, correction…" />
            </div>
            {msg && <p className="text-sm text-gold-dark">{msg}</p>}
            <button className="btn-gold py-2 w-full">Apply</button>
          </form>
        </div>

        {/* Low stock alerts */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 p-5">
          <h3 className="font-display text-2xl mb-4">Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p className="text-neutral-400 text-sm">All products are sufficiently stocked.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex justify-between border border-red-200 bg-red-50 p-3 text-sm">
                  <span>{p.name}</span>
                  <span className="font-medium text-red-700">{p.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Movement logs */}
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left uppercase text-xs tracking-widest text-neutral-500">
            <tr>
              <th className="p-3">Product</th><th className="p-3">Prev</th><th className="p-3">Added</th>
              <th className="p-3">Removed</th><th className="p-3">Current</th><th className="p-3">By</th>
              <th className="p-3">Note</th><th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-neutral-50">
                <td className="p-3 font-medium">{l.productName}</td>
                <td className="p-3">{l.previousQuantity}</td>
                <td className="p-3 text-green-700">{l.addedQuantity > 0 ? `+${l.addedQuantity}` : '—'}</td>
                <td className="p-3 text-red-700">{l.removedQuantity > 0 ? `−${l.removedQuantity}` : '—'}</td>
                <td className="p-3 font-medium">{l.currentQuantity}</td>
                <td className="p-3 text-neutral-500">{l.performedBy}</td>
                <td className="p-3 text-neutral-500">{l.note}</td>
                <td className="p-3 text-neutral-400">{l.createdAt ? new Date(l.createdAt).toLocaleString() : ''}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-neutral-400">No stock movements yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`w-9 h-9 border ${i === page ? 'bg-ink text-gold' : 'border-neutral-300'}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  )
}
