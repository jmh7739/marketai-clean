import { supabase } from "./supabase-client"

export interface BetaTester {
  id: string
  email: string
  phone: string
  name: string
  feedback: string[]
  testingStartDate: string
  isActive: boolean
}

export interface FeedbackData {
  testerId: string
  category: "bug" | "feature" | "ui" | "performance" | "other"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  screenshots?: string[]
}

export class BetaTesterService {
  // 베타 테스터 등록
  static async registerBetaTester(data: {
    email: string
    phone: string
    name: string
  }): Promise<{ success: boolean; testerId?: string; message: string }> {
    try {
      // 중복 확인
      const { data: existing } = await supabase
        .from("beta_testers")
        .select("id")
        .or(`email.eq.${data.email},phone.eq.${data.phone}`)
        .single()

      if (existing) {
        return {
          success: false,
          message: "이미 등록된 이메일 또는 전화번호입니다.",
        }
      }

      // 베타 테스터 등록
      const { data: tester, error } = await supabase
        .from("beta_testers")
        .insert({
          email: data.email,
          phone: data.phone,
          name: data.name,
          testing_start_date: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // 환영 이메일 발송 (실제 환경에서는 이메일 서비스 연동)
      await this.sendWelcomeEmail(data.email, data.name)

      return {
        success: true,
        testerId: tester.id,
        message: "베타 테스터로 등록되었습니다!",
      }
    } catch (error) {
      console.error("베타 테스터 등록 오류:", error)
      return {
        success: false,
        message: "등록 중 오류가 발생했습니다.",
      }
    }
  }

  // 피드백 제출
  static async submitFeedback(feedback: FeedbackData): Promise<boolean> {
    try {
      const { error } = await supabase.from("beta_feedback").insert({
        tester_id: feedback.testerId,
        category: feedback.category,
        title: feedback.title,
        description: feedback.description,
        severity: feedback.severity,
        screenshots: feedback.screenshots || [],
        created_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      // 심각한 버그의 경우 즉시 알림
      if (feedback.severity === "critical") {
        await this.notifyDevelopers(feedback)
      }

      return true
    } catch (error) {
      console.error("피드백 제출 오류:", error)
      return false
    }
  }

  // 베타 테스터 목록 조회
  static async getBetaTesters(): Promise<BetaTester[]> {
    try {
      const { data, error } = await supabase
        .from("beta_testers")
        .select(`
          *,
          beta_feedback(title, category, severity, created_at)
        `)
        .eq("is_active", true)
        .order("testing_start_date", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error("베타 테스터 조회 오류:", error)
      return []
    }
  }

  // 피드백 통계
  static async getFeedbackStats(): Promise<{
    totalFeedback: number
    byCategory: Record<string, number>
    bySeverity: Record<string, number>
  }> {
    try {
      const { data, error } = await supabase.from("beta_feedback").select("category, severity")

      if (error) {
        throw error
      }

      const byCategory: Record<string, number> = {}
      const bySeverity: Record<string, number> = {}

      data?.forEach((item) => {
        byCategory[item.category] = (byCategory[item.category] || 0) + 1
        bySeverity[item.severity] = (bySeverity[item.severity] || 0) + 1
      })

      return {
        totalFeedback: data?.length || 0,
        byCategory,
        bySeverity,
      }
    } catch (error) {
      console.error("피드백 통계 조회 오류:", error)
      return {
        totalFeedback: 0,
        byCategory: {},
        bySeverity: {},
      }
    }
  }

  private static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    // 실제 환경에서는 SendGrid, AWS SES 등 이메일 서비스 사용
    console.log(`환영 이메일 발송: ${email} (${name})`)
  }

  private static async notifyDevelopers(feedback: FeedbackData): Promise<void> {
    // 실제 환경에서는 Slack, Discord 등으로 즉시 알림
    console.log("긴급 버그 알림:", feedback)
  }
}
