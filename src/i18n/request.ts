import { getRequestConfig } from 'next-intl/server';

// Define your supported locales as a const to derive types from them
 const locales = ['en', 'ar'] as const;
 type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate and fallback safely
  const locale = await requestLocale;
  const activeLocale = locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : 'ar';

  return {
    locale: activeLocale,
    messages: (await import(`../../messages/${activeLocale}.json`)).default,
    // Setting these helps with date/number formatting performance
    timeZone: 'UTC', 
  };
});