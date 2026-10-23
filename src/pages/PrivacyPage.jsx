import React, { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function PrivacyPage() {
  const { lang, t } = useI18n();
  useEffect(() => {
    document.title = `${t.footer.privacy} – Elektrotechnik Krasniqi`;
    document.documentElement.lang = lang;
  }, [lang, t]);

  return (
    <main className="bg-white pt-28 sm:pt-32">
      <div className="mx-auto max-w-[820px] px-5 sm:px-8 py-12 sm:py-16">
        <h1 className="font-heading font-bold tracking-tight text-navy" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.privacy.title}</h1>
        <div className="mt-5 w-12 h-px bg-brand" />
        <p className="mt-6 text-[15px] text-navy/60 leading-relaxed">{t.privacy.intro}</p>

        <div className="mt-10 space-y-8">
          {t.privacy.sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-heading font-semibold text-[18px] text-navy">{s.h}</h2>
              {/* Ein Abschnitt darf mehrere Absaetze haben. Ein Rechtstext in
                  je einem Block je Thema ist sonst kaum lesbar. */}
              {(Array.isArray(s.p) ? s.p : [s.p]).map((absatz, j) => (
                <p key={j} className="mt-2 text-[15px] text-navy/70 leading-relaxed">{absatz}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}