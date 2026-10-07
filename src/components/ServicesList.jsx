import React from "react";
import { useI18n } from "@/lib/i18n";
import { Image } from "@/components/ui/image";

const SERVICE_KEYS = [
  "elektroinstallation", "smart-home", "solarinstallation",
  "medientechnik", "netzwerktechnik", "beleuchtung", "wartung-reparatur", "e-ladestationen",
];

// Row-based services list: each service shows its 4:3 image immediately
// (no accordion), alternating image side on desktop, stacked on mobile.
export default function ServicesList() {
  const { t } = useI18n();
  return (
    <>
      <div>
        {SERVICE_KEYS.map((key, i) => {
          const item = t.services.items[key];
          const flip = i % 2 === 1;
          return (
            <div
              id={`svc-${key}`}
              key={key}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-10 border-t hairline scroll-mt-28"
            >
              <div className={flip ? "md:order-2" : "md:order-1"}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fittingType="fill"
                  className="block w-full aspect-[4/3] rounded-xl overflow-hidden"
                />
              </div>
              <div className={flip ? "md:order-1" : "md:order-2"}>
                <h3 className="font-heading font-semibold text-[22px] sm:text-[24px] text-navy">{item.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-navy/80 font-medium">{item.short}</p>
                <div className="mt-4 space-y-4">
                  {item.detail.map((p, j) => (
                    <p key={j} className="text-[15px] leading-relaxed text-navy/70">{p}</p>
                  ))}
                </div>
                <p className="mt-5 text-[14px] text-navy/55">
                  <span className="font-semibold text-navy/70">{t.services.inquiryLabel}:</span> {item.inquiry}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-[13px] text-navy/45">{t.services.illustrationNote}</p>
    </>
  );
}