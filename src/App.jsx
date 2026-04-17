import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from './lib/supabase'
import { money, thumb, SHOP } from './lib/utils'

const WA = SHOP.whatsapp

// Icons
const Ic = {
  cart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  minus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  phone: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  bag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>,
}

function ProductCard({ p, promo, onOpen, onAdd }) {
  const [added, setAdded] = useState(false)
  const doAdd = (e) => { e.stopPropagation(); onAdd(); setAdded(true); setTimeout(() => setAdded(false), 1200) }
  return (
    <div className="group cursor-pointer" onClick={onOpen}>
      <div className="aspect-[3/4] bg-[var(--color-warm)] rounded-xl overflow-hidden mb-2.5 relative">
        {p.image ? <img src={thumb(p.image, 500)} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">No image</div>}
        {promo && <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[var(--color-brand)] text-white text-[9px] font-bold rounded-md tracking-wider uppercase">Sale</span>}
        <button onClick={doAdd} className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${added ? 'bg-[var(--color-brand)] text-white scale-110' : 'bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white shadow-sm'}`}>
          {added ? Ic.check : Ic.plus}
        </button>
      </div>
      <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">{p.category}</div>
      <div className="text-[13px] font-medium text-[var(--color-brand)] leading-snug mb-1 line-clamp-2">{p.name}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-[13px] font-bold">{money(promo ? promo.price : p.price)}</span>
        {promo && <span className="text-[11px] text-gray-400 line-through">{money(p.price)}</span>}
      </div>
    </div>
  )
}

// Countdown timer for promo banner
function CountdownTimer({ endDate }) {
  const [time, setTime] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate) - new Date()
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
      return { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) }
    }
    setTime(calc())
    const i = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(i)
  }, [endDate])
  const pad = n => String(n).padStart(2, '0')
  return (
    <div className="flex gap-1.5 items-center">
      {[['d', time.d], ['h', time.h], ['m', time.m], ['s', time.s]].map(([l, v]) => (
        <div key={l} className="flex items-center gap-0.5">
          <span className="bg-white/20 text-white text-[11px] font-bold px-1.5 py-0.5 rounded font-mono min-w-[24px] text-center">{pad(v || 0)}</span>
          <span className="text-white/50 text-[9px] uppercase">{l}</span>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [promos, setPromos] = useState([])
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
  const [cartToast, setCartToast] = useState(false)

  useEffect(() => { try { localStorage.setItem('etr_cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => { window.scrollTo(0, 0); setShowMobileMenu(false) }, [page])

  // Load data
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('products').select('id,name,category,price,wholesale_price,wholesale_min_qty,quantity,image').order('name')
      setProducts((data || []).filter(p => p.quantity > 0)); setLoading(false)
    }
    const loadPromos = async () => {
      const { data } = await supabase.from('promos').select('id,name,start_date,end_date,items,active').eq('active', true)
      if (!data?.length) return; const now = new Date(), map = {}, activePromos = []
      for (const p of data) {
        if (p.start_date && new Date(p.start_date) > now) continue
        if (p.end_date && new Date(p.end_date) < now) continue
        let items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items
        if (!Array.isArray(items)) continue
        activePromos.push(p)
        for (const it of items) {
          const pid = it.productId || it.product_id, pp = Number(it.promoPrice || it.promo_price || 0)
          if (pid && pp > 0 && (!map[pid] || pp < map[pid].price)) map[pid] = { price: pp, name: p.name }
        }
      }
      setPromoMap(map); setPromos(activePromos)
    }
    load(); loadPromos()
  }, [])

  // Hash routing
  useEffect(() => {
    const handle = () => {
      const h = window.location.hash.slice(1)
      if (h.startsWith('/product/')) { const id = h.replace('/product/', ''); const p = products.find(x => x.id === id); if (p) { setSelectedProduct(p); setPage('product') } }
      else if (h === '/shop') setPage('shop')
      else if (h === '/cart') setPage('cart')
      else if (h === '/track') setPage('track')
      else if (!h || h === '/') setPage('home')
    }
    window.addEventListener('hashchange', handle); handle(); return () => window.removeEventListener('hashchange', handle)
  }, [products])

  const navigate = (p, hash) => { setPage(p); window.location.hash = hash || '/' }
  const openProduct = p => { setSelectedProduct(p); navigate('product', `/product/${p.id}`) }
  const cats = useMemo(() => ['all', ...[...new Set(products.filter(p => p.category).map(p => p.category))].sort()], [products])
  const filtered = useMemo(() => { const q = search.toLowerCase(); return products.filter(p => (!q || p.name.toLowerCase().includes(q)) && (cat === 'all' || p.category === cat)) }, [products, search, cat])

  const addToCart = p => {
    setCart(prev => { const ex = prev.find(c => c.id === p.id); const price = promoMap[p.id] ? promoMap[p.id].price : Number(p.price); if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c); return [...prev, { id: p.id, name: p.name, price, qty: 1, img: p.image }] })
    setCartToast(true); setTimeout(() => setCartToast(false), 1500)
  }
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

  // Active promo for banner
  const activePromo = promos.find(p => p.end_date && new Date(p.end_date) > new Date())

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-7 h-7 border-2 border-gray-200 border-t-[var(--color-brand)] rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-body)' }}>

      {/* PROMO BANNER — countdown timer at top */}
      {activePromo && (
        <div className="bg-[var(--color-brand)] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-center gap-4 text-xs">
            <span className="font-medium truncate">{activePromo.name}</span>
            <CountdownTimer endDate={activePromo.end_date} />
            <button onClick={() => navigate('shop', '/shop')} className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider underline underline-offset-2 hover:no-underline shrink-0">Shop Now</button>
          </div>
        </div>
      )}

      {/* CART TOAST */}
      {cartToast && (
        <div className="fixed top-20 right-4 bg-[var(--color-brand)] text-white px-4 py-2.5 rounded-lg text-xs font-semibold z-[100] shadow-lg animate-[fadeIn_0.2s_ease]">
          Added to cart
        </div>
      )}

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate('home', '/')} className="font-bold text-base tracking-tight text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-display)' }}>ERBLiving</button>
          <div className="hidden md:flex items-center gap-7">
            <button onClick={() => navigate('home', '/')} className={`text-[13px] font-medium transition ${page === 'home' ? 'text-[var(--color-brand)]' : 'text-gray-400 hover:text-gray-700'}`}>Home</button>
            <button onClick={() => { navigate('shop', '/shop'); setCat('all') }} className={`text-[13px] font-medium transition ${page === 'shop' ? 'text-[var(--color-brand)]' : 'text-gray-400 hover:text-gray-700'}`}>Shop</button>
            <button onClick={() => navigate('track', '/track')} className={`text-[13px] font-medium transition ${page === 'track' ? 'text-[var(--color-brand)]' : 'text-gray-400 hover:text-gray-700'}`}>Track Order</button>
            <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`} className="text-[13px] font-medium text-gray-400 hover:text-gray-700 transition">{SHOP.phone}</a>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { setShowSearch(!showSearch); if (page !== 'shop') navigate('shop', '/shop') }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition text-gray-500">{Ic.search}</button>
            <button onClick={() => navigate('cart', '/cart')} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition text-gray-500">
              {Ic.bag}
              {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-brand)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50">{showMobileMenu ? Ic.x : Ic.menu}</button>
          </div>
        </div>
        {showSearch && <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3"><input autoFocus className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></div>}
        {showMobileMenu && <div className="md:hidden px-4 pb-4 space-y-0.5 border-t border-gray-50 pt-2">
          {[['Home','home','/'],['Shop','shop','/shop'],['Track Order','track','/track']].map(([l,p,h]) => <button key={p} onClick={() => navigate(p, h)} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">{l}</button>)}
          <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`} className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">{SHOP.phone}</a>
        </div>}
      </nav>

      {/* ═══ HOME ═══ */}
      {page === 'home' && <>
        {/* Hero — compact, product-focused */}
        <section className="bg-[var(--color-warm)] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-[var(--color-brand)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Your home, beautifully furnished.</h1>
              <p className="text-gray-400 text-sm mt-1.5">Bedsheets, curtains, carpets, cookware. Delivered across Ghana.</p>
            </div>
            <button onClick={() => navigate('shop', '/shop')} className="h-10 px-6 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold hover:bg-black transition flex items-center gap-2 shrink-0 self-start md:self-center">Shop Now {Ic.arrow}</button>
          </div>
        </section>

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-1">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => navigate('shop', '/shop')} className="h-8 px-4 rounded-md text-xs font-semibold whitespace-nowrap bg-[var(--color-brand)] text-white shrink-0">All</button>
            {cats.filter(c => c !== 'all').map(c => <button key={c} onClick={() => { setCat(c); navigate('shop', '/shop') }} className="h-8 px-4 rounded-md text-xs font-semibold whitespace-nowrap bg-gray-50 text-gray-500 hover:bg-gray-100 transition shrink-0 capitalize">{c}</button>)}
          </div>
        </div>

        {/* Products grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
            {products.slice(0, 15).map(p => <ProductCard key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} />)}
          </div>
          {products.length > 15 && <div className="text-center mt-10"><button onClick={() => navigate('shop', '/shop')} className="h-10 px-8 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">View all {products.length} products</button></div>}
        </section>
      </>}

      {/* ═══ SHOP ═══ */}
      {page === 'shop' && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-bold text-[var(--color-brand)]" style={{ fontFamily: 'var(--font-display)' }}>{cat === 'all' ? 'All Products' : cat} <span className="text-gray-300 font-normal text-sm ml-1">({filtered.length})</span></h1>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-hide">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`h-8 px-4 rounded-md text-xs font-semibold whitespace-nowrap transition shrink-0 ${cat === c ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{c === 'all' ? 'All' : c}</button>)}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">{filtered.map(p => <ProductCard key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} />)}</div>
        {filtered.length === 0 && <div className="text-center py-20 text-gray-300 text-sm">No products found</div>}
      </div>}

      {/* ═══ PRODUCT DETAIL ═══ */}
      {page === 'product' && selectedProduct && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => window.history.back()} className="text-xs text-gray-400 hover:text-gray-600 mb-5 inline-flex items-center gap-1">&larr; Back</button>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="aspect-square bg-[var(--color-warm)] rounded-xl overflow-hidden">{selectedProduct.image ? <img src={thumb(selectedProduct.image, 900)} alt={selectedProduct.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200">No image</div>}</div>
          <div className="flex flex-col justify-center py-2">
            {selectedProduct.category && <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-2">{selectedProduct.category}</p>}
            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-brand)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{selectedProduct.name}</h1>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-2xl font-bold">{money(getPrice(selectedProduct))}</span>
              {promoMap[selectedProduct.id] && <span className="text-base text-gray-400 line-through">{money(selectedProduct.price)}</span>}
              {promoMap[selectedProduct.id] && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">SALE</span>}
            </div>
            <button onClick={() => addToCart(selectedProduct)} className="w-full md:w-auto h-12 px-10 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold hover:bg-black transition">Add to Cart</button>
            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">{Ic.check} <span>Nationwide delivery</span></div>
              <div className="flex items-center gap-2">{Ic.check} <span>Secure MoMo payment</span></div>
              <div className="flex items-center gap-2">{Ic.phone} <span>Questions? Call {SHOP.phone}</span></div>
            </div>
          </div>
        </div>
        {products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).length > 0 && <div className="mt-14">
          <h2 className="text-base font-bold mb-5" style={{ fontFamily: 'var(--font-display)' }}>Similar products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">{products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 5).map(p => <ProductCard key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => openProduct(p)} onAdd={() => addToCart(p)} />)}</div>
        </div>}
      </div>}

      {/* ═══ CART ═══ */}
      {page === 'cart' && <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-lg font-bold text-[var(--color-brand)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Cart ({cartCount})</h1>
        {cart.length === 0 ? <div className="text-center py-16"><p className="text-gray-300 text-sm mb-4">Nothing here yet</p><button onClick={() => navigate('shop', '/shop')} className="h-10 px-6 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold">Browse Products</button></div> : <>
          <div className="space-y-3 mb-6">{cart.map(c => <div key={c.id} className="flex gap-3 items-center p-3 rounded-xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0">{c.img ? <img src={thumb(c.img, 150)} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}</div>
            <div className="flex-1 min-w-0"><div className="text-[13px] font-medium truncate">{c.name}</div><div className="text-[13px] font-bold mt-0.5">{money(c.price)}</div></div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => updateQty(c.id, -1)} className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center hover:bg-gray-100">{Ic.minus}</button>
              <span className="w-6 text-center text-[13px] font-bold">{c.qty}</span>
              <button onClick={() => updateQty(c.id, 1)} className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center hover:bg-gray-100">{Ic.plus}</button>
            </div>
          </div>)}</div>
          <div className="border-t border-gray-100 pt-4 mb-6"><div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="font-bold text-base">{money(cartTotal)}</span></div><div className="text-[11px] text-gray-300 mt-1">Delivery fees will be confirmed by our team</div></div>
          <button onClick={() => setPage('checkout')} className="w-full h-12 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold hover:bg-black transition">Checkout · {money(cartTotal)}</button>
        </>}
      </div>}

      {/* ═══ CHECKOUT ═══ */}
      {page === 'checkout' && <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-lg font-bold text-[var(--color-brand)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
        <div className="space-y-3 mb-6">
          <div><label className="text-[11px] text-gray-400 font-medium block mb-1">Full Name *</label><input className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Your name" /></div>
          <div><label className="text-[11px] text-gray-400 font-medium block mb-1">Phone *</label><input className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="0XX XXX XXXX" type="tel" /></div>
          <div><label className="text-[11px] text-gray-400 font-medium block mb-1">Delivery Address</label><textarea className="w-full h-20 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="City, area, landmark..." /></div>
          <div><label className="text-[11px] text-gray-400 font-medium block mb-1">Notes</label><input className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Optional" /></div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          {cart.map(c => <div key={c.id} className="flex justify-between text-[13px] py-1"><span className="text-gray-500">{c.qty}x {c.name}</span><span className="font-semibold">{money(c.price * c.qty)}</span></div>)}
          <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-2.5 mt-2.5"><span>Total</span><span>{money(cartTotal)}</span></div>
        </div>
        <p className="text-[11px] text-gray-300 text-center mb-4">You'll receive a USSD code to pay via Mobile Money after placing your order.</p>
        <button onClick={placeOrder} disabled={!custName.trim() || !custPhone.trim() || submitting} className="w-full h-12 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold hover:bg-black transition disabled:opacity-30">{submitting ? 'Placing...' : `Place Order · ${money(cartTotal)}`}</button>
      </div>}

      {/* ═══ SUCCESS ═══ */}
      {page === 'success' && orderResult && <div className="max-w-md mx-auto px-4 sm:px-6 py-14 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">{Ic.check}</div>
        <h1 className="text-xl font-bold text-[var(--color-brand)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Order Placed</h1>
        <p className="text-sm text-gray-400 mb-8">{orderResult.orderNo}</p>
        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Pay via Mobile Money</div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-200"><div className="text-lg font-bold font-mono text-[var(--color-brand)]">*920*141*{orderResult.ussdCode}#</div></div>
          <p className="text-[11px] text-gray-400 mt-2 text-center">{money(orderResult.total)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left text-sm text-gray-500 space-y-1.5">
          <p>1. Dial the code above to pay</p>
          <p>2. We confirm and process your order</p>
          <p>3. Our team contacts you for delivery</p>
        </div>
        <button onClick={() => navigate('home', '/')} className="h-10 px-6 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold">Continue Shopping</button>
      </div>}

      {/* ═══ TRACK ═══ */}
      {page === 'track' && <div className="max-w-lg mx-auto px-4 sm:px-6 py-14">
        <h1 className="text-lg font-bold text-[var(--color-brand)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>Track Order</h1>
        <p className="text-sm text-gray-400 mb-6">Enter your phone, order number, or tracking number.</p>
        <div className="flex gap-2 mb-8"><input className="flex-1 h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400" value={trackQuery} onChange={e => setTrackQuery(e.target.value)} placeholder="Search..." onKeyDown={e => e.key === 'Enter' && trackOrder()} /><button onClick={trackOrder} disabled={tracking} className="h-11 px-5 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold">{tracking ? '...' : 'Find'}</button></div>
        {trackResult && trackResult.length === 0 && <p className="text-sm text-gray-300 text-center">No orders found</p>}
        {trackResult && trackResult.length > 0 && <div className="space-y-3">{trackResult.map(o => <div key={o.order_no} className="border border-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2"><div className="text-sm font-bold">{o.order_no}</div><span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${o.status === 'Paid' || o.status === 'Completed' ? 'bg-gray-800 text-white' : o.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>{o.status}</span></div>
          <div className="text-sm text-gray-400">{money(o.total)}</div>
          {o.tracking_no && <div className="text-[11px] text-gray-300 mt-1 font-mono">{o.tracking_no}</div>}
          {o.delivery_status && <div className="mt-2 pt-2 border-t border-gray-50"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.delivery_status === 'Delivered' || o.delivery_status === 'Picked Up' ? 'bg-green-50 text-green-700' : o.delivery_status === 'Out for Delivery' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{o.delivery_status}</span>{o.delivery_guy && <span className="text-[11px] text-gray-300 ml-2">By: {o.delivery_guy}</span>}</div>}
        </div>)}</div>}
      </div>}

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-sm font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>EVERYTINROOM&BEDTIME</div>
              <p className="text-xs text-gray-400 leading-relaxed">Quality home furnishings delivered across Ghana.</p>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Shop</div>
              <div className="space-y-1.5"><button onClick={() => navigate('shop', '/shop')} className="block text-xs text-gray-500 hover:text-gray-800 transition">All Products</button><button onClick={() => navigate('track', '/track')} className="block text-xs text-gray-500 hover:text-gray-800 transition">Track Order</button></div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <a href={`tel:${SHOP.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-gray-800 transition">{Ic.phone} {SHOP.phone}</a>
                <a href={`tel:${SHOP.phone2.replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-gray-800 transition">{Ic.phone} {SHOP.phone2}</a>
                <a href={SHOP.mapsUrl} target="_blank" className="flex items-center gap-1.5 hover:text-gray-800 transition">{Ic.pin} {SHOP.address}</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-5 text-center"><p className="text-[11px] text-gray-300">&copy; {new Date().getFullYear()} EVERYTINROOM&BEDTIME</p></div>
        </div>
      </footer>
    </div>
  )
}
