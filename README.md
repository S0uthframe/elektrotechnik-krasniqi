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
3. **Zwei `<h1>` auf der Startseite** (aus der Vorlage übernommen: der Hero
   rendert eine Mobil- und eine Desktop-Variante). Für die Suche ist das ein
   Mangel; die saubere Lösung ist, eine Variante per CSS auszublenden statt
   sie doppelt in den DOM zu schreiben.
4. **Fehler in `localizedPath` (`src/components/Layout.jsx`, aus der Vorlage).**
   Die Übersetzung des Slugs richtet sich nach der *aktuellen*, nicht nach der
   *Ziel*-Sprache. Auf `/de/impressum` zeigt deshalb `hreflang="de"` auf
   `/de/imprint` — eine Seite, die es nicht gibt. Betroffen sind alle
   deutschen Unterseiten.

Punkt 3 und 4 sind absichtlich nicht korrigiert: Der Auftrag war ein
1:1-Nachbau. Beides ist in wenigen Zeilen behoben, sobald es gewünscht ist.

## Herkunft

Stand der Vorlage: 7. Oktober 2026, Branch `main` der Base44-App.
