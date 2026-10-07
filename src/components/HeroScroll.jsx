import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import HeroCtaButton from "@/components/HeroCtaButton";

const HERO_DESKTOP = "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/ca03c90ed_Codex-Bild21Sept202614_43_58.png";
const DARK_DESKTOP = "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/b8afcdfb2_Codex-Bild21Sept202614_48_20.png";
const BRIGHT_MOBILE = "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/02b490829_hell-mobile.png";

const PHONE_HREF = "tel:+491604141186";

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
            {/* Bright base image */}
            <img
              src={HERO_DESKTOP}
              alt={t.hero.visualNote}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            {/* Dark copy on top — clipped away from bottom up as you scroll */}
            <motion.img
              src={DARK_DESKTOP}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-top"
              style={{ clipPath: reduce ? "inset(100% 0% 0% 0%)" : clip, WebkitClipPath: reduce ? "inset(100% 0% 0% 0%)" : clip }}
            />
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
              {/* Bright base image */}
              <img
                src={BRIGHT_MOBILE}
                alt={t.hero.visualNote}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              {/* Dark copy on top — clipped away from bottom up as you scroll */}
              <motion.img
                src={BRIGHT_MOBILE}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{ filter: "brightness(0.34) saturate(0.85)", clipPath: reduce ? "inset(100% 0% 0% 0%)" : clip, WebkitClipPath: reduce ? "inset(100% 0% 0% 0%)" : clip }}
              />
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