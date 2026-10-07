import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useAnimationControls, useReducedMotion } from "framer-motion";

// Hero call button: always visible & usable. Fires a one-time soft glow when
// `glowSignal` increments, then shows a continuous moving border while
// `borderEnabled` is true (paused when off-screen or tab inactive). Reduced
// motion → static ring, no glow. Supports a router `to` (Link) or an `href`
// (anchor, e.g. tel:). `block` makes it full-width.
export default function HeroCtaButton({ to, href, children, glowSignal = 0, borderEnabled = false, className, block = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  const controls = useAnimationControls();
  const [tabVisible, setTabVisible] = useState(typeof document !== "undefined" ? !document.hidden : true);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (glowSignal === 0 || reduce) return;
    controls.start("glow");
  }, [glowSignal, reduce, controls]);

  const showBorder = borderEnabled || reduce;
  const play = showBorder && !reduce && inView && tabVisible;

  const glowVariants = {
    idle: { boxShadow: "0 0 0px rgba(128,161,216,0)", filter: "brightness(1)" },
    glow: {
      boxShadow: [
        "0 0 0px rgba(128,161,216,0)",
        "0 0 16px rgba(128,161,216,0.5)",
        "0 0 0px rgba(128,161,216,0)",
      ],
      filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const ringMask = {
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
  };

  const inner = href ? (
    <a href={href} className={className}>{children}</a>
  ) : (
    <Link to={to} className={className}>{children}</Link>
  );

  return (
    <span ref={ref} className={`relative ${block ? "flex w-full" : "inline-flex"}`}>
      <motion.span variants={glowVariants} initial="idle" animate={controls} className={`${block ? "flex w-full" : "inline-flex"} rounded-full`}>
        {inner}
      </motion.span>

      {showBorder && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={
            reduce
              ? { padding: "1.5px", background: "rgba(128,161,216,0.45)", ...ringMask }
              : {
                  padding: "1.5px",
                  background:
                    "conic-gradient(from var(--mb-angle, 0deg), transparent 0deg, transparent 250deg, rgba(191,232,255,0.85) 305deg, rgba(255,255,255,0.95) 330deg, transparent 360deg)",
                  filter: "drop-shadow(0 0 2px rgba(128,161,216,0.4))",
                  animationName: "mb-spin",
                  animationDuration: "4s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationPlayState: play ? "running" : "paused",
                  ...ringMask,
                }
          }
        />
      )}
    </span>
  );
}