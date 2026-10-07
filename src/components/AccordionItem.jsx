import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

// Accessible accordion item: button with aria-expanded/aria-controls, content
// always in the HTML (height-animated, no max-height cutoff). Reduced motion
// opens instantly. Multiple items can be open at once (controlled by parent).
export default function AccordionItem({ id, title, subtitle, open, onToggle, children, contentClassName }) {
  const reduce = useReducedMotion();
  const panelId = `${id}-panel`;
  const btnId = `${id}-btn`;
  return (
    <div className="border-t hairline">
      <h3 className="m-0">
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span>
            <span className="block font-heading font-semibold text-[18px] sm:text-[19px] text-navy">{title}</span>
            {subtitle && <span className="block mt-1.5 text-[15px] text-navy/60 leading-relaxed">{subtitle}</span>}
          </span>
          <span className="shrink-0 w-9 h-9 rounded-full border hairline flex items-center justify-center text-brand" aria-hidden="true">
            {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </span>
        </button>
      </h3>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.22, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className={contentClassName ?? "pb-7 pr-6 sm:pr-12 max-w-2xl text-[15px] leading-relaxed text-navy/75 space-y-4"}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}