import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import client, { unwrap } from '../api/client'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    client.get('/categories').then((r) => setCategories(unwrap(r) || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, size: 12 }
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    client
      .get('/products', { params })
      .then((r) => {
        const data = unwrap(r)
        setProducts(data?.content || [])
        setTotalPages(data?.totalPages || 0)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [search, categoryId, page])

  const applySearch = (e) => {
    e.preventDefault()
    setPage(0)
    const next = new URLSearchParams(searchParams)
    if (searchInput) next.set('search', searchInput)
    else next.delete('search')
    setSearchParams(next)
  }

  const setCategory = (id) => {
    setPage(0)
    const next = new URLSearchParams(searchParams)
    if (id) next.set('categoryId', id)
    else next.delete('categoryId')
    setSearchParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-5xl mb-8">The Shop</h1>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-10">
        <form onSubmit={applySearch} className="flex gap-2 w-full md:w-96">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="input"
          />
          <button className="btn-ghost px-5">Search</button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`badge border px-3 py-1 ${!categoryId ? 'bg-ink text-gold' : 'border-neutral-300'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(String(c.id))}
              className={`badge border px-3 py-1 ${
                categoryId === String(c.id) ? 'bg-ink text-gold' : 'border-neutral-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-10 h-10 border ${
                i === page ? 'bg-ink text-gold' : 'border-neutral-300 hover:border-gold'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
