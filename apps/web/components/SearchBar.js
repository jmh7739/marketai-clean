"use client"

import { useState } from "react"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="상품을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-r-lg hover:bg-blue-700 transition-colors">
            검색
          </button>
        </div>
      </div>
    </div>
  )
}
