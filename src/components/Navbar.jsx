import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

function Navbar() {
  const cartItems = useSelector(state => state.cart.items)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? 'bg-black bg-opacity-80 backdrop-blur-xl border-b border-white border-opacity-10 shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-white hover:opacity-80 transition-opacity duration-200"
        >
          Kami<span className="text-blue-400">Shopsy</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-1">
          {[{ to: '/', label: 'Home' }, { to: '/products', label: 'Products' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(to)
                  ? 'text-white bg-white bg-opacity-10'
                  : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Cart */}
          <Link
            to="/cart"
            className={`relative ml-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive('/cart')
                ? 'bg-blue-600 text-white'
                : 'bg-white bg-opacity-10 text-gray-300 hover:bg-blue-600 hover:text-white'
            }`}
          >
            {/* Cart Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            Cart
            {totalItems > 0 && (
              <span className="bg-blue-400 text-black text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-black bg-opacity-90 backdrop-blur-xl border-t border-white border-opacity-10 px-6 py-4 flex flex-col gap-1">
          {[{ to: '/', label: 'Home' }, { to: '/products', label: 'Products' }, { to: '/cart', label: 'Cart' }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive(to)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {label} {label === 'Cart' && totalItems > 0 && `(${totalItems})`}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar