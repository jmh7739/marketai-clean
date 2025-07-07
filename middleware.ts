import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 보호할 경로들
const PROTECTED_PATHS = ["/", "/auth", "/sell", "/search", "/category", "/product", "/my-account", "/admin"]

// 허용된 IP 주소들 (필요시 추가)
const ALLOWED_IPS = [
  "127.0.0.1",
  "::1",
  // 여기에 허용할 IP 주소들을 추가하세요
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 접근 게이트 페이지는 항상 허용
  if (pathname === "/access-gate") {
    return NextResponse.next()
  }

  // 정적 파일들은 허용
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next()
  }

  // 보호된 경로인지 확인
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))

  if (isProtectedPath) {
    // 쿠키에서 접근 권한 확인
    const accessGranted = request.cookies.get("access_granted")?.value

    if (!accessGranted) {
      // 접근 권한이 없으면 접근 게이트로 리다이렉트
      return NextResponse.redirect(new URL("/access-gate", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
