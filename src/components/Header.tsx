"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDoctorStore } from "@/store/useDoctorStore";
import { useUserStore } from "@/store/useUserStore";
import { useTranslations } from 'next-intl';
import { LogOut, User, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants/index';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');
  
  // Stores
  const { drName, drImage, drId, clearDrAuth } = useDoctorStore();
  const { name: patientName, token: patientToken, setAuth } = useUserStore();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration Fix: Prevents SSR errors with persisted stores
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDoctorPage = pathname.includes('/doctor');
  const isPatientLoggedIn = !!patientToken;
  const isDoctorLoggedIn = isDoctorPage && !!drId;

  const handleLogout = () => {
    if (isDoctorPage) {
      clearDrAuth();
      window.location.href = '/doctor'; 
    } else {
      setAuth("", "", "");
      router.push('/');
    }
  };

  if (!mounted) return null; // Wait for client-side hydration

  return (
    <header className="fixed z-[1000] bg-white/90 backdrop-blur-md top-0 left-0 w-full h-[5rem] flex justify-between items-center px-[1.5rem] md:px-[3rem] border-b-[0.125rem] border-[#f1f5f9]">
      <div className="shrink-0">
        <Link href={isDoctorLoggedIn ? "/doctor" : isPatientLoggedIn ? "/dashboard" : "/"}>
          <Image src="/logo-text.png" alt="Logo" width={140} height={40} priority />
        </Link>
      </div>

      <nav className="hidden lg:flex items-center gap-[2.5rem]">
        {!isDoctorPage && NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-[#475569] hover:text-medical-teal cursor-pointer font-[700] text-[0.935rem]">
            {t(link.key)}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-[0.75rem] md:gap-[1.5rem]">
        <LanguageSwitcher />

        {(isPatientLoggedIn || isDoctorLoggedIn) && (
          <div className="flex items-center gap-[0.75rem]">
            <div className="flex items-center gap-[0.75rem] bg-medical-teal/[0.05] px-[0.75rem] md:px-[1rem] py-[0.5rem] rounded-[1.25rem] border-2 border-medical-teal/[0.1]">
              <div className="relative w-[2.25rem] h-[2.25rem] rounded-full overflow-hidden bg-medical-teal flex items-center justify-center border-2 border-white shadow-sm">
                {(isDoctorLoggedIn && drImage) ? (
                  <Image src={drImage} alt="Dr" fill className="object-cover" />
                ) : (
                  <User size="1.25rem" className="text-white" />
                )}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[0.875rem] font-[900] text-[#134e4a] leading-none">
                  {isDoctorLoggedIn ? drName : patientName}
                </span>
                {isDoctorLoggedIn && (
                  <span className="text-[0.6rem] font-bold text-medical-teal uppercase mt-1 tracking-wider">Medical Provider</span>
                )}
              </div>
            </div>

            <button onClick={handleLogout} className="p-[0.75rem] bg-red-50 text-red-500 rounded-[1.25rem] hover:bg-red-100 transition-all active:scale-95">
              <LogOut size="1.25rem" />
            </button>
          </div>
        )}

        {!isDoctorPage && (
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && !isDoctorPage && (
        <div className="absolute top-[5.1rem] left-0 w-full bg-white border-b border-slate-100 flex flex-col p-8 gap-6 lg:hidden shadow-2xl animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-[1.25rem] font-black text-slate-800" onClick={() => setIsMobileMenuOpen(false)}>
              {t(link.key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}