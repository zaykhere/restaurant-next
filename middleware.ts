import { verifyJwt } from '@/utils/auth';
import { prisma } from '@/utils/connect';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes (login, register, etc.)
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Extract the Bearer token

  if (!token) {
    // If no token, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = verifyJwt(token);

  if (!decoded) {
    // If JWT is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Fetch the user from the database using the decoded `id` from JWT
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    // If the user doesn't exist in the database, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Optionally attach user data to the request headers (if needed for your logic)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', user.id);

  //  const userId = req.headers.get('x-user-id');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*'], // secure these routes
};
