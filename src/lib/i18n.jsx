import React, { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

export const translations = {
  de: {
    meta: {
      homeTitle: "Elektriker Alteglofsheim | Elektrotechnik Krasniqi",
      homeDesc: "Elektrotechnik Krasniqi in Alteglofsheim bei Regensburg: Elektroinstallation, Smart Home, Photovoltaik und Wallboxen für Privat und Gewerbe. Jetzt anrufen.",
    },
    nav: {
      services: "Leistungen",
      audiences: "Für wen",
      about: "Unternehmen",
      reviews: "Bewertungen",
      faq: "FAQ",
      contact: "Kontakt",
      cta: "Projekt anfragen",
      projects: "Projekte",
      langLabel: "DE / EN",
    },
    hero: {
      eyebrow: "Elektrotechnik Krasniqi · Alteglofsheim bei Regensburg",
      title1: "Ihr Elektriker in Alteglofsheim für",
      title2: "Installation, Smart Home und Solar",
      desc: "Ob Neubau, Sanierung oder Modernisierung, ob Wohnhaus oder Gewerbeobjekt: Elektrotechnik Krasniqi installiert und wartet Ihre Elektrotechnik – von der Stromversorgung bis zur Wallbox. Sie werden persönlich beraten und erhalten auf Wunsch ein unverbindliches Angebot.",
      descShort: "Elektrotechnik für Wohnhaus und Gewerbe – persönlich beraten, sauber umgesetzt.",
      ctaCall: "Jetzt anrufen",
      scrollHint: "Nach unten scrollen",
      visualNote: "Illustrative Visualisierung der Leistungen – kein ausgeführtes Kundenprojekt.",
    },
    intro: {
      eyebrow: "UNTERNEHMEN",
      title: "Elektrotechnik für Ihr Zuhause und Ihren Betrieb",
      paragraphs: [
        "Elektrotechnik Krasniqi aus Alteglofsheim im Landkreis Regensburg arbeitet für Privat- und Gewerbekunden. Private Bauherren und Eigentümer unterstützen wir bei Neubau, Sanierung und Modernisierung – von der Elektroinstallation über Beleuchtung und Smart Home bis zur Solaranlage und Wallbox.",
        "Für Unternehmen installieren wir die Elektrotechnik in Gewerbeobjekten und entwickeln Beleuchtungskonzepte, die zur Nutzung der Räume passen. Neben neuen Installationen gehören Wartung und Reparatur bestehender Anlagen zu unseren Aufgaben.",
        "Wir hören zu, klären Ihre Anforderungen und stimmen unser Angebot auf Ihr Vorhaben ab.",
      ],
    },
    services: {
      eyebrow: "LEISTUNGEN",
      title: "Unsere Leistungen",
      inquiryLabel: "Hilfreich für Ihre Anfrage",
      illustrationNote: "Symbolbilder zur Veranschaulichung unserer Leistungen.",
      items: {
        elektroinstallation: {
          title: "Elektroinstallation",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/02ee97a53_elektro-krasniqi-verteilerkasten-gross.jpg",
          alt: "Großer industrieller Verteilerkasten mit Schaltanlagen",
          short: "Elektroinstallationen für Neubauten, Sanierungen und Gewerbeobjekte – von neuen Anlagen bis zur Modernisierung bestehender Technik.",
          detail: [
            "Ob Sie neu bauen, ein Bestandsgebäude sanieren oder Gewerberäume einrichten: Die Elektroinstallation ist die Grundlage für Beleuchtung, Technik und Geräte. Wir übernehmen Neuinstallationen ebenso wie die Modernisierung bestehender Anlagen. Der Umfang richtet sich nach Ihrem Vorhaben und dem Zustand der vorhandenen Installation.",
            "Vorab sollte geklärt werden, wie die Räume genutzt werden und wo Steckdosen, Schalter und Anschlüsse benötigt werden. Auch spätere Erweiterungen wie eine Wallbox, eine Solaranlage oder Smart-Home-Funktionen lassen sich dabei berücksichtigen.",
          ],
          inquiry: "Gebäudeart, Neubau oder Bestand, ungefähres Alter der Installation, vorhandene Pläne und Ihr gewünschter Zeitrahmen.",
        },
        "smart-home": {
          title: "Smart Home",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/0b84bb3b0_generated_image.png",
          alt: "Wohnraum mit integrierter Beleuchtung, Beschattung und Wandsteuerung",
          short: "Beschattung, Beleuchtung und Energiemanagement, die sich nach Ihren Bedürfnissen richten – für mehr Komfort im Alltag.",
          detail: [
            "Smart-Home-Technik soll sich nach Ihnen richten. Das kann bedeuten, dass sich die Beschattung am Sonnenstand und der gewünschten Raumtemperatur orientiert, die Beleuchtung zu unterschiedlichen Situationen passt oder ein Energiemanagement die Abläufe im Haus aufeinander abstimmt.",
            "Welche Funktionen sich im Neubau einplanen oder in einem bestehenden Gebäude ergänzen lassen, hängt von der vorhandenen Installation und Ihren Zielen ab. Wichtig ist deshalb, gewünschte Funktionen und bereits vorhandene Geräte frühzeitig zu besprechen.",
          ],
          inquiry: "Neubau oder Bestand, betroffene Räume, gewünschte Funktionen sowie vorhandene Geräte und Systeme.",
        },
        solarinstallation: {
          title: "Photovoltaik / Solarinstallation",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/f97b4b036_elektro-krasniqi-solardach.jpg",
          alt: "Photovoltaikanlage auf einem Flachdach",
          short: "Photovoltaikanlagen für Gebäude, deren Eigentümer einen Teil ihres Strombedarfs selbst aus Sonnenenergie erzeugen möchten.",
          detail: [
            "Mit einer Photovoltaikanlage (PV-Anlage) erzeugen Sie Strom aus Sonnenenergie. Wir installieren PV-Anlagen für Gebäude. Wie viel Ihres Verbrauchs eine Anlage decken kann und ob sie wirtschaftlich zu Ihrem Vorhaben passt, hängt von den individuellen Voraussetzungen ab.",
            "Zu klären sind unter anderem die Ausrichtung und der Zustand der Dachfläche, die vorhandene Elektroinstallation und der Zählerschrank. Auch ein möglicher Stromspeicher und die Anforderungen des Netzbetreibers gehören zu den Abstimmungsfragen. Welche Arbeiten Teil des Auftrags sind, wird im konkreten Angebot festgelegt.",
          ],
          inquiry: "Gebäudeart, ungefähre Dachfläche und Ausrichtung, jährlicher Stromverbrauch sowie vorhandene oder geplante Wallboxen und Wärmepumpen.",
        },
        medientechnik: {
          title: "Medientechnik",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/4196c91ee_elektro-krasniqi-verteiler.jpg",
          alt: "Satelliten-Multischalter mit sauber geführten Koaxkabeln",
          short: "Medientechnik gehört zu unserem Angebot. Ihr Vorhaben und den möglichen Leistungsumfang besprechen wir persönlich mit Ihnen.",
          detail: [
            "Welche Anlagen und Anwendungen für Ihr Vorhaben infrage kommen, klären wir individuell. Schildern Sie uns, was Sie erreichen möchten und welche Ausstattung bereits vorhanden ist.",
          ],
          inquiry: "Betroffene Räume, Neubau oder bestehendes Gebäude sowie vorhandene Geräte und gewünschte Nutzung.",
        },
        netzwerktechnik: {
          title: "Netzwerktechnik",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/265d8e921_PHOTO-2026-10-02-17-32-283.jpg",
          alt: "Serverschrank mit sauber geführten Netzwerkkabeln",
          short: "Netzwerk- und Verkabelungsinfrastruktur für Gewerbe – von der Datenverkabelung bis zu Serverschränken und aktiver Netzwerktechnik.",
          detail: [
            "Eine zuverlässige Netzwerkinfrastruktur ist die Grundlage für reibungslose Abläufe im Betrieb. Wir übernehmen die Datenverkabelung, die Einrichtung von Serverschränken und den Aufbau aktiver Netzwerkkomponenten.",
            "Welche Ausstattung für Ihr Vorhaben sinnvoll ist, hängt von der Gebäudestruktur, der Anzahl der Arbeitsplätze und Ihren Anforderungen ab. Klären Sie frühzeitig, welche Bereiche versorgt und welche Geräte angeschlossen werden müssen.",
          ],
          inquiry: "Gebäudeart, Anzahl der Arbeitsplätze, vorhandene oder geplante Netzwerkkomponenten und gewünschter Zeitrahmen.",
        },
        beleuchtung: {
          title: "Beleuchtung",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/40c34a2bf_elektro-krasniqi-buero.jpg",
          alt: "Heller Innenraum mit Tageslicht und Deckenbeleuchtung",
          short: "Beleuchtungskonzepte für Innenräume, Außenbereiche und Gewerbe – abgestimmt auf die Nutzung und die gewünschte Lichtwirkung, inklusive Lichtmasten für gewerbliche Außenflächen.",
          detail: [
            "Gutes Licht richtet sich danach, wie ein Bereich genutzt wird. Im Wohnraum zählen Atmosphäre und Behaglichkeit, am Arbeitsplatz geeignete Helligkeit und geringe Blendung. Im Außenbereich unterstützt Beleuchtung die Orientierung an Wegen und Eingängen. Für gewerbliche Außenflächen installieren wir zudem Lichtmasten, um großflächig eine gleichmäßige Ausleuchtung zu erreichen.",
            "Wir entwickeln Beleuchtungskonzepte für Innenräume, Außenbereiche und Gewerbe. Vorab besprechen wir, welche Flächen beleuchtet werden sollen, welche Leuchten vorhanden oder vorgesehen sind und wie das Licht geschaltet oder gedimmt werden soll. Eine mögliche Verbindung mit Smart-Home-Funktionen lässt sich ebenfalls klären.",
          ],
          inquiry: "Räume oder Flächen, Fotos, vorhandene oder gewünschte Leuchten und die vorgesehene Nutzung.",
        },
        "wartung-reparatur": {
          title: "Wartung und Reparatur",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/8d62ae689_elektro-krasniqi-verteilerkasten.jpg",
          alt: "Verteilerkasten mit Sicherungen und Überspannungsschutz",
          short: "Vorbeugende Kontrollen und Fehlerbehebung an elektrischen Anlagen sowie Wartung von Wallboxen und Ladepunkten.",
          detail: [
            "Elektrische Anlagen verändern sich mit der Zeit: Bauteile verschleißen und Störungen können auftreten. Vorbeugende Kontrollen helfen, mögliche Schwachstellen zu erkennen. Bei einem Fehler untersuchen wir die Ursache und stimmen die erforderlichen Arbeiten mit Ihnen ab.",
            "Teilen Sie uns mit, ob es um eine aktuelle Störung oder eine geplante Überprüfung geht und welche Teile der Anlage betroffen sind. Auch Wallboxen und Ladepunkte gehören zu unserem Wartungsangebot.",
          ],
          inquiry: "Fehlerbeschreibung, Zeitpunkt des ersten Auftretens, betroffene Räume oder Geräte und ungefähres Alter der Anlage. Fotos nur von außen aufnehmen; keine Abdeckungen elektrischer Anlagen öffnen.",
        },
        "e-ladestationen": {
          title: "E-Ladestationen",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/affcaa250_generated_image.png",
          alt: "Elektroauto beim Laden an einer Wallbox",
          short: "Installation und Wartung von Wallboxen und Ladepunkten – passend zur vorhandenen Elektroinstallation und zur geplanten Nutzung.",
          detail: [
            "Eine eigene Ladestation muss zu Ihrem Fahrzeug, Ihrem Stellplatz und der vorhandenen Elektroinstallation passen. Wir installieren und warten Wallboxen und Ladepunkte.",
            "Vorab klären wir unter anderem die verfügbare Anschlussleistung, den Leitungsweg zum Stellplatz und die geplante Nutzung. Auch die geltenden Anforderungen des Netzbetreibers müssen berücksichtigt werden. Welche Leistungen der Auftrag umfasst, wird individuell abgestimmt.",
          ],
          inquiry: "Fahrzeugmodell, gewünschter Standort, Fotos von Zählerschrank und Stellplatz, ungefähre Entfernung zwischen beiden sowie Angaben zu einer vorhandenen oder geplanten Solaranlage.",
        },
      },
    },
    audiences: {
      eyebrow: "ZIELGRUPPEN",
      title: "Für Privathaushalte und Unternehmen",
      private: {
        title: "Privatkunden",
        text: "Ob Neubau, Sanierung oder ein Zuhause, das mit der Zeit mehr leisten soll: Wir setzen Elektroinstallationen für Wohngebäude um und beraten Sie zu Ihren Möglichkeiten. Bei Modernisierungen klären wir, was die vorhandene Anlage unterstützt und wo Anpassungen erforderlich sind. Dazu passen Beleuchtung, Smart-Home-Funktionen, Solarinstallation und eine Wallbox für Ihr Elektroauto.",
        links: ["elektroinstallation", "smart-home", "solarinstallation", "e-ladestationen"],
      },
      business: {
        title: "Firmenkunden",
        text: "In Gewerbeobjekten bestimmt die Nutzung der Räume, was die Elektrotechnik leisten muss. Deshalb besprechen wir, welche Bereiche versorgt werden sollen, welche Geräte zum Einsatz kommen und welche Beleuchtung benötigt wird. Stimmen Sie frühzeitig mit uns ab, welche betrieblichen Abläufe bei der Umsetzung berücksichtigt werden müssen. Auch bei Wartung und Reparatur bestehender Anlagen unterstützen wir Sie.",
        links: ["elektroinstallation", "netzwerktechnik", "beleuchtung", "wartung-reparatur"],
      },
    },
    process: {
      eyebrow: "PROJEKTABLAUF",
      title: "So kann Ihr Vorhaben starten",
      steps: [
        { title: "Vorhaben beschreiben", text: "Rufen Sie uns an und schildern Sie kurz, was Sie planen oder welches Problem besteht – ob Neubau, Modernisierung, Erweiterung oder Störung." },
        { title: "Anforderungen klären", text: "Gemeinsam besprechen wir Ihre Wünsche, die vorhandene Technik und offene Fragen. Je nach Vorhaben kann ein Termin vor Ort sinnvoll sein." },
        { title: "Weitere Schritte vereinbaren", text: "Anschließend stimmen wir das weitere Vorgehen ab. Auf Wunsch erhalten Sie ein unverbindliches Angebot als Grundlage für Ihre Entscheidung." },
      ],
    },
    about: {
      eyebrow: "UNTERNEHMEN",
      title: "Wie wir arbeiten",
      paragraphs: [
        "Elektrotechnik Krasniqi ist ein Elektrobetrieb mit Sitz in Alteglofsheim im Landkreis Regensburg und langjähriger Erfahrung in der Elektrotechnik. Unser Team legt Wert auf persönliche Zusammenarbeit und einen direkten Austausch.",
        "Am Anfang steht die Beratung: Wir fragen nach, was Sie brauchen und was Sie sich vorstellen, und richten unser Angebot danach aus. Wir arbeiten lösungsorientiert und halten die Abstimmung möglichst unkompliziert.",
        "Bei der Ausführung achten wir auf saubere Arbeit und klare Absprachen. Als regionaler Betrieb sind wir persönlich ansprechbar – vom ersten Gespräch bis zum Abschluss Ihres Vorhabens.",
      ],
    },
    projects: {
      eyebrow: "PROJEKTE",
      title: "Unsere bisherigen Projekte",
      subtitle: "Ein Einblick in abgeschlossene Arbeiten aus den Bereichen Elektroinstallation, Photovoltaik, Netzwerktechnik und Beleuchtung.",
      items: [
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/559e5b54f_PHOTO-2026-10-02-17-44-36.jpg", alt: "Photovoltaikanlage auf Industriedach", caption: "Photovoltaik" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/265d8e921_PHOTO-2026-10-02-17-32-283.jpg", alt: "Serverschrank mit Netzwerkkabeln", caption: "Netzwerktechnik" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/0ea8aad36_PHOTO-2026-10-02-17-55-577.jpg", alt: "LED-Beleuchtungskörper während der Montage", caption: "Beleuchtung" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/83813abe6_PHOTO-2026-10-02-17-55-563.jpg", alt: "Stromversorgung auf einer Baustelle", caption: "Stromversorgung" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/fa9b2f098_PHOTO-2026-10-02-17-35-50.jpg", alt: "Photovoltaikmodule im Detail", caption: "Photovoltaik" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/c828269f1_PHOTO-2026-10-02-17-32-282.jpg", alt: "Netzwerkschrank mit Patchpanel und Switches", caption: "Netzwerktechnik" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/545164cbd_PHOTO-2026-10-02-17-55-576.jpg", alt: "Innenraum mit LED-Lichtbahnen", caption: "Beleuchtung" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/dae2b6915_PHOTO-2026-10-02-18-29-04.jpg", alt: "Lichtmast für gewerbliche Außenbeleuchtung", caption: "Lichtmasten" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/86c5fb369_PHOTO-2026-10-02-17-55-575.jpg", alt: "Außenanlage in der Dämmerung", caption: "Außenanlage" },
        { video: "https://media.base44.com/videos/public/6ab1017905a6126f39abd0a8/08ee2aae2_VIDEO-2026-10-02-17-35-35.mp4", alt: "Photovoltaik-Installation", caption: "Photovoltaik" },
      ],
    },
    reviews: {
      eyebrow: "KUNDENSTIMMEN",
      title: "Was unsere Kunden sagen",
      ratingText: "5,0 von 5 auf Google",
      linkLabel: "Rezensionsprofil auf Google",
      items: [
        { name: "patrick b", initial: "P", quote: "Alles sehr gut gelaufen. Auch nachträgliche wünsche wurden kurzfristig gut umgesetzt. Fehler wurden schnell beseitigt.", link: "https://www.google.com/maps/contrib/107443780903653367260/reviews?hl=de-DE" },
        { name: "D", initial: "D", quote: "Saubere Arbeit!\nPünktlich zum Termin erschienen.\nBei jedem Problem würde ich mich jederzeit wieder Melden!", link: "https://www.google.com/maps/contrib/113763070550452779266/reviews?hl=de-DE" },
        { name: "Aurel Krasniqi", initial: "AK", quote: "Alles sauber und auftragsgemäß erledigt.", link: "https://www.google.com/maps/contrib/116457869132292929234/reviews?hl=de-DE" },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Häufige Fragen",
      items: [
        { q: "Arbeiten Sie für Privat- und Firmenkunden?", a: "Ja. Wir arbeiten für private Haushalte und Gewerbekunden. Dazu gehören Installationen für Neubau und Sanierung, Modernisierungen sowie Wartung und Reparatur bestehender Anlagen. Welche Leistungen zu Ihrem Vorhaben passen, klären wir im persönlichen Gespräch." },
        { q: "Welche Leistungen bieten Sie an?", a: "Unser Angebot umfasst Elektroinstallation, Smart Home, Photovoltaik, Medientechnik, Beleuchtung, Wartung und Reparatur sowie die Installation und Wartung von E-Ladestationen. Wenn Sie Ihr Vorhaben nicht eindeutig zuordnen können, sprechen Sie uns an." },
        { q: "In welcher Region sind Sie tätig?", a: "Unser Betrieb hat seinen Sitz in Alteglofsheim im Landkreis Regensburg. Nennen Sie uns den Projektort, damit wir klären können, ob wir Ihr Vorhaben betreuen können." },
        { q: "Welche Angaben helfen bei der Anfrage?", a: "Hilfreich sind der Projektort, die Gebäudeart, eine kurze Beschreibung Ihres Vorhabens und Ihr gewünschter Zeitrahmen. Vorhandene Pläne und Fotos können die erste Einschätzung erleichtern. Elektrische Anlagen für Fotos nicht öffnen." },
        { q: "Können Sie bestehende Anlagen modernisieren?", a: "Ja. Neben neuen Installationen gehören Modernisierungen bestehender Anlagen zu unserem Angebot. Ob eine Installation ergänzt werden kann oder teilweise erneuert werden sollte, hängt von ihrem Zustand und den geplanten Anforderungen ab." },
        { q: "Wovon hängt der Aufwand eines Projekts ab?", a: "Entscheidend sind unter anderem der Umfang, der Zustand der vorhandenen Anlage, die Zugänglichkeit der Leitungswege und die gewünschte Ausstattung. Eine konkrete Einschätzung ist möglich, nachdem diese Punkte geklärt wurden." },
        { q: "Kann ich ein unverbindliches Angebot erhalten?", a: "Ja. Auf Wunsch erhalten Sie ein unverbindliches Angebot. Dafür besprechen wir zunächst Ihr Vorhaben und die Informationen, die für die Einschätzung erforderlich sind." },
        { q: "Wie erreiche ich Sie?", a: "Sie erreichen uns Montag bis Samstag von 7 bis 19 Uhr telefonisch unter 0160 4141186. Alternativ können Sie unser Kontaktformular nutzen oder an info@elektro-krasniqi.de schreiben." },
      ],
    },
    contact: {
      eyebrow: "KONTAKT",
      title: "Sprechen Sie mit uns über Ihr Vorhaben",
      text: "Rufen Sie uns an und schildern Sie kurz, was Sie planen. Wenn Sie lieber schriftlich anfragen möchten, nutzen Sie das Kontaktformular oder schreiben Sie an info@elektro-krasniqi.de.",
      ctaCall: "Jetzt anrufen",
      phoneLabel: "Telefon",
      phoneValue: "0160 4141186",
      emailLabel: "E-Mail",
      emailValue: "info@elektro-krasniqi.de",
      addressName: "Elektrotechnik Krasniqi",
      street: "Brachweg 5",
      city: "Alteglofsheim",
      hours: "Montag–Samstag: 07:00–19:00 Uhr",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon, optional",
      location: "Projektort",
      service: "Gewünschte Leistung",
      selectService: "Bitte Leistung wählen",
      message: "Nachricht",
      privacyNote: "Informationen zur Verarbeitung Ihrer Angaben finden Sie in unserer",
      privacyLink: "Datenschutzerklärung",
      submit: "Anfrage senden",
      sending: "Wird gesendet …",
      success: "Ihre Anfrage wurde erfolgreich übermittelt.",
      errorRequired: "Bitte füllen Sie dieses Feld aus.",
      errorEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      errorGeneric: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
      notConfigured: "Der E-Mail-Versand ist noch nicht konfiguriert. Ihre Anfrage wurde gespeichert – kontaktieren Sie uns für den direkten Draht bitte telefonisch.",
    },
    footer: {
      tagline: "Elektrotechnik Krasniqi — Ihr regionaler Elektropartner in Bayern.",
      nav: "Navigation",
      legal: "Rechtliches",
      imprint: "Impressum",
      privacy: "Datenschutz",
      designNote: "Designkonzept — Illustratives Motiv",
    },
    imprint: {
      title: "Impressum",
      note: "Angaben gemäß § 5 TMG. Bitte in der Bearbeitungsansicht vervollständigen – fehlende Angaben sind als offen gekennzeichnet.",
      name: "Elektro Technik Krasniqi",
      phone: "Telefon",
      email: "E-Mail",
      addressOpen: "Angaben zur Adresse stehen noch aus (in Bearbeitung).",
      responsibleOpen: "Angaben zur verantwortlichen Person stehen noch aus (in Bearbeitung).",
    },
    privacy: {
      title: "Datenschutzerklärung",
      intro: "Diese Datenschutzerklärung basiert auf den bestehenden Angaben und ist nach Einführung des Kontaktformulars zu prüfen und ggf. anzupassen.",
      sections: [
        { h: "Verantwortlicher", p: "Verantwortlich für die Datenverarbeitung auf dieser Website ist Elektro Technik Krasniqi. (Vollständige Kontaktdaten siehe Impressum.)" },
        { h: "Erhebung bei Kontaktanfragen", p: "Wenn Sie uns über das Kontaktformular eine Anfrage senden, verarbeiten wir die eingegebenen Daten zur Bearbeitung und Beantwortung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen bzw. Vertragserfüllung)." },
        { h: "Speicherung von Anfragen", p: "Anfragen werden über eine Backend-Funktion gespeichert und – soweit konfiguriert – an die bestätigte Firmenadresse gesendet. Die Daten werden nicht öffentlich lesbar abgelegt." },
        { h: "Ihre Rechte", p: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf Datenübertragbarkeit und Widerspruch." },
        { h: "Weitergabe an Dritte", p: "Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur Bearbeitung Ihrer Anfrage erforderlich oder gesetzlich vorgeschrieben ist." },
      ],
    },
    notFound: { title: "Seite nicht gefunden", back: "Zur Startseite" },
  },

  en: {
    meta: {
      homeTitle: "Electrician in Alteglofsheim | Elektrotechnik Krasniqi",
      homeDesc: "Elektrotechnik Krasniqi in Alteglofsheim near Regensburg: electrical installations, smart homes, solar PV and EV charging for homes and businesses.",
    },
    nav: {
      services: "Services",
      audiences: "Homes & businesses",
      about: "About us",
      reviews: "Reviews",
      faq: "FAQ",
      contact: "Contact",
      cta: "Discuss your project",
      projects: "Projects",
      langLabel: "DE / EN",
    },
    hero: {
      eyebrow: "Elektrotechnik Krasniqi · Alteglofsheim near Regensburg",
      title1: "Your electrician in Alteglofsheim for",
      title2: "electrical installations, smart homes and solar",
      desc: "Whether you are building, renovating or upgrading a home or commercial property, Elektrotechnik Krasniqi installs and maintains your electrical systems — from power distribution to EV charging. We provide personal advice and a no-obligation quotation on request.",
      descShort: "Electrical services for homes and businesses — personal advice and careful workmanship.",
      ctaCall: "Call now",
      scrollHint: "Scroll down",
      visualNote: "Illustrative visualization of our services – not a completed customer project.",
    },
    intro: {
      eyebrow: "COMPANY",
      title: "Electrical services for your home and business",
      paragraphs: [
        "Based in Alteglofsheim in the district of Regensburg, Elektrotechnik Krasniqi works with homeowners and businesses. We support residential new builds, renovations and upgrades, covering electrical installations, lighting, smart home technology, solar installations and EV charging.",
        "For businesses, we install electrical systems in commercial properties and develop lighting concepts suited to how each space is used. We also maintain and repair existing installations.",
        "We take the time to understand your requirements and agree on a scope of work that fits your project.",
      ],
    },
    services: {
      eyebrow: "SERVICES",
      title: "Our services",
      inquiryLabel: "Useful information for your enquiry",
      illustrationNote: "Illustrative images representing our services.",
      items: {
        elektroinstallation: {
          title: "Electrical installations",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/02ee97a53_elektro-krasniqi-verteilerkasten-gross.jpg",
          alt: "Large industrial distribution cabinet with switchgear",
          short: "Electrical installations for new builds, renovations and commercial properties, including upgrades to existing systems.",
          detail: [
            "Whether you are building a new property, renovating an existing one or fitting out commercial premises, the electrical installation provides the foundation for lighting, equipment and appliances. We carry out new installations and modernise existing systems. The scope depends on your project and the condition of the existing installation.",
            "Before work begins, it is important to establish how rooms will be used and where sockets, switches and connections are needed. Future additions such as EV charging, solar panels or smart home functions can also be considered.",
          ],
          inquiry: "Property type, new or existing building, approximate installation age, available plans and preferred timeframe.",
        },
        "smart-home": {
          title: "Smart home",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/0b84bb3b0_generated_image.png",
          alt: "Living room with integrated lighting, shading and wall control",
          short: "Shading, lighting and energy management adapted to your needs for greater everyday comfort.",
          detail: [
            "Smart home technology should adapt to your needs. This might mean adjusting shading to the sun and your preferred room temperature, adapting lighting to different activities or coordinating household systems through energy management.",
            "The functions that can be planned into a new build or added to an existing property depend on the electrical installation and your goals. It helps to discuss your priorities and any existing equipment early.",
          ],
          inquiry: "New or existing property, rooms involved, preferred functions and existing devices or systems.",
        },
        solarinstallation: {
          title: "Solar PV installations",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/f97b4b036_elektro-krasniqi-solardach.jpg",
          alt: "Photovoltaic system on a flat roof",
          short: "Solar photovoltaic systems for property owners who want to generate part of their electricity from sunlight.",
          detail: [
            "A photovoltaic (PV) system generates electricity from sunlight. We install solar PV systems for buildings. How much of your consumption a system can cover, and whether it makes financial sense for your project, depends on the individual circumstances.",
            "Points to clarify include the roof's orientation and condition, the existing electrical installation and the meter cabinet. Potential battery storage and grid operator requirements also need consideration. The specific work included is set out in the individual quotation.",
          ],
          inquiry: "Property type, approximate roof area and orientation, annual electricity consumption, and existing or planned EV chargers and heat pumps.",
        },
        medientechnik: {
          title: "Media technology",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/4196c91ee_elektro-krasniqi-verteiler.jpg",
          alt: "Satellite multiswitch with neatly routed coaxial cables",
          short: "Media technology is part of our offering. Contact us to discuss your project and the possible scope.",
          detail: [
            "We discuss suitable systems and applications individually. Tell us what you want to achieve and what equipment is already available.",
          ],
          inquiry: "Rooms involved, new or existing property, existing equipment and intended use.",
        },
        netzwerktechnik: {
          title: "Network technology",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/265d8e921_PHOTO-2026-10-02-17-32-283.jpg",
          alt: "Server rack with neatly routed network cables",
          short: "Network and cabling infrastructure for businesses — from data cabling to server racks and active network equipment.",
          detail: [
            "A reliable network infrastructure is the foundation for smooth operations. We handle data cabling, server rack setup and the installation of active network components.",
            "The right equipment for your project depends on the building layout, the number of workstations and your requirements. Clarify early which areas need to be served and which devices need to be connected.",
          ],
          inquiry: "Property type, number of workstations, existing or planned network components and preferred timeframe.",
        },
        beleuchtung: {
          title: "Lighting",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/40c34a2bf_elektro-krasniqi-buero.jpg",
          alt: "Bright interior with daylight and ceiling lighting",
          short: "Lighting concepts for indoor, outdoor and commercial spaces, based on their use and the desired lighting effect, including light masts for commercial outdoor areas.",
          detail: [
            "Good lighting starts with how a space is used. Living areas call for a comfortable atmosphere, while workplaces need appropriate light levels and limited glare. Outdoor lighting helps people find their way around paths and entrances. For commercial outdoor areas we also install light masts to provide even illumination across large spaces.",
            "We develop lighting concepts for residential and commercial interiors and outdoor spaces. We discuss the areas involved, existing or proposed fixtures, and how the lighting should be switched or dimmed. Potential integration with smart home functions can also be explored.",
          ],
          inquiry: "Rooms or areas involved, photographs, existing or preferred fixtures and intended use.",
        },
        "wartung-reparatur": {
          title: "Maintenance and repairs",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/8d62ae689_elektro-krasniqi-verteilerkasten.jpg",
          alt: "Distribution board with fuses and surge protection",
          short: "Preventive checks and electrical fault finding, plus maintenance for EV chargers and charging points.",
          detail: [
            "Electrical installations change over time. Components wear and faults can develop. Preventive checks help identify potential issues. When a fault occurs, we investigate the cause and discuss the work required.",
            "Let us know whether you are reporting a current fault or planning an inspection, and which parts of the installation are affected. Our maintenance offering also includes EV chargers and charging points.",
          ],
          inquiry: "A description of the fault, when it started, affected rooms or devices and the approximate age of the installation. Only photograph equipment from outside; do not remove electrical covers.",
        },
        "e-ladestationen": {
          title: "EV charging",
          image: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/affcaa250_generated_image.png",
          alt: "Electric car charging at a wallbox",
          short: "Installation and maintenance of EV chargers and charging points, matched to your electrical installation and intended use.",
          detail: [
            "An EV charger needs to suit your vehicle, parking space and existing electrical installation. We install and maintain EV chargers and charging points.",
            "Before work begins, we discuss the available electrical capacity, the cable route to the parking space and your intended charging arrangements. Applicable grid operator requirements also need consideration. The scope of work is agreed individually.",
          ],
          inquiry: "Vehicle model, preferred location, photographs of the meter cabinet and parking space, the approximate distance between them, and details of an existing or planned solar installation.",
        },
      },
    },
    audiences: {
      eyebrow: "CUSTOMER GROUPS",
      title: "For homes and businesses",
      private: {
        title: "Homeowners",
        text: "Whether you are building, renovating or adapting your home to changing needs, we carry out residential electrical installations and explain the available options. For upgrades, we discuss what the existing system can support and where changes are needed. Related services include lighting, smart home functions, solar installations and charging your electric vehicle at home.",
        links: ["elektroinstallation", "smart-home", "solarinstallation", "e-ladestationen"],
      },
      business: {
        title: "Business customers",
        text: "The way commercial premises are used determines their electrical requirements. We discuss which areas need supplying, what equipment will be used and what lighting is appropriate. Let us know early about any operational requirements that need consideration during the work. We also support businesses with maintenance and repairs to existing installations.",
        links: ["elektroinstallation", "netzwerktechnik", "beleuchtung", "wartung-reparatur"],
      },
    },
    process: {
      eyebrow: "PROJECT PROCESS",
      title: "How to get your project started",
      steps: [
        { title: "Tell us what you need", text: "Call us and briefly explain your plans or the issue you are experiencing — whether it concerns a new build, an upgrade, an extension or a fault." },
        { title: "Discuss the requirements", text: "We talk through your priorities, the existing installation and any open questions. Depending on the project, a site visit may be useful." },
        { title: "Agree on the next steps", text: "We discuss how to proceed. A no-obligation quotation is available on request to help you make your decision." },
      ],
    },
    about: {
      eyebrow: "COMPANY",
      title: "How we work",
      paragraphs: [
        "Elektrotechnik Krasniqi is an electrical business based in Alteglofsheim in the district of Regensburg, with longstanding experience in electrical work. Our team values personal cooperation and direct communication.",
        "Every project begins with a conversation. We ask what you need and what you have in mind, then shape our proposal around those requirements. We take a practical approach and keep coordination as straightforward as possible.",
        "During the work, we focus on careful workmanship and clear agreements. As a regional business, we offer personal contact from the initial conversation through to completion.",
      ],
    },
    projects: {
      eyebrow: "PROJECTS",
      title: "Our previous projects",
      subtitle: "A look at completed work across electrical installation, solar, network technology and lighting.",
      items: [
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/559e5b54f_PHOTO-2026-10-02-17-44-36.jpg", alt: "Solar system on an industrial roof", caption: "Solar" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/265d8e921_PHOTO-2026-10-02-17-32-283.jpg", alt: "Server rack with network cables", caption: "Network technology" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/0ea8aad36_PHOTO-2026-10-02-17-55-577.jpg", alt: "LED light fixture being installed", caption: "Lighting" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/83813abe6_PHOTO-2026-10-02-17-55-563.jpg", alt: "Power supply on a construction site", caption: "Power supply" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/fa9b2f098_PHOTO-2026-10-02-17-35-50.jpg", alt: "Solar modules in detail", caption: "Solar" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/c828269f1_PHOTO-2026-10-02-17-32-282.jpg", alt: "Network cabinet with patch panel and switches", caption: "Network technology" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/545164cbd_PHOTO-2026-10-02-17-55-576.jpg", alt: "Interior with LED light tracks", caption: "Lighting" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/dae2b6915_PHOTO-2026-10-02-18-29-04.jpg", alt: "Light mast for commercial outdoor lighting", caption: "Light masts" },
        { src: "https://media.base44.com/images/public/6ab1017905a6126f39abd0a8/86c5fb369_PHOTO-2026-10-02-17-55-575.jpg", alt: "Outdoor area at dusk", caption: "Outdoor" },
        { video: "https://media.base44.com/videos/public/6ab1017905a6126f39abd0a8/08ee2aae2_VIDEO-2026-10-02-17-35-35.mp4", alt: "Solar installation", caption: "Solar" },
      ],
    },
    reviews: {
      eyebrow: "CUSTOMER FEEDBACK",
      title: "What our customers say",
      ratingText: "5.0 out of 5 on Google",
      linkLabel: "View reviewer's profile on Google",
      translationLabel: "English translation",
      items: [
        { name: "patrick b", initial: "P", quote: "Alles sehr gut gelaufen. Auch nachträgliche wünsche wurden kurzfristig gut umgesetzt. Fehler wurden schnell beseitigt.", translation: "Everything went very well. Additional requests were also handled well at short notice. Issues were resolved quickly.", link: "https://www.google.com/maps/contrib/107443780903653367260/reviews?hl=de-DE" },
        { name: "D", initial: "D", quote: "Saubere Arbeit!\nPünktlich zum Termin erschienen.\nBei jedem Problem würde ich mich jederzeit wieder Melden!", translation: "Neat work!\nArrived on time for the appointment.\nI would contact them again whenever a problem comes up!", link: "https://www.google.com/maps/contrib/113763070550452779266/reviews?hl=de-DE" },
        { name: "Aurel Krasniqi", initial: "AK", quote: "Alles sauber und auftragsgemäß erledigt.", translation: "Everything was completed neatly and as agreed.", link: "https://www.google.com/maps/contrib/116457869132292929234/reviews?hl=de-DE" },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        { q: "Do you work with homeowners and businesses?", a: "Yes. We work with residential and commercial customers. Our services include installations for new builds and renovations, upgrades, and maintenance and repairs to existing systems. We discuss which services are appropriate for your project." },
        { q: "What services do you offer?", a: "Our offering includes electrical installations, smart home technology, solar PV, media technology, lighting, maintenance and repairs, and the installation and maintenance of EV charging points. If you are unsure which service fits your project, contact us." },
        { q: "Which areas do you cover?", a: "Our business is based in Alteglofsheim in the district of Regensburg. Tell us your project location so we can confirm whether we can take on work in your area." },
        { q: "What information should I provide when making an enquiry?", a: "Please include the project location, property type, a brief description of your plans and your preferred timeframe. Existing plans and photographs can help with an initial assessment. Do not open electrical equipment to take photographs." },
        { q: "Can you upgrade existing installations?", a: "Yes. Alongside new installations, we modernise existing systems. Whether an installation can be extended or needs partial replacement depends on its condition and the planned requirements." },
        { q: "What determines the amount of work involved?", a: "Relevant factors include the project scope, the condition of the existing system, access to cable routes and the equipment you require. A specific assessment is possible once these points have been clarified." },
        { q: "Can I request a no-obligation quotation?", a: "Yes. A no-obligation quotation is available on request. We first discuss your project and the information needed to assess it." },
        { q: "How can I contact you?", a: "You can call us Monday to Saturday, from 7 am to 7 pm, on +49 160 4141186. Alternatively, use our contact form or email info@elektro-krasniqi.de." },
      ],
    },
    contact: {
      eyebrow: "CONTACT",
      title: "Tell us about your project",
      text: "Call us and briefly explain what you are planning. If you prefer to contact us in writing, use our contact form or email info@elektro-krasniqi.de.",
      ctaCall: "Call now",
      phoneLabel: "Phone",
      phoneValue: "+49 160 4141186",
      emailLabel: "Email",
      emailValue: "info@elektro-krasniqi.de",
      addressName: "Elektrotechnik Krasniqi",
      street: "Brachweg 5",
      city: "Alteglofsheim",
      hours: "Monday–Saturday: 7 am–7 pm",
      name: "Name",
      email: "Email",
      phone: "Phone, optional",
      location: "Project location",
      service: "Service required",
      selectService: "Please select a service",
      message: "Message",
      privacyNote: "Information about how your details are processed is available in our",
      privacyLink: "privacy policy",
      submit: "Send enquiry",
      sending: "Sending…",
      success: "Your enquiry has been sent successfully.",
      errorRequired: "Please complete this field.",
      errorEmail: "Please enter a valid email address.",
      errorGeneric: "Your enquiry could not be sent. Please try again or call us.",
      notConfigured: "Email delivery is not yet configured. Your enquiry has been saved – please call us for a direct line.",
    },
    footer: {
      tagline: "Elektrotechnik Krasniqi — your regional electrical partner in Bavaria.",
      nav: "Navigation",
      legal: "Legal",
      imprint: "Legal notice",
      privacy: "Privacy policy",
      designNote: "Design concept — illustrative motif",
    },
    imprint: {
      title: "Imprint",
      note: "Information according to § 5 TMG. Please complete in the editing view – missing details are marked as open.",
      name: "Elektro Technik Krasniqi",
      phone: "Phone",
      email: "Email",
      addressOpen: "Address details are pending (in progress).",
      responsibleOpen: "Details of the responsible person are pending (in progress).",
    },
    privacy: {
      title: "Privacy policy",
      intro: "This privacy policy is based on existing information and must be reviewed and adapted where necessary after the contact form is introduced.",
      sections: [
        { h: "Controller", p: "Responsible for data processing on this website is Elektro Technik Krasniqi. (Full contact details see imprint.)" },
        { h: "Collection for enquiries", p: "When you send us an enquiry via the contact form, we process the data you enter to handle and answer your enquiry. The legal basis is Art. 6 (1) (b) GDPR (pre-contractual measures / contract performance)." },
        { h: "Storage of enquiries", p: "Enquiries are stored via a backend function and – where configured – sent to the confirmed company address. The data is not stored in publicly readable form." },
        { h: "Your rights", p: "You have the right to information, rectification, deletion and restriction of processing of your personal data, as well as the right to data portability and to object." },
        { h: "Disclosure to third parties", p: "Your data is only disclosed to third parties insofar as this is necessary to handle your enquiry or required by law." },
      ],
    },
    notFound: { title: "Page not found", back: "To the home page" },
  },
};

const I18nContext = createContext({ lang: "de", t: translations.de });

export function I18nProvider({ children }) {
  const location = useLocation();
  const lang = useMemo(() => {
    const seg = location.pathname.split("/")[1];
    return seg === "en" ? "en" : "de";
  }, [location.pathname]);
  const value = useMemo(() => ({ lang, t: translations[lang], other: translations[lang === "de" ? "en" : "de"] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useLangPath() {
  const { lang } = useI18n();
  return (path) => `/${lang}${path}`;
}