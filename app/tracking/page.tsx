"use client"

import { useState, useEffect } from "react"
import { Search, Package, Truck, CheckCircle, MapPin, Clock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TrackingInfo {
  trackingNumber: string
  courier: string
  status: string
  sender: string
  recipient: string
  product: string
  estimatedDelivery: string
  currentLocation: string
  history: TrackingEvent[]
}

interface TrackingEvent {
  date: string
  time: string
  location: string
  status: string
  description: string
}

const mockTrackingData: TrackingInfo = {
  trackingNumber: "1234567890",
  courier: "CJ대한통운",
  status: "배송중",
  sender: "TechStore",
  recipient: "김**",
  product: "iPhone 15 Pro Max 256GB",
  estimatedDelivery: "2024-01-18 18:00",
  currentLocation: "서울 강남구 배송센터",
  history: [
    {
      date: "2024-01-17",
      time: "14:30",
      location: "서울 강남구 배송센터",
      status: "배송중",
      description: "배송기사가 상품을 배송중입니다",
    },
    {
      date: "2024-01-17",
      time: "09:15",
      location: "서울 강남구 배송센터",
      status: "배송준비",
      description: "배송센터에서 배송 준비중입니다",
    },
    {
      date: "2024-01-16",
      time: "22:45",
      location: "서울 강남구 배송센터",
      status: "도착",
      description: "배송센터에 도착했습니다",
    },
    {
      date: "2024-01-16",
      time: "18:20",
      location: "경기 성남시 분당구",
      status: "운송중",
      description: "다음 배송센터로 운송중입니다",
    },
    {
      date: "2024-01-16",
      time: "15:30",
      location: "서울 서초구",
      status: "집화완료",
      description: "판매자로부터 상품을 수거했습니다",
    },
  ],
}

const courierList = [
  { value: "cj", label: "CJ대한통운" },
  { value: "lotte", label: "롯데택배" },
  { value: "hanjin", label: "한진택배" },
  { value: "post", label: "우체국택배" },
  { value: "kdexp", label: "경동택배" },
]

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [selectedCourier, setSelectedCourier] = useState("")
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // URL에서 운송장 번호 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const number = urlParams.get("number")
    if (number) {
      setTrackingNumber(number)
      handleSearch(number)
    }
  }, [])

  const handleSearch = async (number?: string) => {
    const searchNumber = number || trackingNumber
    if (!searchNumber) {
      setError("운송장 번호를 입력해주세요")
      return
    }

    setIsLoading(true)
    setError("")

    // 실제로는 API 호출
    setTimeout(() => {
      if (searchNumber === "1234567890") {
        setTrackingInfo(mockTrackingData)
      } else {
        setError("운송장 번호를 찾을 수 없습니다. 번호를 다시 확인해주세요.")
        setTrackingInfo(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "집화완료":
        return <Package className="w-5 h-5 text-blue-500" />
      case "운송중":
      case "배송중":
        return <Truck className="w-5 h-5 text-orange-500" />
      case "도착":
      case "배송준비":
        return <MapPin className="w-5 h-5 text-purple-500" />
      case "배송완료":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "집화완료":
        return "bg-blue-100 text-blue-800"
      case "운송중":
      case "배송중":
        return "bg-orange-100 text-orange-800"
      case "도착":
      case "배송준비":
        return "bg-purple-100 text-purple-800"
      case "배송완료":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">배송 조회</h1>
          <p className="text-gray-600">운송장 번호로 실시간 배송 현황을 확인하세요</p>
        </div>

        {/* 검색 폼 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              배송 조회
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="courier">택배사</Label>
                <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                  <SelectTrigger>
                    <SelectValue placeholder="택배사 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {courierList.map((courier) => (
                      <SelectItem key={courier.value} value={courier.value}>
                        {courier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trackingNumber">운송장 번호</Label>
                <Input
                  id="trackingNumber"
                  placeholder="운송장 번호를 입력하세요"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="flex items-end">
                <Button onClick={() => handleSearch()} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      조회중...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      조회하기
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>테스트용 운송장 번호:</strong> 1234567890 (CJ대한통운)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 배송 정보 */}
        {trackingInfo && (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>배송 정보</span>
                  <Badge className={getStatusColor(trackingInfo.status)}>{trackingInfo.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">운송장 번호</p>
                      <p className="font-semibold">{trackingInfo.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">택배사</p>
                      <p className="font-semibold">{trackingInfo.courier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">상품명</p>
                      <p className="font-semibold">{trackingInfo.product}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">보내는 분</p>
                      <p className="font-semibold">{trackingInfo.sender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">받는 분</p>
                      <p className="font-semibold">{trackingInfo.recipient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">예상 도착시간</p>
                      <p className="font-semibold text-blue-600">{trackingInfo.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                {/* 현재 위치 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">현재 위치</p>
                      <p className="text-blue-700">{trackingInfo.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 배송 추적 내역 */}
            <Card>
              <CardHeader>
                <CardTitle>배송 추적 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingInfo.history.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(event.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">{event.description}</p>
                          <Badge variant="outline" className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                        <p className="text-xs text-gray-500">
                          {event.date} {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 고객센터 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>배송 관련 문의</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {trackingInfo.courier} 고객센터
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">배송 관련 문의는 택배사로 직접 연락해주세요</p>
                    <p className="font-semibold text-blue-600">1588-1255</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      MarketAI 고객센터
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">주문 관련 문의는 MarketAI로 연락해주세요</p>
                    <p className="font-semibold text-blue-600">1588-1234</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 자주 묻는 질문 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>배송 관련 자주 묻는 질문</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Q. 운송장 번호는 언제 발급되나요?</h4>
                <p className="text-sm text-gray-600">
                  판매자가 상품을 발송하면 자동으로 운송장 번호가 발급되며, SMS와 이메일로 안내해드립니다.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Q. 배송 정보가 업데이트되지 않아요</h4>
                <p className="text-sm text-gray-600">
                  택배사 시스템 업데이트에 시간이 걸릴 수 있습니다. 24시간 후에도 업데이트되지 않으면 택배사로 직접
                  문의해주세요.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Q. 배송지를 변경하고 싶어요</h4>
                <p className="text-sm text-gray-600">
                  배송이 시작된 후에는 배송지 변경이 어렵습니다. 택배사 고객센터로 연락하여 변경 가능 여부를
                  확인해주세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
