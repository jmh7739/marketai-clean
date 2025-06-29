import DOMPurify from "isomorphic-dompurify"

// XSS 방지 - HTML 태그 제거
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

// 전화번호 검증
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^010-\d{4}-\d{4}$/
  return phoneRegex.test(phone)
}

// 이메일 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 비밀번호 강도 검증
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "비밀번호는 8자 이상이어야 합니다" }
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: "대소문자와 숫자를 포함해야 합니다" }
  }
  return { isValid: true, message: "안전한 비밀번호입니다" }
}

// SQL 인젝션 방지 - 특수문자 이스케이프
export const escapeSpecialChars = (input: string): string => {
  return input.replace(/['"\\;]/g, "\\$&")
}

// 세션 토큰 생성
export const generateSessionToken = (): string => {
  return crypto.randomUUID()
}

// 입력값 길이 제한
export const limitInputLength = (input: string, maxLength: number): string => {
  return input.slice(0, maxLength)
}

// 가격 검증 (음수, 너무 큰 값 방지)
export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 100000000 // 1억원 이하
}

// 파일 확장자 검증
export const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const extension = filename.split(".").pop()?.toLowerCase()
  return extension ? allowedExtensions.includes(extension) : false
}

// 파일 크기 검증 (MB 단위)
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}
