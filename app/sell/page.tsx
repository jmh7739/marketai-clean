"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Camera, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const categories = [
  {
    value: "electronics",
    label: "전자제품",
    subcategories: ["스마트폰", "노트북/PC", "태블릿", "카메라", "게임기", "오디오"],
  },
  { value: "fashion", label: "패션/의류", subcategories: ["남성의류", "여성의류", "신발", "가방", "시계", "액세서리"] },
  { value: "beauty", label: "뷰티/화장품", subcategories: ["스킨케어", "메이크업", "향수", "헤어케어", "바디케어"] },
  {
    value: "automotive",
    label: "자동차/오토바이",
    subcategories: ["승용차", "SUV", "오토바이", "자동차용품", "타이어/휠"],
  },
  {
    value: "books",
    label: "도서/음반/DVD",
    subcategories: ["소설/에세이", "자기계발", "전문서적", "만화", "음반/CD", "DVD/블루레이"],
  },
]

const conditions = [
  { value: "new", label: "새상품" },
  { value: "like-new", label: "거의 새것" },
  { value: "good", label: "좋음" },
  { value: "fair", label: "보통" },
  { value: "poor", label: "나쁨" },
]

export default function SellPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    condition: "",
    startingPrice: "",
    buyNowPrice: "",
    duration: "7",
    shippingCost: "",
    freeShipping: false,
    localPickup: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((cat) => cat.value === formData.category)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const analyzeWithAI = () => {
    if (images.length === 0) {
      toast.error("분석할 이미지를 먼저 업로드해주세요")
      return
    }

    toast.success("AI 분석 중...")

    // AI 분석 시뮬레이션
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        title: "AI가 분석한 상품명 - 고급 브랜드 제품",
        description:
          "AI가 이미지를 분석하여 자동으로 생성된 상품 설명입니다. 상태가 양호하며 사용감이 적은 제품으로 보입니다.",
        condition: "good",
        startingPrice: "50000",
        buyNowPrice: "80000",
      }))
      toast.success("AI 분석 완료! 상품 정보가 자동으로 입력되었습니다.")
    }, 2000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "상품 제목은 필수입니다"
    if (!formData.description.trim()) newErrors.description = "상품 설명은 필수입니다"
    if (!formData.category) newErrors.category = "카테고리는 필수입니다"
    if (!formData.subcategory) newErrors.subcategory = "세부 카테고리는 필수입니다"
    if (!formData.condition) newErrors.condition = "상품 상태는 필수입니다"
    if (!formData.startingPrice || Number.parseFloat(formData.startingPrice) <= 0) {
      newErrors.startingPrice = "시작가는 필수이며 0보다 커야 합니다"
    }
    if (images.length === 0) newErrors.images = "최소 1개의 상품 이미지가 필요합니다"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("필수 항목을 모두 입력해주세요")
      return
    }

    setIsSubmitting(true)

    try {
      // 경매 데이터 생성
      const auctionData = {
        id: Date.now().toString(),
        ...formData,
        images,
        sellerId: "current-user-id", // 실제로는 로그인된 사용자 ID
        sellerName: "판매자",
        currentBid: Number.parseFloat(formData.startingPrice),
        totalBids: 0,
        endTime: new Date(Date.now() + Number.parseInt(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        createdAt: new Date().toISOString(),
        watchers: 0,
        views: 0,
      }

      // 로컬스토리지에 저장
      const existingAuctions = JSON.parse(localStorage.getItem("auctions") || "[]")
      existingAuctions.push(auctionData)
      localStorage.setItem("auctions", JSON.stringify(existingAuctions))

      toast.success("상품이 성공적으로 등록되었습니다!")

      // 상품 상세 페이지로 이동
      setTimeout(() => {
        router.push(`/auction/${auctionData.id}`)
      }, 1000)
    } catch (error) {
      console.error("상품 등록 실패:", error)
      toast.error("상품 등록에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">상품 판매하기</h1>
          <p className="text-gray-600">상품 정보를 정확히 입력하여 성공적인 경매를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 이미지 업로드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                상품 이미지 <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`상품 이미지 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 8 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">이미지 추가</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {images.length > 0 && (
                  <Button type="button" onClick={analyzeWithAI} variant="outline" className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI로 상품 정보 자동 입력
                  </Button>
                )}

                {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
              </div>
            </CardContent>
          </Card>

          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">
                  상품 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="상품 제목을 입력하세요"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">
                  상품 설명 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="상품에 대한 자세한 설명을 입력하세요"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">
                    카테고리 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value, subcategory: "" }))}
                  >
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="subcategory">
                    세부 카테고리 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger className={errors.subcategory ? "border-red-500" : ""}>
                      <SelectValue placeholder="세부 카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">브랜드 (선택사항)</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                    placeholder="브랜드명 입력"
                  />
                </div>

                <div>
                  <Label htmlFor="condition">
                    상품 상태 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger className={errors.condition ? "border-red-500" : ""}>
                      <SelectValue placeholder="상품 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가격 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>가격 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startingPrice">
                    시작가 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startingPrice: e.target.value }))}
                    placeholder="시작 가격"
                    className={errors.startingPrice ? "border-red-500" : ""}
                  />
                  {errors.startingPrice && <p className="text-red-500 text-sm mt-1">{errors.startingPrice}</p>}
                </div>

                <div>
                  <Label htmlFor="buyNowPrice">즉시구매가 (선택사항)</Label>
                  <Input
                    id="buyNowPrice"
                    type="number"
                    value={formData.buyNowPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, buyNowPrice: e.target.value }))}
                    placeholder="즉시구매 가격"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">경매 기간</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1일</SelectItem>
                    <SelectItem value="3">3일</SelectItem>
                    <SelectItem value="5">5일</SelectItem>
                    <SelectItem value="7">7일</SelectItem>
                    <SelectItem value="10">10일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 배송 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>배송 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingCost">배송비</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shippingCost: e.target.value }))}
                  placeholder="배송비 (원)"
                  disabled={formData.freeShipping}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="freeShipping"
                    checked={formData.freeShipping}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        freeShipping: checked as boolean,
                        shippingCost: checked ? "0" : prev.shippingCost,
                      }))
                    }
                  />
                  <Label htmlFor="freeShipping" className="cursor-pointer">
                    무료배송
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="localPickup"
                    checked={formData.localPickup}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, localPickup: checked as boolean }))}
                  />
                  <Label htmlFor="localPickup" className="cursor-pointer">
                    직접거래 가능
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 등록 버튼 */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "등록 중..." : "경매 등록하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
