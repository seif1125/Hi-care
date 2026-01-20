import { getTranslations } from "next-intl/server";
import { CONTACT_METHODS, BRANCHES, SOCIAL_LINKS } from "@/constants";
import { ExternalLink } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <main className="bg-[#ffffff] min-h-screen font-sans">
      {/* 1. HERO SECTION */}
      <section className="py-[6rem] px-[1.5rem] bg-linear-to-b from-[#f0fdfa] to-[#ffffff] text-center">
        <div className="max-w-[50rem] mx-auto">
          <h1 className="text-[3rem] md:text-[4.5rem] font-[900] text-[#134e4a] mb-[1.5rem] tracking-[-0.04em] leading-[1.1]">
            {t("title")}
          </h1>
          <p className="text-[1.25rem] text-[#475569] leading-[1.8] font-[400]">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* 2. CONTACT CARDS (Overlapping Hero) */}
   <section className="px-[1.5rem] max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1.5rem] -mt-[4rem]">
  {CONTACT_METHODS.map((method) => {
    const IconComponent = method.Icon;

    // 1. Logic to define values and links based on ID
    let infoValue = "";
    let href = "";

    switch (method.id) {
      case "address":
        infoValue = t("address");
        href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t("address"))}`;
        break;
      case "phone":
        infoValue = "+20 123 456 789";
        href = `tel:${infoValue.replace(/\s/g, "")}`;
        break;
      case "email":
        infoValue = "support@hicare.com";
        href = `mailto:${infoValue}`;
        break;
      case "whatsapp":
        infoValue = "+20 987 654 321";
        // WhatsApp link format: https://wa.me/number
        href = `https://wa.me/${infoValue.replace(/[^0-9]/g, "")}`;
        break;
    }

    return (
      <a 
        key={method.id} 
        href={href}
        target={method.id === 'address' || method.id === 'whatsapp' ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="bg-[#ffffff] p-[2.5rem] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#f1f5f9] flex flex-col items-center text-center group hover:-translate-y-[0.5rem] transition-all duration-300"
      >
        <div 
          className="w-[4.5rem] h-[4.5rem] rounded-[1.5rem] flex items-center justify-center mb-[1.5rem] bg-[#f8fafc] group-hover:bg-medical-teal  group-hover:text-[#ffffff] transition-all duration-500 shadow-sm"
          style={{ '--brand-color': method.color, color: method.color } as React.CSSProperties}
        >
          <IconComponent className="text-medical-teal group-hover:text-[white]" size="2rem" strokeWidth={1.5} />
        </div>
        
        <h3 className="font-[800] text-[#134e4a] text-[1.125rem] mb-[0.5rem] uppercase tracking-wider">
          {t(method.id)}
        </h3>
        
        <p className="text-[#64748b] text-[1rem] font-[500] group-hover:text-medical-teal transition-colors">
          {infoValue}
        </p>
      </a>
    );
  })}
</section>

      {/* 3. BRANCHES SECTION */}
      <section className="py-[8rem] px-[1.5rem] max-w-[85rem] mx-auto">
        <div className="flex flex-col items-start mb-[4rem]">
          <h2 className="text-[2.5rem] font-[900] text-medical-dark mb-[1rem] tracking-tight">{t("branchesTitle")}</h2>
          <div className="h-[0.4rem] w-[5rem] bg-medical-teal rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-[2.5rem]">
          {BRANCHES.map((branch, i) => (
            <div key={i} className="group bg-[#f8fafc] p-[2.5rem] rounded-[2.5rem] border border-[#e2e8f0] hover:border-medical-teal hover:bg-[#ffffff] transition-all duration-500">
              <h3 className="text-[1.5rem] font-[800] text-[#134e4a] mb-[2rem] flex justify-between items-center">
                {locale === 'en' ? branch.name_en : branch.name_ar}
                <div className="p-[0.5rem] bg-[#ccfbf1] text-medical-teal rounded-full">
                  <ExternalLink size="1.25rem" />
                </div>
              </h3>
              <iframe src={`https://maps.google.com/maps?q=${branch.coords}&output=embed`} className="w-full h-[200px] rounded-[1.25rem] border border-[#e2e8f0] mb-[2rem]" title={`Map for ${locale === 'en' ? branch.name_en : branch.name_ar}`}></iframe>
              <a 
                href={`http://maps.google.com/?q=${branch.coords}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[0.75rem] py-[1rem] px-[2rem] bg-medical-teal text-[#ffffff] font-[700] rounded-[1.25rem] shadow-lg shadow-medical-teal/20 hover:bg-[#134e4a] transition-all w-full justify-center"
              >
                {t("viewMap")}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SOCIAL MEDIA SECTION */}
      <section className="py-[7rem] bg-[#134e4a] text-center rounded-t-[4rem]">
        <h2 className="text-[#ffffff] text-[2.25rem] font-[900] mb-[3.5rem] tracking-tight">
          {t("socialTitle")}
        </h2>
        <div className="flex justify-center gap-[2rem] flex-wrap">
          {SOCIAL_LINKS.map((social) => {
            const SocialIcon = social.Icon;
            return (
              <a 
                key={social.id} 
                href={social.href}
                className="w-[4.5rem] h-[4.5rem] bg-[#ffffff]/10 rounded-[1.5rem] flex items-center justify-center text-[#ffffff] border border-[#ffffff]/10 hover:scale-[1.1] hover:bg-[#ffffff] transition-all duration-500 group"
              >
                <div className="group-hover:scale-[1.1] transition-transform" style={{ color: social.color }}>
                  <SocialIcon size="2rem" strokeWidth={2} />
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}