import { Testimonial } from "@/types";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { featureIconMap } from "@/constants"; // Ensure this is .tsx

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  const baseUrl = process.env.NEXT_PUBLIC_TESTMONIAL_MOCK_API_URL;
  const res = await fetch(baseUrl!, { next: { revalidate: 3600 } });
  const testimonials: Testimonial[] = await res.json();

  return (
    <main className="bg-[#ffffff] min-h-screen">
      {/* 1. HERO SECTION - Using arbitrary spacing and grid-alignment */}
      <section className="py-[7rem] px-[2rem] md:px-[4rem] max-w-[90rem] mx-auto grid md:grid-cols-2 gap-[5rem] items-center">
        <div className="flex flex-col items-start text-start">
          <span className="text-medical-teal font-[700] tracking-[0.2em] uppercase text-[0.875rem] mb-[1rem]">
            {locale === 'ar' ? 'من نحن' : 'About Us'}
          </span>
          <h1 className="text-[3rem] md:text-[4rem] font-[900] text-[#134e4a] leading-[1.1] mb-[2rem] tracking-[-0.03em]">
            {t("title")}
          </h1>
          <p className="text-[1.25rem] text-[#475569] leading-[1.7] mb-[3rem] max-w-[40rem]">
            {t("subtitle")}
          </p>
          
          <div className="w-full grid grid-cols-1 gap-[2.5rem]">
            <div className="group border-s-[5px] border-medical-teal ps-[1.5rem] py-[0.5rem] hover:bg-[#f0fdfa] transition-all duration-300">
              <h3 className="font-[800] text-[1.25rem] text-[#134e4a] mb-[0.5rem]">{t("mission")}</h3>
              <p className="text-[#64748b] text-[1rem] leading-relaxed">{t("missionText")}</p>
            </div>
            <div className="group border-s-[5px] border-medical-teal ps-[1.5rem] py-[0.5rem] hover:bg-[#f0fdfa] transition-all duration-300">
              <h3 className="font-[800] text-[1.25rem] text-[#134e4a] mb-[0.5rem]">{t("vision")}</h3>
              <p className="text-[#64748b] text-[1rem] leading-relaxed">{t("visionText")}</p>
            </div>
          </div>
        </div>
        
        <div className="relative h-[32rem] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(19,78,74,0.3)]">
           <Image 
            src="/about-hero.png"
            alt="Hi-Care Team"
            fill
            className="object-cover scale-[1.02] hover:scale-[1.08] transition-transform duration-1000 ease-in-out"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#134e4a]/60 via-transparent to-transparent z-10" />
        </div>
      </section>

      {/* 2. FEATURES - Tailwind 4 Flex/Grid alignment */}
    <section className="py-[8rem] bg-[#f8fafc] border-y border-[#e2e8f0]">
  <div className="max-w-[90rem] mx-auto px-[2rem]">
    <div className="flex flex-col items-center text-center mb-[6rem]">
      <h2 className="text-[2.5rem] font-[900] text-medical-dark mb-[1.5rem]">{t("featuresTitle")}</h2>
      <div className="h-[0.35rem] w-[5rem] bg-medical-teal rounded-full" />
    </div>

    <div className="grid md:grid-cols-3 gap-[3rem]">
  {["doctors", "insurance", "support"].map((key) => {
    // 1. Logic inside the map requires curly braces and a return
    const IconComponent = featureIconMap[key as keyof typeof featureIconMap];

    return (
      <div 
        key={key} 
        className="bg-[#ffffff] p-[2.5rem] rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-[#f1f5f9] hover:border-[#0d9488] hover:-translate-y-[0.75rem] transition-all duration-500 group"
      >
        {/* Header: Icon beside Title */}
        <div className="flex items-center gap-[1.25rem] mb-[1.75rem]">
          <div className="w-[4rem] h-[4rem] bg-[#f0fdfa] text-[#0d9488] rounded-[1.25rem] flex items-center justify-center group-hover:bg-[#0d9488] group-hover:text-[#ffffff] transition-colors duration-500 shadow-sm shrink-0">
            {/* 2. Render as a Component tag */}
            <IconComponent size="1.75rem" strokeWidth={1.5} />
          </div>
          <h3 className="text-[1.5rem] font-[800] text-[#134e4a] leading-[1.2]">
            {t(`features.${key}`)}
          </h3>
        </div>

        {/* Description underneath */}
        <p className="text-[#64748b] leading-[1.8] text-[1.125rem]">
          {t(`features.${key}Text`)}
        </p>
      </div>
    );
  })}
</div>
  </div>
</section>

      {/* 3. TESTIMONIALS - Enhanced Card UI */}
      <section className="py-[8rem] px-[2rem]">
        <div className="max-w-[90rem] mx-auto">
          <h2 className="text-[2.5rem] font-[900] text-center text-medical-dark mb-[6rem] tracking-tight">
            {t("testimonialsTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[2.5rem]">
            {testimonials.map((item) => (
              <div key={item.id} className="relative p-[3rem] rounded-[3rem] bg-[#ffffff] border border-[#f1f5f9] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute -top-[1rem] -right-[1rem] w-[6rem] h-[6rem] bg-[#f0fdfa] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <p className="relative z-10 text-[#334155] italic mb-[3rem] text-[1.125rem] leading-[1.9] font-[500]">
                  "{locale === "ar" ? item.content_ar : item.content_en}"
                </p>
                
                <div className="relative z-10 flex items-center gap-[1.5rem]">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-[4rem] h-[4rem] rounded-full object-cover border-[3px] border-medical-teal/20 group-hover:border-medical-teal transition-colors duration-300"
                  />
                  <div className="flex flex-col">
                    <span className="font-[800] text-medical-dark text-[1.125rem]">{item.name}</span>
                    <span className="text-medical-teal text-[0.875rem] font-[700] uppercase tracking-[0.1em] mt-[0.25rem]">
                      {locale === "ar" ? item.role_ar : item.role_en}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}