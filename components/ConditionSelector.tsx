"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CONDITIONS } from "@/lib/categories"

interface ConditionSelectorProps {
  value: {
    condition: string
    customCondition?: string
  }
  onChange: (value: {
    condition: string
    customCondition?: string
  }) => void
  error?: string
}

export function ConditionSelector({ value, onChange, error }: ConditionSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(value.condition === "custom")

  const handleConditionChange = (condition: string) => {
    const needsCustomInput = condition === "custom"
    setShowCustomInput(needsCustomInput)

    onChange({
      condition,
      customCondition: needsCustomInput ? value.customCondition : "",
    })
  }

  const handleCustomConditionChange = (customCondition: string) => {
    onChange({
      ...value,
      customCondition,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="condition">
          상품 상태 <span className="text-red-500">*</span>
        </Label>
        <Select value={value.condition} onValueChange={handleConditionChange}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder="상품 상태를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {CONDITIONS.map((condition) => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCustomInput && (
        <div>
          <Label htmlFor="customCondition">
            상태 직접 입력 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="customCondition"
            value={value.customCondition || ""}
            onChange={(e) => handleCustomConditionChange(e.target.value)}
            placeholder="상품 상태를 직접 입력하세요"
            className={error ? "border-red-500" : ""}
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-1">예: 일부 스크래치 있음, 박스 없음, 부품 일부 누락 등</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
