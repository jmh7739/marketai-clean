"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAuctions, getUsers, getTransactions } from "@/lib/utils"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({
    totalAuctions: 0,
    totalUsers: 0,
    totalTransactions: 0,
  })

  useEffect(() => {
    const updateStats = () => {
      const auctions = getAuctions()
      const users = getUsers()
      const transactions = getTransactions()

      setStats({
        totalAuctions: auctions.length,
        totalUsers: users.length,
        totalTransactions: transactions.length,
      })
    }

    updateStats()

    // Listen for storage changes
    const handleStorageChange = () => {
      updateStats()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">MarketAI</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">AI가 도와주는 스마트한 경매 플랫폼</p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="원하는 상품을 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 text-gray-900"
              />
              <Button type="submit" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{stats.totalAuctions.toLocaleString()}</div>
              <div className="text-blue-200">진행중인 경매</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-blue-200">등록된 회원</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{stats.totalTransactions.toLocaleString()}</div>
              <div className="text-blue-200">성공한 거래</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
