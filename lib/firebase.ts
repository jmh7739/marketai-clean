// Firebase 더미 구현 - 빌드 오류 방지
const auth: any = null

export const signInWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  if (email === "test@marketai.com" && password === "test1234") {
    return {
      user: {
        uid: "test-user-123",
        email: "test@marketai.com",
        displayName: "테스트 사용자",
      },
    }
  }
  throw new Error("Invalid credentials")
}

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  return {
    user: {
      uid: Date.now().toString(),
      email,
      displayName: "새 사용자",
    },
  }
}

export const signOut = async (auth: any) => {
  return Promise.resolve()
}

export { auth }
export default null
