import Hero from '@/components/Hero';
import { getTranslations } from 'next-intl/server'; 


interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Index({ params }: Props) {
  const { locale } = await params;
  
  
  const t = await getTranslations({ locale, namespace: 'Signup' });

  return (

      <div className=" mx-auto px-4 max-w-2xl">
       
       <Hero/>
      </div>
    
  );
}