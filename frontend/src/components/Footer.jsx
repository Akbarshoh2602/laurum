import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream border-t-4 border-gold mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gold border-2 border-cream flex items-center justify-center">
                <span className="font-display text-2xl text-cream">L</span>
              </div>
              <div>
                <span className="font-display text-2xl block leading-none">LAURA</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Men&apos;s Store</span>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed">
              Your go-to spot for men&apos;s clothing that actually slaps.
              Quality gear, fair prices, zero nonsense.
            </p>
          </div>

          <div>
            <h4 className="font-display text-xl text-gold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/70 font-medium">
              <li><Link to="/products" className="hover:text-gold transition">All Products</Link></li>
              <li><Link to="/products" className="hover:text-gold transition">New Arrivals</Link></li>
              <li><Link to="/products" className="hover:text-gold transition">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl text-gold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-cream/70 font-medium">
              <li>Shipping Info</li>
              <li>Returns & Exchanges</li>
              <li>Size Guide</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl text-gold mb-4">Stay in the Loop</h4>
            <p className="text-sm text-cream/60 mb-3">Drop alerts. No spam. Just fire fits.</p>
            <div className="flex border-2 border-cream/30">
              <input
                className="flex-1 bg-charcoal px-3 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
                placeholder="your@email.com"
              />
              <button className="bg-gold text-cream font-bold uppercase text-xs px-4 border-l-2 border-cream/30 hover:bg-gold-dark transition">
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-cream/40">
          © {new Date().getFullYear()} Laura Store — Men&apos;s Clothing. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
