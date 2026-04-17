import { useState, useEffect, useMemo } from 'react'
import { supabase } from './lib/supabase'
import { money, thumb, SHOP } from './lib/utils'

const WA = SHOP.whatsapp
const IconCart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>
const IconMinus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
const IconPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const IconWA = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const IconCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>

function ProductCard({ p, promo, onOpen, onAdd }) {
  return (
    <div className="group">
      <button onClick={onOpen} className="w-full text-left">
        <div className="aspect-square bg-[var(--color-warm)] rounded-2xl overflow-hidden mb-3 relative">
          {p.image ? <img src={thumb(p.image, 500)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>}
          {promo && <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[9px] font-bold rounded-lg uppercase">Sale</span>}
        </div>
        <div className="text-xs text-gray-400 mb-0.5">{p.category}</div>
        <div className="text-sm font-semibold text-[var(--color-brand)] leading-snug mb-1.5 line-clamp-2">{p.name}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">{money(promo ? promo.price : p.price)}</span>
          {promo && <span className="text-xs text-gray-400 line-through">{money(p.price)}</span>}
        </div>
      </button>
      <button onClick={onAdd} className="mt-2 w-full h-10 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition">Add to Cart</button>
    </div>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [promoMap, setPromoMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('etr_cart') || '[]') } catch { return [] } })
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custAddress, setCustAddress] = useState('')
  const [custNotes, setCustNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [trackQuery, setTrackQuery] = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [tracking, setTracking] = useState(false)

  useEffect(() => { try { localStorage.setItem('etr_cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => { window.scrollTo(0, 0) }, [page])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('products').select('id,name,category,price,wholesale_price,wholesale_min_qty,quantity,image').order('name')
      console.log('Products loaded:', data?.length, 'error:', error?.message)
      setProducts((data || []).filter(p => p.quantity > 0)); setLoading(false)
    }
    const loadPromos = async () => {
      const { data } = await supabase.from('promos').select('id,name,start_date,end_date,items,active').eq('active', true)
      if (!data?.length) return; const now = new Date(), map = {}
      for (const p of data) { if (p.start_date && new Date(p.start_date) > now) continue; if (p.end_date && new Date(p.end_date) < now) continue; let items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items; if (!Array.isArray(items)) continue; for (const it of items) { const pid = it.productId || it.product_id, pp = Number(it.promoPrice || it.promo_price || 0); if (pid && pp > 0 && (!map[pid] || pp < map[pid].price)) map[pid] = { price: pp, name: p.name } } }
      setPromoMap(map)
    }
    load(); loadPromos()
  }, [])

  useEffect(() => {
    const handle = () => { const h = window.location.hash.slice(1); if (h.startsWith('/product/')) { const id = h.replace('/product/', ''); const p = products.find(x => x.id === id); if (p) { setSelectedProduct(p); setPage('product') } } else if (h === '/shop') setPage('shop'); else if (h === '/cart') setPage('cart'); else if (h === '/track') setPage('track'); else if (!h || h === '/') setPage('home') }
    window.addEventListener('hashchange', handle); handle(); return () => window.removeEventListener('hashchange', handle)
  }, [products])

  const navigate = (p, hash) => { setPage(p); window.location.hash = hash || '/'; setShowMobileMenu(false) }
  const openProduct = p => { setSelectedProduct(p); navigate('product', `/product/${p.id}`) }
  const cats = useMemo(() => ['all', ...[...new Set(products.filter(p => p.category).map(p => p.category))].sort()], [products])
  const filtered = useMemo(() => { const q = search.toLowerCase(); return products.filter(p => (!q || p.name.toLowerCase().includes(q)) && (cat === 'all' || p.category === cat)) }, [products, search, cat])

  const addToCart = p => { setCart(prev => { const ex = prev.find(c => c.id === p.id); const price = promoMap[p.id] ? promoMap[p.id].price : Number(p.price); if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c); return [...prev, { id: p.id, name: p.name, price, qty: 1, img: p.image }] }) }
  const updateQty = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + d) } : c).filter(c => c.qty > 0))
  const cartCount = cart.reduce((a, c) => a + c.qty, 0)
  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0)
  const getPrice = p => promoMap[p.id] ? promoMap[p.id].price : Number(p.price)

  const placeOrder = async () => {
    if (!custName.trim() || !custPhone.trim()) return; setSubmitting(true)
    const orderNo = 'WEB-' + Date.now().toString(36).toUpperCase()
    const items = cart.map(c => ({ name: c.name, qty: c.qty, price: c.price, lineTotal: c.price * c.qty }))
    const { data: maxCode } = await supabase.from('whatsapp_orders').select('ussd_code').order('ussd_code', { ascending: false }).limit(1)
    const ussdCode = (maxCode?.[0]?.ussd_code || 0) + 1
    const { error } = await supabase.from('whatsapp_orders').insert({ order_no: orderNo, date: new Date().toISOString(), customer_name: custName.trim(), customer_phone: custPhone.trim(), items: JSON.stringify(items), subtotal: cartTotal, total: cartTotal, address: custAddress.trim() || null, notes: custNotes.trim() || 'Order from erbliving.shop', status: 'Pending', ussd_code: ussdCode })
    if (!error) { setOrderResult({ orderNo, ussdCode, total: cartTotal }); setCart([]); setPage('success') }
    setSubmitting(false)
  }

  const trackOrder = async () => {
    if (!trackQuery.trim()) return; setTracking(true)
    const q = trackQuery.trim()
    const { data } = await supabase.from('whatsapp_orders').select('order_no,status,total,customer_name,tracking_no,delivery_status,delivery_guy,delivered_at,date').or(`customer_phone.ilike.%${q}%,order_no.ilike.%${q}%,tracking_no.ilike.%${q}%`).order('date', { ascending: false }).limit(5)
    setTrackResult(data || []); setTracking(false)
  }

  if (loading) return <div className="min-h-screen bg-[var(--color-warm)] flex items-center justify-center"><div className="text-center"><div className="text-2xl font-bold text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-display)' }}>ERBLiving</div><div className="w-8 h-8 border-2 border-gray-200 border-t-[var(--color-brand)] rounded-full animate-spin mx-auto mt-6" /></div></div>

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-body)' }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('home', '/')} className="font-bold text-lg tracking-tight text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-display)' }}>ERBLiving</button>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('home', '/')} className="text-sm font-medium text-gray-600 hover:text-black transition">Home</button>
            <button onClick={() => { navigate('shop', '/shop'); setCat('all') }} className="text-sm font-medium text-gray-600 hover:text-black transition">Shop</button>
            <button onClick={() => navigate('track', '/track')} className="text-sm font-medium text-gray-600 hover:text-black transition">Track Order</button>
            <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`} className="text-sm font-medium text-gray-600 hover:text-black transition">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowSearch(!showSearch); if (page !== 'shop') navigate('shop', '/shop') }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"><IconSearch /></button>
            <button onClick={() => navigate('cart', '/cart')} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"><IconCart />{cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--color-brand)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}</button>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
          </div>
        </div>
        {showSearch && <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4"><input autoFocus className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></div>}
        {showMobileMenu && <div className="md:hidden px-4 pb-4 space-y-1 border-t border-gray-100 pt-3"><button onClick={() => navigate('home', '/')} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Home</button><button onClick={() => navigate('shop', '/shop')} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Shop</button><button onClick={() => navigate('track', '/track')} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Track Order</button><a href={`tel:${SHOP.phone.replace(/\s/g, '')}`} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">Call Us</a></div>}
      </nav>

      {/* HOME */}
      {page === 'home' && <>
        <section className="bg-[var(--color-warm)]"><div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24"><div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[var(--color-accent)] mb-4">{SHOP.address}</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-[var(--color-brand)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Your home,<br/>beautifully furnished.</h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg">Quality bedsheets, curtains, carpets, cookware and everything your home needs. Delivered anywhere in Ghana.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('shop', '/shop')} className="h-12 px-8 bg-[var(--color-brand)] text-white rounded-full text-sm font-semibold hover:bg-black transition flex items-center gap-2">Shop Now <IconArrow /></button>
            <a href={`https://wa.me/${WA}`} target="_blank" className="h-12 px-6 bg-white text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2 border border-gray-200"><IconWA /> WhatsApp Us</a>
          </div>
        </div></div></section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-[var(--color-brand)] mb-8" style={{ fontFamily: 'var(--font-display)' }}>Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{cats.filter(c => c !== 'all').map(c => <button key={c} onClick={() => { setCat(c); navigate('shop', '/shop') }} className="bg-[var(--color-warm)] rounded-2xl p-6 text-left hover:bg-gray-100 transition"><div className="text-sm font-semibold text-[var(--color-brand)] capitalize">{c}</div><div className="text-xs text-gray-400 mt-1">{products.filter(p => p.category === c).length} items</div></button>)}</div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-bold text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-display)' }}>Featured</h2><button onClick={() => navigate('shop', '/shop')} className="text-sm font-medium text-gray-500 hover:text-black transition flex items-center gap-1">View all <IconArrow /></button></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.slice(0, 8).map(p => <ProductCard key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} />)}</div>
        </section>

        <section className="bg-[var(--color-warm)] py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">{[['Nationwide Delivery','Across all regions'],['Quality Products','Carefully selected'],['Secure Payments','Pay via Mobile Money'],['Customer Support','Call or WhatsApp us']].map(([t,d]) => <div key={t}><div className="text-sm font-bold text-[var(--color-brand)]">{t}</div><div className="text-xs text-gray-400 mt-1">{d}</div></div>)}</div></section>
      </>}

      {/* SHOP */}
      {page === 'shop' && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-brand)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>{cat === 'all' ? 'All Products' : cat}</h1>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`h-9 px-5 rounded-full text-xs font-semibold whitespace-nowrap transition ${cat === c ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{c === 'all' ? 'All' : c}</button>)}</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{filtered.map(p => <ProductCard key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} />)}</div>
        {filtered.length === 0 && <div className="text-center py-20 text-gray-400 text-sm">No products found</div>}
      </div>}

      {/* PRODUCT DETAIL */}
      {page === 'product' && selectedProduct && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('shop', '/shop')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">&larr; Back</button>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square bg-[var(--color-warm)] rounded-2xl overflow-hidden">{selectedProduct.image ? <img src={thumb(selectedProduct.image, 800)} alt={selectedProduct.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>}</div>
          <div className="flex flex-col justify-center">
            {selectedProduct.category && <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3">{selectedProduct.category}</p>}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-brand)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{selectedProduct.name}</h1>
            <div className="flex items-baseline gap-3 mb-6"><span className="text-2xl font-bold">{money(getPrice(selectedProduct))}</span>{promoMap[selectedProduct.id] && <span className="text-lg text-gray-400 line-through">{money(selectedProduct.price)}</span>}</div>
            
            <div className="flex gap-3">
              <button onClick={() => addToCart(selectedProduct)} className="flex-1 h-13 bg-[var(--color-brand)] text-white rounded-full text-sm font-semibold hover:bg-black transition">Add to Cart</button>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I'm interested in: ${selectedProduct.name} (${money(getPrice(selectedProduct))})`)}`} target="_blank" className="h-13 px-6 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition flex items-center gap-2"><IconWA /> Ask</a>
            </div>
          </div>
        </div>
        {products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).length > 0 && <div className="mt-16"><h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>You might also like</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4).map(p => <ProductCard key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} />)}</div></div>}
      </div>}

      {/* CART */}
      {page === 'cart' && <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-brand)] mb-8" style={{ fontFamily: 'var(--font-display)' }}>Your Cart</h1>
        {cart.length === 0 ? <div className="text-center py-20"><p className="text-gray-400 text-sm mb-4">Your cart is empty</p><button onClick={() => navigate('shop', '/shop')} className="h-11 px-6 bg-[var(--color-brand)] text-white rounded-full text-sm font-semibold">Continue Shopping</button></div> : <>
          <div className="space-y-4 mb-8">{cart.map(c => <div key={c.id} className="flex gap-4 items-center bg-gray-50 rounded-2xl p-4"><div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">{c.img ? <img src={thumb(c.img, 200)} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}</div><div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{c.name}</div><div className="text-sm font-bold mt-1">{money(c.price)}</div></div><div className="flex items-center gap-2"><button onClick={() => updateQty(c.id, -1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"><IconMinus /></button><span className="w-8 text-center text-sm font-bold">{c.qty}</span><button onClick={() => updateQty(c.id, 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"><IconPlus /></button></div></div>)}</div>
          <div className="bg-gray-50 rounded-2xl p-6 mb-6"><div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Subtotal</span><span className="font-bold">{money(cartTotal)}</span></div><div className="flex justify-between text-sm mb-3"><span className="text-gray-500">Delivery</span><span className="text-gray-400 text-xs">To be confirmed</span></div><div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3"><span>Total</span><span>{money(cartTotal)}</span></div></div>
          <button onClick={() => setPage('checkout')} className="w-full h-13 bg-[var(--color-brand)] text-white rounded-full text-sm font-semibold hover:bg-black transition">Proceed to Checkout</button>
        </>}
      </div>}

      {/* CHECKOUT */}
      {page === 'checkout' && <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-brand)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
        <p className="text-sm text-gray-400 mb-8">{cartCount} item{cartCount !== 1 ? 's' : ''} · {money(cartTotal)}</p>
        <div className="space-y-4 mb-8">
          <div><label className="text-xs text-gray-500 font-medium block mb-1.5">Full Name *</label><input className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Your full name" /></div>
          <div><label className="text-xs text-gray-500 font-medium block mb-1.5">Phone Number *</label><input className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="0XX XXX XXXX" type="tel" /></div>
          <div><label className="text-xs text-gray-500 font-medium block mb-1.5">Delivery Address</label><textarea className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 resize-none" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Region, city, area, landmark..." /></div>
          <div><label className="text-xs text-gray-500 font-medium block mb-1.5">Notes (optional)</label><input className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Special instructions..." /></div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Order Summary</div>
          {cart.map(c => <div key={c.id} className="flex justify-between text-sm py-1.5"><span className="text-gray-600">{c.qty}x {c.name}</span><span className="font-semibold">{money(c.price * c.qty)}</span></div>)}
          <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-3 mt-3"><span>Total</span><span>{money(cartTotal)}</span></div>
        </div>
        <p className="text-xs text-gray-400 text-center mb-4">After placing your order, you'll receive a USSD code to pay via Mobile Money.</p>
        <button onClick={placeOrder} disabled={!custName.trim() || !custPhone.trim() || submitting} className="w-full h-13 bg-[var(--color-brand)] text-white rounded-full text-sm font-semibold hover:bg-black transition disabled:opacity-30">{submitting ? 'Placing Order...' : 'Place Order'}</button>
      </div>}

      {/* SUCCESS */}
      {page === 'success' && orderResult && <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><IconCheck /></div>
        <h1 className="text-2xl font-bold text-[var(--color-brand)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Order Placed</h1>
        <p className="text-gray-500 text-sm mb-8">Your order {orderResult.orderNo} has been received.</p>
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-6">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Payment</div>
          <p className="text-sm text-gray-600 mb-3">Dial this USSD code to pay via Mobile Money:</p>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-200"><div className="text-xl font-bold font-mono text-[var(--color-brand)]">*920*141*{orderResult.ussdCode}#</div></div>
          <p className="text-xs text-gray-400 mt-3 text-center">Amount: {money(orderResult.total)}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">What happens next?</div>
          <div className="space-y-2 text-sm text-gray-600"><p>1. Dial the USSD code above to make payment</p><p>2. We'll confirm and process your order</p><p>3. Our team will contact you about delivery</p></div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('home', '/')} className="h-11 px-6 bg-[var(--color-brand)] text-white rounded-full text-sm font-semibold">Continue Shopping</button>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I just placed order ${orderResult.orderNo}`)}`} target="_blank" className="h-11 px-5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold flex items-center gap-2"><IconWA /> Chat</a>
        </div>
      </div>}

      {/* TRACK */}
      {page === 'track' && <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-bold text-[var(--color-brand)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Track Your Order</h1>
        <p className="text-sm text-gray-400 mb-8">Enter your phone number, order number, or tracking number.</p>
        <div className="flex gap-2 mb-8"><input className="flex-1 h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" value={trackQuery} onChange={e => setTrackQuery(e.target.value)} placeholder="Phone, order # or tracking #" onKeyDown={e => e.key === 'Enter' && trackOrder()} /><button onClick={trackOrder} disabled={tracking} className="h-12 px-6 bg-[var(--color-brand)] text-white rounded-xl text-sm font-semibold">{tracking ? '...' : 'Search'}</button></div>
        {trackResult && trackResult.length === 0 && <p className="text-sm text-gray-400 text-center">No orders found.</p>}
        {trackResult && trackResult.length > 0 && <div className="space-y-4">{trackResult.map(o => <div key={o.order_no} className="bg-gray-50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3"><div className="text-sm font-bold">{o.order_no}</div><span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${o.status === 'Paid' || o.status === 'Completed' ? 'bg-gray-800 text-white' : o.status === 'Cancelled' ? 'bg-red-100 text-red-500' : 'bg-gray-200 text-gray-600'}`}>{o.status}</span></div>
          <div className="text-sm text-gray-500">{money(o.total)}</div>
          {o.tracking_no && <div className="text-xs text-gray-400 mt-2 font-mono">{o.tracking_no}</div>}
          {o.delivery_status && <div className="mt-3 pt-3 border-t border-gray-200"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${o.delivery_status === 'Delivered' || o.delivery_status === 'Picked Up' ? 'bg-green-100 text-green-700' : o.delivery_status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{o.delivery_status}</span>{o.delivery_guy && <span className="text-xs text-gray-400 ml-2">By: {o.delivery_guy}</span>}</div>}
        </div>)}</div>}
      </div>}

      {/* FOOTER */}
      <footer className="bg-[var(--color-brand)] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div><div className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>EVERYTINROOM&BEDTIME</div><p className="text-sm text-gray-400 leading-relaxed">Quality home furnishings — bedsheets, curtains, carpets, cookware and more. Nationwide delivery across Ghana.</p></div>
            <div><div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</div><div className="space-y-2"><button onClick={() => navigate('shop', '/shop')} className="block text-sm text-gray-300 hover:text-white transition">Shop All</button><button onClick={() => navigate('track', '/track')} className="block text-sm text-gray-300 hover:text-white transition">Track Order</button></div></div>
            <div><div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact</div><div className="space-y-2 text-sm text-gray-300"><a href={`tel:${SHOP.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition"><IconPhone /> {SHOP.phone}</a><a href={`tel:${SHOP.phone2.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white transition"><IconPhone /> {SHOP.phone2}</a><a href={SHOP.mapsUrl} target="_blank" className="flex items-center gap-2 hover:text-white transition"><IconPin /> {SHOP.address}</a></div></div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center"><p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} EVERYTINROOM&BEDTIME</p></div>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={`https://wa.me/${WA}`} target="_blank" className="fixed bottom-5 right-5 w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-600/20 hover:scale-105 transition z-40"><IconWA /></a>
    </div>
  )
}
