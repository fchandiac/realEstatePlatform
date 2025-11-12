import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Solo aplicar restricciones a rutas del backoffice
    if (pathname.startsWith('/backOffice')) {
      // Verificar autenticación
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      // Verificar rol: solo admin o agente pueden acceder
      if (!token.role || !['admin', 'agente'].includes(token.role)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    // Rutas públicas (portal, etc.) no tienen restricciones
  },
  {
    callbacks: {
      authorized: () => true, // Manejar lógica manualmente en la función middleware
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};