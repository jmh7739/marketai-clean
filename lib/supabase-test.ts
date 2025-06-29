import { supabase } from "./supabase-client"

// Supabase 연결 테스트
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Supabase 연결 실패:", error)
      return { success: false, error: error.message }
    }

    console.log("Supabase 연결 성공")
    return { success: true, message: "Supabase 연결 성공" }
  } catch (error) {
    console.error("Supabase 연결 오류:", error)
    return { success: false, error }
  }
}

// 테스트 데이터 삽입
export const testDataInsert = async () => {
  try {
    const testUser = {
      id: "test-user-" + Date.now(),
      phone: "+821012345678",
      name: "테스트 사용자",
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("users").insert([testUser]).select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data, message: "테스트 데이터 삽입 성공" }
  } catch (error) {
    return { success: false, error }
  }
}
