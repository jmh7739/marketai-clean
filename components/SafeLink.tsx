"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"

interface SafeLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const SafeLink: React.FC<SafeLinkProps> = ({ href, children, className, onClick }) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    }

    try {
      router.push(href)
    } catch (error) {
      console.error("Navigation error:", error)
      // 폴백으로 window.location 사용
      window.location.href = href
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default SafeLink
