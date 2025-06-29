import { auth } from "./firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

// Firebase 연결 테스트
export const testFirebaseConnection = async () => {
  try {
    console.log("Firebase Auth 연결 테스트:", auth.app.name)
    console.log("Firebase 프로젝트 ID:", auth.app.options.projectId)
    return { success: true, message: "Firebase 연결 성공" }
  } catch (error) {
    console.error("Firebase 연결 실패:", error)
    return { success: false, error }
  }
}

// 전화번호 인증 테스트 (실제 번호로 테스트)
export const testPhoneAuth = async (phoneNumber: string) => {
  try {
    // reCAPTCHA 설정
    if (typeof window !== "undefined") {
      const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA 인증 완료")
        },
      })

      // 전화번호 인증 시작
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      console.log("인증번호 발송 성공:", confirmationResult.verificationId)

      return {
        success: true,
        verificationId: confirmationResult.verificationId,
        message: "인증번호가 발송되었습니다.",
      }
    }
  } catch (error) {
    console.error("전화번호 인증 실패:", error)
    return { success: false, error }
  }
}
