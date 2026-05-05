import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductUpload from './ProductUpload'

function Admin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error('Backend returned an error instead of an array:', data)
        setOrders([])
      }
      setLoading(false)
    } catch (err) {
      console.log('Error fetching orders', err)
      setOrders([])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchOrders()
    } catch (err) {
      console.log('Error updating status', err)
    }
  }

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: 'DELETE'
      })
      fetchOrders()
    } catch (err) {
      console.log('Error deleting order', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/admin-login')
  }

  const statusColor = (status) => {
    if (status === 'pending') return 'bg-amber-50 text-amber-600 border border-amber-200'
    if (status === 'shipped') return 'bg-blue-50 text-blue-600 border border-blue-200'
    if (status === 'delivered') return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    return 'bg-gray-100 text-gray-500 border border-gray-200'
  }

  const statusDot = (status) => {
    if (status === 'pending') return 'bg-amber-400'
    if (status === 'shipped') return 'bg-blue-500'
    if (status === 'delivered') return 'bg-emerald-500'
    return 'bg-gray-400'
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium tracking-wide">Loading orders...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-black text-white pt-28 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Dashboard</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Admin Panel</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦', accent: 'text-blue-600' },
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', accent: 'text-emerald-600' },
            { label: 'Pending', value: pendingCount, icon: '⏳', accent: 'text-amber-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-extrabold ${stat.accent}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
          {[
            { key: 'orders', label: 'Manage Orders' },
            { key: 'upload', label: 'Add New Product' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-black text-white shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' ? (
          <ProductUpload />
        ) : (
          <>
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-900 font-bold text-xl mb-1">No orders yet</p>
                <p className="text-gray-400 text-sm">Orders will appear here once customers start purchasing.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div
                    key={order._id}
                    className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
                          {order.customerInfo.firstName} {order.customerInfo.lastName}
                        </h3>
                        <p className="text-gray-400 text-sm mt-0.5">{order.customerInfo.email}</p>
                        <p className="text-gray-400 text-sm">{order.customerInfo.phone}</p>
                        <p className="text-gray-400 text-sm">
                          {order.customerInfo.address}, {order.customerInfo.city}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                        <p className="text-2xl font-extrabold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColor(order.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(order.status)}`} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-100 pt-4 mb-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Items Ordered</h4>
                      <div className="flex flex-col gap-1.5">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 font-medium">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                            <span className="font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      <button
                        onClick={() => updateStatus(order._id, 'pending')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 transition-all duration-150"
                      >
                        ⏳ Pending
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, 'shipped')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all duration-150"
                      >
                        🚚 Shipped
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, 'delivered')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-all duration-150"
                      >
                        ✓ Delivered
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-all duration-150 ml-auto"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Admin