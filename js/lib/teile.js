/* ============================================================================
   Azubi Cockpit — Parametrischer Teile-Generator
   Beschreibt ein Werkstück als Daten -> erzeugt normgerechte Zeichnung
   (Vorderansicht + Schnitt A–A + Bemaßung + Schriftfeld) und leitet daraus
   automatisch die Prüfmaße ab. Baut auf AZ.Blatt / AZ.Pen (zeichnung.js) auf.
   ==========================================================================*/
window.AZ = window.AZ || {};
AZ.parts = AZ.parts || {};

/* Kernlochdurchmesser metr. ISO-Regelgewinde (DIN 13, mm) */
AZ.KERNLOCH = { M3: 2.5, M4: 3.3, M5: 4.2, M6: 5.0, M8: 6.8, M10: 8.5, M12: 10.2 };
/* Steigung P (mm) */
AZ.STEIGUNG = { M3: 0.5, M4: 0.7, M5: 0.8, M6: 1.0, M8: 1.25, M10: 1.5, M12: 1.75 };
/* Grundtoleranz IT9 (µm) je Nennmaßbereich (DIN EN ISO 286) */
AZ.IT9 = { grenzen: [3, 6, 10, 18, 30, 50, 80, 120], w: [25, 30, 36, 43, 52, 62, 74, 87] };

AZ.itWert = function (d, tab) {
  for (var i = 0; i < tab.grenzen.length; i++) if (d <= tab.grenzen[i]) return tab.w[i];
  return tab.w[tab.w.length - 1];
};
/* Passung H9 (Bohrung): unteres Abmaß 0, oberes +IT9 (in mm) */
AZ.passungH9 = function (d) {
  var it = AZ.itWert(d, AZ.IT9) / 1000;
  return { ob: it, un: 0, text: "+" + AZ.mm(it) + " / 0" };
};
AZ.mm = function (v) { return (v).toFixed(3).replace(/0+$/, "").replace(/\.$/, "").replace(".", ","); };

/* -------- Feature normalisieren -------- */
function azNormFeature(f) {
  var g = { typ: f.typ, x: f.x, y: f.y };
  if (f.typ === "gewinde") { g.gew = f.gew; g.nom = parseFloat(f.gew.slice(1)); g.core = AZ.KERNLOCH[f.gew]; }
  else { g.d = f.d; g.passung = f.passung || null; g.senkung = f.senkung || null; }
  return g;
}

/* ==========================================================================
   AZ.parts.platte(spec) — rechteckige Platte mit Bohrungen/Gewinden
   spec: { benennung, nummer, werkstoff, toleranz, w, h, t,
           features:[{typ:'bohrung',x,y,d,passung,senkung:{d}} |
                     {typ:'gewinde',x,y,gew:'M8'}],
           fase, ra, schnitt:true, schnittY }
   ========================================================================== */
AZ.parts.platte = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", schnitt: true, features: [] }, spec);
  spec._features = spec.features.map(azNormFeature);
  if (spec.schnittY == null) spec.schnittY = spec.h / 2;
  return {
    spec: spec,
    svg: function (modus) { return azBuildPlatte(spec, modus === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () { return azPlatteMasse(spec); },
  };
};

function azBuildPlatte(spec, modus) {
  var voll = (modus === "fertig");
  var w = spec.w, h = spec.h, t = spec.t, fase = spec.fase || 0;
  var b = new AZ.Blatt({
    format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff,
    nummer: spec.nummer, toleranz: spec.toleranz, ersteller: "Azubi",
  });
  var schnitt = voll && spec.schnitt && spec._features.length > 0;
  var gap = 15, sy0 = h + gap, sy1 = sy0 + t;
  var yBot = schnitt ? (sy1 + 12) : (h + 12);
  var world = { x: -16, y: -18, w: w + 30, h: yBot + 18 };

  b.zeichnung(world, function (p) {
    /* ---- Vorderansicht ---- */
    p.fill(0, 0, w, h);
    p.rect(0, 0, w, h, "az-vis");
    var feats = spec._features;
    // horizontale Mittellinie auf Schnitthöhe
    p.center(-5, spec.schnittY, w + 5, spec.schnittY);
    feats.forEach(function (f, i) {
      p.center(f.x, -5, f.x, h + 5);
      if (!voll && i > 0) { p.text(f.x - 0.6, f.y + 1.5, "?", "az-todo"); return; }
      if (f.typ === "gewinde") p.gewindeFront(f.x, f.y, f.nom, f.core);
      else { p.circle(f.x, f.y, f.d / 2, "az-vis"); if (f.senkung) p.circle(f.x, f.y, f.senkung.d / 2, "az-thin"); }
    });
    if (schnitt) p.schnittlinie(-6, w + 6, spec.schnittY, "A");

    /* ---- Schnitt A–A ---- */
    if (schnitt) {
      var outline = fase
        ? [[0, sy0 + fase], [fase, sy0], [w - fase, sy0], [w, sy0 + fase], [w, sy1], [0, sy1]]
        : [[0, sy0], [w, sy0], [w, sy1], [0, sy1]];
      var holes = feats.map(function (f) {
        var sw = (f.typ === "gewinde") ? f.core : f.d;
        return [[f.x - sw / 2, sy0], [f.x + sw / 2, sy0], [f.x + sw / 2, sy1], [f.x - sw / 2, sy1]];
      });
      p.hatchPoly(outline, holes, 2.4);
      p.poly(outline, "az-vis");
      feats.forEach(function (f) {
        if (f.typ === "gewinde") {
          p.line(f.x - f.core / 2, sy0, f.x - f.core / 2, sy1, "az-vis");
          p.line(f.x + f.core / 2, sy0, f.x + f.core / 2, sy1, "az-vis");
          p.line(f.x - f.nom / 2, sy0, f.x - f.nom / 2, sy1, "az-thin");
          p.line(f.x + f.nom / 2, sy0, f.x + f.nom / 2, sy1, "az-thin");
        } else {
          p.line(f.x - f.d / 2, sy0, f.x - f.d / 2, sy1, "az-vis");
          p.line(f.x + f.d / 2, sy0, f.x + f.d / 2, sy1, "az-vis");
          if (f.senkung) {
            var dep = (f.senkung.d - f.d) / 2;
            p.line(f.x - f.senkung.d / 2, sy0, f.x - f.d / 2, sy0 + dep, "az-vis");
            p.line(f.x + f.senkung.d / 2, sy0, f.x + f.d / 2, sy0 + dep, "az-vis");
          }
        }
        p.center(f.x, sy0 - 2, f.x, sy1 + 2);
      });
      p.text(w / 2 - 12, sy1 + 10, "SCHNITT A–A", "az-lblb");
    } else if (!voll) {
      p._p('<rect x="' + p.X(0) + '" y="' + p.Y(h + gap) + '" width="' + (w * p.s).toFixed(2) +
        '" height="' + (t * p.s).toFixed(2) + '" class="az-thin" stroke-dasharray="1.5 1.5" fill="none"/>');
      p.text(w / 2 - 14, h + gap + t / 2, "Schnitt A–A ergänzen", "az-note");
    }

    /* ---- Bemaßung ---- */
    if (voll) {
      p.dimH(0, w, -16, 0);
      var xs = feats.map(function (f) { return f.x; }).sort(function (a, c) { return a - c; });
      var prev = 0;
      xs.forEach(function (fx) { if (fx - prev > 0.5) p.dimH(prev, fx, -8, 0); prev = fx; });
      p.dimV(0, h, -14, 0);
      if (schnitt) p.dimV(sy0, sy1, w + 6, w);
      feats.forEach(function (f, i) {
        var ang = (i % 2 === 0) ? -132 : -48;
        if (f.typ === "gewinde") p.dimDia(f.x, f.y, f.nom / 2, ang, null, { text: f.gew });
        else p.dimDia(f.x, f.y, f.d / 2, ang, null, { text: "⌀" + AZ.mm(f.d) + (f.passung ? " " + f.passung : "") });
      });
      if (fase && schnitt) { p.line(fase, sy0, -6, sy0 - 3, "az-thin"); p.text(-15, sy0 - 3.5, AZ.mm(fase) + "×45°", "az-dimtx"); }
      if (spec.ra) p.oberflaeche(w * 0.86, h, spec.ra);
    } else {
      p.dimH(0, w, -16, 0, { text: "?", cls: "az-todo" });
      p.dimV(0, h, -14, 0, { text: "?", cls: "az-todo" });
      var f0 = feats[0];
      if (f0) p.dimDia(f0.x, f0.y, (f0.d || f0.nom) / 2, -132, null, { text: "?", cls: "az-todo" });
    }
  });
  return b.svg();
}

/* Prüfmaße automatisch aus der Werkstückbeschreibung ableiten */
function azPlatteMasse(spec) {
  var kl = spec.toleranz;
  function tolLen(v) { return "±" + AZ.mm(AZ.grenzabmass(v, kl)) + " (2768-" + kl + ")"; }
  var rows = [
    { name: "Länge", soll: AZ.mm(spec.w) + " mm", tol: tolLen(spec.w), mittel: "Messschieber" },
    { name: "Breite", soll: AZ.mm(spec.h) + " mm", tol: tolLen(spec.h), mittel: "Messschieber" },
    { name: "Dicke", soll: AZ.mm(spec.t) + " mm", tol: tolLen(spec.t), mittel: "Messschieber" },
  ];
  spec._features.forEach(function (f) {
    if (f.typ === "gewinde") rows.push({ name: "Gewinde", soll: f.gew, tol: "—", mittel: "Gewindelehrdorn" });
    else if (f.passung === "H9") { var pz = AZ.passungH9(f.d); rows.push({ name: "Passbohrung", soll: "⌀" + AZ.mm(f.d) + " H9", tol: pz.text, mittel: "Grenzlehrdorn" }); }
    else rows.push({ name: "Bohrung", soll: "⌀" + AZ.mm(f.d), tol: "±" + AZ.mm(AZ.grenzabmass(f.d, kl)), mittel: "Messschieber" });
  });
  return rows;
}

/* ==========================================================================
   AZ.parts.biegeteil(spec) — abgekantetes Blechteil (Seitenprofil)
   spec:{ benennung,nummer,werkstoff,toleranz, a (Schenkel waagr.),
          b (Schenkel senkr.), t (Blechdicke), r (Biegeradius), winkel:90 }
   ========================================================================== */
AZ.parts.biegeteil = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", r: 3, winkel: 90 }, spec);
  return {
    spec: spec,
    svg: function (modus) { return azBuildBiege(spec, modus === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz;
      return [
        { name: "Schenkel a", soll: AZ.mm(spec.a) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.a, kl)), mittel: "Messschieber" },
        { name: "Schenkel b", soll: AZ.mm(spec.b) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.b, kl)), mittel: "Messschieber" },
        { name: "Blechdicke t", soll: AZ.mm(spec.t) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.t, kl)), mittel: "Messschieber" },
        { name: "Biegewinkel", soll: spec.winkel + "°", tol: "±1° (2768-m)", mittel: "Winkelmesser" },
        { name: "Biegeradius", soll: "R" + AZ.mm(spec.r), tol: "—", mittel: "Radiuslehre" },
      ];
    },
  };
};

/* ==========================================================================
   AZ.parts.bolzen(spec) — Rundbolzen mit Außengewinde (Seitenansicht)
   spec:{ benennung,nummer,werkstoff,toleranz, d (Nenn-⌀), l (Länge),
          gew:'M10', fase:1 }
   Außengewinde DIN ISO 6410: Nenn-⌀ breit (Außenkontur), Kern-⌀ schmal innen.
   ========================================================================== */
AZ.parts.bolzen = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", fase: 1 }, spec);
  spec.d = spec.d || parseFloat(spec.gew.slice(1));
  return {
    spec: spec,
    svg: function (modus) { return azBuildBolzen(spec, modus === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz;
      return [
        { name: "Länge", soll: AZ.mm(spec.l) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.l, kl)), mittel: "Messschieber" },
        { name: "Gewinde", soll: spec.gew, tol: "—", mittel: "Gewindelehrring" },
        { name: "Fase", soll: AZ.mm(spec.fase) + "×45°", tol: "—", mittel: "Sichtprüfung" },
      ];
    },
  };
};

function azBuildBolzen(spec, modus) {
  var voll = (modus === "fertig");
  var l = spec.l, d = spec.d, f = spec.fase, td = 0.9; // Gewindetiefe (Darstellung)
  var b = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  var world = { x: -16, y: -18, w: l + 34, h: d + 40 };
  b.zeichnung(world, function (p) {
    p.fill(0, 0, l, d);
    // Außenkontur (Nenn-⌀, breit) mit Fase am rechten Ende
    p.line(0, 0, l - f, 0, "az-vis"); p.line(l - f, 0, l, f, "az-vis");
    p.line(0, d, l - f, d, "az-vis"); p.line(l - f, d, l, d - f, "az-vis");
    p.line(l, f, l, d - f, "az-vis"); p.line(0, 0, 0, d, "az-vis");
    // Kern-⌀ (schmal) innen
    if (voll) {
      p.line(0, td, l - f, td, "az-thin");
      p.line(0, d - td, l - f, d - td, "az-thin");
    }
    p.center(-4, d / 2, l + 4, d / 2);
    if (voll) {
      p.dimH(0, l, d + 9, d);
      // Gewinde-Bezeichnung als Hinweislinie
      p.line(l * 0.45, 0, l * 0.45 - 5, -6, "az-thin");
      p.text(l * 0.45 - 16, -7, spec.gew, "az-dimtx");
      p.text(l - f - 2, -3, AZ.mm(f) + "×45°", "az-dimtx");
    } else {
      p.dimH(0, l, d + 9, d, { text: "?", cls: "az-todo" });
      p.text(l * 0.45 - 8, -7, "?", "az-todo");
    }
  });
  return b.svg();
}

function azBuildBiege(spec, modus) {
  var voll = (modus === "fertig");
  var A = spec.a, B = spec.b, t = spec.t, r = spec.r;
  var b = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  // Seitenprofil eines rechtwinklig gebogenen Blechs (L), gleichmäßige Dicke t.
  // Senkrechter Schenkel: x[0..t], y[0..B]; waagerechter Schenkel: y[B-t..B], x[0..A].
  var world = { x: -16, y: -16, w: A + 34, h: B + 34 };
  b.zeichnung(world, function (p) {
    var X = function (x) { return p.X(x); }, Y = function (y) { return p.Y(y); };
    var rs = r * p.s;
    // Geschlossene Außenkontur mit Innen-Rundung (Biegeradius r)
    var d = "M" + X(0) + "," + Y(0) +
      " L" + X(t) + "," + Y(0) +
      " L" + X(t) + "," + Y(B - t - r) +
      " A" + rs.toFixed(2) + "," + rs.toFixed(2) + " 0 0 0 " + X(t + r) + "," + Y(B - t) +
      " L" + X(A) + "," + Y(B - t) +
      " L" + X(A) + "," + Y(B) +
      " L" + X(0) + "," + Y(B) + " Z";
    p._p('<path d="' + d + '" class="az-vis" fill="none"/>');
    if (voll) {
      p.dimH(0, A, B + 8, B);            // a
      p.dimV(0, B, -12, 0);              // b
      p.dimV(B - t, B, A + 8, A);        // t
      p.text(t + r + 1.5, B - t - r + 1, "R" + AZ.mm(r), "az-dimtx");
      p.text(t + 3.5, B - t - r - 4, spec.winkel + "°", "az-dimtx");
    } else {
      p.dimH(0, A, B + 8, B, { text: "?", cls: "az-todo" });
      p.dimV(0, B, -12, 0, { text: "?", cls: "az-todo" });
      p.text(t + 3.5, B - t - r - 4, "?", "az-todo");
    }
  });
  return b.svg();
}
