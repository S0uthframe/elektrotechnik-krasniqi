import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import Logo from "@/components/Logo";

const SERVICE_KEYS = [
  "elektroinstallation", "smart-home", "solarinstallation",
  "medientechnik", "beleuchtung", "wartung-reparatur", "e-ladestationen",
];

export default function Footer() {
  const { lang, t } = useI18n();
  const home = `/${lang}`;
  const imprintSlug = lang === "de" ? "impressum" : "imprint";
  const privacySlug = lang === "de" ? "datenschutz" : "privacy";

  const navItems = [
    { id: "leistungen", label: t.nav.services },
    { id: "zielgruppen", label: t.nav.audiences },
    { id: "unternehmen", label: t.nav.about },
    { id: "bewertungen", label: t.nav.reviews },
    { id: "faq", label: t.nav.faq },
    { id: "kontakt", label: t.nav.contact },
  ];

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              {/* Bis hierher stand eine nachgezeichnete Platzhalter-Grafik aus der
                  Vorlage — ein Quadrat mit angedeutetem Dach, nicht die Marke.
                  Jetzt dieselbe Vektorfassung wie in der Kopfleiste, in Weiss
                  auf dem dunklen Grund. */}
              <Logo className="h-8 w-auto" style={{ color: "#ffffff" }} />
              <span className="font-heading font-semibold text-[15px]">Elektrotechnik Krasniqi</span>
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-white/60 max-w-sm">{t.footer.tagline}</p>
            <div className="mt-6 space-y-1.5 text-[14px]">
              <a href="tel:+491604141186" className="block text-white/80 hover:text-white">+49 160 4141186</a>
              <a href="mailto:info@elektro-krasniqi.de" className="block text-white/80 hover:text-white">info@elektro-krasniqi.de</a>
            </div>
          </div>

          <div className="md:col-span-4">
            <p className="text-[11px] font-semibold tracking-wider text-white/60">{t.footer.nav}</p>
            <ul className="mt-4 grid grid-cols-2 gap-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}><a href={`${home}#${item.id}`} className="text-[14px] text-white/75 hover:text-white">{item.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold tracking-wider text-white/60">{t.footer.legal}</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to={`${home}/${imprintSlug}`} className="text-[14px] text-white/75 hover:text-white">{t.footer.imprint}</Link></li>
              <li><Link to={`${home}/${privacySlug}`} className="text-[14px] text-white/75 hover:text-white">{t.footer.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] text-white/60">© {new Date().getFullYear()} Elektrotechnik Krasniqi</p>
          {/* Hinweis auf das illustrative Motiv und der Agenturnachweis stehen
              zusammen rechts; auf schmalen Bildschirmen untereinander, damit
              die Zeile nicht umbricht. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[12px] text-white/60">
            <span>{t.footer.designNote}</span>
            <span aria-hidden="true" className="hidden sm:inline text-white/25">·</span>
            <span>
              {t.footer.agencyPrefix}{" "}
              <a
                href="https://www.southframe.de/"
                rel="noopener"
                className="text-white/75 underline underline-offset-2 decoration-white/30 hover:text-white hover:decoration-white/70 transition-colors"
              >
                {t.footer.agencyName}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}