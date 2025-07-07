// Supabase 클라이언트 별칭 파일 생성
export * from "./supabase"

// 추가로 필요한 함수들
export async function updateUser(userId: string, data: any) {
  // supabase.ts의 saveUser 함수 사용
  const { saveUser } = await import("./supabase")
  return saveUser({ id: userId, ...data })
}
