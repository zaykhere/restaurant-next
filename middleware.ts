import { verifyJwt } from '@/utils/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  const isAuthenticated = token && verifyJwt(token);
//   const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Optional: define which routes to apply middleware to
export const config = {
  matcher: ['/dashboard/:path*'],
};
