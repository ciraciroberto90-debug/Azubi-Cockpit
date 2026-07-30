/* ============================================================================
   Azubi Cockpit — Zeichen-Engine (normgerecht)
   Erzeugt technische Zeichnungen als SVG nach:
     - DIN ISO 5455 (Maßstäbe, automatisch gewählt)
     - DIN ISO 128-2 (Linienarten)
     - DIN ISO 129-1 (Bemaßung)
     - DIN ISO 5456-2 (Projektion, europäische Methode)
     - DIN EN ISO 7200 (Schriftfeld) / DIN EN ISO 5457 (Blattformat)
   Regel: Objekt hat reale mm-Maße; Engine skaliert genormt und passt es in den
   Zeichenbereich ein -> nichts läuft über den Rand.
   ==========================================================================*/
window.AZ = window.AZ || {};

AZ.NORM = {
  /* Genormte Maßstäbe DIN ISO 5455 als Faktor (Zeichnung/Wirklichkeit) */
  massstaebe: [
    { r: 50, l: "50:1" }, { r: 20, l: "20:1" }, { r: 10, l: "10:1" },
    { r: 5, l: "5:1" }, { r: 2, l: "2:1" }, { r: 1, l: "1:1" },
    { r: 0.5, l: "1:2" }, { r: 0.2, l: "1:5" }, { r: 0.1, l: "1:10" },
    { r: 0.05, l: "1:20" }, { r: 0.02, l: "1:50" }, { r: 0.01, l: "1:100" },
    { r: 0.005, l: "1:200" }, { r: 0.002, l: "1:500" }, { r: 0.001, l: "1:1000" },
  ],
  /* DIN ISO 2768-1 Grenzabmaße Längenmaße (± mm) je Nennmaßbereich */
  tolLaenge: {
    grenzen: [3, 6, 30, 120, 400, 1000, 2000],
    f: [0.05, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5],
    m: [0.1, 0.1, 0.2, 0.3, 0.5, 0.8, 1.2],
    c: [0.2, 0.3, 0.5, 0.8, 1.2, 2.0, 3.0],
    v: [null, 0.5, 1.0, 1.5, 2.5, 4.0, 6.0],
  },
  /* Blattformate DIN EN ISO 5457 (Breite x Höhe mm) */
  formate: {
    A4quer: [297, 210], A4hoch: [210, 297], A3quer: [420, 297],
  },
};

/* Grenzabmaß ± für ein Nennmaß und eine Toleranzklasse (ISO 2768-1) */
AZ.grenzabmass = function (nennmass, klasse) {
  klasse = klasse || "m";
  var t = AZ.NORM.tolLaenge, g = t.grenzen, arr = t[klasse];
  var n = Math.abs(nennmass);
  for (var i = 0; i < g.length; i++) { if (n <= g[i]) return arr[i]; }
  return arr[arr.length - 1];
};

/* Wählt den größten genormten Maßstab, mit dem (bw x bh) in (tw x th) passt */
AZ.waehleMassstab = function (bw, bh, tw, th) {
  var max = Math.min(tw / bw, th / bh);
  var ms = AZ.NORM.massstaebe;
  for (var i = 0; i < ms.length; i++) { if (ms[i].r <= max + 1e-9) return ms[i]; }
  return ms[ms.length - 1];
};

var _azId = 0;

/* ----------------------------------------------------------------------------
   AZ.Blatt — ein Zeichnungsblatt mit Rahmen + Schriftfeld
   cfg: { format, titel, werkstoff, nummer, ersteller, datum, toleranz,
          projektion:"1", benennungZusatz }
   ---------------------------------------------------------------------------*/
AZ.Blatt = function (cfg) {
  cfg = cfg || {};
  var fmt = AZ.NORM.formate[cfg.format || "A4quer"];
  this.W = fmt[0]; this.H = fmt[1];
  this.cfg = cfg;
  this.uid = "az" + (++_azId);
  this.body = [];            // svg-Elemente des Zeichenbereichs
  this.massstabLabel = cfg.massstab || "1:1";
  // Rahmen/Ränder (ISO 5457: Heftrand links 20, sonst 10)
  this.mL = 20; this.mR = 10; this.mT = 10; this.mB = 10;
  // Schriftfeld (max. 180 breit ISO 7200) unten rechts
  this.sfW = 180; this.sfH = 30;
};

AZ.Blatt.prototype._zeichenbereich = function () {
  // Fläche für die Zeichnung: innerhalb Rahmen, oberhalb Schriftfeld
  return {
    x: this.mL + 6,
    y: this.mT + 6,
    w: (this.W - this.mR) - (this.mL) - 12,
    h: (this.H - this.mB - this.sfH - 6) - (this.mT) - 12,
  };
};

/* Zeichnung platzieren: worldBBox {x,y,w,h} (reale mm inkl. Bemaßung),
   drawFn(pen) zeichnet in Welt-mm. Engine skaliert genormt + zentriert. */
AZ.Blatt.prototype.zeichnung = function (worldBBox, drawFn) {
  var zb = this._zeichenbereich();
  var msf = AZ.waehleMassstab(worldBBox.w, worldBBox.h, zb.w, zb.h);
  var s = msf.r;
  this.massstabLabel = msf.l;
  // Zentrieren im Zeichenbereich
  var drawW = worldBBox.w * s, drawH = worldBBox.h * s;
  var ox = zb.x + (zb.w - drawW) / 2 - worldBBox.x * s;
  var oy = zb.y + (zb.h - drawH) / 2 - worldBBox.y * s;
  var pen = new AZ.Pen(this, s, ox, oy);
  drawFn(pen);
  return this;
};

AZ.Blatt.prototype.push = function (svg) { this.body.push(svg); };

/* Schriftfeld nach DIN EN ISO 7200 (kompakt) */
AZ.Blatt.prototype._schriftfeld = function () {
  var c = this.cfg;
  var x = this.W - this.mR - this.sfW, y = this.H - this.mB - this.sfH;
  var w = this.sfW, h = this.sfH;
  var e = [];
  function box(bx, by, bw, bh) { e.push('<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" class="az-sf"/>'); }
  function k(bx, by, t) { e.push('<text x="' + bx + '" y="' + by + '" class="az-sfk">' + AZ.esc(t) + '</text>'); }
  function v(bx, by, t) { e.push('<text x="' + bx + '" y="' + by + '" class="az-sfv">' + AZ.esc(t) + '</text>'); }
  box(x, y, w, h);
  // Spalten
  var c1 = x, c2 = x + 108, c3 = x + 150;
  e.push('<line x1="' + c2 + '" y1="' + y + '" x2="' + c2 + '" y2="' + (y + h) + '" class="az-sf"/>');
  e.push('<line x1="' + c3 + '" y1="' + y + '" x2="' + c3 + '" y2="' + (y + h) + '" class="az-sf"/>');
  // Zeilen linke Spalte
  e.push('<line x1="' + c1 + '" y1="' + (y + 16) + '" x2="' + c2 + '" y2="' + (y + 16) + '" class="az-sf"/>');
  // Benennung (groß)
  k(c1 + 2, y + 5, "BENENNUNG");
  v(c1 + 2, y + 13, c.titel || "—");
  k(c1 + 2, y + 21, "ALLGEMEINTOLERANZ");
  v(c1 + 2, y + 28, "ISO 2768-" + (c.toleranz || "m"));
  // Mittlere Spalte: Werkstoff / Maßstab
  e.push('<line x1="' + c2 + '" y1="' + (y + 16) + '" x2="' + c3 + '" y2="' + (y + 16) + '" class="az-sf"/>');
  k(c2 + 2, y + 5, "WERKSTOFF"); v(c2 + 2, y + 13, c.werkstoff || "—");
  k(c2 + 2, y + 21, "MASSSTAB"); v(c2 + 2, y + 28, this.massstabLabel);
  // Rechte Spalte: Zeichnungsnr / Datum / Projektionssymbol (je 10 mm Zeile)
  e.push('<line x1="' + c3 + '" y1="' + (y + 10) + '" x2="' + (x + w) + '" y2="' + (y + 10) + '" class="az-sf"/>');
  e.push('<line x1="' + c3 + '" y1="' + (y + 20) + '" x2="' + (x + w) + '" y2="' + (y + 20) + '" class="az-sf"/>');
  k(c3 + 2, y + 4, "ZEICHN.-NR"); v(c3 + 2, y + 8.6, c.nummer || "—");
  k(c3 + 2, y + 14, "DATUM"); v(c3 + 2, y + 18.6, c.datum || "__.__.____");
  // Projektionssymbol (1. Winkel), zentriert in der unteren rechten Zelle
  this._projektion(c3 + 5, y + 25, e);
  return e.join("");
};

AZ.Blatt.prototype._projektion = function (px, py, e) {
  // vereinfachtes Symbol Projektionsmethode 1 (europäisch)
  e.push('<g transform="translate(' + px + ',' + py + ')">' +
    '<path d="M0,-4 L8,-2 L8,2 L0,4 Z" class="az-thin" fill="none"/>' +
    '<circle cx="18" cy="0" r="2.4" class="az-thin" fill="none"/>' +
    '<circle cx="18" cy="0" r="4" class="az-thin" fill="none"/>' +
    '<line x1="8" y1="0" x2="14" y2="0" class="az-thin"/>' +
    '</g>');
};

AZ.Blatt.prototype.svg = function () {
  var vb = "0 0 " + this.W + " " + this.H;
  var frameX = this.mL, frameY = this.mT,
    frameW = this.W - this.mL - this.mR, frameH = this.H - this.mT - this.mB;
  var out = '<svg class="az-blatt" viewBox="' + vb + '" role="img" ' +
    'aria-label="' + AZ.esc(this.cfg.titel || "Technische Zeichnung") + '" ' +
    'preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  out += AZ._defs(this.uid);
  out += AZ._style();
  // Blattfläche + Rahmen
  out += '<rect x="0" y="0" width="' + this.W + '" height="' + this.H + '" fill="#fdfdfb"/>';
  out += '<rect x="' + frameX + '" y="' + frameY + '" width="' + frameW + '" height="' + frameH + '" class="az-frame"/>';
  // Zeichnungsinhalt
  out += '<g marker-mid="">' + this.body.join("") + '</g>';
  // Schriftfeld
  out += this._schriftfeld();
  out += "</svg>";
  return out;
};

/* ----------------------------------------------------------------------------
   AZ.Pen — zeichnet in Welt-mm, transformiert in Blatt-mm (Skalierung s)
   ---------------------------------------------------------------------------*/
AZ.Pen = function (blatt, s, ox, oy) {
  this.b = blatt; this.s = s; this.ox = ox; this.oy = oy;
};
AZ.Pen.prototype.X = function (x) { return +(this.ox + x * this.s).toFixed(3); };
AZ.Pen.prototype.Y = function (y) { return +(this.oy + y * this.s).toFixed(3); };
AZ.Pen.prototype._p = function (svg) { this.b.push(svg); };

AZ.Pen.prototype.rect = function (x, y, w, h, cls) {
  cls = cls || "az-vis";
  this._p('<rect x="' + this.X(x) + '" y="' + this.Y(y) + '" width="' + (w * this.s).toFixed(3) +
    '" height="' + (h * this.s).toFixed(3) + '" class="' + cls + '" fill="none"/>');
};
AZ.Pen.prototype.line = function (x1, y1, x2, y2, cls) {
  cls = cls || "az-vis";
  this._p('<line x1="' + this.X(x1) + '" y1="' + this.Y(y1) + '" x2="' + this.X(x2) + '" y2="' + this.Y(y2) + '" class="' + cls + '"/>');
};
AZ.Pen.prototype.circle = function (cx, cy, r, cls) {
  cls = cls || "az-vis";
  this._p('<circle cx="' + this.X(cx) + '" cy="' + this.Y(cy) + '" r="' + (r * this.s).toFixed(3) + '" class="' + cls + '" fill="none"/>');
};
AZ.Pen.prototype.center = function (x1, y1, x2, y2) { this.line(x1, y1, x2, y2, "az-center"); };
AZ.Pen.prototype.hidden = function (x1, y1, x2, y2) { this.line(x1, y1, x2, y2, "az-hidden"); };
AZ.Pen.prototype.fill = function (x, y, w, h) {
  this._p('<rect x="' + this.X(x) + '" y="' + this.Y(y) + '" width="' + (w * this.s).toFixed(3) +
    '" height="' + (h * this.s).toFixed(3) + '" class="az-part"/>');
};
AZ.Pen.prototype.text = function (x, y, t, cls) {
  cls = cls || "az-dimtx";
  this._p('<text x="' + this.X(x) + '" y="' + this.Y(y) + '" class="' + cls + '">' + AZ.esc(t) + '</text>');
};

/* Bemaßung: Maßhilfslinien (schmal, Überstand), Maßlinie mit Pfeilen, Maßzahl
   dimH(x1,x2, yMass, yKante, opts) — horizontal, Maß = |x2-x1| mm             */
AZ.Pen.prototype.dimH = function (x1, x2, yMass, yKante, opts) {
  opts = opts || {};
  var uid = this.b.uid, over = 1.5; // Überstand Maßhilfslinie mm
  var dir = (yMass < yKante) ? -1 : 1;
  this._p('<line x1="' + this.X(x1) + '" y1="' + this.Y(yKante) + '" x2="' + this.X(x1) + '" y2="' + this.Y(yMass + dir * over) + '" class="az-thin"/>');
  this._p('<line x1="' + this.X(x2) + '" y1="' + this.Y(yKante) + '" x2="' + this.X(x2) + '" y2="' + this.Y(yMass + dir * over) + '" class="az-thin"/>');
  this._p('<line x1="' + this.X(x1) + '" y1="' + this.Y(yMass) + '" x2="' + this.X(x2) + '" y2="' + this.Y(yMass) +
    '" class="az-thin" marker-start="url(#' + uid + 'as)" marker-end="url(#' + uid + 'ae)"/>');
  var t = (opts.text != null) ? opts.text : String(Math.round(Math.abs(x2 - x1)));
  var mx = (x1 + x2) / 2, ty = yMass + dir * 1.4;
  this._p('<text x="' + this.X(mx) + '" y="' + this.Y(ty) + '" class="' + (opts.cls || 'az-dimtx') + '" text-anchor="middle">' + AZ.esc(t) + '</text>');
};
AZ.Pen.prototype.dimV = function (y1, y2, xMass, xKante, opts) {
  opts = opts || {};
  var uid = this.b.uid, over = 1.5;
  var dir = (xMass < xKante) ? -1 : 1;
  this._p('<line x1="' + this.X(xKante) + '" y1="' + this.Y(y1) + '" x2="' + this.X(xMass + dir * over) + '" y2="' + this.Y(y1) + '" class="az-thin"/>');
  this._p('<line x1="' + this.X(xKante) + '" y1="' + this.Y(y2) + '" x2="' + this.X(xMass + dir * over) + '" y2="' + this.Y(y2) + '" class="az-thin"/>');
  this._p('<line x1="' + this.X(xMass) + '" y1="' + this.Y(y1) + '" x2="' + this.X(xMass) + '" y2="' + this.Y(y2) +
    '" class="az-thin" marker-start="url(#' + uid + 'as)" marker-end="url(#' + uid + 'ae)"/>');
  var t = (opts.text != null) ? opts.text : String(Math.round(Math.abs(y2 - y1)));
  var my = (y1 + y2) / 2, tx = this.X(xMass + dir * 1.6), tyy = this.Y(my);
  this._p('<text x="' + tx + '" y="' + tyy + '" class="' + (opts.cls || 'az-dimtx') + '" text-anchor="middle" transform="rotate(-90 ' + tx + ' ' + tyy + ')">' + AZ.esc(t) + '</text>');
};
/* Durchmesser-Bemaßung als Hinweislinie: ⌀d  */
AZ.Pen.prototype.dimDia = function (cx, cy, r, angDeg, d, opts) {
  opts = opts || {};
  var a = angDeg * Math.PI / 180;
  var x1 = cx + r * Math.cos(a), y1 = cy + r * Math.sin(a);
  var x2 = cx + (r + 8) * Math.cos(a), y2 = cy + (r + 8) * Math.sin(a);
  this.line(x1, y1, x2, y2, "az-thin");
  var t = (opts.text != null) ? opts.text : ("⌀" + d);
  this._p('<text x="' + this.X(x2 + 1) + '" y="' + this.Y(y2) + '" class="' + (opts.cls || 'az-dimtx') + '">' + AZ.esc(t) + '</text>');
};

/* Innengewinde in Vorderansicht (DIN ISO 6410):
   Kernloch = breiter Vollkreis, Gewinde-Nenn-⌀ = schmaler 3/4-Kreis */
AZ.Pen.prototype.gewindeFront = function (cx, cy, dNom, core) {
  this.circle(cx, cy, core / 2, "az-vis");           // Kernloch (breit)
  var r = (dNom / 2) * this.s, X = this.X(cx), Y = this.Y(cy);
  var a0 = Math.PI * 0.13, a1 = Math.PI * 1.87;      // Lücke oben rechts
  var x0 = (X + r * Math.cos(a0)).toFixed(2), y0 = (Y + r * Math.sin(a0)).toFixed(2);
  var x1 = (X + r * Math.cos(a1)).toFixed(2), y1 = (Y + r * Math.sin(a1)).toFixed(2);
  this._p('<path d="M' + x0 + ',' + y0 + ' A' + r.toFixed(2) + ',' + r.toFixed(2) +
    ' 0 1 1 ' + x1 + ',' + y1 + '" class="az-thin" fill="none"/>');
};

/* Schnittschraffur (45°, schmal) innerhalb einer Polygon-Kontur, abzügl. Löcher.
   points/holes: Arrays von [x,y] in Welt-mm (Löcher = Polygon-Arrays) */
AZ.Pen.prototype.hatchPoly = function (points, holes, spacing) {
  spacing = spacing || 2.4;
  var self = this, uid = this.b.uid + "h" + (this.b._hc = (this.b._hc || 0) + 1);
  function poly(pts) {
    return "M" + pts.map(function (p) { return self.X(p[0]) + "," + self.Y(p[1]); }).join(" L") + " Z";
  }
  var d = poly(points);
  (holes || []).forEach(function (ho) { d += " " + poly(ho); });
  this._p('<clipPath id="' + uid + '"><path d="' + d + '" clip-rule="evenodd"/></clipPath>');
  var xs = points.map(function (p) { return p[0]; }), ys = points.map(function (p) { return p[1]; });
  var minx = Math.min.apply(0, xs), maxx = Math.max.apply(0, xs), miny = Math.min.apply(0, ys), maxy = Math.max.apply(0, ys);
  var X0 = this.X(minx), Y0 = this.Y(miny), W = (maxx - minx) * this.s, H = (maxy - miny) * this.s;
  var step = spacing * this.s, lines = "";
  for (var off = -H; off < W; off += step) {
    lines += '<line x1="' + (X0 + off).toFixed(2) + '" y1="' + Y0.toFixed(2) +
      '" x2="' + (X0 + off + H).toFixed(2) + '" y2="' + (Y0 + H).toFixed(2) + '" class="az-thin"/>';
  }
  this._p('<g clip-path="url(#' + uid + ')">' + lines + "</g>");
};

/* Polygonzug (Kontur) zeichnen */
AZ.Pen.prototype.poly = function (points, cls) {
  cls = cls || "az-vis";
  var self = this;
  var d = "M" + points.map(function (p) { return self.X(p[0]) + "," + self.Y(p[1]); }).join(" L") + " Z";
  this._p('<path d="' + d + '" class="' + cls + '" fill="none"/>');
};

/* Oberflächenangabe DIN EN ISO 21920 (Grundsymbol + Ra), feste mm-Größe */
AZ.Pen.prototype.oberflaeche = function (x, y, ra) {
  var X = this.X(x), Y = this.Y(y);
  this._p('<path d="M' + (X - 2.2) + ',' + Y + ' L' + (X - 0.6) + ',' + (Y + 2.4) +
    ' L' + (X + 2.6) + ',' + (Y - 3.4) + '" class="az-vis" fill="none"/>');
  this._p('<text x="' + (X - 2) + '" y="' + (Y - 1.2) + '" class="az-note">Ra ' + AZ.esc(ra) + '</text>');
};

/* Schnittverlaufslinie (Strichpunkt breit an Enden) mit Pfeilen + Buchstaben */
AZ.Pen.prototype.schnittlinie = function (x1, x2, y, letter) {
  var uid = this.b.uid;
  this.line(x1, y, x2, y, "az-center");
  // Pfeile nach unten (Blickrichtung) + Buchstaben an beiden Enden
  this._p('<line x1="' + this.X(x1) + '" y1="' + this.Y(y) + '" x2="' + this.X(x1) + '" y2="' + this.Y(y + 5) +
    '" class="az-vis" marker-end="url(#' + uid + 'ae)"/>');
  this._p('<line x1="' + this.X(x2) + '" y1="' + this.Y(y) + '" x2="' + this.X(x2) + '" y2="' + this.Y(y + 5) +
    '" class="az-vis" marker-end="url(#' + uid + 'ae)"/>');
  this.text(x1 - 1, y - 1.5, letter, "az-lblb");
  this.text(x2 + 1.5, y - 1.5, letter, "az-lblb");
};

/* ---- gemeinsame Defs / Style (in jedes SVG eingebettet -> druckt s/w) ---- */
AZ._defs = function (uid) {
  // Maßpfeile ~3 mm (userSpaceOnUse = mm, da viewBox in mm)
  return '<defs>' +
    '<marker id="' + uid + 'ae" markerWidth="3.2" markerHeight="2.4" refX="3" refY="1.2" orient="auto" markerUnits="userSpaceOnUse">' +
    '<path d="M0,0.3 L3,1.2 L0,2.1 Z" fill="#1a1a1a"/></marker>' +
    '<marker id="' + uid + 'as" markerWidth="3.2" markerHeight="2.4" refX="0.2" refY="1.2" orient="auto" markerUnits="userSpaceOnUse">' +
    '<path d="M3.2,0.3 L0.2,1.2 L3.2,2.1 Z" fill="#1a1a1a"/></marker>' +
    '</defs>';
};
AZ._style = function () {
  return '<style>' +
    '.az-blatt text{font-family:ui-monospace,"Cascadia Code",Menlo,Consolas,monospace}' +
    '.az-frame{fill:none;stroke:#1a1a1a;stroke-width:0.5}' +
    '.az-vis{stroke:#1a1a1a;stroke-width:0.5;fill:none;stroke-linecap:round;stroke-linejoin:round}' +
    '.az-thin{stroke:#1a1a1a;stroke-width:0.25;fill:none}' +
    '.az-center{stroke:#1a1a1a;stroke-width:0.25;fill:none;stroke-dasharray:6 1.2 0.8 1.2}' +
    '.az-hidden{stroke:#1a1a1a;stroke-width:0.35;fill:none;stroke-dasharray:2.5 1.2}' +
    '.az-part{fill:#eceae2;stroke:none}' +
    '.az-dimtx{fill:#1a1a1a;font-size:3.2px;font-weight:600}' +
    '.az-note{fill:#1a1a1a;font-size:3px}' +
    '.az-lblb{fill:#1a1a1a;font-size:4px;font-weight:800}' +
    '.az-todo{fill:#E4531D;font-size:4px;font-weight:800}' +
    '.az-sf{fill:none;stroke:#1a1a1a;stroke-width:0.35}' +
    '.az-sfk{fill:#666;font-size:2.4px;letter-spacing:.03em}' +
    '.az-sfv{fill:#1a1a1a;font-size:3.4px;font-weight:700}' +
    '</style>';
};

AZ.esc = function (s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
};
