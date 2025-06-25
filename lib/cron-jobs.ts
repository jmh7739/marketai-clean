import { EscrowService } from "./path-to-EscrowService" // Declare or import EscrowService

// 실제 운영에서는 Vercel Cron Jobs 또는 별도 서버에서 실행
export async function runDailyEscrowCheck() {
  console.log("일일 에스크로 자동 확정 작업 시작...")

  try {
    const result = await EscrowService.autoConfirmExpiredTransactions()

    if (result.success) {
      console.log(`${result.confirmedCount}건의 거래가 자동 확정되었습니다.`)
    }
  } catch (error) {
    console.error("자동 확정 작업 실패:", error)
  }
}

// 매일 오전 9시에 실행 (Vercel Cron Jobs 설정)
// vercel.json에 추가:
// {
//   "crons": [{
//     "path": "/api/cron/auto-confirm",
//     "schedule": "0 9 * * *"
//   }]
// }
