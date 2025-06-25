"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Camera, DollarSign, Sparkles, Zap, Truck, Package, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// 카테고리 데이터
const categories = {
  전자제품: ["스마트폰", "노트북", "태블릿", "이어폰/헤드셋", "게임기", "카메라", "기타"],
  패션: ["상의", "하의", "아우터", "신발", "가방", "액세서리", "기타"],
  뷰티: ["스킨케어", "메이크업", "향수", "헤어케어", "바디케어", "기타"],
  스포츠: ["운동복", "운동화", "운동기구", "아웃도어", "골프", "기타"],
  도서: ["소설", "자기계발", "전문서적", "만화", "잡지", "기타"],
  "홈&리빙": ["가구", "인테리어", "주방용품", "생활용품", "기타"],
  유아동: ["의류", "장난감", "도서", "용품", "기타"],
  기타: ["수집품", "예술품", "악기", "기타"],
}

const conditionOptions = [
  { value: "new", label: "새 상품" },
  { value: "like-new", label: "거의 새 것" },
  { value: "good", label: "좋음" },
  { value: "fair", label: "보통" },
  { value: "poor", label: "나쁨" },
  { value: "custom", label: "기타 (직접입력)" },
]

export default function SellPage() {
  const [images, setImages] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("")
  const [selectedCondition, setSelectedCondition] = useState<string>("")
  const [customCondition, setCustomCondition] = useState<string>("")
  const [startPrice, setStartPrice] = useState<string>("")
  const [buyNowPrice, setBuyNowPrice] = useState<string>("")
  const [enableInstantBuy, setEnableInstantBuy] = useState<boolean>(false)
  const [enablePickup, setEnablePickup] = useState<boolean>(false)
  const [enableMinBid, setEnableMinBid] = useState<boolean>(false)
  const [isAnalyzingPrice, setIsAnalyzingPrice] = useState<boolean>(false)
  const [aiSuggestions, setAiSuggestions] = useState<{
    category: string
    title: string
    keywords: string[]
    suggestedPrice: number
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // 택배 배송 관련 상태들을 다음과 같이 수정
  const [freeShipping, setFreeShipping] = useState<boolean>(false)
  const [shippingCost, setShippingCost] = useState<string>("3000")
  const [conditionalFreeShipping, setConditionalFreeShipping] = useState<boolean>(false)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<string>("50000")
  const [deliveryCompany, setDeliveryCompany] = useState<string>("")
  const [deliveryTime, setDeliveryTime] = useState<string>("")
  const [pickupLocation, setPickupLocation] = useState<string>("")
  const [pickupNote, setPickupNote] = useState<string>("")

  // 더미 AI 분석 함수
  const analyzeImage = async () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setAiSuggestions({
        category: "전자제품",
        title: "iPhone 15 Pro Max 256GB 자연 티타늄",
        keywords: ["아이폰", "스마트폰", "애플", "256GB", "티타늄"],
        suggestedPrice: 1200000,
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  // AI 가격 추천 함수
  const getAIPriceRecommendation = async () => {
    setIsAnalyzingPrice(true)
    setTimeout(() => {
      const suggestedStartPrice = Math.floor(Math.random() * 500000) + 100000
      const suggestedBuyNowPrice = Math.floor(suggestedStartPrice * 1.3)

      setStartPrice(suggestedStartPrice.toString())
      setBuyNowPrice(suggestedBuyNowPrice.toString())
      setIsAnalyzingPrice(false)
    }, 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
    if (files.length > 0 && !aiSuggestions) {
      analyzeImage()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setImages((prev) => [...prev, ...files])
    if (files.length > 0 && !aiSuggestions) {
      analyzeImage()
    }
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubCategory("") // 카테고리 변경시 서브카테고리 초기화
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">상품 등록하기</h1>
          <p className="text-gray-600">사진만 올려도 AI가 자동으로 상품 정보를 분석해드려요!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 이미지 업로드 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                상품 사진 업로드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {images.length === 0 ? (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">사진을 드래그하거나 클릭해서 업로드하세요</p>
                    <p className="text-sm text-gray-500 mb-4">최대 10장까지 업로드 가능</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        사진 선택하기
                      </label>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`상품 이미지 ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="more-images"
                    />
                    <Button variant="outline" asChild>
                      <label htmlFor="more-images" className="cursor-pointer">
                        사진 더 추가하기
                      </label>
                    </Button>
                  </div>
                )}
              </div>

              {/* AI 분석 상태 */}
              {isAnalyzing && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-800">AI가 상품을 분석하고 있어요...</span>
                  </div>
                </div>
              )}

              {/* AI 추천 결과 */}
              {aiSuggestions && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">AI 분석 완료!</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">카테고리:</span> {aiSuggestions.category}
                    </p>
                    <p>
                      <span className="font-medium">추천 제목:</span> {aiSuggestions.title}
                    </p>
                    <p>
                      <span className="font-medium">키워드:</span> {aiSuggestions.keywords.join(", ")}
                    </p>
                    <p>
                      <span className="font-medium">예상 시세:</span> ₩{aiSuggestions.suggestedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상품 정보 입력 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 카테고리 */}
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 서브 카테고리 */}
              {selectedCategory && (
                <div>
                  <Label htmlFor="subcategory">세부 카테고리</Label>
                  <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="세부 카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[selectedCategory as keyof typeof categories].map((subCategory) => (
                        <SelectItem key={subCategory} value={subCategory}>
                          {subCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 제목 */}
              <div>
                <Label htmlFor="title">상품 제목</Label>
                <Input id="title" placeholder="상품 제목을 입력하세요" defaultValue={aiSuggestions?.title} />
              </div>

              {/* 상품 설명 */}
              <div>
                <Label htmlFor="description">상품 설명</Label>
                <Textarea
                  id="description"
                  placeholder="상품의 상태, 구매 시기, 사용감 등을 자세히 적어주세요"
                  rows={4}
                />
              </div>

              {/* 상품 상태 */}
              <div>
                <Label htmlFor="condition">상품 상태</Label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="상품 상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 기타 선택시 직접 입력 필드 */}
                {selectedCondition === "custom" && (
                  <div className="mt-2">
                    <Input
                      placeholder="상품 상태를 직접 입력해주세요"
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 경매 설정 섹션 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              경매 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* AI 가격 추천 버튼 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">AI 가격 추천</h3>
                  <p className="text-sm text-gray-600">시장 데이터를 분석하여 최적의 가격을 제안해드립니다</p>
                </div>
                <Button
                  onClick={getAIPriceRecommendation}
                  disabled={isAnalyzingPrice}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isAnalyzingPrice ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      분석중...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      AI 가격 추천
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 시작가 */}
              <div>
                <Label htmlFor="startPrice">경매 시작가</Label>
                <Input
                  id="startPrice"
                  type="number"
                  placeholder="0"
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  추천: ₩{aiSuggestions ? Math.floor(aiSuggestions.suggestedPrice * 0.7).toLocaleString() : "0"}
                </p>
              </div>

              {/* 경매 기간 */}
              <div>
                <Label htmlFor="duration">경매 기간</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="기간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1일</SelectItem>
                    <SelectItem value="3">3일</SelectItem>
                    <SelectItem value="5">5일</SelectItem>
                    <SelectItem value="7">7일</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 즉시구매가 체크박스 */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="enableInstantBuy"
                    checked={enableInstantBuy}
                    onCheckedChange={(checked) => setEnableInstantBuy(checked as boolean)}
                  />
                  <Label htmlFor="enableInstantBuy" className="cursor-pointer">
                    즉시구매가 설정
                  </Label>
                </div>
                {enableInstantBuy && (
                  <div>
                    <Input
                      id="buyNowPrice"
                      type="number"
                      placeholder="0"
                      value={buyNowPrice}
                      onChange={(e) => setBuyNowPrice(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      추천: ₩{aiSuggestions?.suggestedPrice?.toLocaleString() || "0"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 배송 정보 섹션 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              배송 정보 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* 배송비 기본 설정 */}
              <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  배송비 설정
                </h3>
                <div className="space-y-4">
                  {/* 무료배송 체크박스 */}
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="freeShipping"
                      checked={freeShipping}
                      onCheckedChange={(checked) => setFreeShipping(checked as boolean)}
                    />
                    <Label htmlFor="freeShipping" className="text-base font-medium cursor-pointer">
                      🚚 무료배송
                    </Label>
                  </div>

                  {/* 배송비 입력 (무료배송이 아닐 때만 표시) */}
                  {!freeShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border">
                      <div>
                        <Label htmlFor="shippingCost" className="text-base font-medium">
                          💰 배송비 (원)
                        </Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Input
                            id="shippingCost"
                            type="number"
                            value={shippingCost}
                            onChange={(e) => setShippingCost(e.target.value)}
                            placeholder="3000"
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-600 font-medium">원</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">💡 일반적인 택배비: 3,000원 ~ 4,000원</p>
                      </div>

                      <div>
                        <Label htmlFor="deliveryCompany" className="text-base font-medium">
                          📦 택배사 선택
                        </Label>
                        <Select value={deliveryCompany} onValueChange={setDeliveryCompany}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="택배사를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cj">🚛 CJ대한통운</SelectItem>
                            <SelectItem value="lotte">📮 롯데택배</SelectItem>
                            <SelectItem value="hanjin">✈️ 한진택배</SelectItem>
                            <SelectItem value="post">🏣 우체국택배</SelectItem>
                            <SelectItem value="etc">🚚 기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* 조건부 무료배송 */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Checkbox
                        id="conditionalFreeShipping"
                        checked={conditionalFreeShipping}
                        onCheckedChange={(checked) => setConditionalFreeShipping(checked as boolean)}
                      />
                      <Label htmlFor="conditionalFreeShipping" className="text-base font-medium cursor-pointer">
                        🎯 조건부 무료배송 설정
                      </Label>
                    </div>

                    {conditionalFreeShipping && (
                      <div className="ml-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={freeShippingThreshold}
                            onChange={(e) => setFreeShippingThreshold(e.target.value)}
                            placeholder="50000"
                            className="w-32"
                          />
                          <span className="text-sm text-gray-600">원 이상 구매시 무료배송</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">💡 예: 5만원 이상 구매시 무료배송</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 발송 시간 및 배송 방법 안내 */}
              <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  발송 및 배송 방법
                </h3>
                <div className="space-y-6">
                  {/* 발송 시간 설정 */}
                  <div>
                    <Label htmlFor="deliveryTime" className="text-base font-medium">
                      ⏰ 낙찰 후 발송까지 소요시간
                    </Label>
                    <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                      <SelectTrigger className="w-48 mt-2">
                        <SelectValue placeholder="발송 소요시간" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="same-day">🚀 당일 발송</SelectItem>
                        <SelectItem value="1-day">📅 1일 후 발송</SelectItem>
                        <SelectItem value="2-3-days">📅 2-3일 후 발송</SelectItem>
                        <SelectItem value="3-5-days">📅 3-5일 후 발송</SelectItem>
                        <SelectItem value="5-7-days">📅 5-7일 후 발송</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">💡 낙찰 후 상품을 발송하기까지 걸리는 시간</p>
                  </div>

                  {/* 직접 픽업 가능 여부 */}
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <Checkbox
                        id="enablePickup"
                        checked={enablePickup}
                        onCheckedChange={(checked) => setEnablePickup(checked as boolean)}
                      />
                      <Label htmlFor="enablePickup" className="text-base font-medium cursor-pointer">
                        🏃‍♂️ 직접 픽업 가능
                      </Label>
                    </div>

                    {enablePickup && (
                      <div className="ml-6 space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div>
                          <Label htmlFor="pickupLocation" className="text-base font-medium">
                            📍 픽업 가능 지역
                          </Label>
                          <Input
                            id="pickupLocation"
                            placeholder="예: 강남구, 서초구"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="mt-2"
                          />
                          <p className="text-sm text-gray-500 mt-1">💡 여러 지역은 쉼표로 구분해주세요</p>
                        </div>
                        <div>
                          <Label htmlFor="pickupNote" className="text-base font-medium">
                            📝 픽업 관련 메모
                          </Label>
                          <Input
                            id="pickupNote"
                            placeholder="예: 지하철역 근처, 주말만 가능"
                            value={pickupNote}
                            onChange={(e) => setPickupNote(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 배송 방법 안내 */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">📦 배송 방법 안내</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 낙찰 후 구매자가 택배배송 또는 직접픽업을 선택합니다</li>
                      <li>• 택배배송 선택시 위에서 설정한 배송비가 적용됩니다</li>
                      <li>• 직접픽업 선택시 배송비는 무료입니다</li>
                      <li>• 구매자가 배송지 정보를 입력한 후 발송해주세요</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 배송비 미리보기 */}
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2 text-lg">
                  <Package className="w-5 h-5" />🔍 배송 정보 미리보기
                </h3>
                <div className="space-y-3">
                  {freeShipping ? (
                    <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                      <p className="text-green-700 font-semibold text-lg flex items-center gap-2">✅ 무료배송</p>
                    </div>
                  ) : conditionalFreeShipping ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-lg border border-blue-300">
                        <p className="text-blue-700 font-semibold">
                          📦 기본 배송비: {shippingCost ? `${Number(shippingCost).toLocaleString()}원` : "미설정"}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                        <p className="text-green-700 font-semibold">
                          ✅ {freeShippingThreshold ? `${Number(freeShippingThreshold).toLocaleString()}원` : "미설정"}{" "}
                          이상 무료배송
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-lg border border-blue-300">
                      <p className="text-blue-700 font-semibold">
                        📦 배송비: {shippingCost ? `${Number(shippingCost).toLocaleString()}원` : "미설정"}
                      </p>
                    </div>
                  )}

                  {enablePickup && (
                    <div className="p-3 bg-purple-100 rounded-lg border border-purple-300">
                      <p className="text-purple-700 font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        🏃‍♂️ 직접픽업 가능
                        {pickupLocation && ` (${pickupLocation})`}
                      </p>
                    </div>
                  )}

                  {deliveryTime && (
                    <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
                      <p className="text-gray-700 font-semibold">
                        🚚 발송시간:{" "}
                        {deliveryTime === "same-day"
                          ? "당일 발송"
                          : deliveryTime === "1-day"
                            ? "1일 후 발송"
                            : deliveryTime === "2-3-days"
                              ? "2-3일 후 발송"
                              : deliveryTime === "3-5-days"
                                ? "3-5일 후 발송"
                                : deliveryTime === "5-7-days"
                                  ? "5-7일 후 발송"
                                  : "미설정"}
                      </p>
                    </div>
                  )}

                  {deliveryCompany && (
                    <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
                      <p className="text-gray-700 font-semibold">
                        📮 택배사:{" "}
                        {deliveryCompany === "cj"
                          ? "CJ대한통운"
                          : deliveryCompany === "lotte"
                            ? "롯데택배"
                            : deliveryCompany === "hanjin"
                              ? "한진택배"
                              : deliveryCompany === "post"
                                ? "우체국택배"
                                : "기타"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 등록 버튼 */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            경매 등록하기
          </Button>
        </div>
      </div>
    </div>
  )
}
