import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, increaseQty, decreaseQty, clearCart } from '../store/cartSlice'
import { Link } from 'react-router-dom'

function Cart() {
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="flex flex-col gap-4 mb-6">
          {cartItems.map(item => (
            // Use _id for MongoDB items, fallback to id for old hardcoded items
            <div key={item._id || item.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
              
              {/* Live Image from ImgBB */}
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-20 w-20 object-cover rounded-lg shrink-0 bg-gray-100"
                />
              ) : (
                <div className="bg-gray-200 h-20 w-20 rounded-lg shrink-0 flex items-center justify-center text-xs text-gray-500">
                  No Image
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">{item.category || 'General'}</p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(decreaseQty(item._id || item.id))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition"
                >
                  -
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => dispatch(increaseQty(item._id || item.id))}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 transition"
                >
                  +
                </button>
              </div>

              {/* Item total */}
              <p className="font-bold text-gray-800 w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              {/* Remove */}
              <button
                onClick={() => dispatch(removeFromCart(item._id || item.id))}
                className="text-red-400 hover:text-red-600 transition text-sm"
              >
                ✕
              </button>

            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-500 font-semibold">Free</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="flex-1 border border-red-400 text-red-400 py-3 rounded-lg hover:bg-red-50 transition"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
            >
              Checkout
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
export default Cart