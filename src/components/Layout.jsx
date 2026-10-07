import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MAP_DE_EN = { "leistungen": "services", "kontakt": "contact", "impressum": "imprint", "datenschutz": "privacy" };
const MAP_EN_DE = Object.fromEntries(Object.entries(MAP_DE_EN).map(([k, v]) => [v, k]));

function localizedPath(pathname, targetLang) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${targetLang}`;
  const src = parts[0] === "en" ? MAP_EN_DE : MAP_DE_EN;
  parts[0] = targetLang;
  if (parts[1] && src[parts[1]]) parts[1] = src[parts[1]];
  return "/" + parts.join("/");
}

function setLink(id, rel, href, hreflang) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("link");
    el.id = id;
    document.head.appendChild(el);
  }
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  if (hreflang) el.setAttribute("hreflang", hreflang);
}

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const origin = window.location.origin;
    setLink("canonical", "canonical", origin + location.pathname);
    setLink("hreflang-de", "alternate", origin + localizedPath(location.pathname, "de"), "de");
    setLink("hreflang-en", "alternate", origin + localizedPath(location.pathname, "en"), "en");
    setLink("hreflang-default", "alternate", origin + localizedPath(location.pathname, "de"), "x-default");
  }, [location.pathname]);

  useEffect(() => {
    const origin = window.location.origin;
    const ld = {
      "@context": "https://schema.org",
      "@type": "Electrician",
      name: "Elektrotechnik Krasniqi",
      url: origin,
      "@id": `${origin}/#electrician`,
      telephone: "+491604141186",
      email: "info@elektro-krasniqi.de",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Brachweg 5",
        addressLocality: "Alteglofsheim",
        addressRegion: "Landkreis Regensburg",
        addressCountry: "DE",
      },
      openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "19:00",
      }],
    };
    let el = document.getElementById("ld-electrician");
    if (!el) {
      el = document.createElement("script");
      el.id = "ld-electrician";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(ld);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}