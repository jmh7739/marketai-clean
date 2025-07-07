"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Navigation, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentLocation, getNearbyProducts, type LocationData, type NearbyProduct } from "@/lib/location-service"

declare global {
  interface Window {
    kakao: any
  }
}

export default function LocalTradeMap() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [nearbyProducts, setNearbyProducts] = useState<NearbyProduct[]>([])
  const [selectedRadius, setSelectedRadius] = useState("5")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markers = useRef<any[]>([])

  // 카카오 지도 초기화
  useEffect(() => {
    const script = document.createElement("script")
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`
    script.async = true

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current && userLocation) {
          initializeMap()
        }
      })
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [userLocation])

  // 위치 권한 요청
  const requestLocation = async () => {
    setLoading(true)
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
      setLocationPermission("granted")
      await loadNearbyProducts(location)
    } catch (error) {
      console.error("위치 정보 가져오기 실패:", error)
      setLocationPermission("denied")
    } finally {
      setLoading(false)
    }
  }

  // 주변 상품 로드
  const loadNearbyProducts = async (location: LocationData) => {
    setLoading(true)
    try {
      const products = await getNearbyProducts(
        location,
        Number.parseInt(selectedRadius),
        selectedCategory === "all" ? undefined : selectedCategory,
      )
      setNearbyProducts(products)
    } catch (error) {
      console.error("주변 상품 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  // 지도 초기화
  const initializeMap = () => {
    if (!mapRef.current || !userLocation) return

    const options = {
      center: new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude),
      level: 5,
    }

    mapInstance.current = new window.kakao.maps.Map(mapRef.current, options)

    // 내 위치 마커
    const myPosition = new window.kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
    const myMarker = new window.kakao.maps.Marker({
      position: myPosition,
      image: new window.kakao.maps.MarkerImage("/icons/my-location.png", new window.kakao.maps.Size(30, 30)),
    })
    myMarker.setMap(mapInstance.current)

    // 상품 마커들 추가
    addProductMarkers()
  }

  // 상품 마커 추가
  const addProductMarkers = () => {
    // 기존 마커 제거
    markers.current.forEach((marker) => marker.setMap(null))
    markers.current = []

    nearbyProducts.forEach((product) => {
      const position = new window.kakao.maps.LatLng(product.location.latitude, product.location.longitude)

      const marker = new window.kakao.maps.Marker({
        position,
        image: new window.kakao.maps.MarkerImage("/icons/product-marker.png", new window.kakao.maps.Size(25, 25)),
      })

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        showProductInfo(product)
      })

      marker.setMap(mapInstance.current)
      markers.current.push(marker)
    })
  }

  // 상품 정보 표시
  const showProductInfo = (product: NearbyProduct) => {
    const content = `
      <div style="padding: 10px; width: 200px;">
        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${product.title}</h4>
        <p style="margin: 0; color: #666; font-size: 12px;">${product.distance}km 거리</p>
        <p style="margin: 5px 0 0 0; font-weight: bold; color: #e74c3c;">
          ${product.price.toLocaleString()}원
        </p>
      </div>
    `

    const infoWindow = new window.kakao.maps.InfoWindow({
      content,
    })

    infoWindow.open(
      mapInstance.current,
      markers.current.find(
        (m) =>
          m.getPosition().getLat() === product.location.latitude &&
          m.getPosition().getLng() === product.location.longitude,
      ),
    )
  }

  // 필터 변경 시 상품 재로드
  useEffect(() => {
    if (userLocation) {
      loadNearbyProducts(userLocation)
    }
  }, [selectedRadius, selectedCategory])

  // 지도에 마커 업데이트
  useEffect(() => {
    if (mapInstance.current && nearbyProducts.length > 0) {
      addProductMarkers()
    }
  }, [nearbyProducts])

  if (locationPermission === "prompt") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-4">내 주변 직거래</h2>
            <p className="text-gray-600 mb-6">
              주변에서 판매중인 상품을 확인하려면
              <br />
              위치 정보 접근을 허용해주세요
            </p>
            <Button onClick={requestLocation} disabled={loading} className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              {loading ? "위치 확인 중..." : "내 위치 확인하기"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (locationPermission === "denied") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-4">위치 접근 거부됨</h2>
            <p className="text-gray-600 mb-6">
              직거래 서비스를 이용하려면
              <br />
              브라우저 설정에서 위치 접근을 허용해주세요
            </p>
            <Button onClick={requestLocation} variant="outline" className="w-full bg-transparent">
              다시 시도하기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">내 주변 직거래</h1>
              <p className="text-gray-600">
                {userLocation?.district}, {userLocation?.city} • {nearbyProducts.length}개 상품
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant={viewMode === "map" ? "default" : "outline"} size="sm" onClick={() => setViewMode("map")}>
                <Map className="w-4 h-4 mr-1" />
                지도
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-1" />
                목록
              </Button>
            </div>
          </div>

          {/* 필터 */}
          <div className="flex items-center gap-4 mt-4">
            <Select value={selectedRadius} onValueChange={setSelectedRadius}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1km 이내</SelectItem>
                <SelectItem value="3">3km 이내</SelectItem>
                <SelectItem value="5">5km 이내</SelectItem>
                <SelectItem value="10">10km 이내</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="electronics">전자제품</SelectItem>
                <SelectItem value="fashion">패션/의류</SelectItem>
                <SelectItem value="beauty">뷰티/화장품</SelectItem>
                <SelectItem value="sports">스포츠/레저</SelectItem>
                <SelectItem value="books">도서/음반</SelectItem>
                <SelectItem value="home">홈&리빙</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 지도 */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div ref={mapRef} className="w-full h-96 lg:h-[600px] rounded-lg" />
                </CardContent>
              </Card>
            </div>

            {/* 상품 목록 */}
            <div className="space-y-4">
              <h3 className="font-semibold">주변 상품 ({nearbyProducts.length})</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {nearbyProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={product.images[0] || "/placeholder.svg?height=80&width=80"}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{product.title}</h4>
                          <p className="text-lg font-bold text-red-600 mt-1">{product.price.toLocaleString()}원</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {product.distance}km
                            </Badge>
                            <span className="text-xs text-gray-500">{product.seller.name}</span>
                            {product.seller.isVerified && (
                              <Badge variant="outline" className="text-xs">
                                인증
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 리스트 뷰 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nearbyProducts.map((product) => (
              <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={product.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-xl font-bold text-red-600 mb-3">{product.price.toLocaleString()}원</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{product.distance}km</span>
                      <div className="flex items-center gap-1">
                        <span>{product.seller.name}</span>
                        {product.seller.isVerified && (
                          <Badge variant="outline" className="text-xs">
                            인증
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* 안전거래존 정보 */}
                    {product.meetingSpots.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600 mb-1">근처 안전거래존</p>
                        <p className="text-xs text-blue-600">{product.meetingSpots[0].name}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {nearbyProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">주변에 판매중인 상품이 없습니다</h3>
            <p className="text-gray-600 mb-6">검색 반경을 늘리거나 다른 카테고리를 선택해보세요</p>
            <Button onClick={() => loadNearbyProducts(userLocation!)}>새로고침</Button>
          </div>
        )}
      </div>
    </div>
  )
}
