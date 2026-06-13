import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client, { unwrap } from '../api/client'
import ProductCard from '../components/ProductCard'

const CATEGORY_COLORS = ['bg-gold', 'bg-electric', 'bg-forest', 'bg-charcoal', 'bg-gold-light', 'bg-mist']

function Section({ title, subtitle, products, bg = 'bg-cream' }) {
  if (!products?.length) return null
  return (
    <section className={`py-16 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="badge-hot inline-block mb-3">{subtitle}</span>
            <h2 className="font-display text-5xl sm:text-6xl text-ink leading-none">{title}</h2>
          </div>
          <Link
            to="/products"
            className="btn-ghost py-2 px-5 text-xs"
          >
            See All →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
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
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-ink text-cream border-b-4 border-gold">
        <div className="absolute inset-0 pattern-stripes opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge-new inline-block mb-6 animate-bounce-soft">New Season Drop</span>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] mb-6">
              GEAR lalal.<br />
              <span className="text-gold">LOOK O'zgartirdim.</span>
            </h1>
            <p className="text-cream/80 text-lg max-w-md mb-8 leading-relaxed">
              Premium men&apos;s clothing for guys who actually care about what they wear.
              Jackets, tees, pants — all picked to level up your daily fit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-gold">Shop Now</Link>
              <Link to="/products" className="btn-outline-gold border-cream text-cream shadow-pop-sm hover:bg-cream hover:text-ink">
                Browse Drops
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t-2 border-cream/20">
              {[
                { n: '500+', l: 'Happy Guys' },
                { n: '48h', l: 'Fast Ship' },
                { n: 'Easy', l: 'Returns' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl text-gold">{s.n}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cream/60">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-gold border-2 border-ink" />
            <div className="relative border-2 border-ink overflow-hidden aspect-[4/5] shadow-pop-lg">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80"
                alt="Men's fashion"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 badge-hot text-base px-4 py-2 rotate-3 shadow-pop">
              🔥 Hot Picks
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-pearl pattern-dots border-b-2 border-ink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="font-display text-5xl sm:text-6xl text-ink">PICK YOUR VIBE</h2>
              <p className="text-slate font-medium mt-2">Tap a category and find your next go-to piece</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((c, i) => (
                <Link
                  key={c.id}
                  to={`/products?categoryId=${c.id}`}
                  className={`group ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} border-2 border-ink p-6
                              text-center shadow-pop-sm transition-all duration-200
                              hover:-translate-y-1 hover:shadow-pop hover:rotate-1`}
                >
                  <span className="font-display text-2xl text-ink group-hover:scale-110 inline-block transition-transform">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Section title="STAFF PICKS" subtitle="Featured" products={featured} />
      <Section title="FRESH DROPS" subtitle="Just Landed" products={newArrivals} bg="bg-pearl pattern-stripes" />
      <Section title="CROWD FAVES" subtitle="Best Sellers" products={bestSellers} />

      {/* Promo blocks */}
      <section className="grid md:grid-cols-2 border-y-2 border-ink">
        <div className="bg-gold p-10 sm:p-14 border-b-2 md:border-b-0 md:border-r-2 border-ink flex flex-col justify-center">
          <h3 className="font-display text-5xl text-ink leading-none mb-4">WEEKEND<br />WARRIOR?</h3>
          <p className="text-ink/80 font-medium mb-6">Casual fits that still look put-together. No effort required.</p>
          <Link to="/products" className="btn-ghost self-start">Shop Casual</Link>
        </div>
        <div className="bg-electric p-10 sm:p-14 flex flex-col justify-center">
          <h3 className="font-display text-5xl text-ink leading-none mb-4">OFFICE<br />READY</h3>
          <p className="text-ink/80 font-medium mb-6">Clean lines, sharp cuts. Dress like you mean business.</p>
          <Link to="/products" className="btn-ghost self-start">Shop Smart</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-cream py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1490570148377-898d69a12faa?w=1200&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <span className="badge-new mb-6 inline-block">Join the crew</span>
          <h2 className="font-display text-5xl sm:text-6xl mb-4">
            GET <span className="text-gold">10% OFF</span> YOUR FIRST ORDER
          </h2>
          <p className="text-cream/70 mb-8 font-medium">Create an account and never miss a drop again.</p>
          <Link to="/register" className="btn-gold">Sign Up Free</Link>
        </div>
      </section>
    </div>
  )
}
