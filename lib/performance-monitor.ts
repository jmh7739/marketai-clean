class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  private observer: PerformanceObserver | null = null

  initialize() {
    // Core Web Vitals 측정
    this.measureCoreWebVitals()

    // 커스텀 메트릭 측정
    this.measureCustomMetrics()

    // 리소스 로딩 시간 측정
    this.measureResourceTiming()
  }

  private measureCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric("LCP", lastEntry.startTime)
    })
    this.observer.observe({ entryTypes: ["largest-contentful-paint"] })

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric("FID", entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ["first-input"] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.recordMetric("CLS", clsValue)
        }
      })
    }).observe({ entryTypes: ["layout-shift"] })
  }

  private measureCustomMetrics() {
    // 페이지 로드 시간
    window.addEventListener("load", () => {
      const loadTime = performance.now()
      this.recordMetric("PageLoad", loadTime)
    })

    // API 응답 시간 측정
    this.interceptFetch()
  }

  private measureResourceTiming() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.initiatorType === "img") {
          this.recordMetric("ImageLoad", entry.duration)
        } else if (entry.initiatorType === "script") {
          this.recordMetric("ScriptLoad", entry.duration)
        }
      })
    }).observe({ entryTypes: ["resource"] })
  }

  private interceptFetch() {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const duration = endTime - startTime

        const url = typeof args[0] === "string" ? args[0] : args[0].url
        if (url.includes("/api/")) {
          this.recordMetric("APIResponse", duration)
        }

        return response
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        this.recordMetric("APIError", duration)
        throw error
      }
    }
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const values = this.metrics.get(name)!
    values.push(value)

    // 최대 100개까지만 보관
    if (values.length > 100) {
      values.shift()
    }

    // 임계값 초과 시 경고
    this.checkThresholds(name, value)
  }

  private checkThresholds(name: string, value: number) {
    const thresholds = {
      LCP: 2500, // 2.5초
      FID: 100, // 100ms
      CLS: 0.1, // 0.1
      PageLoad: 3000, // 3초
      APIResponse: 1000, // 1초
      ImageLoad: 2000, // 2초
    }

    const threshold = thresholds[name as keyof typeof thresholds]
    if (threshold && value > threshold) {
      console.warn(`성능 임계값 초과: ${name} = ${value}ms (임계값: ${threshold}ms)`)

      // 성능 이슈 리포트
      this.reportPerformanceIssue(name, value, threshold)
    }
  }

  private reportPerformanceIssue(metric: string, value: number, threshold: number) {
    // 성능 이슈를 서버로 전송
    fetch("/api/performance-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metric,
        value,
        threshold,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // 리포트 실패는 무시
    })
  }

  getMetrics() {
    const result: Record<string, any> = {}

    this.metrics.forEach((values, name) => {
      result[name] = {
        count: values.length,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        latest: values[values.length - 1],
      }
    })

    return result
  }

  // 메모리 사용량 모니터링
  getMemoryUsage() {
    if ("memory" in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      }
    }
    return null
  }

  // 네트워크 상태 모니터링
  getNetworkInfo() {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      }
    }
    return null
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
