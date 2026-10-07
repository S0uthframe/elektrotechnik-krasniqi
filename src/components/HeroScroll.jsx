import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cdnSrc, onCdnError } from "@/lib/cdn-image";
import { SOFORTBILDER } from "@/lib/sofortbilder";
import HeroCtaButton from "@/components/HeroCtaButton";

// Die beiden Desktop-Fassungen liegen auf dem eigenen Server
// (public/media, erzeugt von tools/bilder_rechnen.py). Das mobile Bild haengt
// noch am CDN: seine Originaldatei (hell-mobile.png) fehlt bislang.
const HERO_DESKTOP = "hero-desktop-hell";
const DARK_DESKTOP = "hero-desktop-dunkel";
const hero = (name, breite) => `/media/${name}-${breite}w.webp`;
const heroSatz = (name) => `${hero(name, 1280)} 1280w, ${hero(name, 1672)} 1672w`;
const BRIGHT_MOBILE = "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/02b490829_hell-mobile.png";

const PHONE_HREF = "tel:+491604141186";

// Bildstufen. Die Quelldateien sind rauschreiche 3D-Renderings und lassen sich
// schlecht komprimieren: 579 KB als WebP bei w_960/q_75, gemessene 3,75 s nur
// fuer den Download — so lange blieb die Hero-Flaeche leer.
//
// Drei Hebel dagegen:
// 1. SOFORT: eine 48 Pixel breite Fassung (etwa 1 KB), unscharf hochskaliert.
//    Sie ist nach dem ersten Netzabruf da und fuellt die Flaeche, bis das
//    richtige Bild steht. Das ist dieselbe Technik, die die Bildkomponente der
//    Vorlage an anderen Stellen bereits verwendet.
// 2. Die dunkle Ebene auf dem Handy ist dieselbe Datei, nur per CSS auf 34 %
//    Helligkeit gedimmt. Kompressionsartefakte sieht dort niemand, also bekommt
//    sie eine eigene, deutlich staerker komprimierte Fassung. Sie ist das
//    LCP-Element — und damit das, was zaehlt.
// 3. Die helle Ebene wird erst danach geladen; sichtbar wird sie ohnehin erst
//    beim Scrollen.
const Q_SOFORT = { breite: 48, qualitaet: 40 };
const Q_DUNKEL_MOBIL = { breite: 900, qualitaet: 38 };
const Q_HELL_MOBIL = { breite: 900, qualitaet: 62 };

// Unscharfes Sofortbild. aria-hidden, weil es nur eine Vorstufe desselben
// Motivs ist und Screenreadern nichts Zusaetzliches sagt.
function Sofortbild({ src, position }) {
  // Lokale Bilder bringen ihre Vorstufe als data-URI mit — kein Netzabruf.
  const quelle = SOFORTBILDER[src] || cdnSrc(src, Q_SOFORT.breite, Q_SOFORT.qualitaet);
  return (
    <img
      src={quelle}
      alt=""
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover ${position}`}
      style={{ filter: "blur(16px)", transform: "scale(1.08)" }}
    />
  );
}

// Desktop- und Mobilfassung des Heros standen beide dauerhaft im DOM; CSS hat
// nur eine davon ausgeblendet. Damit lagen zwei <h1> auf der Seite und beide
// Hero-Bilder wurden geladen. Die Mediaquery entscheidet jetzt, welche Fassung
// ueberhaupt gerendert wird. Der Startwert wird synchron gelesen, es gibt also
// kein Umspringen beim ersten Bild.
const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => setIsDesktop(event.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

// Pinned scroll reveal: a dark copy of the image lies over the bright one.
// As the user scrolls, the dark copy is clipped away from the bottom up,
// revealing the bright image. The hero stays pinned during the reveal; once
// the bright image is fully visible it holds, then the page scrolls on and
// the call button highlight begins.
export default function HeroScroll() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  // Beim Seitenaufbau stand zuerst das helle Bild und wurde dann vom dunklen
  // ueberdeckt — sichtbar als Aufblitzen. Ursache war die Ladereihenfolge: Das
  // helle Bild liegt unten, bekam aber die hohe Prioritaet und den Preload,
  // obwohl zu Beginn der Animation ausschliesslich das dunkle zu sehen ist.
  // Jetzt laedt das dunkle zuerst; das helle kommt erst danach und damit
  // unbemerkt hinter der dunklen Flaeche.
  const [darkLoaded, setDarkLoaded] = useState(false);
  // Ohne Animation (prefers-reduced-motion) wird die dunkle Fassung nie
  // gezeigt. Sie dann gar nicht erst zu laden spart eine ganze Bilddatei.
  const showDark = !reduce;
  const sectionRef = useRef(null);
  const [glowSignal, setGlowSignal] = useState(0);
  const [borderEnabled, setBorderEnabled] = useState(false);
  const glowFiredRef = useRef(false);
  const timersRef = useRef([]);

  // Progress 0 -> 1 over the pin distance (section bottom reaches viewport bottom)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Dark copy clipped away from bottom up over the first 40% of the pin, then holds bright
  const clip = useTransform(scrollYProgress, [0, 0.4], ["inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"], { clamp: true });
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0], { clamp: true });

  useEffect(() => {
    const handle = (v) => {
      if (v >= 0.4) {
        if (!glowFiredRef.current && timersRef.current.length === 0) {
          const t1 = setTimeout(() => {
            glowFiredRef.current = true;
            setGlowSignal((s) => s + 1);
            const t2 = setTimeout(() => setBorderEnabled(true), 800);
            timersRef.current = [t2];
          }, 400);
          timersRef.current = [t1];
        }
      } else if (!glowFiredRef.current) {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
      }
    };
    const unsub = scrollYProgress.on("change", handle);
    return () => {
      unsub();
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [scrollYProgress]);

  const scrollToIntro = () => {
    const el = document.getElementById("intro");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-navy h-[170vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ===== Desktop (lg+): full-bleed image, text overlay on left negative space ===== */}
        {isDesktop && (
        <div className="relative h-full">
          {/* Image area starts below the header so the full roofline stays visible */}
          <div className="absolute top-20 inset-x-0 bottom-0 overflow-hidden">
            <Sofortbild src={showDark ? DARK_DESKTOP : HERO_DESKTOP} position="object-top" />
            {/* Bright base image — erst nach dem dunklen, damit es nicht aufblitzt */}
            {(!showDark || darkLoaded) && (
              <img
                src={hero(HERO_DESKTOP, 1672)}
                srcSet={heroSatz(HERO_DESKTOP)}
                sizes="100vw"
                alt={t.hero.visualNote}
                fetchPriority={showDark ? "low" : "high"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
            {/* Dark copy on top — clipped away from bottom up as you scroll */}
            {showDark && (
              <motion.img
                src={hero(DARK_DESKTOP, 1672)}
                srcSet={heroSatz(DARK_DESKTOP)}
                sizes="100vw"
                // Faellt das dunkle Bild aus, das helle trotzdem freigeben —
                // sonst bliebe die Hero-Flaeche dauerhaft leer.
                onError={() => setDarkLoaded(true)}
                onLoad={() => setDarkLoaded(true)}
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
                style={{ clipPath: clip, WebkitClipPath: clip }}
              />
            )}
          </div>
          <div className="relative z-10 mx-auto max-w-[1280px] px-10 h-full flex items-center">
            <div className="max-w-[480px]">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-accent-blue">{t.hero.eyebrow}</p>
              <h1
                className="mt-4 font-heading font-bold tracking-tight leading-[1.05] text-white"
                style={{ fontSize: "clamp(3rem, 4vw, 3.5rem)" }}
              >
                {t.hero.title1}<br />{t.hero.title2}
              </h1>
              <p className="mt-5 text-[16px] leading-relaxed text-white/80 max-w-[340px]">{t.hero.desc}</p>
              <div className="mt-7">
                <HeroCtaButton
                  href={PHONE_HREF}
                  glowSignal={glowSignal}
                  borderEnabled={borderEnabled}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-blue px-7 py-3.5 text-[14px] font-semibold text-navy hover:bg-[#9bb9e4] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t.hero.ctaCall}
                </HeroCtaButton>
              </div>
            </div>
          </div>
        </div>

        )}

        {/* ===== Mobile / tablet: stacked — image, headline, short desc, call button ===== */}
        {!isDesktop && (
        <div className="relative h-full">
          <div className="pt-20">
            {/* Building image — own area, not a background */}
            <div className="relative h-[40svh] min-h-[220px] max-h-[300px] overflow-hidden">
              <Sofortbild src={BRIGHT_MOBILE} position="object-center" />
              {/* Bright base image — erst nach der dunklen Ebene */}
              {(!showDark || darkLoaded) && (
                <img
                  src={cdnSrc(BRIGHT_MOBILE, Q_HELL_MOBIL.breite, Q_HELL_MOBIL.qualitaet)}
                  onError={onCdnError(BRIGHT_MOBILE)}
                  alt={t.hero.visualNote}
                  fetchPriority={showDark ? "low" : "high"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
              {/* Dark copy on top — clipped away from bottom up as you scroll */}
              {showDark && (
                <motion.img
                  src={cdnSrc(BRIGHT_MOBILE, Q_DUNKEL_MOBIL.breite, Q_DUNKEL_MOBIL.qualitaet)}
                  onError={(event) => {
                    const vorher = event.currentTarget.src;
                    onCdnError(BRIGHT_MOBILE)(event);
                    if (event.currentTarget.src === vorher) setDarkLoaded(true);
                  }}
                  onLoad={() => setDarkLoaded(true)}
                  alt=""
                  aria-hidden="true"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{ filter: "brightness(0.34) saturate(0.85)", clipPath: clip, WebkitClipPath: clip }}
                />
              )}
              {/* Fade into the navy text area below */}
              <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(8,31,48,0.95), transparent)" }} />
            </div>

            {/* Text + button directly under the image */}
            <div className="px-5 pt-5 pb-6">
              <h1
                className="font-heading font-bold tracking-tight leading-[1.1] text-white"
                style={{ fontSize: "clamp(1.75rem, 8vw, 2rem)" }}
              >
                {t.hero.title1}<br />{t.hero.title2}
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">{t.hero.descShort}</p>
              <div className="mt-6">
                <HeroCtaButton
                  href={PHONE_HREF}
                  glowSignal={glowSignal}
                  borderEnabled={borderEnabled}
                  block
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-blue w-full min-h-12 px-6 text-[15px] font-semibold text-navy hover:bg-[#9bb9e4] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t.hero.ctaCall}
                </HeroCtaButton>
              </div>
            </div>
          </div>
        </div>
        )}

        <motion.div style={{ opacity: arrowOpacity }} className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={scrollToIntro}
            aria-label={t.hero.scrollHint}
            className="pointer-events-auto inline-flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors"
          >
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}