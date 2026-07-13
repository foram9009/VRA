// middleware.ts
import NextAuth from 'next-auth';
import { auth } from '@/lib/auth'; // Import the specific auth function

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnProtectedRoute = req.nextUrl.pathname.startsWith('/admin');
  
  // Allow access to login page even if logged in (redirects happen naturally via UI usually, or force redirect to dashboard)
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isOnProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.url));
  }

  // Basic role check logic (refined for robustness)
  if (isOnProtectedRoute && isLoggedIn) {
    const userRole = req.auth?.user?.role;
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      return Response.redirect(new URL('/', req.url));
    }
  }

  // Redirect logged in users away from login page to dashboard
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
