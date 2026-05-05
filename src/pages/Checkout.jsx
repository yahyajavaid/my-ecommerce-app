import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { clearCart } from '../store/cartSlice'

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(state => state.cart.items)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    address: '', city: '', phone: ''
  })

  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Go Shopping
        </Link>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.address || !form.phone) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            address: form.address,
            city: form.city,
            phone: form.phone,
          },
          items: cartItems,
          total: total
        })
      })

      if (response.ok) {
        dispatch(clearCart())
        setOrderPlaced(true)
        setTimeout(() => navigate('/'), 3000)
      } else {
        alert('Something went wrong, please try again')
      }
    } catch (err) {
      alert('Could not connect to server')
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-500">Thank you for your purchase. Redirecting you home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name *" value={form.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="lastName" placeholder="Last Name" value={form.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="email" placeholder="Email *" value={form.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="address" placeholder="Address *" value={form.address}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="city" placeholder="City" value={form.city}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input name="phone" placeholder="Phone Number *" value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-6"
              >
                Place Order
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
export default Checkout