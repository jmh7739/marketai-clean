export interface FeeStructure {
  minAmount: number
  maxAmount: number | null
  feeRate: number
  description: string
}

export const FEE_STRUCTURE: FeeStructure[] = [
  {
    minAmount: 0,
    maxAmount: 100000,
    feeRate: 0.1, // 10%
    description: "10만원 미만",
  },
  {
    minAmount: 100000,
    maxAmount: 300000,
    feeRate: 0.07, // 7%
    description: "10만원 이상 30만원 미만",
  },
  {
    minAmount: 300000,
    maxAmount: 500000,
    feeRate: 0.05, // 5%
    description: "30만원 이상 50만원 미만",
  },
  {
    minAmount: 500000,
    maxAmount: 1000000,
    feeRate: 0.04, // 4%
    description: "50만원 이상 100만원 미만",
  },
  {
    minAmount: 1000000,
    maxAmount: null,
    feeRate: 0.03, // 3%
    description: "100만원 이상",
  },
]

export class FeeCalculator {
  // 수수료 계산
  static calculateFee(amount: number): { fee: number; feeRate: number; netAmount: number } {
    const structure = FEE_STRUCTURE.find(
      (tier) => amount >= tier.minAmount && (tier.maxAmount === null || amount < tier.maxAmount),
    )

    if (!structure) {
      throw new Error("수수료 구조를 찾을 수 없습니다")
    }

    const fee = Math.floor(amount * structure.feeRate)
    const netAmount = amount - fee

    return {
      fee,
      feeRate: structure.feeRate,
      netAmount,
    }
  }

  // 수수료 구조 설명
  static getFeeStructureDescription(): string[] {
    return FEE_STRUCTURE.map((tier) => `${tier.description}: ${(tier.feeRate * 100).toFixed(0)}%`)
  }

  // 예상 수수료 미리보기
  static getFeePreview(amount: number) {
    const { fee, feeRate, netAmount } = this.calculateFee(amount)

    return {
      originalAmount: amount,
      fee,
      feeRate: (feeRate * 100).toFixed(1) + "%",
      netAmount,
      description: `₩${amount.toLocaleString()} → 수수료 ₩${fee.toLocaleString()} (${(feeRate * 100).toFixed(1)}%) → 실수령액 ₩${netAmount.toLocaleString()}`,
    }
  }
}
