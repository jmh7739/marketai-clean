import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface LocationData {
  latitude: number
  longitude: number
  address: string
  district: string // 구/군
  city: string // 시/도
}

export interface NearbyProduct {
  id: string
  title: string
  price: number
  images: string[]
  distance: number
  location: LocationData
  seller: {
    name: string
    rating: number
    isVerified: boolean
  }
  meetingSpots: SafeMeetingSpot[]
}

export interface SafeMeetingSpot {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  type: "police_station" | "subway_station" | "department_store" | "community_center"
  operatingHours: string
  facilities: string[]
}

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("위치 서비스를 지원하지 않는 브라우저입니다"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // 카카오 지도 API로 주소 변환
          const address = await reverseGeocode(latitude, longitude)
          resolve({
            latitude,
            longitude,
            address: address.address,
            district: address.district,
            city: address.city,
          })
        } catch (error) {
          reject(error)
        }
      },
      (error) => {
        reject(new Error("위치 정보를 가져올 수 없습니다"))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      },
    )
  })
}

// 카카오 지도 API - 좌표를 주소로 변환
const reverseGeocode = async (lat: number, lng: number) => {
  const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`, {
    headers: {
      Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_API_KEY}`,
    },
  })

  const data = await response.json()
  const result = data.documents[0]

  return {
    address: result.address.address_name,
    district: result.address.region_2depth_name,
    city: result.address.region_1depth_name,
  }
}

// 두 지점 간 거리 계산 (km)
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 주변 상품 검색
export const getNearbyProducts = async (
  userLocation: LocationData,
  radius = 5, // km
  category?: string,
): Promise<NearbyProduct[]> => {
  try {
    let query = supabase
      .from("products")
      .select(`
        *,
        seller:profiles(name, rating, is_verified),
        product_locations(*)
      `)
      .eq("status", "active")
      .eq("trade_type", "local") // 직거래 상품만

    if (category) {
      query = query.eq("category", category)
    }

    const { data: products, error } = await query

    if (error) throw error

    // 거리 계산 및 필터링
    const nearbyProducts = products
      .map((product) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          product.product_locations.latitude,
          product.product_locations.longitude,
        )

        return {
          ...product,
          distance: Math.round(distance * 10) / 10, // 소수점 1자리
        }
      })
      .filter((product) => product.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    // 안전거래존 정보 추가
    const productsWithMeetingSpots = await Promise.all(
      nearbyProducts.map(async (product) => {
        const meetingSpots = await getSafeMeetingSpots(
          product.product_locations.latitude,
          product.product_locations.longitude,
        )

        return {
          ...product,
          meetingSpots,
        }
      }),
    )

    return productsWithMeetingSpots
  } catch (error) {
    console.error("주변 상품 검색 실패:", error)
    return []
  }
}

// 안전거래존 검색
export const getSafeMeetingSpots = async (lat: number, lng: number, radius = 3): Promise<SafeMeetingSpot[]> => {
  try {
    const { data: spots, error } = await supabase.from("safe_meeting_spots").select("*")

    if (error) throw error

    // 거리 계산 및 필터링
    const nearbySpots = spots
      .map((spot) => ({
        ...spot,
        distance: calculateDistance(lat, lng, spot.latitude, spot.longitude),
      }))
      .filter((spot) => spot.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5) // 최대 5개

    return nearbySpots
  } catch (error) {
    console.error("안전거래존 검색 실패:", error)
    return []
  }
}

// 위치 정보 저장 (상품 등록 시)
export const saveProductLocation = async (productId: string, location: LocationData) => {
  try {
    const { error } = await supabase.from("product_locations").insert({
      product_id: productId,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      district: location.district,
      city: location.city,
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("위치 정보 저장 실패:", error)
    return { success: false, error }
  }
}
