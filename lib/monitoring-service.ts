export interface SystemMetrics {
  responseTime: number
  errorRate: number
  activeUsers: number
  auctionCount: number
  bidCount: number
  serverLoad: number
}

export interface ErrorLog {
  id: string
  timestamp: string
  level: "error" | "warning" | "info"
  message: string
  stack?: string
  userId?: string
  url?: string
  userAgent?: string
}

export class MonitoringService {
  private static metrics: SystemMetrics = {
    responseTime: 0,
    errorRate: 0,
    activeUsers: 0,
    auctionCount: 0,
    bidCount: 0,
    serverLoad: 0,
  }

  // 성능 메트릭 수집
  static trackPageLoad(page: string, loadTime: number): void {
    console.log(`페이지 로드 시간: ${page} - ${loadTime}ms`)

    // 실제 환경에서는 Google Analytics, Mixpanel 등으로 전송
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "page_load_time", {
        page_title: page,
        value: loadTime,
      })
    }
  }

  // API 호출 추적
  static trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    console.log(`API 호출: ${method} ${endpoint} - ${duration}ms (${status})`)

    // 에러율 계산
    if (status >= 400) {
      this.metrics.errorRate += 1
    }

    // 응답 시간 업데이트
    this.metrics.responseTime = (this.metrics.responseTime + duration) / 2
  }

  // 에러 로깅
  static logError(error: Error, context?: any): void {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level: "error",
      message: error.message,
      stack: error.stack,
      userId: context?.userId,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
    }

    console.error("에러 발생:", errorLog)

    // 실제 환경에서는 Sentry, LogRocket 등으로 전송
    this.sendToErrorTracking(errorLog)
  }

  // 사용자 활동 추적
  static trackUserAction(action: string, properties?: Record<string, any>): void {
    console.log(`사용자 액션: ${action}`, properties)

    // 실제 환경에서는 분석 도구로 전송
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", action, properties)
    }
  }

  // 실시간 메트릭 업데이트
  static updateMetrics(newMetrics: Partial<SystemMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics }

    // 임계값 체크
    this.checkThresholds()
  }

  // 현재 메트릭 조회
  static getMetrics(): SystemMetrics {
    return { ...this.metrics }
  }

  private static checkThresholds(): void {
    // 응답 시간이 3초 이상이면 경고
    if (this.metrics.responseTime > 3000) {
      console.warn("응답 시간 임계값 초과:", this.metrics.responseTime)
    }

    // 에러율이 5% 이상이면 경고
    if (this.metrics.errorRate > 0.05) {
      console.warn("에러율 임계값 초과:", this.metrics.errorRate)
    }
  }

  private static sendToErrorTracking(errorLog: ErrorLog): void {
    // 실제 환경에서는 Sentry 등으로 전송
    // Sentry.captureException(error)
  }
}
