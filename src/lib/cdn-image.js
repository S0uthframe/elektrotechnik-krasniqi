import { buildTransformUrl, parseWixMediaUrl } from "@/components/ui/image-helpers";

// Hero- und Logo-Bilder hingen als unveraenderte PNG am CDN: das mobile
// Hero-Bild mit 1,8 MB, das Logo mit 510 KB fuer eine Flaeche von 122x63 px.
// media.base44.com kann dieselben Dateien skaliert und als WebP ausliefern —
// genau das nutzt die Image-Komponente der Vorlage bereits, nur griff sie bei
// diesen beiden Stellen nicht, weil dort ein nacktes <img> steht.
//
// Bewusst ohne serverseitigen Zuschnitt (fit statt fill): Der Beschnitt
// entsteht weiterhin per CSS (object-cover, object-top). Mit fill wuerde das
// CDN mittig beschneiden und der Dachfirst im Hero waere angeschnitten.
export function cdnSrc(src, width, quality = 85) {
  const parsed = parseWixMediaUrl(src);
  if (!parsed) return src; // kein CDN-Bild: unveraendert durchreichen
  return buildTransformUrl(parsed, { width, height: width, crop: false, quality });
}

// Faellt eine umgewandelte Datei aus, laedt der Browser das Original nach.
// Ohne das waere eine fehlgeschlagene Umwandlung eine leere Stelle im Layout.
export function onCdnError(originalSrc) {
  return (event) => {
    if (event.currentTarget.src !== originalSrc) event.currentTarget.src = originalSrc;
  };
}
