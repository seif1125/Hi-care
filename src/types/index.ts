export interface Testimonial {
  id: string;         // Unique ID from MockAPI
  name: string;       // Person's name (usually remains same in both languages)
  avatar: string;     // URL to the profile image
  
  // Localized Roles
  role_en: string;    // e.g., "Medical Director"
  role_ar: string;    // e.g., "مدير طبي"
  
  // Localized Testimonial Content
  content_en: string; // The English quote
  content_ar: string; // The Arabic quote
}

export interface InsuranceProgram {
  id: string;
  provider_ar: string;
  provider_en: string;
  provider_website_en: string;
  provider_website_ar: string;
  provider_logo: string;
  program_title_ar: string;
  program_title_en: string;
  expiry_date: string;
  price: number;
  coverage_amount: number;
  details_en: string;
  details_ar: string;
}

// Custom type for the Zustand Store
export interface SignupState {
  name: string;
  email: string;
  selectedInsuranceId: string | null;
  hasConsented: boolean;
  setPersonalInfo: (name: string, email: string) => void;
  setInsurance: (id: string) => void;
  setConsent: (consented: boolean) => void;
  resetForm: () => void;
}

export interface InsurancesStepProps {
  programs: InsuranceProgram[];
  selectedId: string | null;
  isRtl: boolean;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}
export interface ConsentStepProps {
  hasConsented: boolean;
  isRtl: boolean;
  onConsentChange: (val: boolean) => void;
  onComplete: () => void;
  onBack: () => void;
}
export interface PersonalInfoStepProps {
  name: string;
  email: string;
  isRtl: boolean;
  onUpdate: (name: string, email: string) => void;
  onNext: () => void;
}
