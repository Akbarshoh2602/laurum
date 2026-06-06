export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl text-gold mb-3">AURUM</div>
          <p className="text-sm leading-relaxed">
            Timeless clothing crafted with premium materials and an eye for detail.
          </p>
        </div>
        <div>
          <h4 className="text-cream uppercase tracking-widest text-xs mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>New Arrivals</li>
            <li>Best Sellers</li>
            <li>Collections</li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream uppercase tracking-widest text-xs mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            <li>Shipping</li>
            <li>Returns</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream uppercase tracking-widest text-xs mb-4">Newsletter</h4>
          <p className="text-sm mb-3">Join for early access to new drops.</p>
          <div className="flex">
            <input className="flex-1 bg-charcoal border border-cream/20 px-3 py-2 text-sm text-cream" placeholder="Email" />
            <button className="bg-gold text-ink px-4 text-sm uppercase">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs tracking-widest text-cream/40">
        © {new Date().getFullYear()} AURUM. All rights reserved.
      </div>
    </footer>
  )
}
