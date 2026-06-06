import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client, { unwrap } from '../api/client'
import ProductCard from '../components/ProductCard'

function Section({ title, subtitle, products }) {
  if (!products?.length) return null
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{subtitle}</p>
          <h2 className="font-display text-4xl mt-1">{title}</h2>
        </div>
        <Link to="/products" className="text-sm uppercase tracking-widest hover:text-gold">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    client.get('/products/featured').then((r) => setFeatured(unwrap(r) || [])).catch(() => {})
    client.get('/products/new-arrivals').then((r) => setNewArrivals(unwrap(r) || [])).catch(() => {})
    client.get('/products/best-sellers').then((r) => setBestSellers(unwrap(r) || [])).catch(() => {})
    client.get('/categories').then((r) => setCategories(unwrap(r) || [])).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink text-cream">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600')",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-32 md:py-44">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">The AURUM Collection</p>
          <h1 className="font-display text-5xl md:text-7xl leading-tight max-w-2xl">
            Wear the standard of gold.
          </h1>
          <p className="mt-6 max-w-lg text-cream/70">
            Refined essentials and statement pieces, crafted for those who appreciate timeless design.
          </p>
          <Link to="/products" className="btn-gold mt-8">Shop the collection</Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-14">
          <h2 className="font-display text-4xl text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?categoryId=${c.id}`}
                className="border border-neutral-300 py-8 text-center hover:bg-ink hover:text-gold transition"
              >
                <span className="font-display text-xl">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Section title="Featured" subtitle="Hand-picked" products={featured} />
      <Section title="New Arrivals" subtitle="Just in" products={newArrivals} />
      <Section title="Best Sellers" subtitle="Most loved" products={bestSellers} />
    </div>
  )
}
