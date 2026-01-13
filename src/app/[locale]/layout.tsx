import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string }; // Next.js injects this from the [locale] folder name
}
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  
  // Base URL for your production site
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ; 

  return {
    // 1. Basic Metadata
    title: {
      template: `%s | ${t('title')}`,
      default: `${t('title')} | ${t('slogan')}`,
    },
    description: t('description'),
    keywords: t('keywords'), // e.g., "medical, insurance, doctor, chat, health"
    
    // 2. OpenGraph (Facebook, WhatsApp, LinkedIn)
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Hi-Care',
      images: [
        {
          url: '/public/og-image.png', // Create a 1200x630 image of your logo
          width: 1200,
          height: 630,
          alt: 'Hi-Care Medical Platform',
        },
      ],
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
    },

    // 3. Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/public/og-image.png'],
    },

    // 4. Multi-language Alternates (Crucial for SEO)
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en-US': `${baseUrl}/en`,
        'ar-EG': `${baseUrl}/ar`,
      },
    },

    // 5. Robots & Performance
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
export default async function LocaleLayout({ children, params }: LayoutProps) {
  // Await the params (required in newer Next.js versions)
  const { locale } = await params;

  // Validate that the incoming locale is supported
  const locales = ['en', 'ar'];
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}