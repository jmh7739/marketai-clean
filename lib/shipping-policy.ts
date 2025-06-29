export interface ShippingPolicy {
  freeShipping: boolean
  shippingCost: number
  method: "standard" | "express" | "pickup" | "convenience"
  regions: {
    standard: number
    jeju: number
    remote: number
  }
}

export class ShippingPolicyService {
  // 배송비 정책 - 판매자 완전 선택
  static getShippingOptions() {
    return {
      freeShipping: {
        label: "무료배송",
        description: "판매자가 배송비 부담",
        recommended: "5만원 이상 상품",
      },
      standardShipping: {
        label: "배송비 별도",
        description: "구매자가 배송비 부담",
        defaultCost: 3000,
        regions: {
          standard: 3000,
          jeju: 6000,
          remote: 8000,
        },
      },
      pickup: {
        label: "직거래",
        description: "안전거래존에서 직접 거래",
        cost: 0,
      },
    }
  }

  // 배송비 계산
  static calculateShippingCost(policy: ShippingPolicy, region: string): number {
    if (policy.freeShipping) return 0

    switch (region) {
      case "jeju":
        return policy.regions.jeju
      case "remote":
        return policy.regions.remote
      default:
        return policy.regions.standard
    }
  }
}
