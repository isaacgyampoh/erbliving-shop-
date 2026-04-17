import { useState, useEffect, useMemo, useRef } from 'react'
import { supabase } from './lib/supabase'
import { money, thumb, SHOP } from './lib/utils'

const WA = SHOP.whatsapp
const I = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  grid: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  bag: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  search: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  x: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  minus: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>,
  plus: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
  pin: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  phone: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  fire: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.6 0-7-2.4-7-7 0-3.1 2.1-5.7 3.4-7.1.4-.4 1-.1 1 .4v1.3c0 .5.5.8.9.5C12.5 9.5 15 6 15 3c0-.5.5-.8.9-.5C18.5 4.5 21 8.4 21 12.5 21 18.3 17.3 23 12 23z"/></svg>,
  track: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>,
}

function Timer({ endDate }) {
  const [t, setT] = useState({})
  useEffect(() => {
    const calc = () => { const d = new Date(endDate) - new Date(); if (d <= 0) return { d: 0, h: 0, m: 0, s: 0 }; return { d: Math.floor(d / 864e5), h: Math.floor((d % 864e5) / 36e5), m: Math.floor((d % 36e5) / 6e4), s: Math.floor((d % 6e4) / 1e3) } }
    setT(calc()); const i = setInterval(() => setT(calc()), 1000); return () => clearInterval(i)
  }, [endDate])
  const p = n => String(n).padStart(2, '0')
  return <div className="flex gap-1">{[['d',t.d],['h',t.h],['m',t.m],['s',t.s]].map(([l,v]) => <div key={l} className="bg-white text-[var(--color-promo)] text-[11px] font-bold px-1.5 py-0.5 rounded font-mono min-w-[22px] text-center">{p(v||0)}<span className="text-[8px] text-gray-400 ml-0.5">{l}</span></div>)}</div>
}

function Card({ p, promo, onOpen, onAdd }) {
  const [ok, setOk] = useState(false)
  const add = e => { e.stopPropagation(); onAdd(); setOk(true); setTimeout(() => setOk(false), 1200) }
  return (
    <div className="cursor-pointer group" onClick={onOpen}>
      <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-2 relative">
        {p.image ? <img src={thumb(p.image, 500)} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" loading="lazy" /> : <div className="w-full h-full bg-gray-100" />}
        {promo && <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--color-promo)] text-white text-[9px] font-bold rounded-md tracking-wide">PROMO</span>}
        <button onClick={add} className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${ok ? 'bg-[var(--color-brand)] text-white scale-110' : 'bg-white/90 shadow-sm text-gray-600 md:opacity-0 md:group-hover:opacity-100'}`}>
          {ok ? I.check : I.plus}
        </button>
      </div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{p.category}</div>
      <div className="text-[13px] font-medium leading-snug mt-0.5 line-clamp-2">{p.name}</div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-[13px] font-bold">{money(promo ? promo.price : p.price)}</span>
        {promo && <span className="text-[11px] text-gray-300 line-through">{money(p.price)}</span>}
      </div>
    </div>
  )
}

export default function App() {
  const [products, setProducts] = useState([])
  const [promos, setPromos] = useState([])
  const [promoMap, setPromoMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('home')
  const [sel, setSel] = useState(null)
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('etr_cart') || '[]') } catch { return [] } })
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [showSearch, setShowSearch] = useState(false)
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custAddress, setCustAddress] = useState('')
  const [custNotes, setCustNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [trackQuery, setTrackQuery] = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [tracking, setTracking] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { try { localStorage.setItem('etr_cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => { window.scrollTo(0, 0) }, [page])

  useEffect(() => {
    supabase.from('products').select('id,name,category,price,wholesale_price,wholesale_min_qty,quantity,image').order('name').then(({ data }) => { setProducts((data || []).filter(p => p.quantity > 0)); setLoading(false) })
    supabase.from('promos').select('id,name,start_date,end_date,items,active').eq('active', true).then(({ data }) => {
      if (!data?.length) return; const now = new Date(), map = {}, active = []
      for (const p of data) { if (p.start_date && new Date(p.start_date) > now) continue; if (p.end_date && new Date(p.end_date) < now) continue; let items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items; if (!Array.isArray(items)) continue; active.push(p); for (const it of items) { const pid = it.productId || it.product_id, pp = Number(it.promoPrice || it.promo_price || 0); if (pid && pp > 0 && (!map[pid] || pp < map[pid].price)) map[pid] = { price: pp, name: p.name } } }
      setPromoMap(map); setPromos(active)
    })
  }, [])

  useEffect(() => {
    const handle = () => { const h = window.location.hash.slice(1); if (h.startsWith('/product/')) { const p = products.find(x => x.id === h.replace('/product/','')); if (p) { setSel(p); setPage('product') } } else if (h === '/shop') setPage('shop'); else if (h === '/cart') setPage('cart'); else if (h === '/track') setPage('track'); else if (h === '/checkout') setPage('checkout'); else setPage('home') }
    window.addEventListener('hashchange', handle); handle(); return () => window.removeEventListener('hashchange', handle)
  }, [products])

  const go = (p, h) => { setPage(p); window.location.hash = h || '/' }
  const open = p => { setSel(p); go('product', `/product/${p.id}`) }
  const cats = useMemo(() => ['all', ...[...new Set(products.filter(p => p.category).map(p => p.category))].sort()], [products])
  const filtered = useMemo(() => { const q = search.toLowerCase(); return products.filter(p => (!q || p.name.toLowerCase().includes(q)) && (cat === 'all' || p.category === cat)) }, [products, search, cat])

  const addToCart = p => { setCart(prev => { const ex = prev.find(c => c.id === p.id); const price = promoMap[p.id] ? promoMap[p.id].price : Number(p.price); if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c); return [...prev, { id: p.id, name: p.name, price, qty: 1, img: p.image }] }); setToast('Added to cart'); setTimeout(() => setToast(''), 1500) }
  const updQty = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(0, c.qty + d) } : c).filter(c => c.qty > 0))
  const cc = cart.reduce((a, c) => a + c.qty, 0)
  const ct = cart.reduce((a, c) => a + c.price * c.qty, 0)
  const gp = p => promoMap[p.id] ? promoMap[p.id].price : Number(p.price)

  // Promo products
  const promoProducts = useMemo(() => products.filter(p => promoMap[p.id]), [products, promoMap])
  // "Trending" — shuffle products deterministically by day
  const trending = useMemo(() => { const day = new Date().getDate(); return [...products].sort((a, b) => ((a.id.charCodeAt(0) + day) % 7) - ((b.id.charCodeAt(0) + day) % 7)).slice(0, 6) }, [products])

  // Hero slideshow — pick products with images for banner
  const heroProducts = useMemo(() => products.filter(p => p.image).slice(0, 5), [products])
  const [heroIdx, setHeroIdx] = useState(0)
  useEffect(() => {
    if (heroProducts.length <= 1) return
    const i = setInterval(() => setHeroIdx(prev => (prev + 1) % heroProducts.length), 4000)
    return () => clearInterval(i)
  }, [heroProducts.length])

  const placeOrder = async () => {
    if (!custName.trim() || !custPhone.trim()) return; setSubmitting(true)
    const orderNo = 'WEB-' + Date.now().toString(36).toUpperCase()
    const items = cart.map(c => ({ name: c.name, qty: c.qty, price: c.price, lineTotal: c.price * c.qty }))
    const { data: mc } = await supabase.from('whatsapp_orders').select('ussd_code').order('ussd_code', { ascending: false }).limit(1)
    const uc = (mc?.[0]?.ussd_code || 0) + 1
    const { error } = await supabase.from('whatsapp_orders').insert({ order_no: orderNo, date: new Date().toISOString(), customer_name: custName.trim(), customer_phone: custPhone.trim(), items: JSON.stringify(items), subtotal: ct, total: ct, address: custAddress.trim() || null, notes: custNotes.trim() || 'Order from erbliving.shop', status: 'Pending', ussd_code: uc })
    if (!error) { setOrderResult({ orderNo, ussdCode: uc, total: ct }); setCart([]); setPage('success'); window.location.hash = '/' }
    setSubmitting(false)
  }

  const trackOrder = async () => {
    if (!trackQuery.trim()) return; setTracking(true); const q = trackQuery.trim()
    const { data } = await supabase.from('whatsapp_orders').select('order_no,status,total,customer_name,tracking_no,delivery_status,delivery_guy,delivered_at,date').or(`customer_phone.ilike.%${q}%,order_no.ilike.%${q}%,tracking_no.ilike.%${q}%`).order('date', { ascending: false }).limit(5)
    setTrackResult(data || []); setTracking(false)
  }

  const activePromo = promos.find(p => p.end_date && new Date(p.end_date) > new Date())

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-200 border-t-[var(--color-brand)] rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0" style={{ fontFamily: 'var(--font-body)' }}>

      {/* PROMO BANNER */}
      {activePromo && <div className="bg-[var(--color-promo)]"><div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center gap-3 text-xs text-white"><span className="font-bold truncate">{activePromo.name}</span><Timer endDate={activePromo.end_date} /><button onClick={() => go('shop', '/shop')} className="hidden sm:block text-[10px] font-bold underline">Shop Promo</button></div></div>}

      {/* TOAST */}
      {toast && <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[var(--color-brand)] text-white px-5 py-2 rounded-full text-xs font-semibold z-[100] shadow-lg" style={{ animation: 'fadeIn 0.2s ease' }}>{toast}</div>}

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
          <button onClick={() => go('home', '/')} className="font-bold text-base tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>ERBLiving</button>
          <div className="hidden md:flex items-center gap-6">
            {[['Home','home','/'],['Shop','shop','/shop'],['Track','track','/track']].map(([l,p,h]) => <button key={p} onClick={() => go(p,h)} className={`text-xs font-semibold transition ${page === p ? 'text-[var(--color-brand)]' : 'text-gray-400 hover:text-gray-600'}`}>{l}</button>)}
            <a href={`tel:${SHOP.phone.replace(/\s/g,'')}`} className="text-xs font-semibold text-gray-400 hover:text-gray-600">{SHOP.phone}</a>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => { setShowSearch(!showSearch); if (page !== 'shop') go('shop','/shop') }} className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-50">{I.search}</button>
            <button onClick={() => go('cart','/cart')} className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-50">{I.bag}{cc > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[var(--color-promo)] text-white text-[8px] font-bold rounded-full flex items-center justify-center">{cc}</span>}</button>
          </div>
        </div>
        {showSearch && <div className="px-4 sm:px-6 pb-3 max-w-7xl mx-auto"><input autoFocus className="w-full h-10 px-4 bg-gray-50 rounded-xl text-sm focus:outline-none border border-gray-100 focus:border-gray-300" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></div>}
      </nav>

      {/* ═══ HOME ═══ */}
      {page === 'home' && <>
        {/* Hero — rotating product images as background */}
        <section className="relative overflow-hidden bg-black" style={{ height: 'min(55vh, 420px)' }}>
          {/* Background images — crossfade */}
          {heroProducts.map((p, i) => (
            <div key={p.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === heroIdx ? 1 : 0 }}>
              <img src={thumb(p.image, 1200)} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.5)' }} />
            </div>
          ))}
          {/* Overlay content */}
          <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 pb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">New Arrivals</p>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {heroProducts[heroIdx]?.name || 'Quality Home Furnishings'}
            </h1>
            <div className="flex items-center gap-3">
              <button onClick={() => go('shop', '/shop')} className="h-10 px-6 bg-white text-[var(--color-brand)] rounded-lg text-xs font-bold hover:bg-gray-100 transition flex items-center gap-1.5">Shop Now {I.arrow}</button>
              {heroProducts[heroIdx] && <button onClick={() => open(heroProducts[heroIdx])} className="h-10 px-5 bg-white/15 text-white rounded-lg text-xs font-semibold hover:bg-white/25 transition backdrop-blur-sm">{money(gp(heroProducts[heroIdx]))}</button>}
            </div>
            {/* Dots */}
            <div className="flex gap-1.5 mt-5">
              {heroProducts.map((_, i) => (
                <button key={i} onClick={() => setHeroIdx(i)} className={`h-1 rounded-full transition-all duration-500 ${i === heroIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
              ))}
            </div>
          </div>
        </section>

        {/* Search bar on mobile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 md:hidden">
          <button onClick={() => { setShowSearch(true); go('shop','/shop') }} className="w-full h-10 px-4 bg-gray-50 rounded-xl text-sm text-gray-400 text-left flex items-center gap-2 border border-gray-100">
            {I.search} Search products...
          </button>
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {cats.map(c => <button key={c} onClick={() => { setCat(c); go('shop','/shop') }} className="h-8 px-4 rounded-lg text-[11px] font-semibold whitespace-nowrap bg-gray-50 text-gray-500 hover:bg-gray-100 transition shrink-0 capitalize">{c === 'all' ? 'All Products' : c}</button>)}
          </div>
        </div>

        {/* Promo products — horizontal scroll */}
        {promoProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[var(--color-promo)]">{I.fire}</span>
              <h2 className="text-sm font-bold">Promo Deals</h2>
              <button onClick={() => go('shop','/shop')} className="ml-auto text-[11px] text-gray-400 font-medium">See All {I.arrow}</button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {promoProducts.map(p => (
                <div key={p.id} onClick={() => open(p)} className="min-w-[140px] max-w-[140px] flex-shrink-0 cursor-pointer group">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative mb-1.5">
                    {p.image && <img src={thumb(p.image, 300)} className="w-full h-full object-cover" />}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[var(--color-promo)] text-white text-[8px] font-bold rounded">PROMO</span>
                  </div>
                  <div className="text-[11px] font-medium line-clamp-2 leading-snug">{p.name}</div>
                  <div className="flex items-baseline gap-1 mt-0.5"><span className="text-[12px] font-bold">{money(promoMap[p.id].price)}</span><span className="text-[10px] text-gray-300 line-through">{money(p.price)}</span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-400">{I.fire}</span>
            <h2 className="text-sm font-bold">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {trending.map(p => (
              <div key={p.id} onClick={() => open(p)} className="cursor-pointer group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-1.5">{p.image && <img src={thumb(p.image, 300)} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />}</div>
                <div className="text-[11px] font-medium line-clamp-1">{p.name}</div>
                <div className="text-[11px] font-bold">{money(gp(p))}</div>
              </div>
            ))}
          </div>
        </section>

        {/* All products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <h2 className="text-sm font-bold mb-3">All Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-5">
            {products.slice(0, 20).map(p => <Card key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => open(p)} onAdd={() => addToCart(p)} />)}
          </div>
          {products.length > 20 && <div className="text-center mt-8"><button onClick={() => go('shop','/shop')} className="h-10 px-8 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">View all {products.length} products</button></div>}
        </section>
      </>}

      {/* ═══ SHOP ═══ */}
      {page === 'shop' && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between mb-4"><h1 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>{cat === 'all' ? 'All Products' : cat}</h1><span className="text-xs text-gray-300">{filtered.length} items</span></div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`h-8 px-4 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition ${cat === c ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{c === 'all' ? 'All' : c}</button>)}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-5">{filtered.map(p => <Card key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => open(p)} onAdd={() => addToCart(p)} />)}</div>
        {filtered.length === 0 && <p className="text-center py-20 text-gray-300 text-sm">No products found</p>}
      </div>}

      {/* ═══ PRODUCT ═══ */}
      {page === 'product' && sel && <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <button onClick={() => window.history.back()} className="text-[11px] text-gray-400 hover:text-gray-600 mb-4 inline-block">&larr; Back</button>
        <div className="grid md:grid-cols-2 gap-5 md:gap-10">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">{sel.image ? <img src={thumb(sel.image, 900)} alt={sel.name} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}</div>
          <div className="flex flex-col justify-center">
            {sel.category && <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1.5">{sel.category}</p>}
            <h1 className="text-lg md:text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{sel.name}</h1>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-xl font-bold">{money(gp(sel))}</span>
              {promoMap[sel.id] && <><span className="text-sm text-gray-300 line-through">{money(sel.price)}</span><span className="text-[10px] font-bold text-[var(--color-promo)] bg-red-50 px-1.5 py-0.5 rounded">PROMO</span></>}
            </div>
            <button onClick={() => addToCart(sel)} className="w-full md:w-auto h-11 px-8 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold hover:bg-black transition">Add to Cart</button>
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-1.5">{I.check} Nationwide delivery</p>
              <p className="flex items-center gap-1.5">{I.check} Secure MoMo payment</p>
              <p className="flex items-center gap-1.5">{I.phone} Call {SHOP.phone}</p>
            </div>
          </div>
        </div>
        {products.filter(p => p.category === sel.category && p.id !== sel.id).length > 0 && <div className="mt-12"><h2 className="text-sm font-bold mb-3">Similar</h2><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-5">{products.filter(p => p.category === sel.category && p.id !== sel.id).slice(0, 5).map(p => <Card key={p.id} p={p} promo={promoMap[p.id]} onOpen={() => open(p)} onAdd={() => addToCart(p)} />)}</div></div>}
      </div>}

      {/* ═══ CART ═══ */}
      {page === 'cart' && <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-base font-bold mb-5" style={{ fontFamily: 'var(--font-display)' }}>Cart {cc > 0 && <span className="text-gray-300 font-normal">({cc})</span>}</h1>
        {cart.length === 0 ? <div className="text-center py-14"><p className="text-gray-300 text-sm mb-3">Your cart is empty</p><button onClick={() => go('shop','/shop')} className="h-9 px-5 bg-[var(--color-brand)] text-white rounded-lg text-xs font-semibold">Browse Products</button></div> : <>
          <div className="space-y-2 mb-5">{cart.map(c => <div key={c.id} className="flex gap-3 items-center p-2.5 rounded-xl bg-gray-50">
            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0">{c.img ? <img src={thumb(c.img, 150)} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}</div>
            <div className="flex-1 min-w-0"><div className="text-[12px] font-medium truncate">{c.name}</div><div className="text-[12px] font-bold mt-0.5">{money(c.price)}</div></div>
            <div className="flex items-center gap-1"><button onClick={() => updQty(c.id,-1)} className="w-7 h-7 rounded bg-white flex items-center justify-center text-gray-400">{I.minus}</button><span className="w-5 text-center text-[12px] font-bold">{c.qty}</span><button onClick={() => updQty(c.id,1)} className="w-7 h-7 rounded bg-white flex items-center justify-center text-gray-400">{I.plus}</button></div>
          </div>)}</div>
          <div className="border-t border-gray-100 pt-3 mb-5"><div className="flex justify-between text-sm"><span className="text-gray-400">Total</span><span className="font-bold">{money(ct)}</span></div><p className="text-[10px] text-gray-300 mt-1">Delivery confirmed by our team after checkout</p></div>
          <button onClick={() => { setPage('checkout'); window.location.hash = '/checkout' }} className="w-full h-11 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold hover:bg-black transition">Checkout · {money(ct)}</button>
        </>}
      </div>}

      {/* ═══ CHECKOUT ═══ */}
      {page === 'checkout' && <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-base font-bold mb-5" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
        <div className="space-y-3 mb-5">
          <input className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-gray-300" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Full name *" />
          <input className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-gray-300" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="Phone number *" type="tel" />
          <textarea className="w-full h-16 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-gray-300 resize-none" value={custAddress} onChange={e => setCustAddress(e.target.value)} placeholder="Delivery address (city, area, landmark)" />
          <input className="w-full h-10 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-gray-300" value={custNotes} onChange={e => setCustNotes(e.target.value)} placeholder="Notes (optional)" />
        </div>
        <div className="bg-gray-50 rounded-xl p-3.5 mb-4">{cart.map(c => <div key={c.id} className="flex justify-between text-[12px] py-0.5"><span className="text-gray-500">{c.qty}x {c.name}</span><span className="font-semibold">{money(c.price*c.qty)}</span></div>)}<div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-2 mt-2"><span>Total</span><span>{money(ct)}</span></div></div>
        <p className="text-[10px] text-gray-300 text-center mb-3">You'll get a USSD code to pay via MoMo</p>
        <button onClick={placeOrder} disabled={!custName.trim()||!custPhone.trim()||submitting} className="w-full h-11 bg-[var(--color-brand)] text-white rounded-lg text-sm font-semibold disabled:opacity-30">{submitting ? 'Placing...' : `Place Order · ${money(ct)}`}</button>
      </div>}

      {/* ═══ SUCCESS ═══ */}
      {page === 'success' && orderResult && <div className="max-w-sm mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">{I.check}</div>
        <h1 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Order Placed</h1>
        <p className="text-xs text-gray-400 mb-6">{orderResult.orderNo}</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left"><p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Pay via Mobile Money</p><div className="bg-white rounded-lg p-3 text-center border border-gray-200"><span className="text-lg font-bold font-mono">*920*141*{orderResult.ussdCode}#</span></div><p className="text-[10px] text-gray-400 mt-2 text-center">{money(orderResult.total)}</p></div>
        <div className="text-left text-xs text-gray-400 space-y-1 mb-6"><p>1. Dial the code to pay</p><p>2. We confirm and process your order</p><p>3. Our team contacts you for delivery</p></div>
        <button onClick={() => go('home','/')} className="h-9 px-5 bg-[var(--color-brand)] text-white rounded-lg text-xs font-semibold">Continue Shopping</button>
      </div>}

      {/* ═══ TRACK ═══ */}
      {page === 'track' && <div className="max-w-md mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Track Order</h1>
        <p className="text-xs text-gray-400 mb-5">Search by phone, order # or tracking #</p>
        <div className="flex gap-2 mb-6"><input className="flex-1 h-10 px-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-gray-300" value={trackQuery} onChange={e => setTrackQuery(e.target.value)} placeholder="Search..." onKeyDown={e => e.key === 'Enter' && trackOrder()} /><button onClick={trackOrder} disabled={tracking} className="h-10 px-4 bg-[var(--color-brand)] text-white rounded-lg text-xs font-semibold">{tracking ? '...' : 'Find'}</button></div>
        {trackResult?.length === 0 && <p className="text-xs text-gray-300 text-center">No orders found</p>}
        {trackResult?.length > 0 && <div className="space-y-2">{trackResult.map(o => <div key={o.order_no} className="border border-gray-100 rounded-xl p-3.5"><div className="flex items-center justify-between mb-1.5"><span className="text-xs font-bold">{o.order_no}</span><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${o.status==='Paid'||o.status==='Completed'?'bg-gray-800 text-white':o.status==='Cancelled'?'bg-red-50 text-red-500':'bg-gray-100 text-gray-500'}`}>{o.status}</span></div><div className="text-xs text-gray-400">{money(o.total)}</div>{o.tracking_no && <div className="text-[10px] text-gray-300 font-mono mt-1">{o.tracking_no}</div>}{o.delivery_status && <div className="mt-2 pt-2 border-t border-gray-50"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${o.delivery_status==='Delivered'||o.delivery_status==='Picked Up'?'bg-green-50 text-green-700':o.delivery_status==='Out for Delivery'?'bg-blue-50 text-blue-700':'bg-gray-100 text-gray-500'}`}>{o.delivery_status}</span></div>}</div>)}</div>}
      </div>}

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-gray-50 border-t border-gray-100 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div><div className="text-sm font-bold mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>EVERYTINROOM&BEDTIME</div><p className="text-[11px] text-gray-400 leading-relaxed">Quality home furnishings delivered across Ghana.</p></div>
            <div><div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Shop</div><div className="space-y-1"><button onClick={() => go('shop','/shop')} className="block text-[11px] text-gray-500 hover:text-gray-800 transition">All Products</button><button onClick={() => go('track','/track')} className="block text-[11px] text-gray-500 hover:text-gray-800 transition">Track Order</button></div></div>
            <div><div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contact</div><div className="space-y-1 text-[11px] text-gray-500"><a href={`tel:${SHOP.phone.replace(/\s/g,'')}`} className="flex items-center gap-1 hover:text-gray-800">{I.phone} {SHOP.phone}</a><a href={`tel:${SHOP.phone2.replace(/\s/g,'')}`} className="flex items-center gap-1 hover:text-gray-800">{I.phone} {SHOP.phone2}</a><a href={SHOP.mapsUrl} target="_blank" className="flex items-center gap-1 hover:text-gray-800">{I.pin} {SHOP.address}</a></div></div>
          </div>
          <div className="border-t border-gray-200 pt-4 text-center"><p className="text-[10px] text-gray-300">&copy; {new Date().getFullYear()} EVERYTINROOM&BEDTIME</p></div>
        </div>
      </footer>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around h-14 items-center">
          {[['Home','home','/',I.home],['Categories','shop','/shop',I.grid],['Cart','cart','/cart',I.bag],['Track','track','/track',I.track]].map(([l,p,h,ic]) => (
            <button key={p} onClick={() => go(p,h)} className={`flex flex-col items-center gap-0.5 relative ${page===p?'text-[var(--color-brand)]':'text-gray-400'}`}>
              <span className="relative">{ic}{p==='cart' && cc > 0 && <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[var(--color-promo)] text-white text-[7px] font-bold rounded-full flex items-center justify-center">{cc}</span>}</span>
              <span className="text-[9px] font-medium">{l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
