"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getMainCategories, getSubCategories, isCustomCategory } from "@/lib/categories"

interface CategorySelectorProps {
  value: {
    mainCategory: string
    subCategory: string
    customCategory?: string
  }
  onChange: (value: {
    mainCategory: string
    subCategory: string
    customCategory?: string
  }) => void
  error?: string
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false)

  const mainCategories = getMainCategories()
  const subCategories = value.mainCategory ? getSubCategories(value.mainCategory) : []

  const handleMainCategoryChange = (mainCategory: string) => {
    onChange({
      mainCategory,
      subCategory: "",
      customCategory: "",
    })
    setShowCustomInput(false)
  }

  const handleSubCategoryChange = (subCategory: string) => {
    const needsCustomInput = isCustomCategory(subCategory)
    setShowCustomInput(needsCustomInput)

    onChange({
      ...value,
      subCategory,
      customCategory: needsCustomInput ? value.customCategory : "",
    })
  }

  const handleCustomCategoryChange = (customCategory: string) => {
    onChange({
      ...value,
      customCategory,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mainCategory">
          대분류 <span className="text-red-500">*</span>
        </Label>
        <Select value={value.mainCategory} onValueChange={handleMainCategoryChange}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="대분류를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {mainCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {value.mainCategory && (
        <div>
          <Label htmlFor="subCategory">
            소분류 <span className="text-red-500">*</span>
          </Label>
          <Select value={value.subCategory} onValueChange={handleSubCategoryChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="소분류를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showCustomInput && (
        <div>
          <Label htmlFor="customCategory">
            카테고리 직접 입력 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customCategory"
            value={value.customCategory || ""}
            onChange={(e) => handleCustomCategoryChange(e.target.value)}
            placeholder="카테고리를 직접 입력하세요"
            className={error ? "border-red-500" : ""}
            maxLength={50}
          />
          <p className="text-sm text-gray-500 mt-1">예: 빈티지 의류, 수제 액세서리, 한정판 굿즈 등</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
