export interface AppError {
  code: string
  message: string
  details?: any
}

export const ErrorCodes = {
  // 네트워크 오류
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",

  // 인증 오류
  AUTH_FAILED: "AUTH_FAILED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  PERMISSION_DENIED: "PERMISSION_DENIED",

  // 데이터 오류
  INVALID_INPUT: "INVALID_INPUT",
  DATA_NOT_FOUND: "DATA_NOT_FOUND",
  DUPLICATE_DATA: "DUPLICATE_DATA",

  // 파일 오류
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  UPLOAD_FAILED: "UPLOAD_FAILED",

  // 서버 오류
  SERVER_ERROR: "SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",

  // 비즈니스 로직 오류
  AUCTION_ENDED: "AUCTION_ENDED",
  BID_TOO_LOW: "BID_TOO_LOW",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
} as const

export const ErrorMessages = {
  [ErrorCodes.NETWORK_ERROR]: "네트워크 연결을 확인해주세요",
  [ErrorCodes.TIMEOUT_ERROR]: "요청 시간이 초과되었습니다",
  [ErrorCodes.AUTH_FAILED]: "인증에 실패했습니다",
  [ErrorCodes.TOKEN_EXPIRED]: "로그인이 만료되었습니다. 다시 로그인해주세요",
  [ErrorCodes.PERMISSION_DENIED]: "접근 권한이 없습니다",
  [ErrorCodes.INVALID_INPUT]: "입력값이 올바르지 않습니다",
  [ErrorCodes.DATA_NOT_FOUND]: "요청한 데이터를 찾을 수 없습니다",
  [ErrorCodes.DUPLICATE_DATA]: "이미 존재하는 데이터입니다",
  [ErrorCodes.FILE_TOO_LARGE]: "파일 크기가 너무 큽니다",
  [ErrorCodes.INVALID_FILE_TYPE]: "지원하지 않는 파일 형식입니다",
  [ErrorCodes.UPLOAD_FAILED]: "파일 업로드에 실패했습니다",
  [ErrorCodes.SERVER_ERROR]: "서버 오류가 발생했습니다",
  [ErrorCodes.DATABASE_ERROR]: "데이터베이스 오류가 발생했습니다",
  [ErrorCodes.AUCTION_ENDED]: "경매가 종료되었습니다",
  [ErrorCodes.BID_TOO_LOW]: "입찰가가 너무 낮습니다",
  [ErrorCodes.INSUFFICIENT_BALANCE]: "잔액이 부족합니다",
}

export const createError = (code: keyof typeof ErrorCodes, details?: any): AppError => {
  return {
    code,
    message: ErrorMessages[code],
    details,
  }
}

export const handleError = (error: any): AppError => {
  console.error("Error occurred:", error)

  // Firebase 오류 처리
  if (error?.code?.startsWith("auth/")) {
    return createError(ErrorCodes.AUTH_FAILED, error)
  }

  // 네트워크 오류 처리
  if (error?.code === "NETWORK_ERROR" || !navigator.onLine) {
    return createError(ErrorCodes.NETWORK_ERROR, error)
  }

  // 기본 서버 오류
  return createError(ErrorCodes.SERVER_ERROR, error)
}
