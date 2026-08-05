/* ============================================================================
   Azubi Cockpit — Parametrischer Teile-Generator
   Beschreibt ein Werkstück als Daten -> erzeugt normgerechte Zeichnung
   (Vorderansicht + Schnitt A–A + Bemaßung + Schriftfeld) und leitet daraus
   automatisch die Prüfmaße ab. Baut auf AZ.Blatt / AZ.Pen (zeichnung.js) auf.
   ==========================================================================*/
window.AZ = window.AZ || {};
AZ.parts = AZ.parts || {};

/* Lochkreis-Positionen (Teilkreis) — hier definiert, damit teile.js
   unabhängig von der Ladereihenfolge funktioniert. */
if (typeof azTeilkreis === "undefined") {
  window.azTeilkreis = function (cx, cy, r, n, start, d) {
    var arr = [], a0 = (start == null ? 45 : start) * Math.PI / 180;
    for (var i = 0; i < n; i++) { var a = a0 + i * 2 * Math.PI / n; arr.push({ typ: "bohrung", x: +(cx + r * Math.cos(a)).toFixed(1), y: +(cy + r * Math.sin(a)).toFixed(1), d: d }); }
    return arr;
  };
}

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

/* ==========================================================================
   AZ.parts.welle(spec) — Rundteil/Welle mit Absätzen (Seitenansicht)
   spec:{ benennung,nummer,werkstoff,toleranz, abschnitte:[{d,l}], fase }
   ========================================================================== */
AZ.parts.welle = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", fase: 1, abschnitte: [] }, spec);
  return {
    spec: spec,
    svg: function (m) { return azBuildWelle(spec, m === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz, rows = [], L = 0;
      spec.abschnitte.forEach(function (s, i) {
        rows.push({ name: "Abschnitt " + (i + 1), soll: "⌀" + AZ.mm(s.d) + " × " + AZ.mm(s.l), tol: "±" + AZ.mm(AZ.grenzabmass(s.d, kl)), mittel: "Messschieber" });
        L += s.l;
      });
      rows.push({ name: "Gesamtlänge", soll: AZ.mm(L) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(L, kl)), mittel: "Messschieber" });
      return rows;
    },
  };
};
function azBuildWelle(spec, modus) {
  var voll = (modus === "fertig");
  var segs = spec.abschnitte.length ? spec.abschnitte : [{ d: 20, l: 60 }];
  var L = 0, Dmax = 0;
  segs.forEach(function (s) { L += s.l; if (s.d > Dmax) Dmax = s.d; });
  var f = spec.fase || 0, ay = Dmax / 2;
  var b = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  var world = { x: -18, y: -22, w: L + 40, h: Dmax + 50 };
  b.zeichnung(world, function (p) {
    var x = 0;
    segs.forEach(function (s, i) {
      var y0 = ay - s.d / 2, y1 = ay + s.d / 2, last = (i === segs.length - 1), ff = (last && f) ? f : 0;
      p.fill(x, y0, s.l, s.d);
      p.line(x, y0, x + s.l - ff, y0, "az-vis");
      p.line(x, y1, x + s.l - ff, y1, "az-vis");
      if (ff) { p.line(x + s.l - ff, y0, x + s.l, y0 + ff, "az-vis"); p.line(x + s.l - ff, y1, x + s.l, y1 - ff, "az-vis"); p.line(x + s.l, y0 + ff, x + s.l, y1 - ff, "az-vis"); }
      else if (last) p.line(x + s.l, y0, x + s.l, y1, "az-vis");
      if (i === 0) p.line(x, y0, x, y1, "az-vis");
      else { var pv = segs[i - 1]; p.line(x, ay - pv.d / 2, x, y0, "az-vis"); p.line(x, ay + pv.d / 2, x, y1, "az-vis"); }
      x += s.l;
    });
    p.center(-6, ay, L + 6, ay);
    if (voll) {
      var xc = 0;
      segs.forEach(function (s) { p.dimH(xc, xc + s.l, Dmax + 8, Dmax); xc += s.l; });
      if (segs.length > 1) p.dimH(0, L, Dmax + 16, Dmax);
      xc = 0;
      segs.forEach(function (s) { var mx = xc + s.l / 2; p.line(mx, ay - s.d / 2, mx, -9, "az-thin"); p.text(mx - 6.5, -10, "⌀" + AZ.mm(s.d), "az-dimtx"); xc += s.l; });
      if (f) p.text(L - f - 8, ay - Dmax / 2 - 2.5, AZ.mm(f) + "×45°", "az-dimtx");
    } else {
      p.dimH(0, L, Dmax + 8, Dmax, { text: "?", cls: "az-todo" });
      var xd = 0; segs.forEach(function (s) { p.text(xd + s.l / 2 - 2, -10, "?", "az-todo"); xd += s.l; });
    }
  });
  return b.svg();
}

/* ==========================================================================
   AZ.parts.scheibe(spec) — Rundplatte/Flansch mit Lochkreis (Ansicht+Schnitt)
   spec:{ benennung,nummer,werkstoff,toleranz, da, t, bohrung, passung,
          lochkreis:{tk,n,d}, fase }
   ========================================================================== */
AZ.parts.scheibe = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", fase: 0 }, spec);
  return {
    spec: spec,
    svg: function (m) { return azBuildScheibe(spec, m === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz, rows = [
        { name: "Außen-⌀", soll: "⌀" + AZ.mm(spec.da), tol: "±" + AZ.mm(AZ.grenzabmass(spec.da, kl)), mittel: "Messschieber" },
        { name: "Dicke", soll: AZ.mm(spec.t) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.t, kl)), mittel: "Messschieber" },
      ];
      if (spec.bohrung) rows.push({ name: "Bohrung", soll: "⌀" + AZ.mm(spec.bohrung) + (spec.passung ? " " + spec.passung : ""), tol: spec.passung === "H9" ? AZ.passungH9(spec.bohrung).text : "±" + AZ.mm(AZ.grenzabmass(spec.bohrung, kl)), mittel: spec.passung ? "Grenzlehrdorn" : "Messschieber" });
      if (spec.lochkreis) rows.push({ name: "Lochkreis", soll: spec.lochkreis.n + "× ⌀" + AZ.mm(spec.lochkreis.d) + " auf ⌀" + AZ.mm(spec.lochkreis.tk), tol: "±" + AZ.mm(AZ.grenzabmass(spec.lochkreis.d, kl)), mittel: "Messschieber" });
      return rows;
    },
  };
};
function azBuildScheibe(spec, modus) {
  var voll = (modus === "fertig");
  var da = spec.da, t = spec.t, R = da / 2, f = spec.fase || 0, lk = spec.lochkreis, cb = spec.bohrung;
  var b = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  var gap = 16, sy0 = da + gap, sy1 = sy0 + t;
  var world = { x: -20, y: -18, w: da + 44, h: sy1 + 32 };
  b.zeichnung(world, function (p) {
    var cx = R, cy = R;
    p.circle(cx, cy, R, "az-vis");
    if (cb) p.circle(cx, cy, cb / 2, "az-vis");
    p.center(cx, -6, cx, da + 6); p.center(-6, cy, da + 6, cy);
    if (lk) {
      p._p('<circle cx="' + p.X(cx) + '" cy="' + p.Y(cy) + '" r="' + (lk.tk / 2 * p.s).toFixed(2) + '" class="az-center" fill="none"/>');
      azTeilkreis(cx, cy, lk.tk / 2, lk.n, 45, lk.d).forEach(function (hh) { p.circle(hh.x, hh.y, lk.d / 2, "az-vis"); });
    }
    if (voll) {
      p.schnittlinie(-6, da + 6, cy, "A");
      var outline = f ? [[0, sy0 + f], [f, sy0], [da - f, sy0], [da, sy0 + f], [da, sy1], [0, sy1]] : [[0, sy0], [da, sy0], [da, sy1], [0, sy1]];
      function slot(x0, x1) { return [[x0, sy0], [x1, sy0], [x1, sy1], [x0, sy1]]; }
      var holes = [];
      if (cb) holes.push(slot(cx - cb / 2, cx + cb / 2));
      if (lk) { holes.push(slot(cx - lk.tk / 2 - lk.d / 2, cx - lk.tk / 2 + lk.d / 2)); holes.push(slot(cx + lk.tk / 2 - lk.d / 2, cx + lk.tk / 2 + lk.d / 2)); }
      p.hatchPoly(outline, holes, 2.4); p.poly(outline, "az-vis");
      holes.forEach(function (hh) { p.line(hh[0][0], sy0, hh[0][0], sy1, "az-vis"); p.line(hh[1][0], sy0, hh[1][0], sy1, "az-vis"); });
      p.center(cx, sy0 - 3, cx, sy1 + 3);
      if (lk) { p.center(cx - lk.tk / 2, sy0 - 2, cx - lk.tk / 2, sy1 + 2); p.center(cx + lk.tk / 2, sy0 - 2, cx + lk.tk / 2, sy1 + 2); }
      p.text(da / 2 - 12, sy1 + 10, "SCHNITT A–A", "az-lblb");
      p.dimV(sy0, sy1, da + 6, da);
      p.dimDia(cx, cy, R, -45, null, { text: "⌀" + AZ.mm(da) });
      if (cb) p.dimDia(cx, cy, cb / 2, 135, null, { text: "⌀" + AZ.mm(cb) + (spec.passung ? " " + spec.passung : "") });
      if (lk) { p.text(2, -8, lk.n + "×⌀" + AZ.mm(lk.d) + " · Lochkreis ⌀" + AZ.mm(lk.tk), "az-dimtx"); }
    } else {
      p.dimDia(cx, cy, R, -45, null, { text: "⌀?", cls: "az-todo" });
      p.text(da / 2 - 14, sy0 + t / 2, "Schnitt A–A ergänzen", "az-note");
    }
  });
  return b.svg();
}

/* ==========================================================================
   AZ.parts.winkel(spec) — L-Profil (flache Winkelplatte), Ansicht + Seitenansicht
   spec:{ benennung,nummer,werkstoff,toleranz, a,b (Schenkel), s (Schenkelbreite),
          t (Dicke), bohrungen:[{x,y,d}] }
   ========================================================================== */
AZ.parts.winkel = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", s: 10, t: 8, bohrungen: [] }, spec);
  return {
    spec: spec,
    svg: function (m) { return azBuildWinkel(spec, m === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz, rows = [
        { name: "Schenkel a", soll: AZ.mm(spec.a) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.a, kl)), mittel: "Messschieber" },
        { name: "Schenkel b", soll: AZ.mm(spec.b) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.b, kl)), mittel: "Messschieber" },
        { name: "Schenkelbreite", soll: AZ.mm(spec.s) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.s, kl)), mittel: "Messschieber" },
        { name: "Dicke", soll: AZ.mm(spec.t) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.t, kl)), mittel: "Messschieber" },
      ];
      (spec.bohrungen || []).forEach(function (f, i) { rows.push({ name: "Bohrung " + (i + 1), soll: "⌀" + AZ.mm(f.d), tol: "±" + AZ.mm(AZ.grenzabmass(f.d, kl)), mittel: "Messschieber" }); });
      return rows;
    },
  };
};
function azBuildWinkel(spec, modus) {
  var voll = (modus === "fertig");
  var a = spec.a, b = spec.b, s = spec.s, t = spec.t, boh = spec.bohrungen || [];
  var B = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  var gapS = 14, sideX = a + gapS;
  var world = { x: -16, y: -18, w: a + gapS + t + 30, h: b + 40 };
  B.zeichnung(world, function (p) {
    var outline = [[0, 0], [s, 0], [s, b - s], [a, b - s], [a, b], [0, b]];
    p.fillPoly(outline); p.poly(outline, "az-vis");
    (voll ? boh : boh.slice(0, 1)).forEach(function (f) {
      p.circle(f.x, f.y, f.d / 2, "az-vis");
      p.center(f.x, f.y - f.d / 2 - 3, f.x, f.y + f.d / 2 + 3); p.center(f.x - f.d / 2 - 3, f.y, f.x + f.d / 2 + 3, f.y);
      if (voll) p.dimDia(f.x, f.y, f.d / 2, -45, null, { text: "⌀" + AZ.mm(f.d) });
    });
    if (voll) {
      p.rect(sideX, 0, t, b, "az-vis");
      boh.forEach(function (f) { p.hidden(sideX, f.y - f.d / 2, sideX + t, f.y - f.d / 2); p.hidden(sideX, f.y + f.d / 2, sideX + t, f.y + f.d / 2); });
      p.dimH(0, a, -8, 0); p.dimV(0, b, -14, 0);
      p.dimH(0, s, b + 8, b); p.dimV(b - s, b, a + 6, a);
      p.dimH(sideX, sideX + t, b + 8, b);
    } else {
      p._p('<rect x="' + p.X(sideX) + '" y="' + p.Y(0) + '" width="' + (t * p.s).toFixed(2) + '" height="' + (b * p.s).toFixed(2) + '" class="az-thin" stroke-dasharray="1.5 1.5" fill="none"/>');
      p.dimH(0, a, -8, 0, { text: "?", cls: "az-todo" }); p.dimV(0, b, -14, 0, { text: "?", cls: "az-todo" });
      p.text(sideX - 1, b + 6, "Seitenansicht ergänzen", "az-note");
    }
  });
  return B.svg();
}

/* ==========================================================================
   AZ.parts.buchse(spec) — Buchse/Hülse (Längsschnitt + Stirnansicht)
   spec:{ benennung,nummer,werkstoff,toleranz, da,di,l, passung, fase }
   ========================================================================== */
AZ.parts.buchse = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", fase: 1 }, spec);
  return {
    spec: spec,
    svg: function (m) { return azBuildBuchse(spec, m === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz;
      return [
        { name: "Außen-⌀", soll: "⌀" + AZ.mm(spec.da), tol: "±" + AZ.mm(AZ.grenzabmass(spec.da, kl)), mittel: "Messschieber" },
        { name: "Bohrung", soll: "⌀" + AZ.mm(spec.di) + (spec.passung ? " " + spec.passung : ""), tol: spec.passung === "H9" ? AZ.passungH9(spec.di).text : "±" + AZ.mm(AZ.grenzabmass(spec.di, kl)), mittel: spec.passung ? "Grenzlehrdorn" : "Innenmessschieber" },
        { name: "Länge", soll: AZ.mm(spec.l) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.l, kl)), mittel: "Messschieber" },
      ];
    },
  };
};
function azBuildBuchse(spec, modus) {
  var voll = (modus === "fertig");
  var da = spec.da, di = spec.di, l = spec.l, f = spec.fase || 0, ay = da / 2;
  var B = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  var gap = 16, cx = l + gap + da / 2;
  var world = { x: -18, y: -18, w: l + gap + da + 40, h: da + 40 };
  B.zeichnung(world, function (p) {
    if (voll) {
      var outline = f ? [[0, f], [f, 0], [l - f, 0], [l, f], [l, da - f], [l - f, da], [f, da], [0, da - f]] : [[0, 0], [l, 0], [l, da], [0, da]];
      var bore = [[0, ay - di / 2], [l, ay - di / 2], [l, ay + di / 2], [0, ay + di / 2]];
      p.hatchPoly(outline, [bore], 2.4); p.poly(outline, "az-vis");
      p.line(0, ay - di / 2, l, ay - di / 2, "az-vis"); p.line(0, ay + di / 2, l, ay + di / 2, "az-vis");
      p.center(-4, ay, l + 4, ay);
      p.dimH(0, l, da + 8, da);
      if (f) p.text(l - f - 6, -2, AZ.mm(f) + "×45°", "az-dimtx");
    } else {
      p._p('<rect x="' + p.X(0) + '" y="' + p.Y(0) + '" width="' + (l * p.s).toFixed(2) + '" height="' + (da * p.s).toFixed(2) + '" class="az-thin" stroke-dasharray="1.5 1.5" fill="none"/>');
      p.text(l / 2 - 14, ay, "Längsschnitt ergänzen", "az-note");
      p.dimH(0, l, da + 8, da, { text: "?", cls: "az-todo" });
    }
    // Stirnansicht (Kreise) rechts
    p.circle(cx, ay, da / 2, "az-vis"); p.circle(cx, ay, di / 2, "az-vis");
    p.center(cx, -5, cx, da + 5); p.center(cx - da / 2 - 5, ay, cx + da / 2 + 5, ay);
    if (voll) {
      p.dimDia(cx, ay, da / 2, -45, null, { text: "⌀" + AZ.mm(da) });
      p.dimDia(cx, ay, di / 2, 135, null, { text: "⌀" + AZ.mm(di) + (spec.passung ? " " + spec.passung : "") });
    } else {
      p.dimDia(cx, ay, da / 2, -45, null, { text: "⌀?", cls: "az-todo" });
    }
  });
  return B.svg();
}

/* ==========================================================================
   AZ.parts.uprofil(spec) — U-Profil (Querschnitt)  spec:{ w,h,s }
   ========================================================================== */
AZ.parts.uprofil = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m" }, spec);
  return {
    spec: spec, svg: function (m) { return azBuildUT(spec, "u", m === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz;
      return [
        { name: "Breite", soll: AZ.mm(spec.w) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.w, kl)), mittel: "Messschieber" },
        { name: "Höhe", soll: AZ.mm(spec.h) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.h, kl)), mittel: "Messschieber" },
        { name: "Wandstärke", soll: AZ.mm(spec.s) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.s, kl)), mittel: "Messschieber" },
      ];
    },
  };
};
/* AZ.parts.tprofil(spec) — T-Profil (Querschnitt)  spec:{ w,h,s (Flansch), sw (Steg) } */
AZ.parts.tprofil = function (spec) {
  spec = Object.assign({ werkstoff: "S235JR", toleranz: "m", sw: null }, spec);
  if (spec.sw == null) spec.sw = spec.s;
  return {
    spec: spec, svg: function (m) { return azBuildUT(spec, "t", m === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz;
      return [
        { name: "Breite (Flansch)", soll: AZ.mm(spec.w) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.w, kl)), mittel: "Messschieber" },
        { name: "Höhe", soll: AZ.mm(spec.h) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.h, kl)), mittel: "Messschieber" },
        { name: "Flanschdicke", soll: AZ.mm(spec.s) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.s, kl)), mittel: "Messschieber" },
        { name: "Stegdicke", soll: AZ.mm(spec.sw) + " mm", tol: "±" + AZ.mm(AZ.grenzabmass(spec.sw, kl)), mittel: "Messschieber" },
      ];
    },
  };
};
function azBuildUT(spec, art, modus) {
  var voll = (modus === "fertig"), w = spec.w, h = spec.h, s = spec.s;
  var B = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff, nummer: spec.nummer, toleranz: spec.toleranz });
  var world = { x: -16, y: -18, w: w + 34, h: h + 40 };
  B.zeichnung(world, function (p) {
    var out;
    if (art === "u") out = [[0, 0], [s, 0], [s, h - s], [w - s, h - s], [w - s, 0], [w, 0], [w, h], [0, h]];
    else { var sw = spec.sw, x1 = w / 2 - sw / 2, x2 = w / 2 + sw / 2; out = [[0, 0], [w, 0], [w, s], [x2, s], [x2, h], [x1, h], [x1, s], [0, s]]; }
    p.fillPoly(out); p.poly(out, "az-vis");
    if (voll) {
      p.dimH(0, w, -8, 0); p.dimV(0, h, -14, 0);
      if (art === "u") { p.dimH(0, s, h + 8, h); p.dimV(h - s, h, w + 6, w); }
      else { p.dimV(0, s, w + 6, w); p.dimH(w / 2 - spec.sw / 2, w / 2 + spec.sw / 2, h + 8, h); }
    } else { p.dimH(0, w, -8, 0, { text: "?", cls: "az-todo" }); p.dimV(0, h, -14, 0, { text: "?", cls: "az-todo" }); }
  });
  return B.svg();
}

/* ==========================================================================
   AZ.parts.zahnrad(spec) — Stirnrad-Grundform (vereinfachte Darstellung)
   spec:{ m (Modul), z (Zähnezahl), bohrung, passung }
   Kopfkreis breit, Teilkreis Strichpunkt, Fußkreis schmal (DIN-vereinfacht).
   ========================================================================== */
AZ.parts.zahnrad = function (spec) {
  spec = Object.assign({ werkstoff: "C45", toleranz: "m", bohrung: 20 }, spec);
  return {
    spec: spec, svg: function (mo) { return azBuildZahnrad(spec, mo === "ergaenzen" ? "ergaenzen" : "fertig"); },
    masse: function () {
      var kl = spec.toleranz, m = spec.m, z = spec.z;
      var rows = [
        { name: "Modul m", soll: AZ.mm(m) + " mm", tol: "—", mittel: "—" },
        { name: "Zähnezahl z", soll: "" + z, tol: "—", mittel: "—" },
        { name: "Kopfkreis ⌀a", soll: "⌀" + AZ.mm(m * (z + 2)), tol: "±" + AZ.mm(AZ.grenzabmass(m * (z + 2), kl)), mittel: "Messschieber" },
        { name: "Teilkreis ⌀", soll: "⌀" + AZ.mm(m * z), tol: "—", mittel: "—" },
      ];
      if (spec.bohrung) rows.push({ name: "Bohrung", soll: "⌀" + AZ.mm(spec.bohrung) + (spec.passung ? " " + spec.passung : ""), tol: spec.passung === "H9" ? AZ.passungH9(spec.bohrung).text : "±" + AZ.mm(AZ.grenzabmass(spec.bohrung, kl)), mittel: spec.passung ? "Grenzlehrdorn" : "Messschieber" });
      return rows;
    },
  };
};
function azBuildZahnrad(spec, modus) {
  var voll = (modus === "fertig"), m = spec.m, z = spec.z;
  var da = m * (z + 2), d = m * z, df = m * (z - 2.5), R = da / 2;
  var B = new AZ.Blatt({ format: "A4quer", titel: spec.benennung, werkstoff: spec.werkstoff || "C45", nummer: spec.nummer, toleranz: spec.toleranz });
  var world = { x: -20, y: -18, w: da + 78, h: da + 36 };
  B.zeichnung(world, function (p) {
    var cx = R, cy = R;
    p.circle(cx, cy, da / 2, "az-vis");
    p._p('<circle cx="' + p.X(cx) + '" cy="' + p.Y(cy) + '" r="' + (d / 2 * p.s).toFixed(2) + '" class="az-center" fill="none"/>');
    p.circle(cx, cy, df / 2, "az-thin");
    if (spec.bohrung) p.circle(cx, cy, spec.bohrung / 2, "az-vis");
    p.center(cx, -6, cx, da + 6); p.center(-6, cy, da + 6, cy);
    if (voll) {
      p.dimDia(cx, cy, da / 2, -45, null, { text: "⌀" + AZ.mm(da) });
      if (spec.bohrung) p.dimDia(cx, cy, spec.bohrung / 2, 135, null, { text: "⌀" + AZ.mm(spec.bohrung) + (spec.passung ? " " + spec.passung : "") });
      p.text(da + 4, 8, "Modul m = " + AZ.mm(m), "az-dimtx");
      p.text(da + 4, 15, "Zähnezahl z = " + z, "az-dimtx");
      p.text(da + 4, 22, "Teilkreis ⌀ = " + AZ.mm(d), "az-dimtx");
      p.text(da + 4, 29, "Eingriffswinkel 20°", "az-dimtx");
    } else { p.dimDia(cx, cy, da / 2, -45, null, { text: "⌀?", cls: "az-todo" }); }
  });
  return B.svg();
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
