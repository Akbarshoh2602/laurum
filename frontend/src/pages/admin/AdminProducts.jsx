import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import client, { unwrap } from '../../api/client'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')

  const load = useCallback(() => {
    const params = { page, size: 10 }
    if (search) params.search = search
    client.get('/admin/products', { params }).then((r) => {
      const d = unwrap(r)
      setProducts(d?.content || [])
      setTotalPages(d?.totalPages || 0)
    })
  }, [page, search])

  useEffect(() => { load() }, [load])

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return
    await client.delete(`/admin/products/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl">Products</h2>
        <Link to="/admin/products/new" className="btn-gold py-2">+ New Product</Link>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setPage(0); setSearch(input) }} className="flex gap-2 mb-4 max-w-md">
        <input className="input" placeholder="Search products…" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="btn-ghost px-5">Search</button>
      </form>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left uppercase text-xs tracking-widest text-neutral-500">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Code</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-12 bg-neutral-100 overflow-hidden">
                    {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-3 text-neutral-500">{p.productCode}</td>
                <td className="p-3">{p.categoryName}</td>
                <td className="p-3">${Number(p.sellingPrice).toFixed(2)}</td>
                <td className={`p-3 ${p.quantity <= 5 ? 'text-red-600 font-medium' : ''}`}>{p.quantity}</td>
                <td className="p-3">
                  <span className={`badge ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-3">
                  <Link to={`/admin/products/${p.id}/edit`} className="text-gold-dark hover:underline">Edit</Link>
                  <button onClick={() => remove(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-neutral-400">No products.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`w-9 h-9 border ${i === page ? 'bg-ink text-gold' : 'border-neutral-300'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
