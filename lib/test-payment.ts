// 테스트용 결제 시스템
export interface TestPaymentRequest {
  auctionId: string
  buyerId: string
  amount: number
  method: "bank_transfer" | "card"
}

export interface TestPaymentResponse {
  success: boolean
  transactionId: string
  message: string
}

export class TestPaymentService {
  // 테스트용 계좌이체 시뮬레이션
  static async processBankTransfer(request: TestPaymentRequest): Promise<TestPaymentResponse> {
    // 실제 환경에서는 PG사 API 호출
    console.log("테스트 계좌이체 처리:", request)

    // 랜덤하게 성공/실패 시뮬레이션 (90% 성공률)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      const transactionId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Supabase에 거래 기록 저장
      await this.saveTransaction({
        transactionId,
        auctionId: request.auctionId,
        buyerId: request.buyerId,
        amount: request.amount,
        status: "completed",
      })

      return {
        success: true,
        transactionId,
        message: "결제가 완료되었습니다.",
      }
    } else {
      return {
        success: false,
        transactionId: "",
        message: "결제 처리 중 오류가 발생했습니다.",
      }
    }
  }

  private static async saveTransaction(data: any) {
    // Supabase에 거래 기록 저장 로직
    console.log("거래 기록 저장:", data)
  }

  // 테스트용 환불 처리
  static async processRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(`환불 처리: ${transactionId}, 금액: ${amount}`)
    return true
  }
}
