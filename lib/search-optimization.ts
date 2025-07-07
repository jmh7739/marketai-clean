interface SearchIndex {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  location: string
  searchText: string
}

class SearchOptimizationService {
  private searchIndex: SearchIndex[] = []
  private searchHistory: string[] = []
  private popularSearches: Map<string, number> = new Map()

  // 검색 인덱스 구축
  buildSearchIndex(auctions: any[]) {
    this.searchIndex = auctions.map((auction) => ({
      id: auction.id,
      title: auction.title,
      description: auction.description,
      category: auction.category,
      tags: auction.tags || [],
      price: auction.currentBid || auction.startingPrice,
      location: auction.location || "",
      searchText: this.createSearchText(auction),
    }))
  }

  private createSearchText(auction: any): string {
    return [auction.title, auction.description, auction.category, auction.brand || "", ...(auction.tags || [])]
      .join(" ")
      .toLowerCase()
  }

  // 퍼지 검색 (오타 허용)
  fuzzySearch(query: string, maxDistance = 2): SearchIndex[] {
    const normalizedQuery = query.toLowerCase().trim()

    if (!normalizedQuery) return []

    const results = this.searchIndex.filter((item) => {
      // 정확한 매치 우선
      if (item.searchText.includes(normalizedQuery)) {
        return true
      }

      // 단어별 퍼지 매치
      const queryWords = normalizedQuery.split(" ")
      const itemWords = item.searchText.split(" ")

      return queryWords.some((queryWord) =>
        itemWords.some((itemWord) => this.calculateLevenshteinDistance(queryWord, itemWord) <= maxDistance),
      )
    })

    // 관련성 점수로 정렬
    return results.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, normalizedQuery)
      const scoreB = this.calculateRelevanceScore(b, normalizedQuery)
      return scoreB - scoreA
    })
  }

  private calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator)
      }
    }

    return matrix[str2.length][str1.length]
  }

  private calculateRelevanceScore(item: SearchIndex, query: string): number {
    let score = 0

    // 제목에서 정확한 매치
    if (item.title.toLowerCase().includes(query)) score += 10

    // 설명에서 매치
    if (item.description.toLowerCase().includes(query)) score += 5

    // 카테고리 매치
    if (item.category.toLowerCase().includes(query)) score += 3

    // 태그 매치
    item.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(query)) score += 2
    })

    return score
  }

  // 자동완성
  getAutocompleteSuggestions(query: string, limit = 10): string[] {
    const normalizedQuery = query.toLowerCase().trim()

    if (!normalizedQuery) return this.getPopularSearches(limit)

    const suggestions = new Set<string>()

    // 검색 기록에서 매치
    this.searchHistory.forEach((term) => {
      if (term.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(term)
      }
    })

    // 상품 제목에서 매치
    this.searchIndex.forEach((item) => {
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(item.title)
      }
    })

    // 인기 검색어에서 매치
    Array.from(this.popularSearches.keys()).forEach((term) => {
      if (term.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(term)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  // 검색 기록 추가
  addToSearchHistory(query: string) {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    // 중복 제거
    this.searchHistory = this.searchHistory.filter((term) => term !== normalizedQuery)
    this.searchHistory.unshift(normalizedQuery)

    // 최대 50개까지만 보관
    if (this.searchHistory.length > 50) {
      this.searchHistory = this.searchHistory.slice(0, 50)
    }

    // 인기 검색어 업데이트
    const currentCount = this.popularSearches.get(normalizedQuery) || 0
    this.popularSearches.set(normalizedQuery, currentCount + 1)

    // 로컬 스토리지에 저장
    localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory))
  }

  // 인기 검색어 가져오기
  getPopularSearches(limit = 10): string[] {
    return Array.from(this.popularSearches.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([term]) => term)
  }

  // 검색 기록 불러오기
  loadSearchHistory() {
    try {
      const saved = localStorage.getItem("searchHistory")
      if (saved) {
        this.searchHistory = JSON.parse(saved)
      }
    } catch (error) {
      console.error("검색 기록 로드 실패:", error)
    }
  }

  // 검색 기록 삭제
  clearSearchHistory() {
    this.searchHistory = []
    localStorage.removeItem("searchHistory")
  }
}

export const searchService = new SearchOptimizationService()
