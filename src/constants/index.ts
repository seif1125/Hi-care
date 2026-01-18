
import { 
  MapPin, Phone, Mail, MessageCircle,
  Facebook, Twitter, Instagram, Linkedin,
  Stethoscope, ShieldCheck, Headphones
} from "lucide-react";
export const NAV_LINKS = [
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];


export const featureIconMap = {
  doctors: Stethoscope,
  insurance: ShieldCheck,
  support: Headphones,
};

export const CONTACT_METHODS = [
  { id: 'address', Icon: MapPin, color: "#0d9488" },
  { id: 'phone', Icon: Phone, color: "#0891b2" },
  { id: 'email', Icon: Mail, color: "#0284c7" },
  { id: 'whatsapp', Icon: MessageCircle, color: "#16a34a" },
] as const;

export const BRANCHES = [
  { name_en: "Cairo Branch", name_ar: "فرع القاهره", coords: "30.0444,31.2357" },
  { name_en: "Alexandria Branch", name_ar: "فرع الإسكندرية", coords: "31.2001,29.9187" },
  { name_en: "Dubai Office", name_ar: "مكتب دبي", coords: "25.2048,55.2708" },
] as const;

export const SOCIAL_LINKS = [
  { id: 'facebook', Icon: Facebook, color: "#1877F2", href: "#" },
  { id: 'twitter', Icon: Twitter, color: "#1DA1F2", href: "#" },
  { id: 'instagram', Icon: Instagram, color: "#E4405F", href: "#" },
  { id: 'linkedin', Icon: Linkedin, color: "#0A66C2", href: "#" },
] as const;