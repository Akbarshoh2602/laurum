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

  const activeCategory = categories.find((c) => String(c.id) === categoryId)

  return (
    <div>
      {/* Shop header banner */}
      <div className="bg-ink text-cream py-12 border-b-4 border-gold pattern-stripes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="badge-hot mb-4 inline-block">Men&apos;s Clothing</span>
          <h1 className="font-display text-6xl sm:text-7xl leading-none">
            {activeCategory ? activeCategory.name.toUpperCase() : 'THE SHOP'}
          </h1>
          <p className="text-cream/70 font-medium mt-3 max-w-lg">
            {activeCategory
              ? `All our ${activeCategory.name.toLowerCase()} gear in one place.`
              : 'Browse the full collection — find something that fits your style.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <form onSubmit={applySearch} className="flex gap-2 flex-1 max-w-lg">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search jackets, tees, pants…"
              className="input flex-1"
            />
            <button className="btn-gold py-2 px-5 text-xs shrink-0">Go</button>
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`badge transition-all ${!categoryId ? 'bg-gold text-cream shadow-pop-sm' : 'bg-cream hover:bg-pearl'}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(String(c.id))}
                className={`badge transition-all ${
                  categoryId === String(c.id) ? 'bg-gold text-cream shadow-pop-sm' : 'bg-cream hover:bg-pearl'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="font-display text-4xl text-ink animate-pulse">LOADING…</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 card p-12">
            <div className="font-display text-5xl text-ink mb-3">NO LUCK</div>
            <p className="text-slate font-medium">Nothing matched your search. Try something else!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                className={`w-11 h-11 font-bold border-2 border-ink transition-all ${
                  i === page
                    ? 'bg-gold text-cream shadow-pop-sm'
                    : 'bg-cream hover:bg-pearl shadow-pop-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
