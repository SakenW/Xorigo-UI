import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // 页面重构重定向配置
  const redirects: Record<string, string> = {
    '/adoption': '/docs/getting-started',
    '/tokens': '/docs/tokens',
    '/layout-demo': '/workbench?mode=gallery&component=layout',
    // 临时重定向，帮助用户适应新的路由结构 - 避免链式重定向，直接指向最终目标
    '/dashboard': '/workbench?mode=gallery',
  }

  // 检查是否需要重定向
  const redirectPath = redirects[request.nextUrl.pathname]
  if (redirectPath) {
    url.pathname = redirectPath
    return NextResponse.redirect(url, 301)
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
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}