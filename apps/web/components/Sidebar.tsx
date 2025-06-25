'use client'
import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const categories = [
    {
      name: '전자제품',
      icon: '📱',
      subcategories: ['스마트폰', '노트북', '태블릿', '스마트워치', '이어폰/헤드폰', '게임기']
    },
    {
      name: '패션/의류',
      icon: '👕',
      subcategories: ['남성의류', '여성의류', '신발', '가방', '액세서리', '시계']
    },
    {
      name: '홈&리빙',
      icon: '🏠',
      subcategories: ['가구', '침구', '주방용품', '생활용품', '인테리어', '청소용품']
    },
    {
      name: '스포츠/레저',
      icon: '⚽',
      subcategories: ['운동화', '운동복', '헬스용품', '아웃도어', '자전거', '골프용품']
    },
    {
      name: '뷰티/미용',
      icon: '💄',
      subcategories: ['스킨케어', '메이크업', '헤어케어', '향수', '네일', '미용기기']
    },
    {
      name: '자동차/오토바이',
      icon: '🚗',
      subcategories: ['자동차용품', '오토바이용품', '타이어/휠', '내비게이션', '블랙박스', '세차용품']
    },
    {
      name: '도서/음반/DVD',
      icon: '📚',
      subcategories: ['소설', '자기계발', '만화', '음반', 'DVD', '전자책']
    },
    {
      name: '완구/취미',
      icon: '🎮',
      subcategories: ['장난감', '보드게임', '프라모델', '수집품', '악기', '미술용품']
    }
  ]

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📂</span>
          전체 카테고리
        </h3>
      </div>
      
      <div className="overflow-y-auto">
        {categories.map((category, index) => (
          <div key={index} className="border-b border-gray-100">
            <button
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left"
              onClick={() => toggleCategory(category.name)}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{category.icon}</span>
                <span className="text-gray-700 font-medium">{category.name}</span>
              </div>
              {expandedCategories.includes(category.name) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {expandedCategories.includes(category.name) && (
              <div className="bg-gray-50">
                {category.subcategories.map((sub, subIndex) => (
                  <a
                    key={subIndex}
                    href="#"
                    className="block px-12 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white"
                  >
                    {sub}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 추가 메뉴 */}
      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="space-y-2">
          <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">🔥 오늘의 특가</a>
          <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">⚡ 번개세일</a>
          <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">🎁 이벤트</a>
          <a href="#" className="block text-sm text-gray-600 hover:text-blue-600">📦 무료배송</a>
        </div>
      </div>
    </div>
  )
}

export default Sidebar