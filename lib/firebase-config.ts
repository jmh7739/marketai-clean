// Firebase 설정 검증 및 관리

// Firebase 설정 타입
export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

// Firebase 설정 검증 결과 타입
export interface FirebaseConfigValidation {
  isValid: boolean
  config?: FirebaseConfig
  errors: string[]
  missingVars: string[]
}

// 필수 Firebase 환경 변수 목록
const REQUIRED_FIREBASE_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const

// Firebase 설정 검증 함수
export const validateFirebaseConfig = (): FirebaseConfigValidation => {
  const errors: string[] = []
  const missingVars: string[] = []

  // 환경 변수 존재 여부 확인
  const envVars = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  // 누락된 환경 변수 확인
  REQUIRED_FIREBASE_VARS.forEach((varName) => {
    const value = process.env[varName]
    if (!value || value.trim() === "") {
      missingVars.push(varName)
      errors.push(`${varName} 환경 변수가 설정되지 않았습니다.`)
    }
  })

  // 환경 변수 값 유효성 검사
  if (envVars.apiKey && envVars.apiKey.length < 30) {
    errors.push("NEXT_PUBLIC_FIREBASE_API_KEY가 너무 짧습니다. 올바른 API 키인지 확인하세요.")
  }

  if (envVars.authDomain && !envVars.authDomain.includes(".firebaseapp.com")) {
    errors.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN이 올바른 형식이 아닙니다. (.firebaseapp.com 포함)")
  }

  if (envVars.projectId && envVars.projectId.length < 3) {
    errors.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID가 너무 짧습니다.")
  }

  if (envVars.storageBucket && !envVars.storageBucket.includes(".firebasestorage.app")) {
    errors.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET이 올바른 형식이 아닙니다.")
  }

  if (envVars.messagingSenderId && !/^\d+$/.test(envVars.messagingSenderId)) {
    errors.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID는 숫자여야 합니다.")
  }

  if (envVars.appId && !envVars.appId.includes(":web:")) {
    errors.push("NEXT_PUBLIC_FIREBASE_APP_ID가 올바른 형식이 아닙니다. (:web: 포함)")
  }

  // 결과 반환
  const isValid = errors.length === 0

  return {
    isValid,
    config: isValid
      ? {
          apiKey: envVars.apiKey!,
          authDomain: envVars.authDomain!,
          projectId: envVars.projectId!,
          storageBucket: envVars.storageBucket!,
          messagingSenderId: envVars.messagingSenderId!,
          appId: envVars.appId!,
        }
      : undefined,
    errors,
    missingVars,
  }
}

// Firebase 설정 정보 가져오기 (검증 없이)
export const getFirebaseConfig = (): FirebaseConfig | null => {
  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    }

    // 모든 값이 있는지 확인
    if (Object.values(config).every((value) => value.length > 0)) {
      return config
    }

    return null
  } catch (error) {
    console.error("Firebase 설정 가져오기 오류:", error)
    return null
  }
}

// Firebase 설정 디버그 정보
export const debugFirebaseConfig = () => {
  const validation = validateFirebaseConfig()

  console.group("🔥 Firebase 설정 디버그")
  console.log("검증 결과:", validation.isValid ? "✅ 성공" : "❌ 실패")

  if (validation.errors.length > 0) {
    console.log("오류 목록:")
    validation.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`)
    })
  }

  if (validation.missingVars.length > 0) {
    console.log("누락된 환경 변수:")
    validation.missingVars.forEach((varName) => {
      console.log(`  - ${varName}`)
    })
  }

  if (validation.config) {
    console.log("설정 정보:")
    console.log(`  프로젝트 ID: ${validation.config.projectId}`)
    console.log(`  인증 도메인: ${validation.config.authDomain}`)
    console.log(`  스토리지 버킷: ${validation.config.storageBucket}`)
  }

  console.groupEnd()

  return validation
}

// 환경 변수 상태 확인
export const checkFirebaseEnvVars = (): Record<string, boolean> => {
  const status: Record<string, boolean> = {}

  REQUIRED_FIREBASE_VARS.forEach((varName) => {
    status[varName] = !!(process.env[varName] && process.env[varName]!.trim().length > 0)
  })

  return status
}
