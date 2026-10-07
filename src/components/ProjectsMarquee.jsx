import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cdnSrc, onCdnError } from "@/lib/cdn-image";

// Das Laufband verdoppelt seine Inhalte, damit der Umlauf nahtlos ist. Damit
// stand auch das Video zweimal auf der Seite — zwei <video autoplay> auf
// dieselbe Adresse, beide gleichzeitig gestartet, bevor eines im Cache war:
// 7,5 MB wurden zweimal geladen, zusammen 15 der 17,7 MB der ganzen Seite.
//
// Dagegen zwei Dinge: Das Video laedt erst, wenn das Laufband in Sichtweite
// kommt (preload="none" plus IntersectionObserver), und die zweite Fassung
// bekommt ihre Adresse erst, wenn die erste geladen ist — dann bedient der
// Cache sie, statt ein zweites Mal herunterzuladen.
function MarqueeVideo({ src, alt, deferUntil, onReady }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const active = visible && deferUntil;

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      aria-label={alt}
      muted
      loop
      autoPlay
      playsInline
      preload="none"
      // Auch bei einem Fehler freigeben: sonst bliebe die zweite Fassung
      // dauerhaft ohne Quelle und im Laufband klaffte eine Luecke.
      onLoadedData={onReady}
      onError={onReady}
      className="h-56 sm:h-64 md:h-72 w-auto rounded-xl bg-navy/5"
    />
  );
}

// Infinite horizontal marquee of project photos (and one video), scrolling
// left to right. Content is duplicated so translateX(-50%) loops seamlessly.
// Pauses on hover; disabled (static) for reduced-motion users.
export default function ProjectsMarquee() {
  const { t } = useI18n();
  const items = t.projects.items;
  const loop = [...items, ...items];
  // Erst wenn die erste Fassung des Videos geladen ist, bekommt die zweite
  // ihre Adresse — so kommt sie aus dem Cache statt aus dem Netz.
  const [firstVideoReady, setFirstVideoReady] = useState(false);
  const firstVideoIndex = loop.findIndex((it) => it.video);

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
              {it.video ? (
                <MarqueeVideo
                  src={it.video}
                  alt={it.alt}
                  deferUntil={i === firstVideoIndex || firstVideoReady}
                  onReady={i === firstVideoIndex ? () => setFirstVideoReady(true) : undefined}
                />
              ) : (
                <img
                  src={cdnSrc(it.src, 720)}
                  onError={onCdnError(it.src)}
                  alt={it.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-56 sm:h-64 md:h-72 w-auto rounded-xl"
                />
              )}
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