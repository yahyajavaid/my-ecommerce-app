import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: 'Premium Quality',
    desc: 'Every product is curated and quality-checked before it reaches you.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    ),
    title: 'Free Shipping',
    desc: 'Enjoy free delivery on all orders above $50, worldwide.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Easy Returns',
    desc: '30-day hassle-free returns. No questions asked.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Checkout',
    desc: 'Your payment info is always encrypted and protected.',
  },
]

const categories = [
  { label: 'Electronics', emoji: '⚡', bg: 'from-blue-600 to-indigo-700' },
  { label: 'Fashion', emoji: '👗', bg: 'from-rose-500 to-pink-600' },
  { label: 'Home & Living', emoji: '🏠', bg: 'from-amber-500 to-orange-600' },
  { label: 'Sports', emoji: '🏋️', bg: 'from-green-500 to-emerald-600' },
]

function Home() {
  const dispatch = useDispatch()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 6))
        } else {
          setFeaturedProducts([])
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    setAddedId(product._id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Hero ── */}
      <section className="relative bg-black text-white overflow-hidden">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* gradient accent */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-32 flex flex-col items-center text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-400 border border-blue-500 border-opacity-40 bg-blue-500 bg-opacity-10 px-4 py-1.5 rounded-full mb-6">
            New Arrivals · Spring 2026
          </span>
          <h1 className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tight mb-6">
            Shop Smarter.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Live Better.
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
            Discover handpicked products built for modern life — premium quality, unbeatable prices, delivered fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-9 py-4 rounded-2xl transition-all duration-200 text-base shadow-lg shadow-blue-700 shadow-opacity-40"
            >
              Shop Now
            </Link>
            <Link
              to="/products"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-9 py-4 rounded-2xl transition-all duration-200 text-base"
            >
              Browse All →
            </Link>
          </div>
          {/* social proof pill */}
          <div className="mt-12 flex items-center gap-3 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {['bg-pink-500','bg-indigo-500','bg-amber-500','bg-emerald-500'].map((c, i) => (
                <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-black`} />
              ))}
            </div>
            <span><strong className="text-white">12,400+</strong> happy customers this month</span>
          </div>
        </div>
      </section>

      {/* ── Category Chips ── */}
      <section className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 text-center">Browse by Category</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to="/products"
                className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-5 text-white flex flex-col items-start gap-2 hover:scale-105 hover:shadow-lg transition-all duration-200`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="font-bold text-sm tracking-wide">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Hand-Picked</p>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            View All <span className="text-lg leading-none">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-lg">No products available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-50 h-52">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black from-opacity-10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 truncate mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 flex-grow leading-relaxed">
                    {product.description || 'Amazing product for your daily needs.'}
                  </p>

                  <div className="flex items-center justify-between mt-5">
                    <span className="text-xl font-extrabold text-gray-900">
                      PKR{product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        addedId === product._id
                          ? 'bg-green-500 text-white scale-95'
                          : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                      }`}
                    >
                      {addedId === product._id ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-block border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* ── Trust / Features Bar ── */}
      <section className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-10">
            Why MyShop
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-start gap-3">
                <div className="w-12 h-12 bg-blue-600 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-2xl flex items-center justify-center text-blue-400">
                  {f.icon}
                </div>
                <h4 className="font-bold text-base text-white">{f.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-6 text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Ready to upgrade your life?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
          Join thousands of happy customers. New deals drop every week.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-blue-700 font-extrabold px-10 py-4 rounded-2xl hover:bg-blue-50 transition text-base shadow-xl"
        >
          Explore the Store →
        </Link>
      </section>

    </div>
  )
}

export default Home