
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly redirect /admin (exactly) to the home page
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Handle sub-paths of /admin
  if (pathname.startsWith('/admin')) {
    // Allow login page access
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Protect other admin routes like /admin/dashboard
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const verified = await verifyJWT(token);
    if (!verified) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
