import React, { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function ImprintPage() {
  const { lang, t } = useI18n();
  useEffect(() => {
    document.title = `${t.footer.imprint} – Elektrotechnik Krasniqi`;
    document.documentElement.lang = lang;
  }, [lang, t]);

  return (
    <main className="bg-white pt-28 sm:pt-32">
      <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="font-heading font-bold tracking-tight text-navy" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.imprint.title}</h1>
        <div className="mt-5 w-12 h-px bg-brand" />

        <div className="mt-8 space-y-6 text-[15px] text-navy/75 leading-relaxed">
          <div>
            <p className="text-[12px] font-semibold tracking-wide text-navy/45">{lang === "de" ? "Anbieter" : "Provider"}</p>
            <p className="mt-1 font-medium text-navy">{t.imprint.name}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold tracking-wide text-navy/45">{lang === "de" ? "Anschrift" : "Address"}</p>
            <p className="mt-1 text-navy">Brachweg 5</p>
            <p className="text-navy">Alteglofsheim</p>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-[12px] font-semibold tracking-wide text-navy/45">{t.imprint.phone}: </span>
              <a href="tel:+491604141186" className="text-navy hover:text-brand">+49 160 4141186</a>
            </div>
            <div>
              <span className="text-[12px] font-semibold tracking-wide text-navy/45">{t.imprint.email}: </span>
              <a href="mailto:info@elektro-krasniqi.de" className="text-navy hover:text-brand">info@elektro-krasniqi.de</a>
            </div>
            <div>
              <span className="text-[12px] font-semibold tracking-wide text-navy/45">{lang === "de" ? "Öffnungszeiten" : "Opening hours"}: </span>
              <span className="text-navy">{lang === "de" ? "Montag–Samstag: 07:00–19:00 Uhr" : "Monday–Saturday: 7 am–7 pm"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}