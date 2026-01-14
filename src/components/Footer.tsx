"use client";

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-[0.25rem] py-[0.375rem] border shadow-lg  bg-[white] shadow-tile">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
        
        {/* Copyright Section */}
        <p className="text-sm text-slate-500">
          © {currentYear} <span className="font-bold text-medical-dark">Hi-Care</span>. {t('allRightsReserved')}
        </p>

        {/* Developer Credit Section */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-medical-dark">
          <span>{t('developedWith')}</span>
          <Heart size={14} className="text-[red] fill-[red] animate-pulse" />
          <span>&nbsp; {t('by')} &nbsp;  </span>
          <a 
            href="https://github.com/seifamr" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded-md  text-medical-teal hover:scale-105 transition-transform"
          >
          {" "+ t('seif')}
          </a>
        </div>

      </div>
    </footer>
  );
}