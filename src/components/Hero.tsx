"use client";

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('Welcome');

  // Shared classes to reduce redundancy
  const flexCenter = "flex items-center justify-center";

  return (
    <section className={`relative w-full h-[90vh] min-h-[600px] overflow-hidden ${flexCenter}`}>
      {/* Background Section */}
      <div className="absolute h-full w-full inset-0 z-0">
        <Image
          src="/hero-bg.png" 
          alt="Healthcare Background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay - Fixed syntax for Tailwind 4 */}
        <div className="absolute inset-0 bg-linear-to-b from-medical-dark/80 via-medical-dark/60 to-medical-dark/80 backdrop-blur-[2px]" />
      </div>

      {/* Hero Content Container */}
      <div className={` z-10 w-4/5 max-w-4xl px-[1.5rem] text-center flex-col ${flexCenter}`}>
        
        {/* Logo Section */}
        <div className={`mb-[2rem] p-[1rem] bg-white/10 backdrop-blur-md flex-col ${flexCenter}`}>
          <Image 
            src="/logo-text.png" 
            alt="Logo" 
            width={160} 
            height={45} 
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-[2rem] md:text-[3.75rem] font-extrabold text-white mb-[2.25rem] leading-tight">
          {t('title')}
        </h1>

        {/* Description Section */}
        <div className="max-w-2xl mb-[1rem]">
          <p className="text-[1.125rem] md:text-[1.25rem] text-white/90 italic leading-relaxed inline">
            {t('description')}...
          </p>
          <Link 
            href="/about" 
            className="ms-[0.5rem] text-white font-semibold hover:underline underline-offset-4 inline-flex items-center gap-[0.25rem] transition-all"
          >
            {t('readMore')}
          </Link>
        </div>

        {/* Call to Action Button */}
        <Link
          href="/signup"
          className="group relative px-[1.5rem] py-[1rem] bg-medical-teal text-[white] font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-medical-teal/20"
        >
          <div className="relative flex items-center gap-[0.5rem]">
            {t('getStarted')}
            <ArrowRight size={20} className="group-hover:translate-x-[0.25rem] transition-transform" />
          </div>
        </Link>
      </div>
    </section>
  );
}