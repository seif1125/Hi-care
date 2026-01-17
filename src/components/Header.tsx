"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants/index';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  
  // Design Constants (Extracted for readability)
  const headerStyles = "fixed z-1000 bg-[white] top-0 left-0 w-full h-[5rem] flex justify-between items-center z-50 bg-white/90 backdrop-blur-md px-6 md:px-12 shadow-lg shadow-tile transition-all border-0 px-[0.25rem] py-[0.375rem]";
  const navLinkStyles = "text-slate-600 mx-[0.5rem] hover:text-medical-teal cursor-pointer font-medium transition-colors";
  const mobileLinkStyles = "text-2xl text-center w-full font-bold text-slate-800 border-b border-b-medical-teal py-2 cursor-pointer hover:text-medical-teal transition-all";

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={headerStyles}>
        {/* Logo Section */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-text.png" 
              alt="Hi-Care Logo" 
              width={140} 
              height={40} 
              className="object-contain"
              priority 
            />
          </Link>
        </div>

        {/* Navigation & Tools Section */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop View */}
          <nav className="hidden md:flex items-center gap-8 mr-12">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkStyles}>
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Tools Division */}
          <div className="flex items-center gap-[0.375rem]">
            <LanguageSwitcher />
            
            {/* Burger Menu Button */}
            <button 
              aria-label="Toggle Menu"
              className="md:hidden p-2 bg-medical-dark text-medical-teal rounded-[0.75rem] transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {/* Performance Fix: Using opacity and pointer-events instead of hard conditional rendering for animations */}
      <div 
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-sm md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full justify-start items-center p-8 pt-24 gap-6">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={closeMenu}
              className={mobileLinkStyles}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}