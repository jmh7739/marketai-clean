import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Supabase 설정 검증 결과 타입
export interface SupabaseConfigValidation {
  isValid: boolean
  config?: {
    url: string
    anonKey: string
  }
  errors: string[]
}

// 사용자 프로필 타입
export interface UserProfile {
  id?: string
  firebase_uid: string
  email?: string
  phone: string
  name: string
  phone_verified?: boolean
  email_verified?: boolean
  profile_image_url?: string
  created_at?: string
  updated_at?: string
}

// Supabase 연결 테스트 결과 타입
export interface SupabaseConnectionTest {
  connected: boolean
  error?: string
  details?: any
}

// Supabase 클라이언트 인스턴스
let supabaseClient: SupabaseClient | null = null

// Supabase 설정 검증 함수
export const validateSupabaseConfig = (): SupabaseConfigValidation => {
  const errors: string[] = []

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // URL 검증
  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.")
  } else if (!url.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL은 https://로 시작해야 합니다.")
  } else if (!url.includes(".supabase.co")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL이 올바른 Supabase URL 형식이 아닙니다.")
  }

  // Anonymous Key 검증
  if (!anonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.")
  } else if (anonKey.length < 100) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY가 너무 짧습니다. 올바른 키인지 확인하세요.")
  } else if (!anonKey.startsWith("eyJ")) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY가 올바른 JWT 형식이 아닙니다.")
  }

  const isValid = errors.length === 0

  return {
    isValid,
    config: isValid && url && anonKey ? { url, anonKey } : undefined,
    errors,
  }
}

// Supabase 클라이언트 생성
export const createSupabaseClient = (): SupabaseClient | null => {
  try {
    // 이미 생성된 클라이언트가 있으면 반환
    if (supabaseClient) {
      return supabaseClient
    }

    const validation = validateSupabaseConfig()
    if (!validation.isValid || !validation.config) {
      console.error("Supabase 설정 오류:", validation.errors)
      return null
    }

    supabaseClient = createClient(validation.config.url, validation.config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })

    return supabaseClient
  } catch (error) {
    console.error("Supabase 클라이언트 생성 오류:", error)
    return null
  }
}

// Supabase 연결 테스트
export const testSupabaseConnection = async (): SupabaseConnectionTest => {
  try {
    console.log("Supabase 연결 테스트 시작...")

    const client = createSupabaseClient()
    if (!client) {
      return {
        connected: false,
        error: "Supabase 클라이언트 생성 실패",
      }
    }

    // 간단한 쿼리로 연결 테스트
    const { data, error, count } = await client.from("users").select("id", { count: "exact", head: true }).limit(1)

    if (error) {
      console.error("Supabase 연결 테스트 오류:", error)
      return {
        connected: false,
        error: error.message,
        details: error,
      }
    }

    console.log("Supabase 연결 테스트 성공")
    return {
      connected: true,
      details: {
        message: "Supabase 연결 성공",
        tableExists: true,
        rowCount: count,
      },
    }
  } catch (error) {
    console.error("Supabase 연결 테스트 예외:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Supabase 연결 테스트 중 알 수 없는 오류",
      details: error,
    }
  }
}

// 사용자 생성/업데이트 (Upsert)
export const upsertUser = async (
  userProfile: UserProfile,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  try {
    console.log("사용자 Upsert 시작:", userProfile)

    const client = createSupabaseClient()
    if (!client) {
      return { success: false, error: "Supabase 클라이언트 생성 실패" }
    }

    const { data, error } = await client
      .from("users")
      .upsert(
        {
          firebase_uid: userProfile.firebase_uid,
          email: userProfile.email,
          phone: userProfile.phone,
          name: userProfile.name,
          phone_verified: userProfile.phone_verified || false,
          email_verified: userProfile.email_verified || false,
          profile_image_url: userProfile.profile_image_url,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "firebase_uid",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single()

    if (error) {
      console.error("사용자 Upsert 오류:", error)
      return { success: false, error: error.message }
    }

    console.log("사용자 Upsert 성공:", data)
    return { success: true, user: data as UserProfile }
  } catch (error) {
    console.error("사용자 Upsert 예외:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 생성/업데이트 중 알 수 없는 오류",
    }
  }
}

// Firebase UID로 사용자 조회
export const getUserByFirebaseUid = async (
  firebaseUid: string,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  try {
    console.log("사용자 조회 시작:", firebaseUid)

    const client = createSupabaseClient()
    if (!client) {
      return { success: false, error: "Supabase 클라이언트 생성 실패" }
    }

    const { data, error } = await client.from("users").select("*").eq("firebase_uid", firebaseUid).single()

    if (error) {
      console.error("사용자 조회 오류:", error)
      if (error.code === "PGRST116") {
        return { success: false, error: "사용자를 찾을 수 없습니다." }
      }
      return { success: false, error: error.message }
    }

    console.log("사용자 조회 성공:", data)
    return { success: true, user: data as UserProfile }
  } catch (error) {
    console.error("사용자 조회 예외:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 조회 중 알 수 없는 오류",
    }
  }
}

// 전화번호로 사용자 조회
export const getUserByPhone = async (
  phone: string,
): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
  try {
    console.log("전화번호로 사용자 조회 시작:", phone)

    const client = createSupabaseClient()
    if (!client) {
      return { success: false, error: "Supabase 클라이언트 생성 실패" }
    }

    const { data, error } = await client.from("users").select("*").eq("phone", phone).single()

    if (error) {
      console.error("전화번호 사용자 조회 오류:", error)
      if (error.code === "PGRST116") {
        return { success: false, error: "해당 전화번호의 사용자를 찾을 수 없습니다." }
      }
      return { success: false, error: error.message }
    }

    console.log("전화번호 사용자 조회 성공:", data)
    return { success: true, user: data as UserProfile }
  } catch (error) {
    console.error("전화번호 사용자 조회 예외:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "전화번호 사용자 조회 중 알 수 없는 오류",
    }
  }
}

// 사용자 목록 조회 (관리자용)
export const getUsers = async (
  limit = 10,
  offset = 0,
): Promise<{ success: boolean; users?: UserProfile[]; total?: number; error?: string }> => {
  try {
    console.log("사용자 목록 조회 시작:", { limit, offset })

    const client = createSupabaseClient()
    if (!client) {
      return { success: false, error: "Supabase 클라이언트 생성 실패" }
    }

    const { data, error, count } = await client
      .from("users")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("사용자 목록 조회 오류:", error)
      return { success: false, error: error.message }
    }

    console.log("사용자 목록 조회 성공:", { count, dataLength: data?.length })
    return {
      success: true,
      users: data as UserProfile[],
      total: count || 0,
    }
  } catch (error) {
    console.error("사용자 목록 조회 예외:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 목록 조회 중 알 수 없는 오류",
    }
  }
}

// 사용자 삭제
export const deleteUser = async (firebaseUid: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("사용자 삭제 시작:", firebaseUid)

    const client = createSupabaseClient()
    if (!client) {
      return { success: false, error: "Supabase 클라이언트 생성 실패" }
    }

    const { error } = await client.from("users").delete().eq("firebase_uid", firebaseUid)

    if (error) {
      console.error("사용자 삭제 오류:", error)
      return { success: false, error: error.message }
    }

    console.log("사용자 삭제 성공:", firebaseUid)
    return { success: true }
  } catch (error) {
    console.error("사용자 삭제 예외:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "사용자 삭제 중 알 수 없는 오류",
    }
  }
}

// Supabase 설정 디버그
export const debugSupabaseConfig = () => {
  const validation = validateSupabaseConfig()

  console.group("🗄️ Supabase 설정 디버그")
  console.log("검증 결과:", validation.isValid ? "✅ 성공" : "❌ 실패")

  if (validation.errors.length > 0) {
    console.log("오류 목록:")
    validation.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`)
    })
  }

  if (validation.config) {
    console.log("설정 정보:")
    console.log(`  URL: ${validation.config.url}`)
    console.log(`  Anonymous Key: ${validation.config.anonKey.substring(0, 20)}...`)
  }

  console.groupEnd()

  return validation
}

// Supabase 클라이언트 내보내기
export { supabaseClient }
