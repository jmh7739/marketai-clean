import { SupabaseService } from "@/lib/supabase"

export interface PenaltyRecord {
  id: string
  user_id: string
  offense_type: "bid_cancellation" | "payment_default" | "fraudulent_activity"
  offense_count: number
  penalty_type: "warning" | "suspension_7_days" | "suspension_30_days" | "permanent_ban"
  created_at: string
  expires_at?: string
  is_active: boolean
}

export class PenaltySystem {
  // 제재 기록 추가
  static async addPenalty(userId: string, offenseType: string): Promise<PenaltyRecord | null> {
    try {
      // 6개월 이내 제재 기록 조회
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const { data: recentPenalties } = await SupabaseService.supabase
        .from("penalty_records")
        .select("*")
        .eq("user_id", userId)
        .eq("offense_type", offenseType)
        .gte("created_at", sixMonthsAgo.toISOString())
        .order("created_at", { ascending: false })

      const offenseCount = (recentPenalties?.length || 0) + 1
      const penaltyType = this.getPenaltyType(offenseType, offenseCount)

      const expiresAt = this.getExpirationDate(penaltyType)

      const { data, error } = await SupabaseService.supabase
        .from("penalty_records")
        .insert({
          user_id: userId,
          offense_type: offenseType,
          offense_count: offenseCount,
          penalty_type: penaltyType,
          expires_at: expiresAt,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      // 사용자 상태 업데이트
      await this.updateUserStatus(userId, penaltyType)

      return data
    } catch (error) {
      console.error("제재 기록 추가 실패:", error)
      return null
    }
  }

  // 제재 유형 결정
  private static getPenaltyType(offenseType: string, count: number): string {
    const penalties = {
      bid_cancellation: {
        1: "warning",
        2: "suspension_7_days",
        3: "suspension_30_days",
        4: "permanent_ban",
      },
      payment_default: {
        1: "warning",
        2: "suspension_14_days",
        3: "permanent_ban",
      },
      fraudulent_activity: {
        1: "permanent_ban",
      },
    }

    const offensePenalties = penalties[offenseType as keyof typeof penalties]
    if (!offensePenalties) return "warning"

    return offensePenalties[Math.min(count, 4) as keyof typeof offensePenalties] || "permanent_ban"
  }

  // 제재 만료일 계산
  private static getExpirationDate(penaltyType: string): string | null {
    const now = new Date()

    switch (penaltyType) {
      case "suspension_7_days":
        now.setDate(now.getDate() + 7)
        return now.toISOString()
      case "suspension_14_days":
        now.setDate(now.getDate() + 14)
        return now.toISOString()
      case "suspension_30_days":
        now.setDate(now.getDate() + 30)
        return now.toISOString()
      case "permanent_ban":
        return null // 영구 정지
      default:
        return null // 경고는 만료일 없음
    }
  }

  // 사용자 상태 업데이트
  private static async updateUserStatus(userId: string, penaltyType: string) {
    const isBanned = penaltyType.includes("suspension") || penaltyType === "permanent_ban"

    await SupabaseService.supabase
      .from("users")
      .update({
        is_banned: isBanned,
        ban_reason: penaltyType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
  }

  // 활성 제재 확인
  static async getActivePenalty(userId: string): Promise<PenaltyRecord | null> {
    try {
      const { data } = await SupabaseService.supabase
        .from("penalty_records")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      return data
    } catch (error) {
      return null
    }
  }

  // 만료된 제재 정리
  static async cleanupExpiredPenalties() {
    const now = new Date().toISOString()

    await SupabaseService.supabase
      .from("penalty_records")
      .update({ is_active: false })
      .lt("expires_at", now)
      .eq("is_active", true)
  }
}
