import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Reviews section: one large main quote (full width, dark) plus two smaller
// supplementary quotes side by side (stacked on mobile). Quotes are verbatim.
// On the English page the German originals are shown and an accessible toggle
// reveals the English translation so the section does not double in length.
export default function Reviews() {
  const { t } = useI18n();
  const items = t.reviews.items;
  const [main, ...side] = items;

  return (
    <section id="bewertungen" className="bg-white pt-12 sm:pt-20 pb-10 sm:pb-14">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.reviews.eyebrow}</p>
        <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.reviews.title}</h2>
        <div className="mt-4 flex items-center gap-2.5">
          <div className="flex" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-current text-accent-blue" />
            ))}
          </div>
          <span className="text-[14px] font-semibold text-navy">{t.reviews.ratingText}</span>
        </div>

        {/* Main quote — full width, dark */}
        <figure className="mt-10 sm:mt-12 rounded-2xl bg-navy text-white px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <span aria-hidden="true" className="block font-heading text-accent-blue leading-none mb-3" style={{ fontSize: "3.25rem" }}>“</span>
          <blockquote className="font-heading font-medium" style={{ fontSize: "clamp(1.3125rem, 2.4vw, 1.8125rem)", lineHeight: 1.4, maxWidth: "55ch" }}>
            {main.quote}
          </blockquote>
          <TranslationToggle translation={main.translation} label={t.reviews.translationLabel} tone="dark" />
          <figcaption className="mt-7 flex items-center gap-3">
            <span aria-hidden="true" className="w-9 h-9 rounded-full bg-accent-blue text-navy flex items-center justify-center text-[14px] font-semibold">{main.initial}</span>
            <span className="text-[15px] font-semibold text-white">{main.name}</span>
            <a href={main.link} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 text-[13px] font-medium text-accent-blue hover:text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue">
              {t.reviews.linkLabel}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </figcaption>
        </figure>

        {/* Two supplementary reviews */}
        <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {side.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-2xl border hairline bg-[#F3F6FA] p-6 sm:p-8">
              <span aria-hidden="true" className="block font-heading text-brand/30 leading-none mb-2" style={{ fontSize: "2.25rem" }}>“</span>
              <blockquote className="font-medium text-navy whitespace-pre-line" style={{ fontSize: "clamp(1.125rem, 1.6vw, 1.25rem)", lineHeight: 1.45 }}>
                {r.quote}
              </blockquote>
              <TranslationToggle translation={r.translation} label={t.reviews.translationLabel} tone="light" />
              <figcaption className="mt-auto pt-6 flex items-center gap-3">
                <span aria-hidden="true" className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-[13px] font-semibold">{r.initial}</span>
                <span className="text-[14px] font-semibold text-navy">{r.name}</span>
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:text-navy underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
                  {t.reviews.linkLabel}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function TranslationToggle({ translation, label, tone }) {
  const [open, setOpen] = useState(false);
  if (!translation) return null;
  const btn = tone === "dark" ? "text-accent-blue hover:text-white focus-visible:outline-accent-blue" : "text-brand hover:text-navy focus-visible:outline-brand";
  const txt = tone === "dark" ? "text-white/75" : "text-navy/70";
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 ${btn}`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className={`mt-2 text-[14px] leading-relaxed whitespace-pre-line ${txt}`}>{translation}</p>
      )}
    </div>
  );
}