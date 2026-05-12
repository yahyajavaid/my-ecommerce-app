import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Product not found.')
          } else {
            setError('Failed to load product.')
          }
          setProduct(null)
          return
        }
        const data = await res.json()
        setProduct(data)
        setSelectedImage((data.imageUrls && data.imageUrls[0]) || data.imageUrl || '')
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Server error while loading product.')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addToCart(product))
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium tracking-wide">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-black text-white pt-28 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Product</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Details</h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center">
            <p className="text-gray-700 font-semibold mb-4">{error}</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-sm font-semibold"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const imageList = (product.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls
    : (product.imageUrl ? [product.imageUrl] : [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Product</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="text-gray-400 mt-2 text-base">Full details and pricing</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="relative bg-gray-50 h-80 sm:h-[28rem]">
              <img
                src={selectedImage || imageList[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm">
                {product.category || 'General'}
              </span>
            </div>
            {imageList.length > 1 && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {imageList.map((imgUrl, index) => (
                    <button
                      key={`${imgUrl}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`h-20 rounded-2xl overflow-hidden border ${
                        (selectedImage || imageList[0]) === imgUrl
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-base ${i < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
              <span className="text-xs text-gray-400 ml-2">Top rated</span>
            </div>

            <p className="text-3xl font-extrabold text-gray-900 mb-4">PKR{Number(product.price).toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description || 'No description provided for this item.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</span>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                {product.category || 'General'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                }`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <Link
                to="/products"
                className="px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 transition text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
