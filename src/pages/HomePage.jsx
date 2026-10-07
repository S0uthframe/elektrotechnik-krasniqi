import React, { useEffect } from "react";
import { Phone, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import HeroScroll from "@/components/HeroScroll";
import ServicesList from "@/components/ServicesList";
import ProjectsMarquee from "@/components/ProjectsMarquee";
import FaqAccordion from "@/components/FaqAccordion";
import ContactForm from "@/components/ContactForm";
import Reviews from "@/components/Reviews";

const PHONE_HREF = "tel:+491604141186";

export default function HomePage() {
  const { lang, t } = useI18n();

  useEffect(() => {
    document.title = t.meta.homeTitle;
    const upsert = (sel, createKey, createVal, content) => {
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(createKey, createVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    upsert('meta[name="description"]', "name", "description", t.meta.homeDesc);
    upsert('meta[property="og:title"]', "property", "og:title", t.meta.homeTitle);
    upsert('meta[property="og:description"]', "property", "og:description", t.meta.homeDesc);
    upsert('meta[property="og:locale"]', "property", "og:locale", lang === "de" ? "de_DE" : "en_US");
    document.documentElement.lang = lang;
  }, [lang, t]);

  // Scroll to a specific service entry within the services section.
  const openServiceAndScroll = (key) => {
    setTimeout(() => {
      const el = document.getElementById(`svc-${key}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        const sec = document.getElementById("leistungen");
        if (sec) {
          const top = sec.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    }, 60);
  };

  return (
    <main>
      <HeroScroll />

      {/* ===== EINFÜHRUNG ===== */}
      <section id="intro" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.intro.eyebrow}</p>
          <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.intro.title}</h2>
          <div className="mt-6 w-12 h-px bg-brand" />
          <div className="mt-6 max-w-2xl space-y-5">
            {t.intro.paragraphs.map((p, i) => <p key={i} className="text-[16px] leading-relaxed text-navy/75">{p}</p>)}
          </div>
        </div>
      </section>

      {/* ===== LEISTUNGEN (Accordion) ===== */}
      <section id="leistungen" className="bg-[#F6F8FB] py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.services.eyebrow}</p>
          <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.services.title}</h2>
          <div className="mt-10">
            <ServicesList />
          </div>
        </div>
      </section>

      {/* ===== ZIELGRUPPEN ===== */}
      <section id="zielgruppen" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.audiences.eyebrow}</p>
          <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.audiences.title}</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { key: "private", group: t.audiences.private },
              { key: "business", group: t.audiences.business },
            ].map(({ key, group }) => (
              <div key={key}>
                <h3 className="font-heading font-semibold text-[20px] text-navy">{group.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-navy/70">{group.text}</p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                  {group.links.map((skey) => (
                    <button
                      key={skey}
                      type="button"
                      onClick={() => openServiceAndScroll(skey)}
                      className="text-[14px] font-medium text-brand hover:text-navy underline underline-offset-4 decoration-[rgba(7,82,125,0.3)]"
                    >
                      {t.services.items[skey].title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJEKTABLAUF ===== */}
      <section id="ablauf" className="bg-[#F6F8FB] py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.process.eyebrow}</p>
          <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.process.title}</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.process.steps.map((s, i) => (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-[14px] font-semibold">{i + 1}</span>
                  <h3 className="font-heading font-semibold text-[18px] text-navy">{s.title}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-navy/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UNTERNEHMEN ===== */}
      <section id="unternehmen" className="bg-navy text-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-accent-blue">{t.about.eyebrow}</p>
          <h2 className="mt-4 font-heading font-semibold tracking-tight text-white leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.about.title}</h2>
          <div className="mt-6 w-12 h-px bg-accent-blue" />
          <div className="mt-6 max-w-2xl space-y-5">
            {t.about.paragraphs.map((p, i) => <p key={i} className="text-[16px] leading-relaxed text-white/75">{p}</p>)}
          </div>
        </div>
      </section>

      {/* ===== PROJEKTE ===== */}
      <ProjectsMarquee />

      {/* ===== KUNDENSTIMMEN ===== */}
      <Reviews />

      {/* ===== FAQ ===== */}
      <section id="faq" className="bg-[#F6F8FB] py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.faq.eyebrow}</p>
          <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.faq.title}</h2>
          <div className="mt-10">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* ===== KONTAKT ===== */}
      <section id="kontakt" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.contact.eyebrow}</p>
            <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.contact.title}</h2>
            <div className="mt-6 w-12 h-px bg-brand" />
            <p className="mt-6 text-[16px] leading-relaxed text-navy/70 max-w-sm">{t.contact.text}</p>
            <div className="mt-7">
              <a href={PHONE_HREF} className="inline-flex items-center gap-2 rounded-full bg-accent-blue px-7 py-3.5 text-[14px] font-semibold text-navy hover:bg-[#9bb9e4] transition-colors">
                <Phone className="w-4 h-4" />
                {t.contact.ctaCall}
              </a>
            </div>
            <div className="mt-8 space-y-4">
              <a href={PHONE_HREF} className="flex items-center gap-3 group">
                <span className="w-9 h-9 rounded-md border hairline flex items-center justify-center text-brand"><Phone className="w-4 h-4" /></span>
                <span>
                  <span className="block text-[11px] text-navy/45">{t.contact.phoneLabel}</span>
                  <span className="text-[15px] text-navy group-hover:text-brand">{t.contact.phoneValue}</span>
                </span>
              </a>
              <a href="mailto:info@elektro-krasniqi.de" className="flex items-center gap-3 group">
                <span className="w-9 h-9 rounded-md border hairline flex items-center justify-center text-brand"><Mail className="w-4 h-4" /></span>
                <span>
                  <span className="block text-[11px] text-navy/45">{t.contact.emailLabel}</span>
                  <span className="text-[15px] text-navy group-hover:text-brand">{t.contact.emailValue}</span>
                </span>
              </a>
            </div>
            <div className="mt-8 pt-6 border-t hairline">
              <p className="font-heading font-semibold text-[15px] text-navy">{t.contact.addressName}</p>
              <p className="mt-1 text-[15px] text-navy/70">{t.contact.street}</p>
              <p className="text-[15px] text-navy/70">{t.contact.city}</p>
              <p className="mt-2 text-[14px] text-navy/60">{t.contact.hours}</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}