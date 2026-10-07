# Elektrotechnik Krasniqi — Website

Eigenständiger Nachbau der Base44-App *Elektro Krasniqi Website*
(`6ab1017905a6126f39abd0a8`, live unter `krasniqi-energy-flow.base44.app`)
als reines React/Vite-Projekt — ohne Base44-SDK, ohne Plattformbindung.

## Schnellstart

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run lint
```

## Was 1:1 übernommen wurde

Byte-identisch aus der Vorlage:

| Bereich | Dateien |
|---|---|
| Seiten | `src/pages/` (HomePage, ImprintPage, PrivacyPage, NotFoundPage) |
| Komponenten | `src/components/` (Header, Footer, Layout, HeroScroll, HeroCtaButton, ServicesList, AccordionItem, FaqAccordion, ProjectsMarquee, Reviews, ScrollToTop) |
| Bildpipeline | `src/components/ui/image*.jsx`, `src/hooks/use-size.jsx` |
| Texte DE/EN | `src/lib/i18n.jsx` |
| Gestaltung | `src/index.css`, `tailwind.config.js` (nur CommonJS → ESM), `index.html` |

Damit sind Aufbau, Texte, Farben, Typografie, die Scroll-Animation im Hero,
die Projekt-Laufschrift und die Accordion-Bewegung unverändert.

## Was bewusst abweicht

| Vorlage (Base44) | hier | Grund |
|---|---|---|
| `AuthProvider`, `@base44/sdk`, `base44Client.js` | entfernt | Die Seite hat keinen Login. In `App.jsx` war keine einzige Auth-Route eingebunden; die Auth-Seiten im Base44-Projekt waren toter Code. |
| `QueryClientProvider`, `Toaster` | entfernt | Keine Komponente hat sie genutzt. |
| `@base44/vite-plugin` | entfernt | Plattform-Werkzeug (HMR-Notifier, Visual-Edit-Agent), außerhalb von Base44 ohne Funktion. |
| Function `submitContactInquiry` + Entity `ContactInquiry` | `api/contact.php` | Siehe unten. |
| `tailwind.config.js` als CommonJS | ESM | `package.json` setzt `"type": "module"`; `require()` bricht sonst den Build. |

Dadurch sinkt die Abhängigkeitsliste von 60 auf 7 Laufzeitpakete.

## Kontaktformular

`api/contact.php` ersetzt die Base44-Function. Es behält deren Antwortformat
(`{ ok, status, email_sent }`) und deren Reihenfolge bei: erst protokollieren,
dann versenden. `ContactForm.jsx` unterscheidet damit weiterhin zwischen
„zugestellt" und „gespeichert, aber nicht zugestellt" — eine Erfolgsmeldung
erscheint nur, wenn die Mail wirklich raus ist.

Vor dem Livegang einstellen (Kopf der Datei):

- `MAIL_TO` — Empfänger (entspricht dem Base44-Secret `CONTACT_RECIPIENT_EMAIL`)
- `MAIL_FROM` — Absender, muss zur Domain gehören, sonst greift SPF/DMARC
- `LOG_DIR` — **möglichst außerhalb des Webroots**, sonst sind die Anfragen
  über die URL abrufbar

Liegt der Endpunkt woanders, setzt `VITE_CONTACT_ENDPOINT` den Pfad
(siehe `.env.example`).

Enthalten: Methoden- und Größenprüfung, Pflichtfeld- und E-Mail-Validierung,
Rate-Limit (20 s je IP, nur gehasht gespeichert), Schutz vor Header-Injection,
Protokoll als JSONL als Ersatz für die Entity.

## Veröffentlichen

`dist/` auf den Webserver, `api/contact.php` nach `/api/`. `public/.htaccess`
wird mitgebaut und leitet alle Client-Routen (`/de`, `/en/imprint` …) auf
`index.html` — ohne diese Regel liefert der Server dort 404. Auf nginx oder
Caddy ist die Regel entsprechend nachzubilden (`try_files $uri /index.html`).

## Offene Punkte

1. **Bilder und Video liegen weiter auf `media.base44.com`** (21 Bilder,
   1 Video; URLs in `src/lib/i18n.jsx`). Die Seite ist damit optisch 1:1,
   hängt aber am Base44-CDN. Vor dem Livegang auf eigener Domain sollten die
   Dateien übernommen werden. Zu beachten: `media.base44.com` liefert
   Wix-kompatible Transformationen (`/v1/fill/w_…,h_…/…webp`), die
   `src/components/ui/image-helpers.js` nutzt. Bei lokalen Pfaden fällt die
   Komponente sauber auf das Original zurück — dann aber ohne WebP und ohne
   `srcset`. Ein Ersatz dafür ist Teil der Migration, nicht dieses Nachbaus.
2. **`public/favicon.svg` ist ein Platzhalter** in den Markenfarben. Das
   Original liegt auf der Base44-Plattform und war von hier nicht abrufbar.
3. **Fehler in `localizedPath` (`src/components/Layout.jsx`, aus der Vorlage).**
   Die Übersetzung des Slugs richtet sich nach der *aktuellen*, nicht nach der
   *Ziel*-Sprache. Auf `/de/impressum` zeigt deshalb `hreflang="de"` auf
   `/de/imprint` — eine Seite, die es nicht gibt. Betroffen sind alle
   deutschen Unterseiten.

Punkt 3 ist absichtlich nicht korrigiert: Der Auftrag war ein 1:1-Nachbau.
Behoben ist das in wenigen Zeilen, sobald es gewünscht ist.

## Korrigiert gegenüber der Vorlage

**Befunde aus dem PageSpeed-Test auf southframe-test.de.** Die Seite übertrug
17,7 MB. Ursachen und Behebung:

| Befund | Ursache | Behebung |
|---|---|---|
| Video zweimal geladen, 15,0 MB | Das Laufband verdoppelt seine Inhalte für den nahtlosen Umlauf. Zwei `<video autoplay>` auf dieselbe Adresse starteten gleichzeitig, bevor eine im Cache lag. | Video lädt erst bei Sichtkontakt (`preload="none"` + IntersectionObserver); die zweite Fassung bekommt ihre Adresse erst, wenn die erste geladen ist. |
| Hero-Bild 1,84 MB PNG | Nacktes `<img>` auf die Originaldatei, an der Bildpipeline vorbei. | Über `src/lib/cdn-image.js` als WebP in Anzeigegröße. |
| Logo 510 KB für 122×63 px | Dasselbe: Originaldatei 1748×900 unverändert geladen. | Ebenso, plus `width`/`height` gegen Layoutsprünge. |
| LCP-Bild für den Browser unauffindbar | In einer SPA entsteht das `<img>` erst nach dem JavaScript. | `<link rel="preload" as="image" fetchpriority="high">` in `index.html`, nach Breakpoint getrennt. |
| Google Fonts blockiert 780 ms | Kette aus Stylesheet und Schriftdatei über zwei fremde Ursprünge. | Inter liegt unter `public/fonts/` (latin + latin-ext, variabel), `@font-face` in `index.css`, Preload im Dokument. |
| Keine Vorverbindung zum Bild-CDN | — | `<link rel="preconnect">` auf `media.base44.com`. |
| Cache-TTL „None" | — | `.htaccess` setzt ein Jahr `immutable` für die gehashten Dateien, `no-cache` für `index.html`. |
| Formularfelder ohne Label-Bezug | `<label>` und Feld standen nur nebeneinander. | `htmlFor`/`id` pro Feld, dazu `aria-describedby` und `aria-invalid` für Fehlermeldungen. |
| Kontrast in der Fußzeile zu gering | `text-white/40` auf Navy ergibt 3,75:1, verlangt sind 4,5:1. | `text-white/60` (6,72:1). Dazu `text-navy/50` in der Sprachumschaltung (3,30:1) auf `text-navy/65` (5,34:1). |
| `llms.txt` und `ai-catalog.json` „ungültig" | Die SPA-Weiterleitung gab für jede unbekannte Adresse die `index.html` mit Status 200 zurück. Prüfwerkzeuge lasen HTML, wo JSON erwartet wurde. | `.htaccess` beantwortet fehlende Dateien mit Dateiendung jetzt mit 404. Die Dateien selbst werden bewusst nicht angelegt — siehe unten. |

Die umgewandelten Bildadressen konnten von der Entwicklungsumgebung aus nicht
geprüft werden: `media.base44.com` ist dort netzseitig gesperrt. Schlägt eine
Umwandlung fehl, lädt `onCdnError` die Originaldatei nach — schlimmstenfalls
bleibt es also beim bisherigen Zustand, ein Bild fehlt nicht. Der erste Test
auf dem Server zeigt es an der Dateigröße des Hero-Bildes.

### Nicht behoben, mit Begründung

- **`text-navy/45` bis `/60` auf Weiß** (Kontaktlabels, Bildunterschriften,
  Fußnoten) liegen mit 2,87:1 bis 4,48:1 ebenfalls unter 4,5:1. PageSpeed hat
  sie nicht gemeldet, weil nur die Fußzeile in die Stichprobe kam. Die Korrektur
  wären rund zehn Klassenänderungen, die das zurückhaltende Grau der Vorlage
  sichtbar verändern — das ist eine Gestaltungsentscheidung, keine rein
  technische.
- **Fehlende `width`/`height` an den Laufband-Bildern.** Die Maße der
  Originaldateien sind von hier nicht abrufbar; geratene Werte würden die
  Bilder verzerren.
- **42 KB ungenutztes JavaScript.** Aufteilbar, indem `framer-motion` nur für
  den Hero nachgeladen wird. Das verzögert aber genau die Animation, die als
  erstes sichtbar ist.
- **`llms.txt`.** Google unterstützt die Datei nach eigener Aussage nicht, kein
  großer Anbieter hat produktive Nutzung zugesagt. Eine Datei anzulegen, damit
  ein Prüfwerkzeug grün wird, ist kein Grund. Der eigentliche Fehler — HTML mit
  Status 200 auf eine nicht vorhandene Datei — ist behoben.
- **Weiche 404.** Unbekannte Adressen ohne Dateiendung liefern weiterhin die
  Startseite mit Status 200, die dann die 404-Seite anzeigt. Ein echter
  Statuscode 404 verlangt serverseitiges Rendern; das ist eine
  Architekturentscheidung, keine Einstellung.


**Doppeltes `<h1>` auf der Startseite.** Der Hero hatte zwei vollständige
Fassungen dauerhaft im DOM — eine für Desktop, eine für Mobil —, von denen CSS
jeweils eine ausblendete. Für Suchmaschinen standen damit zwei `<h1>` auf der
Seite, und beide Hero-Bilder wurden geladen, obwohl immer nur eines sichtbar
ist. `HeroScroll.jsx` entscheidet jetzt per `matchMedia` (`min-width: 1024px`),
welche Fassung überhaupt gerendert wird.

Der Startwert wird synchron aus `window.matchMedia` gelesen, nicht erst in
einem Effekt — sonst würde beim ersten Bild kurz die falsche Fassung stehen.
Ein `change`-Listener hält den Wechsel beim Verändern der Fensterbreite
nach. Geprüft bei 1440, 900 und 390 px sowie beim Umschalten ohne Neuladen:
jeweils genau ein sichtbares `<h1>`, keine Konsolenfehler.

Die per CSS ausgeblendete Fassung einfach zu einem `<p>` zu machen, wäre der
kürzere Weg gewesen — aber ein schlechterer: Auf Mobilgeräten hätte die Seite
dann gar keine Überschrift erster Ordnung mehr gehabt, was Screenreader-Nutzern
die Orientierung nimmt (WCAG 1.3.1).

## Herkunft

Stand der Vorlage: 7. Oktober 2026, Branch `main` der Base44-App.
