import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      // Safely check for MongoDB _id first, fallback to standard id
      const incomingId = action.payload._id || action.payload.id
      const existing = state.items.find(i => (i._id || i.id) === incomingId)
      
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      // action.payload is the ID string passed from the button
      state.items = state.items.filter(i => (i._id || i.id) !== action.payload)
    },
    increaseQty: (state, action) => {
      const item = state.items.find(i => (i._id || i.id) === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQty: (state, action) => {
      const item = state.items.find(i => (i._id || i.id) === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
      } else {
        // If quantity reaches 0, remove it entirely
        state.items = state.items.filter(i => (i._id || i.id) !== action.payload)
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions
export default cartSlice.reducer