import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});
 
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};