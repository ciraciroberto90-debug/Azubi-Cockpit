/* ============================================================================
   Modul-Inhalt: Vorbereitung Zwischenprüfung (Teil 1 der gestreckten Prüfung)
   Rahmenplan: gestreckte Abschlussprüfung Teil 1 (2 Wo.)
   Kombiniert die Inhalte des 1. Lehrjahres (Prüfungssimulation).
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

AZ_CONTENT["m7-zp1"] = {
  intro: "Vorbereitung auf Teil 1 der Abschlussprüfung: ein komplexes Prüfungsstück fertigen und prüfen sowie " +
    "eine schriftliche Wiederholung aus allen Themen des 1. Lehrjahres.",
  bausteine: [
    {
      id: "zp-info", typ: "aufgabe", titel: "Überblick: Prüfung Teil 1", blattNr: "ZP-A01", render: function () {
        return '<div class="bl-meta"><span>Überblick</span><span>Woche 1</span></div>' +
          '<h3>Gestreckte Abschlussprüfung — Teil 1</h3><p>Teil 1 findet am Ende des 1. bzw. Anfang des 2. Ausbildungsjahres statt und prüft die Grundlagen: ' +
          '<strong>Fertigen eines Werkstücks</strong> (Metallbearbeitung) sowie <strong>schriftliche Aufgaben</strong> (technische Zeichnung, Messen, Toleranzen, Sicherheit).</p>' +
          '<h3>So bereitest du dich vor</h3><ul class="ul"><li>Prüfungsstück nach Zeichnung fertigen (ZP-Ü01)</li>' +
          '<li>schriftliche Wiederholung (ZP-Ü02)</li><li>Sicherheitsregeln &amp; Prüfmittel beherrschen</li></ul>';
      },
    },
    {
      id: "zp-stueck", typ: "praxis", titel: "Prüfungssimulation: Werkstück fertigen & prüfen", blattNr: "ZP-Ü01", render: function () {
        return leseAufgabe({
          meta: ["Prüfungsstück", "Woche 1", "ZP-Ü01"],
          hinweis: "Fertige das Werkstück nach Zeichnung und prüfe es mit den richtigen Prüfmitteln (wie in der Prüfung).",
          text: "Fertige die Halteplatte nach Zeichnung; halte alle Maße, die Passung ⌀12 H9 und das Gewinde M8 ein. Beantworte anschließend die Prüfungsfragen.",
          api: AZ.parts.platte({ benennung: "Prüfungsstück", nummer: "ZP-190", w: 90, h: 50, t: 15, fase: 2, ra: "3,2", features: [{ typ: "bohrung", x: 25, y: 25, d: 12, passung: "H9" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }),
          fragen: ["Welche Grenzabmaße gelten für die Länge 90 mm (ISO 2768-m)?",
            "Mit welchem Prüfmittel prüfst du ⌀12 H9?",
            "Welchen Kernloch-⌀ bohrst du für M8?",
            "Welche PSA trägst du beim Bohren — und was ist verboten?"],
          loesungen: ["±0,3 mm (Bereich >30–120).", "Grenzlehrdorn 12 H9.", "6,8 mm (DIN 13).",
            "Schutzbrille, Sicherheitsschuhe, Gehörschutz; Handschuhe sind an der Bohrmaschine verboten (ISO 7010 P028)."],
        });
      },
    },
    {
      id: "zp-schriftlich", typ: "theorie", titel: "Schriftliche Wiederholung (alle Themen)", blattNr: "ZP-Ü02", render: function () {
        return '<div class="bl-meta"><span>Wiederholung</span><span>Woche 2</span><span>1. Lehrjahr gesamt</span></div>' +
          '<h3>Fragen aus allen Modulen</h3>' +
          '<p class="frage">1. Welche Form/Farbe hat ein Gebotszeichen? ____________________</p>' +
          '<p class="frage">2. Nenne die Linienart für verdeckte Kanten. ____________________</p>' +
          '<p class="frage">3. Berechne n für ⌀10 bei v_c = 35 m/min. ____________________</p>' +
          '<p class="frage">4. Grenzabmaß für 45 mm nach ISO 2768-m? ____________________</p>' +
          '<p class="frage">5. Kernloch-⌀ für M6? ____________________</p>' +
          '<p class="frage">6. Ist H7/g6 eine Spiel- oder Presspassung? ____________________</p>' +
          '<p class="frage">7. In welcher Reihenfolge gilt das TOP-Prinzip? ____________________</p>' +
          '<details class="loesung-box"><summary>Lösung anzeigen</summary><ol class="ol">' +
          '<li>Rund, blau (weißes Piktogramm).</li><li>Schmale Strichlinie.</li>' +
          '<li>n = 35·1000/(π·10) ≈ 1114 min⁻¹.</li><li>±0,3 mm.</li><li>5,0 mm.</li>' +
          '<li>Spielpassung.</li><li>Technisch → Organisatorisch → Personenbezogen.</li></ol></details>';
      },
    },
  ],
};
