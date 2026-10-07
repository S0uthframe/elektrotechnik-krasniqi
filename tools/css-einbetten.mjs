// Bettet das gebaute Stylesheet in die index.html ein.
//
// Warum: Das Stylesheet blockierte das erste Rendering um gemessene 180 ms —
// nicht wegen seiner Groesse (5,5 KB uebertragen), sondern weil es ein
// zusaetzlicher Netzabruf ist, der erst beginnt, wenn die HTML-Datei da ist.
// Bei einer einzigen Seite mit 22 KB CSS wiegt dieser Umweg schwerer als der
// Vorteil, die Datei getrennt zwischenspeichern zu koennen.
//
// Die Grenze ist bewusst gesetzt: Waechst das CSS ueber 60 KB, bricht der
// Schritt ab, statt stillschweigend eine immer schwerere HTML-Datei zu bauen.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist');
const htmlPfad = join(dist, 'index.html');
const html = readFileSync(htmlPfad, 'utf8');

const treffer = html.match(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/);
if (!treffer) {
  console.error('css-einbetten: kein Stylesheet-Verweis in dist/index.html gefunden.');
  process.exit(1);
}

const cssPfad = join(dist, treffer[1]);
const css = readFileSync(cssPfad, 'utf8');

const GRENZE = 60 * 1024;
if (css.length > GRENZE) {
  console.error(`css-einbetten: ${Math.round(css.length / 1024)} KB CSS ueberschreiten die Grenze von 60 KB. Nicht eingebettet.`);
  process.exit(1);
}

writeFileSync(htmlPfad, html.replace(treffer[0], `<style>${css}</style>`));
unlinkSync(cssPfad);
console.log(`css-einbetten: ${Math.round(css.length / 1024)} KB eingebettet, ${treffer[1]} entfernt.`);
