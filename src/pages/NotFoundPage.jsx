import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function NotFoundPage() {
  const { lang, t } = useI18n();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return (
    <main className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-heading font-bold text-navy" style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}>404</p>
        <p className="mt-2 text-[16px] text-navy/60">{t.notFound.title}</p>
        <Link to={`/${lang}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-[14px] font-semibold text-white hover:bg-brand transition-colors">
          {t.notFound.back}
        </Link>
      </div>
    </main>
  );
}