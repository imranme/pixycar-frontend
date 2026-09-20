import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Protected routes that require authentication ─────────────────────────────
const SELLER_ROUTES = [
  '/seller',
  '/list-car',
  '/my-listings',
  '/messages',
  '/profile',
];

const DEALER_ROUTES = [
  '/dealer',
];

// ── Routes that logged-in users should NOT see (auth pages) ──────────────────
const AUTH_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

function getTokenFromRequest(request: NextRequest): string | null {
  // Tokens stored in localStorage are NOT accessible in proxy (server-side).
  // We use a lightweight cookie to carry the auth status flag set at login.
  return request.cookies.get('pixycar_auth')?.value ?? null;
}

function getUserRoleFromRequest(request: NextRequest): string | null {
  return request.cookies.get('pixycar_role')?.value ?? null;
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Public routes that should always be accessible ─────────────────────────
  if (pathname.startsWith('/dealer-invite')) {
    return NextResponse.next();
  }

  const token = getTokenFromRequest(request);
  const role = getUserRoleFromRequest(request);
  const isAuthenticated = !!token;

  // ── Redirect logged-in users away from auth pages ────────────────────────
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthPage && isAuthenticated) {
    if (role === 'DEALER') {
      return NextResponse.redirect(new URL('/dealer/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  }

  // ── Protect seller routes ────────────────────────────────────────────────
  const isSellerRoute = matchesRoute(pathname, SELLER_ROUTES);
  if (isSellerRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ── Protect dealer routes ────────────────────────────────────────────────
  const isDealerRoute = matchesRoute(pathname, DEALER_ROUTES);
  if (isDealerRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ── Role-based protection: sellers can't access dealer routes ─────────────
  if (isDealerRoute && isAuthenticated && role === 'SELLER') {
    return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  }

  // ── Role-based protection: dealers can't access seller routes ─────────────
  if (isSellerRoute && isAuthenticated && role === 'DEALER') {
    return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (.png, .jpg, .svg etc.)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};
