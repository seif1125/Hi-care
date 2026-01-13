import { getTranslations } from 'next-intl/server'; // Use the server version
// import StepOne from '@/components/signup/StepOne';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Index({ params }: Props) {
  const { locale } = await params;
  
  // Notice: We use getTranslations (async) instead of useTranslations (hook)
  const t = await getTranslations({ locale, namespace: 'Signup' });

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-teal-900 tracking-tight">
             {t('title')}
          </h1>
          <p className="mt-2 text-slate-600">{t('step1')}</p>
        </header>
        
     {/* <StepOne /> */}
      </div>
    </main>
  );
}