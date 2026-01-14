'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    
    // Replace the locale prefix in the current URL
    // e.g., /en/about -> /ar/about
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex cursor-pointer justify-between text-[white]  items-center gap-2 px-[0.5rem] w-full py-[0.5rem] rounded-lg border bg-medical-teal text-white border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all text-sm font-semibold uppercase"
    >
      <Globe size={16} className="text-slate-400 me-[4px] " />
      <span>{locale === 'en' ? 'ع' : 'En'}</span>
    </button>
  );
}