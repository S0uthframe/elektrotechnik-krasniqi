#!/usr/bin/env python3
"""
Rechnet die Originalbilder aus medien-original/ in die Fassungen um, die die
Seite ausliefert, und legt sie unter public/media/ ab.

    python3 tools/bilder_rechnen.py

Bewusst KEIN Schritt im Build: Das Ergebnis liegt im Repository. Sonst
bräuchte jeder Build Pillow, und jeder Entwickler dieselbe Version — für
Dateien, die sich praktisch nie ändern. Das Skript läuft, wenn Bilder
dazukommen oder ausgetauscht werden.

Warum überhaupt lokal statt über das Bild-CDN: Gemessen am dunklen Hero-Bild
lieferte das CDN 579 KB, dieselbe Vorlage hier kodiert wiegt 38 KB. Die
Ursache ist die Nachschärfung (usm) in der CDN-Adresse zusammen mit
quality_auto — beides lässt sich von außen nicht abstellen.
"""

import json
import os
from pathlib import Path

from PIL import Image

WURZEL = Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "medien-original"
ZIEL = WURZEL / "public" / "media"

# Profile. "breiten" skaliert auf Breite, "hoehen" auf Höhe — das Laufband
# gibt die Höhe vor (h-72 = 288 px) und lässt die Breite laufen, der Hero
# füllt die Fläche und gibt die Breite vor.
PROFILE = {
    "hero": {"breiten": [1280, 1672], "qualitaet": 72},
    "projekt": {"hoehen": [300, 600], "qualitaet": 72},
}

# Sofortbild: 48 Pixel breit, unscharf hochskaliert. Es wird als data-URI in
# index.html und in die Komponente geschrieben und braucht damit keinen
# eigenen Netzabruf — es steht, sobald das Dokument da ist.
SOFORT_BREITE = 48
SOFORT_QUALITAET = 40


def profil_fuer(name):
    return "hero" if name.startswith("hero-") else "projekt"


def speichern(bild, pfad, qualitaet):
    pfad.parent.mkdir(parents=True, exist_ok=True)
    bild.save(pfad, "WEBP", quality=qualitaet, method=6)
    return pfad.stat().st_size


def sofortbild(bild):
    import base64
    import io

    hoehe = max(1, round(bild.height * SOFORT_BREITE / bild.width))
    klein = bild.resize((SOFORT_BREITE, hoehe), Image.LANCZOS)
    puffer = io.BytesIO()
    klein.save(puffer, "WEBP", quality=SOFORT_QUALITAET, method=6)
    roh = base64.b64encode(puffer.getvalue()).decode("ascii")
    return f"data:image/webp;base64,{roh}"


def main():
    zuordnung = json.loads((QUELLE / "zuordnung.json").read_text(encoding="utf-8"))
    sofortbilder = {}
    gesamt = 0

    for name, datei in sorted(zuordnung.items()):
        if not datei:
            print(f"  {name}: keine Originaldatei zugeordnet — übersprungen")
            continue
        pfad = QUELLE / datei
        if not pfad.is_file():
            print(f"  {name}: {datei} nicht gefunden — übersprungen")
            continue

        bild = Image.open(pfad).convert("RGB")
        profil = PROFILE[profil_fuer(name)]
        zeile = []

        for breite in profil.get("breiten", []):
            if breite > bild.width:
                continue
            k = bild.resize((breite, round(bild.height * breite / bild.width)), Image.LANCZOS)
            groesse = speichern(k, ZIEL / f"{name}-{breite}w.webp", profil["qualitaet"])
            gesamt += groesse
            zeile.append(f"{breite}w: {groesse // 1024} KB")

        for hoehe in profil.get("hoehen", []):
            if hoehe > bild.height:
                continue
            k = bild.resize((round(bild.width * hoehe / bild.height), hoehe), Image.LANCZOS)
            groesse = speichern(k, ZIEL / f"{name}-{hoehe}h.webp", profil["qualitaet"])
            gesamt += groesse
            zeile.append(f"{hoehe}h: {groesse // 1024} KB")

        sofortbilder[name] = sofortbild(bild)
        print(f"  {name}: {', '.join(zeile)}")

    ziel_js = WURZEL / "src" / "lib" / "sofortbilder.js"
    inhalt = (
        "// Erzeugt von tools/bilder_rechnen.py — nicht von Hand ändern.\n"
        "// 48 Pixel breite Vorstufen als data-URI: kein Netzabruf, sofort da.\n"
        "export const SOFORTBILDER = "
        + json.dumps(sofortbilder, indent=2, ensure_ascii=False)
        + ";\n"
    )
    ziel_js.write_text(inhalt, encoding="utf-8")

    print(f"\n{len(sofortbilder)} Bilder, {gesamt // 1024} KB in public/media/")
    print(f"Sofortbilder in {ziel_js.relative_to(WURZEL)}")


if __name__ == "__main__":
    main()
