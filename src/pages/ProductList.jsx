import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function ProductList() {
  const dispatch = useDispatch()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState('')
  const [addedId, setAddedId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setProducts([])
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = ['All', 'General', 'Electronics', 'Clothing', 'Home', 'Sports']

  const filtered = products
    .filter(p => selectedCategory === 'All' || (p.category || 'General') === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5)
      return 0
    })

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    setAddedId(product._id)
    setTimeout(() => setAddedId(null), 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium tracking-wide">Loading store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-black text-white pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Our Collection</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">All Products</h1>
          <p className="text-gray-400 mt-2 text-base">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm cursor-pointer"
          >
            <option value="default">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sm:hidden flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 10h10M11 16h2" />
            </svg>
            Filter
          </button>
        </div>

        <div className="flex gap-8">

          {/* Sidebar — desktop always visible, mobile toggle */}
          <aside
            className={`shrink-0 w-52 ${sidebarOpen ? 'block' : 'hidden'} sm:block`}
          >
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 sticky top-24">
              <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-widest mb-4">
                Categories
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSidebarOpen(false) }}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-black text-white'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-900 font-bold text-xl mb-1">No products found</p>
                <p className="text-gray-400 text-sm">Try a different search or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(product => (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50 h-48">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category badge */}
                      <span className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                        {product.category || 'General'}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <h3 className="font-bold text-gray-900 truncate text-base mb-1">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between mt-auto pt-4">
                        <span className="text-xl font-extrabold text-gray-900">
                          PKR{product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
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
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductList