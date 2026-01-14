import { getTranslations } from 'next-intl/server'; 


interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Index({ params }: Props) {
  const { locale } = await params;
  
  
  const t = await getTranslations({ locale, namespace: 'Signup' });

  return (

      <div className=" mx-auto px-4 max-w-2xl">
       
          <h1 className="text-4xl font-extrabold text-teal-900 tracking-tight">
             {t('title')}
          </h1>
          <p className="mt-2 text-slate-600">{t('step1')}</p>
        
        
     {}
      </div>
    
  );
}