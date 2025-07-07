import type React from "react"
import { Header } from "@/components/Header"

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
    </div>
  )
}
