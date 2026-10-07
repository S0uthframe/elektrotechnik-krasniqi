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

**Zweiter Durchgang.** Nach dem ersten lag die Seite bei rund 1,2 MB Bildern.

| Befund | Behebung |
|---|---|
| Helles Hero-Bild blitzte beim Laden auf, bevor das dunkle es überdeckte | Die Ladereihenfolge war falsch herum: Zu Beginn der Animation ist ausschließlich das dunkle Bild zu sehen, Preload und hohe Priorität lagen aber auf dem hellen. Jetzt lädt das dunkle zuerst, das helle wird erst eingehängt, wenn das dunkle geladen ist. Scheitern beide Adressen des dunklen Bildes, wird das helle trotzdem freigegeben — sonst bliebe die Fläche leer. |
| Mobiles Hero-Bild 976 KB | `w_1200,q_85` → `w_960,q_75`. Angezeigt werden laut Bericht 960×699. |
| Leistungsbilder 117 KB und 62 KB | Die Bildkomponente stand auf Qualität 90, jetzt 80. |
| Logo 18 KB | `w_320,q_85` → `w_256,q_80`; deckt doppelte Pixeldichte ab. |
| Vorverbindung „nicht verwendet" | `crossorigin` entfernt. Die Bilder werden ohne CORS geladen; mit dem Attribut öffnet der Browser einen zweiten, ungenutzten Verbindungskanal. |
| Dunkles Hero-Bild bei abgeschalteter Animation | Wird gar nicht mehr angefordert — sichtbar ist es in diesem Fall nie. |

**Dritter Durchgang — die Hero-Fläche blieb beim Laden leer.** Die
LCP-Aufschlüsselung nannte 3.750 ms allein für den Download der Bilddatei. Die
Quelldateien sind rauschreiche 3D-Renderings und lassen sich schlecht
komprimieren: 579 KB als WebP bei `w_960,q_75`. Drei Hebel:

1. **Sofortbild.** Eine 48 Pixel breite Fassung (rund 1 KB), unscharf
   hochskaliert, füllt die Fläche, bis das richtige Bild steht. Dieselbe
   Technik, die die Bildkomponente der Vorlage an anderen Stellen bereits
   verwendet.
2. **Ohne Umweg über JavaScript.** Das Sofortbild der Komponente wird erst
   gezeichnet, wenn 120 KB JavaScript geladen und ausgeführt sind. Deshalb
   steht derselbe Platzhalter zusätzlich direkt in `index.html` — als
   `#hero-platzhalter` mit eigenem `<style>`. Er erscheint, sobald das Dokument
   da ist, und wird von React beim ersten Rendern ersetzt; dahinter steht das
   gleich aufgebaute Sofortbild der Komponente, also kein sichtbarer Wechsel.
3. **Getrennte Qualitätsstufen.** Auf dem Handy ist die dunkle Ebene dieselbe
   Datei, nur per CSS auf 34 % Helligkeit gedimmt — Kompressionsartefakte sieht
   dort niemand. Sie bekommt deshalb eine eigene, stark komprimierte Fassung
   (`q_38`) und ist als LCP-Element das, was zählt. Die helle Ebene (`q_62`)
   lädt danach; sichtbar wird sie ohnehin erst beim Scrollen. Die Stufen stehen
   gesammelt am Kopf von `HeroScroll.jsx`.

Dazu: Das Stylesheet wird beim Bauen in die `index.html` eingebettet
(`tools/css-einbetten.mjs`) — es blockierte das erste Rendering um 180 ms, nicht
wegen seiner Größe, sondern weil es ein zusätzlicher Netzabruf ist. Der Schritt
bricht ab, wenn das CSS über 60 KB wächst. Die Vorverbindung zu
`media.base44.com` ist entfallen: Die Preloads öffnen die Verbindung bereits
selbst, der Hinweis blieb im Bericht ungenutzt.

**Projektvideo entfernt.** Die Datei wog 7,5 MB für eine Kachel von 288 px
Höhe — um etwa den Faktor zwanzig zu groß. Auf Wunsch des Auftraggebers ist sie
samt der Lade-Mechanik aus dem Laufband genommen; die Vorlage zeigte dort ein
Video zwischen neun Fotos. Das Laufband läuft jetzt mit neun Bildern.

**Vierter Durchgang — Bilder vom CDN auf den eigenen Server.** Die
Originaldateien liegen jetzt unter `medien-original/`,
`tools/bilder_rechnen.py` rechnet daraus die ausgelieferten Fassungen nach
`public/media/`.

Der Vergleich rechtfertigt den Schritt für sich: Dasselbe dunkle Hero-Bild wog
über das Bild-CDN **579 KB**, hier kodiert wiegt es **38 KB**. Ursache ist die
Nachschärfung (`usm`) in der CDN-Adresse zusammen mit `quality_auto` — von
außen nicht abstellbar.

| Was | vorher (CDN) | jetzt (lokal) |
|---|---|---|
| Hero dunkel, volle Breite | 579 KB | 38 KB |
| Hero hell, volle Breite | — | 65 KB |
| Logo, beide Fassungen | 510 KB je PNG | 16 KB zusammen |
| Neun Laufbandbilder, je zwei Stufen | ~1 MB | 480 KB |

Dazu: Die 48-Pixel-Vorstufen liegen jetzt als data-URI im Code und in der
`index.html` — sechs Kilobyte für alle elf Bilder, und kein einziger Netzabruf
mehr dafür.

**Das Logo** kam als AVIF ohne Alphakanal, also mit weißem Hintergrund. Beide
Fassungen sind daraus abgeleitet: Die Deckkraft stammt aus der Helligkeit, was
die weichen Kanten erhält, wo ein harter Schwellenwert einen hellen Saum
hinterlassen hätte. Die blaue Fassung trägt die Farbe, die in der Datei steht
(`#014378`), nicht eine geschätzte. Geprüft wurde nicht nach Augenmaß, sondern
am gerenderten Pixelwert.

**Fünfter Durchgang — Desktop 100, Mobil 79.** Barrierefreiheit, Best
Practices, SEO und agentische Bereitschaft stehen auf voll; die Leistung hängt
allein am Largest Contentful Paint (4,7 s bei einem First Contentful Paint von
1,7 s).

Gefunden und behoben: Die unscharfe Vorstufe in `ui/responsive-image.jsx`
hatte kein `loading="lazy"` — anders als das eigentliche Bild darunter. Dadurch
forderten die acht Bilder der Leistungsliste ihre Vorstufe sofort beim
Seitenaufbau an: acht Abrufe zu einem fremden Ursprung, während das Hero-Bild
lädt. Auf einer gedrosselten Mobilverbindung kostet jeder davon eine
Umlaufzeit. Nachgemessen: vorher elf CDN-Abrufe beim Seitenaufbau, jetzt drei.

Das entscheidende Element bleibt aber das mobile Hero-Bild, das als einziges
noch am CDN hängt. Solange seine Originaldatei fehlt, ist der Wert nicht
weiter zu drücken.

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
- **Neun Bilder hängen weiter am Base44-CDN**, weil ihre Originaldateien
  fehlen: das mobile Hero-Bild (`hell-mobile.png`) und die acht Bilder der
  Leistungsliste (`elektro-krasniqi-verteilerkasten-gross.jpg`,
  `elektro-krasniqi-verteilerkasten.jpg`, `elektro-krasniqi-verteiler.jpg`,
  `elektro-krasniqi-solardach.jpg`, `elektro-krasniqi-buero.jpg` sowie zweimal
  `generated_image.png`). Sobald sie in `medien-original/` liegen, erledigt
  `tools/bilder_rechnen.py` den Rest. Achtung bei den beiden `generated_image.png`:
  Sie tragen denselben Namen und unterscheiden sich nur im Hash der CDN-Adresse —
  sie müssen beim Hochladen unterscheidbar benannt werden.
- **42 KB ungenutztes JavaScript.** Aufteilbar, indem `framer-motion` nur für
  den Hero nachgeladen wird. Das verzögert aber genau die Animation, die als
  erstes sichtbar ist.
- **Erzwungener dynamischer Umbruch (64 ms).** Die Bildkomponente der Vorlage
  misst ihren Container mit `getBoundingClientRect`, um die passende Bildgröße
  anzufordern. Das ist der Preis dieser Technik; ihn zu vermeiden hieße, die
  Komponente zu ersetzen.
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
