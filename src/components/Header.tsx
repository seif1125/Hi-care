"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X, Calendar, User } from 'lucide-react';
import { NAV_LINKS } from '@/constants/index';
import { useUserStore } from "@/store/useUserStore";
import { useAppointmentStore } from "@/store/useAppointmentsStore";
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Stores
  const { name } = useUserStore();
  const { appointments } = useAppointmentStore();

  // Flag: Detect if we are in the dashboard route
  const isDashboard = pathname.includes('/dashboard');

  const navLinkStyles = "text-[#475569] mx-[0.5rem] hover:text-medical-teal cursor-pointer font-[600] transition-colors";

  return (
    <>
      <header className="fixed z-1000 bg-[#ffffff]/90 backdrop-blur-[0.5rem] top-0 left-0 w-full h-[5rem] flex justify-between items-center px-[1.5rem] md:px-[3rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] border-b-[0.125rem] border-[#f1f5f9] transition-all">
        {/* Logo Section */}
        <div className="shrink-0">
          <Link href={isDashboard ? "/dashboard" : "/"} className="flex items-center">
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
        <div className="flex items-center gap-[1rem] md:gap-[2rem]">
          
          {/* 1. PUBLIC NAV: Show only if NOT on dashboard */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-[2rem] mr-[3rem]">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkStyles}>
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          )}

          {/* 2. DASHBOARD TOOLS: Show only if ON dashboard */}
          {isDashboard && (
            <div className="hidden md:flex items-center gap-[1.5rem] pr-[1.5rem]">
              {/* Appointments Icon */}
              <Link href="/dashboard/appointments" className="relative p-[0.625rem] bg-[#f8fafc] rounded-[1rem] text-[#64748b] hover:text-medical-teal transition-all group">
                <Calendar size="1.5rem" />
                {appointments.length > 0 && (
                  <span className="absolute -top-[0.25rem] -right-[0.25rem] bg-[#ef4444] text-white text-[0.65rem] font-[900] min-w-[1.25rem] h-[1.25rem] flex items-center justify-center rounded-full border-[0.125rem] border-white px-[0.125rem]">
                    {appointments.length}
                  </span>
                )}
              </Link>

              {/* User Profile Tag */}
              <div className="flex items-center gap-[0.75rem] bg-[#134e4a]/[0.05] px-[1rem] py-[0.5rem] rounded-[1.25rem] border-2 border-[#134e4a]/[0.1]">
                <div className="w-[2rem] h-[2rem] bg-medical-teal rounded-full flex items-center justify-center text-white">
                  <User size="1.125rem" />
                </div>
                <span className="text-[0.875rem] font-[800] text-[#134e4a] max-w-[8rem] truncate">
                  {name || "User"}
                </span>
              </div>
            </div>
          )}

          {/* Shared Tools (Always Visible) */}
          <div className="flex items-center gap-[0.5rem]">
            <LanguageSwitcher />
            
            <button 
              className="md:hidden p-[0.5rem] bg-[#f8fafc] text-medical-teal rounded-[0.75rem]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Responsive Logic) */}
      <div className={`fixed inset-0 z-900 bg-white/95 backdrop-blur-md md:hidden transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
        <div className="flex flex-col h-full pt-[7rem] px-[2rem] gap-[1.5rem]">
          {isDashboard ? (
            // Mobile Dashboard Menu
            <>
              <div className="flex items-center gap-[1rem] p-[1.5rem] bg-slate-50 rounded-[1.5rem]">
                <div className="w-[3.5rem] h-[3.5rem] bg-medical-teal rounded-full flex items-center justify-center text-white font-[900] text-[1.25rem]">
                  {name?.charAt(0) || 'U'}
                </div>
                <p className="font-[900] text-[#134e4a] text-[1.125rem]">{name || 'User'}</p>
              </div>
              <Link href="/dashboard/appointments" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-[1.5rem] bg-white border-2 border-slate-100 rounded-[1.5rem] font-[800] text-[#475569]">
                <div className="flex items-center gap-[1rem]"><Calendar size="1.25rem" /></div>
                <span className="bg-[#ef4444] text-white px-[0.625rem] py-[0.125rem] rounded-full text-[0.75rem]">{appointments.length}</span>
              </Link>
            </>
          ) : (
            // Mobile Public Menu
            NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-[1.5rem] text-center w-full font-[800] text-[#1e293b] border-b-2 border-[#2dd4bf] py-[0.5rem]">
                {t(link.key)}
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}