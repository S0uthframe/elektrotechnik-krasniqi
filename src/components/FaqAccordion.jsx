import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import AccordionItem from "@/components/AccordionItem";

// Self-managed FAQ accordion. Multiple answers may be open at once.
export default function FaqAccordion() {
  const { t } = useI18n();
  const [openSet, setOpenSet] = useState(new Set());
  const toggle = (i) =>
    setOpenSet((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <div>
      {t.faq.items.map((item, i) => (
        <AccordionItem key={i} id={`faq-${i}`} title={item.q} open={openSet.has(i)} onToggle={() => toggle(i)}>
          <p>{item.a}</p>
        </AccordionItem>
      ))}
    </div>
  );
}