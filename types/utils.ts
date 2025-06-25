import type React from "react"
// clsx와 tailwind-merge를 위한 타입 정의
export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[]

// 컴포넌트 props를 위한 공통 타입
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// 버튼 variant 타입
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type ButtonSize = "default" | "sm" | "lg" | "icon"

// Badge variant 타입
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"
