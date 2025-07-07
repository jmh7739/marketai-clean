import { testFirebaseConnection } from "./firebase"
import { testSupabaseConnection, upsertUser, getUserByFirebaseUid } from "./supabase-client"
import { validateFirebaseConfig } from "./firebase-config"
import { validateSupabaseConfig } from "./supabase-client"

// 연결 테스트 결과 타입
export interface ConnectionTestResult {
  firebase: {
    connected: boolean
    projectId?: string
    authDomain?: string
    error?: string
  }
  supabase: {
    connected: boolean
    url?: string
    error?: string
  }
  timestamp: string
}

// 사용자 테스트 데이터 타입
export interface TestUserData {
  firebaseUid: string
  email: string
  phone: string
  name: string
}

// 환경 변수 디버그 결과 타입
export interface EnvironmentDebugResult {
  firebase: {
    [key: string]: boolean
  }
  supabase: {
    [key: string]: boolean
  }
  overall: {
    allSet: boolean
    missingCount: number
  }
}

// Firebase와 Supabase 연결 테스트
export const testConnections = async (): Promise<ConnectionTestResult> => {
  console.log("=== 연결 테스트 시작 ===")

  // Firebase 연결 테스트
  console.log("Firebase 연결 테스트 시작...")
  const firebaseResult = await testFirebaseConnection()
  console.log("Firebase 연결 테스트 결과:", firebaseResult)

  // Supabase 연결 테스트
  console.log("Supabase 연결 테스트 시작...")
  const supabaseResult = await testSupabaseConnection()
  console.log("Supabase 연결 테스트 결과:", supabaseResult)

  const result: ConnectionTestResult = {
    firebase: firebaseResult,
    supabase: {
      connected: supabaseResult.connected,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      error: supabaseResult.error,
    },
    timestamp: new Date().toISOString(),
  }

  console.log("=== 연결 테스트 완료 ===", result)
  return result
}

// 사용자 생성 테스트
export const testUserCreation = async (
  userData: TestUserData,
): Promise<{ success: boolean; user?: any; error?: string }> => {
  console.log("=== 사용자 생성 테스트 시작 ===")
  console.log("테스트 데이터:", userData)

  try {
    const result = await upsertUser({
      firebase_uid: userData.firebaseUid,
      email: userData.email,
      phone: userData.phone,
      name: userData.name,
      phone_verified: true,
    })

    console.log("사용자 생성 결과:", result)
    return result
  } catch (error) {
    console.error("사용자 생성 테스트 오류:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 생성 테스트 중 오류가 발생했습니다.",
    }
  }
}

// 사용자 조회 테스트
export const testUserQuery = async (firebaseUid: string): Promise<{ success: boolean; user?: any; error?: string }> => {
  console.log("=== 사용자 조회 테스트 시작 ===")
  console.log("Firebase UID:", firebaseUid)

  try {
    const result = await getUserByFirebaseUid(firebaseUid)
    console.log("사용자 조회 결과:", result)
    return result
  } catch (error) {
    console.error("사용자 조회 테스트 오류:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 조회 테스트 중 오류가 발생했습니다.",
    }
  }
}

// 환경 변수 디버그
export const debugEnvironmentVariables = (): EnvironmentDebugResult => {
  console.log("=== 환경 변수 디버그 시작 ===")

  // Firebase 환경 변수 확인
  const firebaseVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  // Supabase 환경 변수 확인
  const supabaseVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // 전체 통계
  const allVars = { ...firebaseVars, ...supabaseVars }
  const totalVars = Object.keys(allVars).length
  const setVars = Object.values(allVars).filter(Boolean).length
  const missingCount = totalVars - setVars

  const result: EnvironmentDebugResult = {
    firebase: firebaseVars,
    supabase: supabaseVars,
    overall: {
      allSet: missingCount === 0,
      missingCount,
    },
  }

  console.log("환경 변수 상태:", result)

  // Firebase 설정 검증
  const firebaseValidation = validateFirebaseConfig()
  console.log("Firebase 설정 검증:", firebaseValidation)

  // Supabase 설정 검증
  const supabaseValidation = validateSupabaseConfig()
  console.log("Supabase 설정 검증:", supabaseValidation)

  console.log("=== 환경 변수 디버그 완료 ===")
  return result
}

// 전체 시스템 테스트
export const runFullSystemTest = async (): Promise<{
  connections: ConnectionTestResult
  userCreation: { success: boolean; user?: any; error?: string }
  userQuery: { success: boolean; user?: any; error?: string }
  environment: EnvironmentDebugResult
}> => {
  console.log("=== 전체 시스템 테스트 시작 ===")

  // 테스트 데이터
  const testData: TestUserData = {
    firebaseUid: "test-" + Date.now(),
    email: "test@example.com",
    phone: "+821012345678",
    name: "테스트 사용자",
  }

  // 1. 연결 테스트
  const connections = await testConnections()

  // 2. 환경 변수 디버그
  const environment = debugEnvironmentVariables()

  // 3. 사용자 생성 테스트 (Supabase 연결이 성공한 경우에만)
  let userCreation = { success: false, error: "Supabase 연결 실패로 인해 테스트를 건너뜁니다." }
  if (connections.supabase.connected) {
    userCreation = await testUserCreation(testData)
  }

  // 4. 사용자 조회 테스트 (사용자 생성이 성공한 경우에만)
  let userQuery = { success: false, error: "사용자 생성 실패로 인해 테스트를 건너뜁니다." }
  if (userCreation.success) {
    userQuery = await testUserQuery(testData.firebaseUid)
  }

  const result = {
    connections,
    userCreation,
    userQuery,
    environment,
  }

  console.log("=== 전체 시스템 테스트 완료 ===", result)
  return result
}
