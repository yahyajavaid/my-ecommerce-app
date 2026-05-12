import { useState } from 'react'

function ProductUpload() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Uploading...')

    if (images.length === 0) {
      setStatus('Please select at least one image.')
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)
    images.forEach((file) => {
      formData.append('images', file)
    })

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/upload`, {
        method: 'POST',
        body: formData, // Browser automatically sets the correct headers for FormData
      })
      
      const data = await res.json()

      if (data.success) {
        setStatus('Success! Product added to store.')
        setName('')
        setPrice('')
        setDescription('')
        setImages([])
        document.getElementById('imageInput').value = ''
      } else {
        setStatus('Failed to upload product.')
      }
    } catch (err) {
      setStatus('Server error during upload.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Product Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Price ($)</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Product Images</label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {images.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">{images.length} image(s) selected</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition mt-2"
        >
          Upload Product
        </button>
      </form>

      {status && (
        <p className={`mt-4 font-semibold text-center ${status.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
          {status}
        </p>
      )}
    </div>
  )
}

export default ProductUpload