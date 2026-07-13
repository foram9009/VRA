// middleware.ts
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as string | undefined;

  // ── Route Definitions ──────────────────────────────────────────────────────
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isProtectedRoute = isAdminRoute || isDashboardRoute;
  const isLoginPage = pathname === '/admin/login';

  // ── Rule 1: Unauthenticated users cannot access protected routes ───────────
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.url));
  }

  // ── Rule 2: Authenticated users without ADMIN/EDITOR role are forbidden ────
  // Must come AFTER the unauthenticated check
  if (isProtectedRoute && isLoggedIn) {
    const isAuthorized = userRole === 'ADMIN' || userRole === 'EDITOR';
    if (!isAuthorized) {
      return Response.redirect(new URL('/', req.url));
    }
  }

  // ── Rule 3: Already-logged-in users redirected away from login page ─────────
  // Must come AFTER route protection so authorized users can reach login-redirect
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  // Exclude Next.js internals, static assets, and API routes from middleware
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
