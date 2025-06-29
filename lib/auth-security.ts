import { SupabaseService } from "@/lib/supabase"

export interface LoginAttempt {
  id: string
  user_identifier: string // 이메일 또는 전화번호
  ip_address: string
  success: boolean
  created_at: string
}

export class AuthSecurity {
  private static readonly MAX_ATTEMPTS = 5
  private static readonly LOCKOUT_DURATION = 10 * 60 * 1000 // 10분

  // 로그인 시도 기록
  static async recordLoginAttempt(userIdentifier: string, ipAddress: string, success: boolean): Promise<void> {
    try {
      await SupabaseService.supabase.from("login_attempts").insert({
        user_identifier: userIdentifier,
        ip_address: ipAddress,
        success: success,
      })
    } catch (error) {
      console.error("로그인 시도 기록 실패:", error)
    }
  }

  // 로그인 시도 횟수 확인
  static async checkLoginAttempts(userIdentifier: string): Promise<{
    isLocked: boolean
    remainingAttempts: number
    lockoutUntil?: Date
  }> {
    try {
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)

      const { data: attempts } = await SupabaseService.supabase
        .from("login_attempts")
        .select("*")
        .eq("user_identifier", userIdentifier)
        .eq("success", false)
        .gte("created_at", oneHourAgo.toISOString())
        .order("created_at", { ascending: false })

      const failedAttempts = attempts?.length || 0

      if (failedAttempts >= this.MAX_ATTEMPTS) {
        const lastAttempt = attempts?.[0]
        if (lastAttempt) {
          const lockoutUntil = new Date(lastAttempt.created_at)
          lockoutUntil.setTime(lockoutUntil.getTime() + this.LOCKOUT_DURATION)

          if (new Date() < lockoutUntil) {
            return {
              isLocked: true,
              remainingAttempts: 0,
              lockoutUntil,
            }
          }
        }
      }

      return {
        isLocked: false,
        remainingAttempts: Math.max(0, this.MAX_ATTEMPTS - failedAttempts),
      }
    } catch (error) {
      console.error("로그인 시도 확인 실패:", error)
      return { isLocked: false, remainingAttempts: this.MAX_ATTEMPTS }
    }
  }

  // 로그인 성공 시 시도 기록 초기화
  static async clearLoginAttempts(userIdentifier: string): Promise<void> {
    try {
      // 성공 기록 추가
      await this.recordLoginAttempt(userIdentifier, "", true)
    } catch (error) {
      console.error("로그인 시도 초기화 실패:", error)
    }
  }

  // 계정 잠금 해제 (본인 인증 후)
  static async unlockAccount(userIdentifier: string): Promise<boolean> {
    try {
      // 실패한 로그인 시도 기록 삭제
      await SupabaseService.supabase
        .from("login_attempts")
        .delete()
        .eq("user_identifier", userIdentifier)
        .eq("success", false)

      return true
    } catch (error) {
      console.error("계정 잠금 해제 실패:", error)
      return false
    }
  }
}
