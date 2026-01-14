import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // This prevents the app from losing the /ar/ prefix
  localePrefix: 'always' 
});

// Export localized versions of these hooks/components
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);