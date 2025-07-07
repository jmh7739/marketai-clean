export interface User {
  id: string
  phone: string
  name?: string
  profileImage?: string
  isVerified: boolean
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface PhoneVerificationState {
  phone: string
  isCodeSent: boolean
  timeLeft: number
  canResend: boolean
  attempts: number
}
