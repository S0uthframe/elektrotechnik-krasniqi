import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Ersetzt die Base44-Function submitContactInquiry. Antwortformat bleibt
// identisch ({ ok, status, email_sent }), damit die Statuslogik unverändert gilt.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact.php";

const SERVICE_KEYS = [
  "elektroinstallation", "smart-home", "solarinstallation",
  "medientechnik", "beleuchtung", "wartung-reparatur", "e-ladestationen",
];

export default function ContactForm() {
  const { lang, t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", service: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | notConfigured

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t.contact.errorRequired;
    if (!form.email.trim()) e.email = t.contact.errorRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.contact.errorEmail;
    if (!form.location.trim()) e.location = t.contact.errorRequired;
    if (!form.service) e.service = t.contact.errorRequired;
    if (!form.message.trim()) e.message = t.contact.errorRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      // customer_type is required by the backend but not exposed in the UI; default to private.
      const payload = { ...form, customer_type: "private" };
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request_failed");
      const data = await res.json();
      // Success only when the email was actually delivered; otherwise report the issue.
      if (data?.status === "sent") setStatus("success");
      else setStatus("notConfigured");
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border hairline bg-white p-8" role="status" aria-live="polite">
        <CheckCircle2 className="w-8 h-8 text-brand" />
        <p className="mt-4 text-[15px] text-navy font-medium">{t.contact.success}</p>
      </div>
    );
  }

  if (status === "notConfigured") {
    return (
      <div className="rounded-lg border hairline bg-white p-8" role="status" aria-live="polite">
        <AlertCircle className="w-8 h-8 text-brand" />
        <p className="mt-4 text-[15px] text-navy font-medium">{t.contact.notConfigured}</p>
      </div>
    );
  }

  const inputBase = "w-full rounded-md border bg-white px-3.5 py-2.5 text-[14px] text-navy placeholder:text-navy/40 focus:outline-none focus:border-brand focus:ring-2 focus:ring-[#80A1D8]/40 transition";
  const errBorder = "border-red-400";
  const okBorder = "border-[rgba(8,31,48,0.18)]";
  const privacySlug = lang === "de" ? "datenschutz" : "privacy";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-describedby="form-status">
      <div role="status" aria-live="polite" className="sr-only" id="form-status">
        {status === "error" ? t.contact.errorGeneric : ""}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="kontakt-name" label={t.contact.name} error={errors.name} required>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={`${inputBase} ${errors.name ? errBorder : okBorder}`} autoComplete="name" />
        </Field>
        <Field id="kontakt-email" label={t.contact.email} error={errors.email} required>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={`${inputBase} ${errors.email ? errBorder : okBorder}`} autoComplete="email" />
        </Field>
        <Field id="kontakt-telefon" label={t.contact.phone}>
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`${inputBase} ${okBorder}`} autoComplete="tel" />
        </Field>
        <Field id="kontakt-ort" label={t.contact.location} error={errors.location} required>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} className={`${inputBase} ${errors.location ? errBorder : okBorder}`} />
        </Field>
      </div>

      <Field id="kontakt-leistung" label={t.contact.service} error={errors.service} required>
        <select value={form.service} onChange={(e) => set("service", e.target.value)} className={`${inputBase} ${errors.service ? errBorder : okBorder}`}>
          <option value="">{t.contact.selectService}</option>
          {SERVICE_KEYS.map((k) => <option key={k} value={t.services.items[k].title}>{t.services.items[k].title}</option>)}
        </select>
      </Field>

      <Field id="kontakt-nachricht" label={t.contact.message} error={errors.message} required>
        <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} className={`${inputBase} ${errors.message ? errBorder : okBorder} resize-y`} />
      </Field>

      <p className="text-[13px] leading-relaxed text-navy/60">
        {t.contact.privacyNote}{" "}
        <Link to={`/${lang}/${privacySlug}`} className="text-brand underline underline-offset-2 hover:text-navy">{t.contact.privacyLink}</Link>.
      </p>

      {status === "error" && (
        <div className="flex items-start gap-2 text-[13px] text-red-600" role="alert">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.contact.errorGeneric}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[14px] font-semibold text-white hover:bg-brand transition-colors disabled:opacity-60"
      >
        {status === "sending" ? <><Loader2 className="w-4 h-4 animate-spin" />{t.contact.sending}</> : <>{t.contact.submit}<ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}

// Label und Eingabefeld standen nur nebeneinander, ohne Verbindung: Screenreader
// lesen das Feld dann ohne Bezeichnung vor, und ein Klick aufs Label setzt den
// Cursor nicht. Das Label zeigt jetzt per htmlFor auf die id, die das Feld hier
// erhaelt — zusaetzlich wird eine Fehlermeldung ueber aria-describedby
// angekuendigt und das Feld als fehlerhaft markiert.
function Field({ id, label, error, required, children }) {
  const errorId = error ? `${id}-fehler` : undefined;
  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        id,
        "aria-describedby": errorId,
        "aria-invalid": error ? true : undefined,
        required: required || undefined,
      })
    : children;

  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-semibold tracking-wide text-navy/60 mb-2">
        {label}{required && <span className="text-brand"> *</span>}
      </label>
      {control}
      {error && <p id={errorId} className="mt-1.5 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}