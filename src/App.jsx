import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, User, Menu, Moon, Sun, Search } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useDarkMode() {
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])
  return [dark, setDark]
}

function Shell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useDarkMode()
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-neutral-950/60 border-b border-neutral-200/60 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight text-xl" style={{color:'#1E90FF'}}>SoleStyle</Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/shop" className="hover:text-[#1E90FF]">Shop</Link>
            <Link to="/admin" className="hover:text-[#1E90FF]">Admin</Link>
            <Link to="/profile" className="hover:text-[#1E90FF] flex items-center gap-2"><User size={18}/> Profile</Link>
            <Link to="/cart" className="hover:text-[#1E90FF] flex items-center gap-2"><ShoppingCart size={18}/> Cart</Link>
            <button onClick={()=>setDark(!dark)} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {dark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
          </div>
          <button className="md:hidden p-2" onClick={()=>setMenuOpen(!menuOpen)}><Menu/></button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-3 flex gap-4">
            <Link to="/shop">Shop</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/cart">Cart</Link>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-neutral-200/60 dark:border-neutral-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 text-sm text-neutral-500">© {new Date().getFullYear()} SoleStyle</div>
      </footer>
    </div>
  )
}

function Hero() {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-16 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <div className="inline-flex px-2 py-1 text-xs rounded-full bg-[#1E90FF]/10 text-[#1E90FF] mb-4">New Arrivals</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Find your perfect stride</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">Browse, customize, and purchase premium footwear with 3D views and real-time stock.</p>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/shop')} className="px-5 py-3 rounded-lg text-white font-semibold shadow-sm" style={{background:'#1E90FF'}}>Shop now</button>
          <button onClick={()=>navigate('#collections')} className="px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700">Explore</button>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-[#1E90FF]/10 to-purple-500/10 aspect-square w-full" />
    </div>
  )
}

function Featured() {
  const [items, setItems] = useState([])
  useEffect(()=>{ fetch(`${API_BASE}/api/products?featured=true`).then(r=>r.json()).then(setItems).catch(()=>setItems([])) },[])
  return (
    <div id="collections" className="max-w-7xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p=> <ProductCard key={p.id} product={p} />)}
        {items.length===0 && [1,2,3].map(i=> <div key={i} className="h-56 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"/>) }
      </div>
    </div>
  )
}

function ProductCard({product}){
  return (
    <Link to={`/product/${product.id}`} className="group rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-md transition">
      <div className="h-48 bg-neutral-100 dark:bg-neutral-800" style={{backgroundImage: product.images?.[0] ? `url(${product.images[0]})` : 'none', backgroundSize:'cover', backgroundPosition:'center'}} />
      <div className="p-4">
        <div className="font-semibold mb-1">{product.title}</div>
        <div className="text-sm text-neutral-500">${product.price?.toFixed(2)}</div>
      </div>
    </Link>
  )
}

function Shop(){
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [items, setItems] = useState([])
  useEffect(()=>{
    const url = new URL(`${API_BASE}/api/products`)
    if (q) url.searchParams.set('q', q)
    if (cat) url.searchParams.set('category', cat)
    fetch(url.toString()).then(r=>r.json()).then(setItems)
  },[q,cat])
  const cats = ['men','women','kids','sports','formal','casual']
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search shoes" className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
        </div>
        <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <option value="">All</option>
          {cats.map(c=> <option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p=> <ProductCard key={p.id} product={p}/>) }
      </div>
    </div>
  )
}

// Simple 3D viewer using <model-viewer> web component for .glb/.gltf
function ModelViewer3D({src}){
  return (
    <model-viewer src={src} alt="3D Shoe" camera-controls autoplay ar style={{width:'100%', height:'380px', background:'#111'}}></model-viewer>
  )
}

function ProductDetails(){
  const { pathname } = useLocation()
  const id = pathname.split('/').pop()
  const [data, setData] = useState(null)
  const [variant, setVariant] = useState({size:'', color:''})
  useEffect(()=>{ fetch(`${API_BASE}/api/products/${id}`).then(r=>r.json()).then(setData) },[id])
  if (!data) return <div className="max-w-5xl mx-auto px-4 py-10">Loading...</div>
  const sizes = Array.from(new Set((data.variants||[]).map(v=>v.size)))
  const colors = Array.from(new Set((data.variants||[]).map(v=>v.color)))
  const inStock = (data.variants||[]).some(v=>v.size===variant.size && v.color===variant.color && v.stock>0)
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        {data.model_url ? <ModelViewer3D src={data.model_url}/> : <div className="h-96 bg-neutral-100 dark:bg-neutral-800"/>}
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <div className="text-[#1E90FF] font-semibold mb-4">${data.price?.toFixed(2)}</div>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">{data.description}</p>
        <div className="mb-4">
          <div className="text-sm mb-1">Size</div>
          <div className="flex flex-wrap gap-2">
            {sizes.map(s=> <button key={s} onClick={()=>setVariant(v=>({...v,size:s}))} className={`px-3 py-1 rounded border ${variant.size===s? 'border-[#1E90FF] text-[#1E90FF]' : 'border-neutral-300 dark:border-neutral-700'}`}>{s}</button>)}
          </div>
        </div>
        <div className="mb-6">
          <div className="text-sm mb-1">Color</div>
          <div className="flex flex-wrap gap-2">
            {colors.map(c=> <button key={c} onClick={()=>setVariant(v=>({...v,color:c}))} className={`px-3 py-1 rounded border ${variant.color===c? 'border-[#1E90FF] text-[#1E90FF]' : 'border-neutral-300 dark:border-neutral-700'}`}>{c}</button>)}
          </div>
        </div>
        <div className="flex gap-3">
          <button disabled={!inStock} className={`px-5 py-3 rounded-lg text-white font-semibold ${inStock? '' : 'opacity-50 cursor-not-allowed'}`} style={{background:'#1E90FF'}}>Add to cart</button>
          <button className="px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 flex items-center gap-2"><Heart size={18}/> Wishlist</button>
        </div>
      </div>
    </div>
  )
}

function Cart(){
  return <div className="max-w-5xl mx-auto px-4 py-10">Your cart is empty for now.</div>
}

function Checkout(){
  return <div className="max-w-5xl mx-auto px-4 py-10">Secure checkout coming next. Payments will use Stripe/Razorpay.</div>
}

function Profile(){
  return <div className="max-w-4xl mx-auto px-4 py-10">Login, orders and address management will appear here.</div>
}

function Admin(){
  const [title,setTitle]=useState('')
  const [price,setPrice]=useState('')
  const [category,setCategory]=useState('sports')
  const [modelUrl,setModelUrl]=useState('')
  const [imageUrl,setImageUrl]=useState('')
  const [saving,setSaving]=useState(false)
  const save = async ()=>{
    setSaving(true)
    const payload={title, price: parseFloat(price||'0'), categories:[category], images: imageUrl? [imageUrl]:[], model_url:modelUrl, variants:[{size:'8', color:'black', stock:10}]}
    await fetch(`${API_BASE}/api/admin/products`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    setSaving(false)
    alert('Product saved')
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
        <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          {['men','women','kids','sports','formal','casual'].map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input value={modelUrl} onChange={e=>setModelUrl(e.target.value)} placeholder="3D Model URL (.glb/.gltf)" className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
        <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL" className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
        <button disabled={saving} onClick={save} className="px-5 py-3 rounded-lg text-white font-semibold" style={{background:'#1E90FF'}}>{saving? 'Saving...' : 'Save Product'}</button>
      </div>
      <p className="text-sm text-neutral-500 mt-4">Add sample 3D models by pasting a public .glb/.gltf URL. You can use sample from public domain.</p>
    </div>
  )
}

function Home(){
  return (
    <>
      <Hero/>
      <Featured/>
    </>
  )
}

function App(){
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/product/:id" element={<ProductDetails/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}

export default App
