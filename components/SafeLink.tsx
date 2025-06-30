"use client"

import Link from "next/link"
import type { ReactNode } from "react"

interface SafeLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function SafeLink({ href, children, className, onClick }: SafeLinkProps) {
  // 외부 링크인지 확인
  const isExternal = href.startsWith("http") || href.startsWith("//")

  // 해시 링크인지 확인
  const isHashLink = href.startsWith("#")

  if (isExternal) {
    return (
      <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  if (isHashLink) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
