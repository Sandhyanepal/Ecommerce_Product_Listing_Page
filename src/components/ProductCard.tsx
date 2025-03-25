import React from 'react'

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="group hover:shadow-2xl transition">
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-lg font-bold">${product.price}</p>
      </div>
    </div>
  )
}

export default ProductCard
