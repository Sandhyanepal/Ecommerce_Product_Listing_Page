'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { X, Search, SlidersHorizontal, RefreshCw } from 'lucide-react'
import productsData from '../data/products.json'
import ProductCard from '@/components/ProductCard'
import { ThemeToggle } from './theme-toggle'

interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
}

const products: Product[] = productsData

export default function ModernProductFilter() {
  const [isMobile, setIsMobile] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category))],
    [products]
  )

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCategories.length === 0 ||
            selectedCategories.includes(product.category) ||
            selectedCategories.includes('All'))
      ),
    [products, searchTerm, selectedCategories]
  )

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
  }

  const MobileFilterModal = () => (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetFilters}
            className="text-gray-600 hover:text-black"
            title="Reset Filters"
          >
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setIsFilterOpen(false)}>
            <X size={24} />
          </button>
        </div>
      </div>
      <div className="p-4">
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const DesktopFilter = () => (
    <div className="w-64 p-9 h-full fixed left-0 top-20 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={resetFilters}
          className="text-gray-600 hover:text-black"
          title="Reset Filters"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      {categories.map((category) => (
        <label key={category} className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => toggleCategory(category)}
          />
          <span>{category}</span>
        </label>
      ))}
    </div>
  )

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition-all duration-300">
      <div className="fixed top-0 left-0 w-full bg-gray-50 py-6 sm:px-8 px-4 shadow-md z-50 flex justify-between items-center">
        <h1 className="sm:text-4xl text-2xl font-semibold text-gray-800 sm:pl-12 pl-0">
          Product catalog
        </h1>
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex min-h-screen mt-24">
        {!isMobile && <DesktopFilter />}

        <div className={`flex-1 p-4 ${!isMobile ? 'ml-64' : ''}`}>
          {isMobile && (
            <div className="w-4/5 m-auto flex items-center mb-4">
              <div className="relative flex-grow mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="p-2 bg-gray-100 rounded"
              >
                <SlidersHorizontal className="dark:text-black" />
              </button>
            </div>
          )}

          {!isMobile && (
            <div className="w-5/6 m-auto relative mb-4 flex items-center">
              <div className="relative flex-grow mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-black"
                  title="Reset Filters"
                >
                  <RefreshCw size={20} />
                </button>
              )}
            </div>
          )}

          <div className="lg:w-full md:w-full w-4/5 m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No products found
            </div>
          )}
        </div>

        {isMobile && isFilterOpen && <MobileFilterModal />}
      </div>
    </div>
  )
}
