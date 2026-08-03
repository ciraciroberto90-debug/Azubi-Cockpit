/* ============================================================================
   Azubi Cockpit — Curriculum (Gerüst über 3,5 Jahre)
   Ausbildungsberuf: Mechatroniker/in
   Grundlage: Ausbildungsrahmenplan (MechatronikerAusbV), IHK "Sachliche und
   zeitliche Gliederung". Zeitrichtwerte in Wochen sind Richtwerte des
   Rahmenplans und werden an den betrieblichen Ausbildungsplan angepasst.

   status: "fertig"  -> Muster-Modul, Inhalte + Blätter vorhanden
           "geruest" -> Struktur angelegt, Inhalte folgen
   ==========================================================================*/
window.AZ_CURRICULUM = {
  beruf: "Mechatroniker/in",
  dauer: "3,5 Jahre (7 Halbjahre)",
  prinzip: ["Aufgabe wird erklärt", "Theorie wird gemacht", "Praxis wird ausgeführt"],

  /* Berufsschule — KMK-Rahmenlehrplan Mechatroniker/in (13 Lernfelder).
     Stunden für LF1–LF4 belegt (Σ 280 h, 1. Jahr). Übrige Zeitrichtwerte
     laut KMK-Rahmenlehrplan — vor Einsatz fachlich prüfen. */
  lernfelder: [
    { nr: 1,  lj: 1, stunden: 40,  titel: "Analysieren von Funktionszusammenhängen in mechatronischen Systemen" },
    { nr: 2,  lj: 1, stunden: 80,  titel: "Herstellen mechanischer Teilsysteme" },
    { nr: 3,  lj: 1, stunden: 100, titel: "Installieren elektrischer Betriebsmittel unter Beachtung sicherheitstechnischer Aspekte" },
    { nr: 4,  lj: 1, stunden: 60,  titel: "Untersuchen der Energie- und Informationsflüsse in elektrischen, pneumatischen und hydraulischen Baugruppen" },
    { nr: 5,  lj: 2, stunden: null, titel: "Kommunizieren mit Hilfe von Datenverarbeitungssystemen" },
    { nr: 6,  lj: 2, stunden: null, titel: "Planen und Organisieren von Arbeitsabläufen" },
    { nr: 7,  lj: 2, stunden: null, titel: "Realisieren mechatronischer Teilsysteme" },
    { nr: 8,  lj: 2, stunden: null, titel: "Design und Erstellen mechatronischer Systeme" },
    { nr: 9,  lj: 3, stunden: null, titel: "Untersuchen des Informationsflusses in komplexen mechatronischen Systemen" },
    { nr: 10, lj: 3, stunden: null, titel: "Planen der Montage und Demontage" },
    { nr: 11, lj: 3, stunden: null, titel: "Inbetriebnahme, Fehlersuche und Instandsetzung" },
    { nr: 12, lj: 3, stunden: null, titel: "Vorbeugende Instandhaltung" },
    { nr: 13, lj: 3, stunden: null, titel: "Übergabe von mechatronischen Systemen an Kundinnen und Kunden" },
  ],

  lehrjahre: [
    /* ------------------------------------------------------------------ LJ1 */
    {
      nr: 1,
      titel: "1. Lehrjahr",
      untertitel: "Grundbildung — Sicherheit, Metall, Kommunikation",
      pruefung: "Teil 1 der Abschlussprüfung (Zwischenprüfung)",
      lernfelder: [1, 2, 3, 4],
      module: [
        {
          id: "m1-arbeitssicherheit",
          titel: "Arbeits- & Gesundheitsschutz, Umweltschutz",
          fach: "Arbeitssicherheit",
          wochen: "durchgängig · Grundkurs 2 Wo.",
          rahmenplan: "Sicherheit u. Gesundheitsschutz bei der Arbeit; Umweltschutz",
          normen: ["DIN EN ISO 7010", "ArbSchG §5", "DGUV", "BetrSichV"],
          status: "fertig",
          beschreibung: "Gefährdungen erkennen, PSA richtig anwenden, Sicherheitszeichen lesen, Gefährdungsbeurteilung — die Basis für alles Weitere.",
        },
        {
          id: "m2-technische-kommunikation",
          titel: "Betriebl. & technische Kommunikation · Techn. Zeichnen (Grundlagen)",
          fach: "Kommunikation / TZ",
          wochen: "7 Wo.",
          rahmenplan: "Betriebliche und technische Kommunikation",
          normen: ["DIN ISO 128-2", "DIN ISO 129-1", "DIN ISO 5455", "DIN EN ISO 7200"],
          status: "fertig",
          beschreibung: "Technische Zeichnungen lesen und erstellen, Skizzen, Stücklisten, Normen.",
        },
        {
          id: "m3-planen-organisieren",
          titel: "Planen und Organisieren der Arbeit, Bewerten der Ergebnisse",
          fach: "Arbeitsplanung",
          wochen: "5 Wo.",
          rahmenplan: "Planen und Organisieren der Arbeit …",
          normen: [],
          status: "fertig",
          beschreibung: "Arbeitsschritte planen, Material/Werkzeug bereitstellen, Ergebnisse bewerten.",
        },
        {
          id: "m4-pruefen-anreissen",
          titel: "Prüfen, Anreißen und Kennzeichnen",
          fach: "Messtechnik",
          wochen: "3 Wo.",
          rahmenplan: "Prüfen, Anreißen und Kennzeichnen",
          normen: ["DIN ISO 2768-1", "DIN EN ISO 286"],
          status: "fertig",
          beschreibung: "Messschieber & Bügelmessschraube lesen, Toleranzen verstehen (ISO 2768), anreißen und körnen.",
        },
        {
          id: "m5-grundkurs-metall",
          titel: "Grundkurs Metall — Manuelles & maschinelles Bearbeiten",
          fach: "Metalltechnik",
          wochen: "11 Wo.",
          rahmenplan: "Manuelles u. maschinelles Spanen, Trennen und Umformen",
          normen: ["DIN ISO 2768-1", "DIN ISO 128-2", "DIN ISO 129-1"],
          status: "fertig",
          beschreibung: "Feilen, Sägen, Bohren, Senken, Gewindeschneiden — mit echten technischen Zeichnungen zum Fertigen und Prüfen.",
        },
        {
          id: "m6-fuegen",
          titel: "Zusammenbauen und Verbinden von Bauteilen (Fügen)",
          fach: "Montage",
          wochen: "4 Wo.",
          rahmenplan: "Zusammenbauen u. Verbinden von Bauteilen u. Baugruppen",
          normen: [],
          status: "fertig",
          beschreibung: "Schraub-, Steck- und Klemmverbindungen; Baugruppen montieren.",
        },
        {
          id: "m7-zp1",
          titel: "Vorbereitung Zwischenprüfung (Teil 1)",
          fach: "Prüfung",
          wochen: "2 Wo.",
          rahmenplan: "gestreckte Abschlussprüfung Teil 1",
          normen: [],
          status: "fertig",
          beschreibung: "Prüfungssimulation praktisch + schriftlich.",
        },
      ],
    },
    /* ------------------------------------------------------------------ LJ2 */
    {
      nr: 2,
      titel: "2. Lehrjahr",
      untertitel: "Aufbau — Elektrotechnik, Pneumatik, Steuerungstechnik",
      pruefung: "",
      lernfelder: [5, 6, 7, 8],
      module: [
        { id: "m8-elektrotechnik", titel: "Grundlagen Elektrotechnik", fach: "Elektrotechnik", wochen: "6 Wo.", rahmenplan: "Elektrische Größen messen u. beurteilen", normen: ["DIN EN 60617", "DIN VDE 0100"], status: "geruest", beschreibung: "Stromkreis, Messen, Schutzmaßnahmen, Stromlaufpläne." },
        { id: "m9-pneumatik", titel: "Pneumatik — Grundlagen", fach: "Pneumatik", wochen: "4 Wo.", rahmenplan: "Steuerungstechnik (pneumatisch)", normen: ["DIN ISO 1219-1", "DIN ISO 1219-2"], status: "geruest", beschreibung: "Zylinder, Ventile, Schaltpläne nach ISO 1219 zeichnen und ergänzen." },
        { id: "m10-elektropneumatik", titel: "Elektropneumatik", fach: "Pneumatik/E-Technik", wochen: "4 Wo.", rahmenplan: "Steuerungstechnik", normen: ["DIN ISO 1219", "DIN EN 60617"], status: "geruest", beschreibung: "Magnetventile, Relaissteuerung, Verknüpfungen." },
        { id: "m11-hydraulik", titel: "Hydraulik — Grundlagen", fach: "Hydraulik", wochen: "3 Wo.", rahmenplan: "Steuerungstechnik (hydraulisch)", normen: ["DIN ISO 1219-1"], status: "geruest", beschreibung: "Druck, Kraft, Ventile, Sicherheit." },
        { id: "m12-sps", titel: "SPS — Grundlagen", fach: "Automatisierung", wochen: "6 Wo.", rahmenplan: "Programmieren mechatronischer Systeme", normen: ["DIN EN 61131-3"], status: "geruest", beschreibung: "Verdrahtung, KOP/FUP, Ein-/Ausgänge." },
        { id: "m13-installation", titel: "Elektrische Installation & Schaltpläne", fach: "Elektrotechnik", wochen: "4 Wo.", rahmenplan: "Installieren elektrischer Baugruppen", normen: ["DIN EN 60617", "DIN EN 81346"], status: "geruest", beschreibung: "Stromlaufpläne lesen & erstellen." },
        { id: "m14-sensorik", titel: "Sensorik & Aktorik", fach: "Automatisierung", wochen: "3 Wo.", rahmenplan: "Aufbauen u. Prüfen von Steuerungen", normen: [], status: "geruest", beschreibung: "Induktiv/kapazitiv/optisch, Antriebe." },
        { id: "m15-montage", titel: "Montage & Inbetriebnahme von Baugruppen", fach: "Montage", wochen: "4 Wo.", rahmenplan: "Zusammenbauen mechatronischer Baugruppen", normen: [], status: "geruest", beschreibung: "Baugruppen prüfen und in Betrieb nehmen." },
      ],
    },
    /* ------------------------------------------------------------------ LJ3 */
    {
      nr: 3,
      titel: "3. Lehrjahr",
      untertitel: "Automatisierung & Prüfungsvorbereitung (inkl. 7. Halbjahr)",
      pruefung: "Teil 2 der Abschlussprüfung",
      lernfelder: [9, 10, 11, 12, 13],
      module: [
        { id: "m16-sps-aufbau", titel: "SPS-Aufbau, Vernetzung & Bus", fach: "Automatisierung", wochen: "5 Wo.", rahmenplan: "Programmieren u. Vernetzen", normen: ["DIN EN 61131-3", "PROFINET"], status: "geruest", beschreibung: "Feldbus/IO-Link, Visualisierung." },
        { id: "m17-antriebstechnik", titel: "Antriebstechnik", fach: "Antriebe", wochen: "4 Wo.", rahmenplan: "Antriebe auswählen u. in Betrieb nehmen", normen: [], status: "geruest", beschreibung: "Motoren, Frequenzumrichter, Parametrieren." },
        { id: "m18-inbetriebnahme", titel: "Automatisierte Systeme in Betrieb nehmen", fach: "Automatisierung", wochen: "5 Wo.", rahmenplan: "Inbetriebnahme mechatronischer Systeme", normen: [], status: "geruest", beschreibung: "Gesamtanlage, Schnittstellen." },
        { id: "m19-fehlersuche", titel: "Fehlersuche & Instandhaltung", fach: "Instandhaltung", wochen: "4 Wo.", rahmenplan: "Instandhalten mechatronischer Systeme", normen: [], status: "geruest", beschreibung: "Systematische Diagnose, Wartungsplan." },
        { id: "m20-programmierung", titel: "Programmierung & Visualisierung", fach: "Automatisierung", wochen: "4 Wo.", rahmenplan: "Programmieren", normen: ["DIN EN 61131-3"], status: "geruest", beschreibung: "Ablaufsteuerungen, HMI." },
        { id: "m21-pruefung2", titel: "Prüfungsvorbereitung Teil 2", fach: "Prüfung", wochen: "6 Wo.", rahmenplan: "betrieblicher Auftrag · Fachgespräch · schriftlich", normen: [], status: "geruest", beschreibung: "Abschlussprüfung Teil 2 gezielt vorbereiten." },
      ],
    },
  ],
};
