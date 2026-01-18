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