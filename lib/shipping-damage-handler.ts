import { supabase } from "./supabase-client"

export interface ShippingDamageCase {
  id: string
  transactionId: string
  buyerId: string
  sellerId: string
  carrierId: string
  trackingNumber: string
  damageType: "packaging" | "product" | "both"
  damageDescription: string
  packagingPhotos: string[]
  productPhotos: string[]
  carrierInsuranceClaim?: string
  responsibility: "carrier" | "seller" | "disputed"
  status: "investigating" | "carrier_liable" | "seller_liable" | "resolved"
  resolutionAmount?: number
  createdAt: string
}

export class ShippingDamageHandler {
  // 배송 파손 신고 처리
  static async handleShippingDamage(data: {
    transactionId: string
    buyerId: string
    trackingNumber: string
    damageDescription: string
    packagingPhotos: File[]
    productPhotos: File[]
  }) {
    try {
      // 거래 정보 확인
      const { data: transaction } = await supabase
        .from("transactions")
        .select(`
          *,
          auction:auctions(seller_id, shipping_method)
        `)
        .eq("id", data.transactionId)
        .eq("buyer_id", data.buyerId)
        .single()

      if (!transaction) {
        return { success: false, error: "거래를 찾을 수 없습니다" }
      }

      // 배송 추적 정보 확인
      const trackingInfo = await this.getTrackingInfo(data.trackingNumber)
      if (!trackingInfo.delivered) {
        return { success: false, error: "배송 완료되지 않은 상품입니다" }
      }

      // 사진 업로드
      const packagingUrls = await this.uploadDamagePhotos(data.packagingPhotos, "packaging")
      const productUrls = await this.uploadDamagePhotos(data.productPhotos, "product")

      // 파손 케이스 생성
      const { data: damageCase } = await supabase
        .from("shipping_damage_cases")
        .insert({
          transaction_id: data.transactionId,
          buyer_id: data.buyerId,
          seller_id: transaction.auction.seller_id,
          carrier_id: trackingInfo.carrierId,
          tracking_number: data.trackingNumber,
          damage_description: data.damageDescription,
          packaging_photos: packagingUrls,
          product_photos: productUrls,
          status: "investigating",
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      // 자동 책임 판단
      const responsibility = await this.determineResponsibility(damageCase.id, trackingInfo, packagingUrls)

      return {
        success: true,
        caseId: damageCase.id,
        responsibility,
        message: this.getResponsibilityMessage(responsibility),
      }
    } catch (error) {
      console.error("배송 파손 처리 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 책임 소재 판단
  private static async determineResponsibility(
    caseId: string,
    trackingInfo: any,
    packagingPhotos: string[],
  ): Promise<"carrier" | "seller" | "disputed"> {
    try {
      // 1. 배송업체 보험 처리 가능 여부 확인
      const carrierInsuranceEligible = await this.checkCarrierInsurance(trackingInfo)

      // 2. 포장 상태 AI 분석 (실제로는 AI 서비스 호출)
      const packagingAnalysis = await this.analyzePackaging(packagingPhotos)

      let responsibility: "carrier" | "seller" | "disputed"

      if (carrierInsuranceEligible && packagingAnalysis.adequate) {
        // 포장 적절 + 배송업체 보험 가능 = 배송업체 책임
        responsibility = "carrier"
        await this.initiateCarrierClaim(caseId, trackingInfo)
      } else if (!packagingAnalysis.adequate) {
        // 포장 부적절 = 판매자 책임
        responsibility = "seller"
      } else {
        // 애매한 경우 = 분쟁
        responsibility = "disputed"
      }

      // 책임 소재 업데이트
      await supabase
        .from("shipping_damage_cases")
        .update({
          responsibility,
          packaging_analysis: packagingAnalysis,
          carrier_insurance_eligible: carrierInsuranceEligible,
        })
        .eq("id", caseId)

      return responsibility
    } catch (error) {
      console.error("책임 판단 오류:", error)
      return "disputed"
    }
  }

  // 배송업체 보험 확인
  private static async checkCarrierInsurance(trackingInfo: any): Promise<boolean> {
    // 실제로는 각 배송업체 API 호출
    // 여기서는 간단한 로직으로 대체
    return trackingInfo.insured && trackingInfo.value > 0
  }

  // 포장 상태 분석 (AI 또는 규칙 기반)
  private static async analyzePackaging(photos: string[]): Promise<{
    adequate: boolean
    score: number
    issues: string[]
  }> {
    // 실제로는 AI 이미지 분석 서비스 호출
    // 여기서는 간단한 더미 분석
    return {
      adequate: Math.random() > 0.3, // 70% 확률로 적절한 포장
      score: Math.random() * 100,
      issues: ["bubble_wrap_insufficient", "box_too_large"],
    }
  }

  // 배송업체 보험 청구 시작
  private static async initiateCarrierClaim(caseId: string, trackingInfo: any) {
    try {
      // 배송업체별 보험 청구 프로세스
      const claimData = {
        trackingNumber: trackingInfo.trackingNumber,
        carrierId: trackingInfo.carrierId,
        damageType: "product_damage",
        claimAmount: trackingInfo.value,
      }

      // 실제로는 배송업체 API 호출
      const claimId = `CLAIM_${Date.now()}`

      await supabase
        .from("shipping_damage_cases")
        .update({
          carrier_insurance_claim: claimId,
          status: "carrier_liable",
        })
        .eq("id", caseId)

      return { success: true, claimId }
    } catch (error) {
      console.error("배송업체 보험 청구 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 배송 추적 정보 조회
  private static async getTrackingInfo(trackingNumber: string) {
    // 실제로는 배송업체 API 호출
    return {
      trackingNumber,
      carrierId: "cj_logistics",
      delivered: true,
      deliveredAt: new Date().toISOString(),
      insured: true,
      value: 100000,
    }
  }

  // 파손 사진 업로드
  private static async uploadDamagePhotos(photos: File[], type: string): Promise<string[]> {
    const urls: string[] = []

    for (const photo of photos) {
      const fileName = `damage-photos/${type}_${Date.now()}_${photo.name}`
      const { data } = await supabase.storage.from("shipping-damage").upload(fileName, photo)

      if (data) urls.push(data.path)
    }

    return urls
  }

  // 책임 소재별 메시지
  private static getResponsibilityMessage(responsibility: string): string {
    const messages = {
      carrier: "배송업체 책임으로 판단되어 보험 청구를 진행합니다. 3-5일 내 처리 완료됩니다.",
      seller: "포장 불량으로 인한 파손으로 판단되어 판매자가 책임집니다. 교환 또는 환불 처리됩니다.",
      disputed: "책임 소재가 명확하지 않아 추가 조사가 필요합니다. 관리자가 개입하여 처리합니다.",
    }
    return messages[responsibility as keyof typeof messages] || "처리 중입니다."
  }

  // 케이스 해결
  static async resolveCase(
    caseId: string,
    resolution: {
      type: "carrier_compensation" | "seller_refund" | "seller_exchange" | "no_action"
      amount?: number
      reason: string
    },
  ) {
    try {
      await supabase
        .from("shipping_damage_cases")
        .update({
          status: "resolved",
          resolution_type: resolution.type,
          resolution_amount: resolution.amount,
          resolution_reason: resolution.reason,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", caseId)

      // 해결 방안 실행
      await this.executeResolution(caseId, resolution)

      return { success: true }
    } catch (error) {
      console.error("케이스 해결 오류:", error)
      return { success: false, error: error.message }
    }
  }

  // 해결 방안 실행
  private static async executeResolution(caseId: string, resolution: any) {
    // 실제 환불/교환 처리 로직
    console.log(`배송 파손 케이스 ${caseId} 해결: ${resolution.type}`)
  }
}
