import React from "react";
import { useI18n } from "@/lib/i18n";
import { SOFORTBILDER } from "@/lib/sofortbilder";

export default function ProjectsMarquee() {
  const { t } = useI18n();
  const items = t.projects.items;
  const loop = [...items, ...items];

  return (
    <section id="projekte" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <p className="text-[12px] font-semibold tracking-[0.18em] text-brand">{t.projects.eyebrow}</p>
        <h2 className="mt-4 font-heading font-semibold tracking-tight text-navy leading-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>{t.projects.title}</h2>
        <div className="mt-4 w-12 h-px bg-brand" />
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-navy/70">{t.projects.subtitle}</p>
      </div>

      <div
        className="marquee-pause mt-12 overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          maskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee items-center">
          {loop.map((it, i) => (
            <figure key={i} className="shrink-0 mr-3">
              <img
                src={`/media/${it.src}-600h.webp`}
                srcSet={`/media/${it.src}-300h.webp 1x, /media/${it.src}-600h.webp 2x`}
                style={{ backgroundImage: `url(${SOFORTBILDER[it.src]})`, backgroundSize: "cover" }}
                alt={it.alt}
                loading="lazy"
                decoding="async"
                className="h-56 sm:h-64 md:h-72 w-auto rounded-xl"
              />
              {it.caption && (
                <figcaption className="mt-2 text-[13px] font-medium tracking-wide text-navy/60">{it.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}