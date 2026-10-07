import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const ROUTE_MAP_DE_EN = {
  "leistungen": "services",
  "kontakt": "contact",
  "impressum": "imprint",
  "datenschutz": "privacy",
};
const ROUTE_MAP_EN_DE = Object.fromEntries(Object.entries(ROUTE_MAP_DE_EN).map(([k, v]) => [v, k]));

// Uploaded brand logos: white variant for dark backgrounds, blue variant for light backgrounds.
const LOGO_WHITE = "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/287789357_Codex-Bild21Sept202614_48_13.png";
const LOGO_BLUE = "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/26a6f1bfc_Codex-Bild21Sept202614_48_00.png";

// Theme of the section currently behind the fixed header. The hero (no id) is dark.
const SECTION_THEME = {
  intro: "light", leistungen: "light", zielgruppen: "light", ablauf: "light",
  unternehmen: "dark", projekte: "light", bewertungen: "light", faq: "light", kontakt: "light",
};

function otherLangUrl(pathname, currentLang) {
  const other = currentLang === "de" ? "en" : "de";
  const map = currentLang === "de" ? ROUTE_MAP_DE_EN : ROUTE_MAP_EN_DE;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${other}`;
  parts[0] = other;
  if (parts[1] && map[parts[1]]) parts[1] = map[parts[1]];
  return "/" + parts.join("/");
}

export default function Header() {
  const { lang, t } = useI18n();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overDark, setOverDark] = useState(true); // section behind header is dark (hero at top)
  const rafRef = useRef(null);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
      // Find the section whose top has crossed the viewport top — that is the
      // section sitting behind the fixed header. The hero has no id and
      // defaults to dark.
      const sections = document.querySelectorAll("main section[id]");
      let theme = "dark";
      for (const sec of sections) {
        const top = sec.getBoundingClientRect().top;
        if (top <= 0) theme = SECTION_THEME[sec.id] ?? "light";
        else break;
      }
      setOverDark(theme === "dark");
    };
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const home = `/${lang}`;
  const navItems = [
    { id: "leistungen", label: t.nav.services },
    { id: "zielgruppen", label: t.nav.audiences },
    { id: "unternehmen", label: t.nav.about },
    { id: "projekte", label: t.nav.projects },
    { id: "bewertungen", label: t.nav.reviews },
    { id: "faq", label: t.nav.faq },
    { id: "kontakt", label: t.nav.contact },
  ];

  // overDark (dark section behind) -> white header, dark text, blue logo.
  // else (light section behind) -> navy header, light text, white logo.
  const textColor = overDark ? "text-navy" : "text-white";
  const subColor = overDark ? "text-navy/80" : "text-white/80";
  const hoverColor = overDark ? "hover:text-navy" : "hover:text-white";
  const langActive = overDark ? "text-navy" : "text-white";
  const langInactive = overDark ? "text-navy/50 hover:text-navy" : "text-white/50 hover:text-white";
  const langSep = overDark ? "text-navy/30" : "text-white/30";
  const menuIcon = overDark ? "text-navy" : "text-white";
  const logoSrc = overDark ? LOGO_BLUE : LOGO_WHITE;
  const bg = overDark ? "rgba(255,255,255,0.92)" : "rgba(8,31,48,0.92)";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md ${scrolled ? "h-16 shadow-[0_1px_0_rgba(8,31,48,0.08)]" : "h-20"}`}
      style={{ backgroundColor: bg }}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to={home} className="flex items-center gap-2.5 group" aria-label="Elektrotechnik Krasniqi">
            <img src={logoSrc} alt="" className="h-9 w-auto" />
            <span className={`font-heading font-semibold text-[15px] tracking-tight ${textColor}`}>Elektrotechnik Krasniqi</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <a key={item.id} href={`${home}#${item.id}`} className={`text-[14px] font-medium ${subColor} ${hoverColor}`}>{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-[13px] font-medium">
              <LangLink target="de" current={lang} href={otherLangUrl(location.pathname, lang)} activeCls={langActive} inactiveCls={langInactive}>DE</LangLink>
              <span className={langSep}>|</span>
              <LangLink target="en" current={lang} href={otherLangUrl(location.pathname, lang)} activeCls={langActive} inactiveCls={langInactive}>EN</LangLink>
            </div>
            <a href={`${home}#kontakt`} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent-blue px-5 py-2.5 text-[13px] font-semibold text-navy hover:bg-[#6f93cc] transition-colors">
              {t.nav.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button className={`lg:hidden p-2 -mr-2 ${menuIcon}`} onClick={() => setMobileOpen((v) => !v)} aria-label="Menü" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className={`lg:hidden border-t ${overDark ? "bg-white border-[rgba(8,31,48,0.08)]" : "bg-navy border-[rgba(255,255,255,0.14)]"}`}>
          <nav className="px-5 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            <div className="flex items-center justify-between py-2">
              <span className={`text-[13px] font-medium ${overDark ? "text-navy/60" : "text-white/60"}`}>{t.nav.langLabel}</span>
              <div className="flex items-center gap-1 text-[13px] font-medium">
                <LangLink target="de" current={lang} href={otherLangUrl(location.pathname, lang)} activeCls={langActive} inactiveCls={langInactive}>DE</LangLink>
                <span className={langSep}>|</span>
                <LangLink target="en" current={lang} href={otherLangUrl(location.pathname, lang)} activeCls={langActive} inactiveCls={langInactive}>EN</LangLink>
              </div>
            </div>
            <div className={`h-px my-1 ${overDark ? "bg-navy/10" : "bg-white/10"}`} />
            {navItems.map((item) => (
              <a key={item.id} href={`${home}#${item.id}`} onClick={() => setMobileOpen(false)} className={`px-1 py-2.5 text-[15px] font-medium ${subColor} ${hoverColor} border-b ${overDark ? "border-[rgba(8,31,48,0.08)]" : "border-[rgba(255,255,255,0.14)]"}`}>{item.label}</a>
            ))}
            <a href={`${home}#kontakt`} onClick={() => setMobileOpen(false)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent-blue px-5 py-3 text-[14px] font-semibold text-navy">
              {t.nav.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function LangLink({ target, current, href, activeCls, inactiveCls, children }) {
  const active = current === target;
  const cls = active ? `${activeCls} underline underline-offset-4` : inactiveCls;
  if (active) return <span className={cls} aria-current="true">{children}</span>;
  return <Link to={href} className={cls}>{children}</Link>;
}