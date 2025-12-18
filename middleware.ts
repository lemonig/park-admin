/*
 * @Author: Jonny
 * @Date: 2025-12-18 17:23:24
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-18 17:24:45
 * @FilePath: \park-web\middleware.ts
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/protected')

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/public/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/protected/:path*'],
}
