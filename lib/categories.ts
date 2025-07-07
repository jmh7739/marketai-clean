// 카테고리 시스템 (기타 및 직접입력 포함)
export interface Category {
  id: string
  name: string
  parentId?: string
  isCustom?: boolean
  userId?: string
  level: number
}

export const DEFAULT_CATEGORIES: Category[] = [
  // 대분류
  { id: "electronics", name: "전자제품", level: 1 },
  { id: "fashion", name: "패션/의류", level: 1 },
  { id: "beauty", name: "뷰티/화장품", level: 1 },
  { id: "automotive", name: "자동차/오토바이", level: 1 },
  { id: "books", name: "도서/음반/DVD", level: 1 },
  { id: "sports", name: "스포츠/레저", level: 1 },
  { id: "home", name: "생활/가전", level: 1 },
  { id: "toys", name: "완구/취미", level: 1 },
  { id: "other_main", name: "기타", level: 1 },

  // 전자제품 소분류
  { id: "smartphones", name: "스마트폰", parentId: "electronics", level: 2 },
  { id: "laptops", name: "노트북/PC", parentId: "electronics", level: 2 },
  { id: "tablets", name: "태블릿", parentId: "electronics", level: 2 },
  { id: "cameras", name: "카메라", parentId: "electronics", level: 2 },
  { id: "gaming", name: "게임기", parentId: "electronics", level: 2 },
  { id: "audio", name: "오디오", parentId: "electronics", level: 2 },
  { id: "other_electronics", name: "기타 (직접입력)", parentId: "electronics", level: 2 },

  // 패션/의류 소분류
  { id: "mens_clothing", name: "남성의류", parentId: "fashion", level: 2 },
  { id: "womens_clothing", name: "여성의류", parentId: "fashion", level: 2 },
  { id: "shoes", name: "신발", parentId: "fashion", level: 2 },
  { id: "bags", name: "가방", parentId: "fashion", level: 2 },
  { id: "watches", name: "시계", parentId: "fashion", level: 2 },
  { id: "accessories", name: "액세서리", parentId: "fashion", level: 2 },
  { id: "other_fashion", name: "기타 (직접입력)", parentId: "fashion", level: 2 },

  // 뷰티/화장품 소분류
  { id: "skincare", name: "스킨케어", parentId: "beauty", level: 2 },
  { id: "makeup", name: "메이크업", parentId: "beauty", level: 2 },
  { id: "fragrance", name: "향수", parentId: "beauty", level: 2 },
  { id: "haircare", name: "헤어케어", parentId: "beauty", level: 2 },
  { id: "bodycare", name: "바디케어", parentId: "beauty", level: 2 },
  { id: "other_beauty", name: "기타 (직접입력)", parentId: "beauty", level: 2 },

  // 자동차/오토바이 소분류
  { id: "cars", name: "승용차", parentId: "automotive", level: 2 },
  { id: "suvs", name: "SUV", parentId: "automotive", level: 2 },
  { id: "motorcycles", name: "오토바이", parentId: "automotive", level: 2 },
  { id: "car_parts", name: "자동차용품", parentId: "automotive", level: 2 },
  { id: "tires", name: "타이어/휠", parentId: "automotive", level: 2 },
  { id: "other_automotive", name: "기타 (직접입력)", parentId: "automotive", level: 2 },

  // 도서/음반/DVD 소분류
  { id: "novels", name: "소설/에세이", parentId: "books", level: 2 },
  { id: "self_help", name: "자기계발", parentId: "books", level: 2 },
  { id: "textbooks", name: "전문서적", parentId: "books", level: 2 },
  { id: "comics", name: "만화", parentId: "books", level: 2 },
  { id: "music", name: "음반/CD", parentId: "books", level: 2 },
  { id: "movies", name: "DVD/블루레이", parentId: "books", level: 2 },
  { id: "other_books", name: "기타 (직접입력)", parentId: "books", level: 2 },

  // 스포츠/레저 소분류
  { id: "fitness", name: "헬스/피트니스", parentId: "sports", level: 2 },
  { id: "outdoor", name: "아웃도어", parentId: "sports", level: 2 },
  { id: "golf", name: "골프", parentId: "sports", level: 2 },
  { id: "fishing", name: "낚시", parentId: "sports", level: 2 },
  { id: "cycling", name: "자전거", parentId: "sports", level: 2 },
  { id: "other_sports", name: "기타 (직접입력)", parentId: "sports", level: 2 },

  // 생활/가전 소분류
  { id: "kitchen", name: "주방용품", parentId: "home", level: 2 },
  { id: "furniture", name: "가구", parentId: "home", level: 2 },
  { id: "appliances", name: "생활가전", parentId: "home", level: 2 },
  { id: "bedding", name: "침구/홈텍스타일", parentId: "home", level: 2 },
  { id: "cleaning", name: "청소/세탁용품", parentId: "home", level: 2 },
  { id: "other_home", name: "기타 (직접입력)", parentId: "home", level: 2 },

  // 완구/취미 소분류
  { id: "toys_kids", name: "유아동완구", parentId: "toys", level: 2 },
  { id: "figures", name: "피규어/프라모델", parentId: "toys", level: 2 },
  { id: "board_games", name: "보드게임", parentId: "toys", level: 2 },
  { id: "musical_instruments", name: "악기", parentId: "toys", level: 2 },
  { id: "art_supplies", name: "미술용품", parentId: "toys", level: 2 },
  { id: "other_toys", name: "기타 (직접입력)", parentId: "toys", level: 2 },

  // 기타 소분류
  { id: "other_sub", name: "기타 (직접입력)", parentId: "other_main", level: 2 },
]

export const CONDITIONS = [
  { value: "new", label: "새상품" },
  { value: "like_new", label: "거의 새것" },
  { value: "good", label: "좋음" },
  { value: "fair", label: "보통" },
  { value: "poor", label: "나쁨" },
  { value: "custom", label: "기타 (직접입력)" },
]

// 카테고리 관련 함수들
export const getMainCategories = () => {
  return DEFAULT_CATEGORIES.filter((cat) => cat.level === 1)
}

export const getSubCategories = (parentId: string) => {
  return DEFAULT_CATEGORIES.filter((cat) => cat.parentId === parentId)
}

export const isCustomCategory = (categoryId: string) => {
  return categoryId.includes("other_") || categoryId === "custom"
}

export const createCustomCategory = (name: string, parentId: string, userId: string): Category => {
  return {
    id: `custom_${Date.now()}_${userId}`,
    name,
    parentId,
    isCustom: true,
    userId,
    level: 2,
  }
}
