'use client'

import React, { useState, useMemo } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import productsData from '../data/products.json'

// Define Product Type
export interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
}

// Explicitly type the products
export const products: Product[] = productsData

interface ProductFilterProps {
  onFilteredProductsChange: (products: Product[]) => void
}

export default function ProductFilter({
  onFilteredProductsChange,
}: ProductFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Memoize categories to prevent unnecessary recalculations
  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products]
  )

  // Memoize filtered products for performance
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category) ||
          selectedCategories.includes('All'))
    )

    // Call the callback function with filtered products
    onFilteredProductsChange(filtered)

    return filtered
  }, [products, searchTerm, selectedCategories, onFilteredProductsChange])

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
  }

  return (
    <div className="w-full max-w-xs">
      <div className="relative mb-4 flex items-center">
        <div className="relative flex-grow mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
        </div>
        {(searchTerm || selectedCategories.length > 0) && (
          <button
            onClick={resetFilters}
            className="text-gray-600 hover:text-black"
            title="Reset Filters"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Categories</h2>
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="form-checkbox"
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
