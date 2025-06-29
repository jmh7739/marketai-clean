// 실제 수수료 계산 시스템
export interface FeeStructure {
  minAmount: number
  maxAmount: number
  feeRate: number
  description: string
}

export const FEE_STRUCTURE: FeeStructure[] = [
  { minAmount: 0, maxAmount: 10000, feeRate: 0.1, description: "1만원 미만" },
  { minAmount: 10000, maxAmount: 50000, feeRate: 0.09, description: "1-5만원" },
  { minAmount: 50000, maxAmount: 100000, feeRate: 0.08, description: "5-10만원" },
  { minAmount: 100000, maxAmount: 300000, feeRate: 0.07, description: "10-30만원" },
  { minAmount: 300000, maxAmount: 500000, feeRate: 0.065, description: "30-50만원" },
  { minAmount: 500000, maxAmount: 1000000, feeRate: 0.06, description: "50-100만원" },
  { minAmount: 1000000, maxAmount: 3000000, feeRate: 0.055, description: "100-300만원" },
  { minAmount: 3000000, maxAmount: Number.POSITIVE_INFINITY, feeRate: 0.05, description: "300만원 이상" },
]

export function calculateFee(amount: number): { fee: number; feeRate: number; netAmount: number } {
  const feeStructure = FEE_STRUCTURE.find((structure) => amount >= structure.minAmount && amount < structure.maxAmount)

  if (!feeStructure) {
    throw new Error("Invalid amount")
  }

  const fee = Math.floor(amount * feeStructure.feeRate)
  const netAmount = amount - fee

  return {
    fee,
    feeRate: feeStructure.feeRate,
    netAmount,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount)
}

export function getFeeDescription(amount: number): string {
  const feeStructure = FEE_STRUCTURE.find((structure) => amount >= structure.minAmount && amount < structure.maxAmount)
  return feeStructure?.description || "알 수 없음"
}
