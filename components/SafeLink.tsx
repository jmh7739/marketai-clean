"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"

interface SafeLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function SafeLink({ href, children, className, onClick, ...props }: SafeLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
    }

    // 외부 링크인 경우 새 탭에서 열기
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      e.preventDefault()
      window.open(href, "_blank", "noopener,noreferrer")
      return
    }

    // 내부 링크는 Next.js 라우터 사용
    if (href.startsWith("/")) {
      e.preventDefault()
      router.push(href)
      return
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
