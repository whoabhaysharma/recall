import { NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/app', '/app/'];

// Routes that should redirect to app if already authenticated
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

export function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Get session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  
  // Check if the user is authenticated (just check for cookie presence)
  // Note: We can't verify the token in middleware due to Edge runtime limitations
  const isAuthenticated = !!sessionCookie;
  
  // Handle protected routes (redirect to login if not authenticated)
  if (PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('Redirecting unauthenticated user from protected route to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
  
  // Handle auth routes (redirect to app if already authenticated)
  if (AUTH_ROUTES.some(route => path === route)) {
    if (isAuthenticated) {
      console.log('Redirecting authenticated user from auth route to app');
      return NextResponse.redirect(new URL('/app', request.url));
    }
    return NextResponse.next();
  }
  
  // For all other routes, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add routes that should be handled by the middleware
    '/app',
    '/app/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
}; 