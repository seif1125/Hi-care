import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import '../globals.css';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer';
// import Footer from '@/components/Footer'; // Ensure path is correct

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Updated to Promise for Next.js 15
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: `${t('title')} | ${t('slogan')}`,
    },
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Hi-Care',
      images: [
        {
          url: '/og-image.png', 
          width: 1200,
          height: 630,
          alt: 'Hi-Care Medical Platform',
        },
      ],
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og-image.png'], 
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en-US': `${baseUrl}/en`,
        'ar-EG': `${baseUrl}/ar`,
      },
    },
  };
}

export default async function LocaleLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ locale: string }> 
}) {
  
  const { locale } = await params;

  
  const messages = await getMessages();

 return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* min-h-screen: Ensures the body is at least as tall as the screen
          flex flex-col: Allows children to behave as flex items
      */}
      <body className="min-h-screen flex flex-col bg-white">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          
          {/* flex-grow: This is the magic. It tells the main section to 
              expand and fill all available space, pushing the footer down.
          */}
          <main className="grow pt-[5rem]">
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}