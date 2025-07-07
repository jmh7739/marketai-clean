"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"

interface SafeLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string
  children: React.ReactNode
  className?: string
}

export function SafeLink({ href, children, className, ...props }: SafeLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

export default SafeLink
