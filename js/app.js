/* ============================================================================
   Azubi Cockpit — App (Hash-Router + Views)
   ==========================================================================*/
(function () {
  "use strict";
  var C = window.AZ_CURRICULUM;
  var CONTENT = window.AZ_CONTENT || {};
  var app = document.getElementById("app");

  /* ---------- Helpers ---------- */
  function h(html) { return html; }
  function findLj(n) { return C.lehrjahre.filter(function (l) { return l.nr == n; })[0]; }
  function findModul(id) {
    for (var i = 0; i < C.lehrjahre.length; i++) {
      var m = C.lehrjahre[i].module.filter(function (x) { return x.id === id; })[0];
      if (m) return { modul: m, lj: C.lehrjahre[i] };
    }
    return null;
  }
  function ljProgress(lj) {
    var total = lj.module.length;
    var done = lj.module.filter(function (m) { return m.status === "fertig"; }).length;
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function lfById(nr) { return C.lernfelder.filter(function (x) { return x.nr == nr; })[0]; }

  function setNav(active) {
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-k") === active);
    });
  }

  /* ---------- View: Start ---------- */
  function viewStart() {
    setNav("start");
    var flow = C.prinzip.map(function (p, i) {
      var desc = ["Auftrag, Lernziel und Bezug zum Rahmenplan.",
        "Arbeitsblätter, Zeichnungen &amp; Pläne — druckfertig, mit Lösung.",
        "Auftrag an Werkbank/Anlage mit Prüfkriterien und Abnahme."][i];
      return '<div class="step"><div class="num">SCHRITT 0' + (i + 1) + '</div><h3>' + p + '</h3><p>' + desc + '</p></div>';
    }).join("");

    var ljCards = C.lehrjahre.map(function (lj) {
      var pr = ljProgress(lj);
      return '<a class="lj-card" href="#/lj/' + lj.nr + '">' +
        '<span class="lj">' + lj.titel.toUpperCase() + '</span>' +
        '<h3>' + lj.untertitel + '</h3>' +
        '<p>' + lj.module.length + ' Module · Lernfelder ' + lj.lernfelder.join(", ") + '</p>' +
        '<div class="progress"><i style="width:' + pr.pct + '%"></i></div>' +
        '<div class="pmeta"><span>' + pr.done + '/' + pr.total + ' Module fertig</span><span>' + (lj.pruefung || "") + '</span></div>' +
        '</a>';
    }).join("");

    app.innerHTML = h(
      '<div class="wrap">' +
      '<p class="eyebrow">Ausbildung ' + C.beruf + ' · ' + C.dauer + '</p>' +
      '<h1>Azubi Cockpit</h1>' +
      '<p class="lead">Dein Hauptquartier für die Ausbildung: strukturiert nach <strong>Ausbildungsrahmenplan (Betrieb)</strong> und <strong>Lernfeldern (Berufsschule)</strong>. Druckfertige Arbeitsblätter, echte technische Zeichnungen &amp; Pläne — jeweils mit Lösungsheft.</p>' +

      '<section><p class="eyebrow">Das Prinzip</p><h2>Jede Aufgabe in drei Schritten</h2>' +
      '<div class="flow">' + flow + '</div></section>' +

      '<section><p class="eyebrow">Duale Ausbildung</p><h2>Zwei Lernorte, ein Plan</h2>' +
      '<div class="duale">' +
      '<div class="card"><small>Betrieb</small><h3>Ausbildungsrahmenplan</h3><p>Sachliche &amp; zeitliche Gliederung nach MechatronikerAusbV — mit Zeitrichtwerten in Wochen.</p></div>' +
      '<div class="card"><small>Berufsschule</small><h3>13 Lernfelder (KMK)</h3><p>Kompetenzorientierter Rahmenlehrplan — jedes Modul ist einem Lernfeld zugeordnet.</p></div>' +
      '</div></section>' +

      '<section><p class="eyebrow">Der Fahrplan</p><h2>Vom 1. bis zum 3. Lehrjahr</h2>' +
      '<div class="lj-grid">' + ljCards + '</div></section>' +

      '<div class="footer">AZUBI COCKPIT · ' + C.beruf + ' · strukturiert nach Rahmenplan &amp; Lernfeldern · kein erfundener Inhalt</div>' +
      '</div>'
    );
  }

  /* ---------- View: Lehrjahr ---------- */
  function viewLj(n) {
    var lj = findLj(n);
    if (!lj) return viewStart();
    setNav("lj" + n);

    var lfRows = lj.lernfelder.map(function (nr) {
      var lf = lfById(nr);
      return '<div class="lf-item"><span class="n">LF ' + lf.nr + '</span><span>' + lf.titel + '</span>' +
        '<span class="h">' + (lf.stunden ? lf.stunden + " h" : "lt. KMK") + '</span></div>';
    }).join("");

    var rows = lj.module.map(function (m) {
      var fertig = m.status === "fertig";
      var href = fertig ? '#/modul/' + m.id : '#/modul/' + m.id;
      return '<a class="mod-row' + (fertig ? "" : " locked") + '" href="' + href + '">' +
        '<span class="badge ' + m.status + '">' + (fertig ? "fertig" : "Gerüst") + '</span>' +
        '<div><div class="fach">' + m.fach + '</div><h3>' + m.titel + '</h3><div class="sub">' + m.beschreibung + '</div></div>' +
        '<div class="weeks">' + m.wochen + '</div></a>';
    }).join("");

    app.innerHTML = h(
      '<div class="wrap">' +
      '<div class="crumb"><a href="#/">Cockpit</a> / ' + lj.titel + '</div>' +
      '<p class="eyebrow">' + lj.titel + (lj.pruefung ? " · " + lj.pruefung : "") + '</p>' +
      '<h1>' + lj.untertitel + '</h1>' +
      '<div class="lf-box"><h3>Berufsschule — Lernfelder in diesem Lehrjahr</h3>' + lfRows + '</div>' +
      '<section style="margin-top:26px"><h2>Module (Betrieb)</h2><div class="mod-list">' + rows + '</div></section>' +
      '<div class="footer">Zeitrichtwerte nach Ausbildungsrahmenplan · an betrieblichen Plan anpassbar</div>' +
      '</div>'
    );
  }

  /* ---------- View: Modul ---------- */
  function viewModul(id) {
    var f = findModul(id);
    if (!f) return viewStart();
    var m = f.modul, lj = f.lj;
    setNav("lj" + lj.nr);
    var content = CONTENT[id];

    var normen = (m.normen || []).map(function (n) { return '<span class="chip">' + n + '</span>'; }).join("");
    var lfChips = lj.lernfelder.map(function (nr) { return '<span class="chip">LF ' + nr + '</span>'; }).join("");

    var body;
    if (content && content.bausteine) {
      body = renderListe(id, content);
    } else {
      body = '<div class="lf-box" style="border-left-color:var(--warn)"><h3>In Vorbereitung</h3>' +
        '<p>Dieses Modul ist im Gerüst angelegt. Struktur, Rahmenplan-Bezug und Lernfeld stehen — die Arbeitsblätter, Zeichnungen und Lösungen folgen im gleichen Qualitätsstandard (normgerecht, kein erfundener Inhalt).</p></div>';
    }

    app.innerHTML = h(
      '<div class="wrap">' +
      '<div class="crumb"><a href="#/">Cockpit</a> / <a href="#/lj/' + lj.nr + '">' + lj.titel + '</a> / ' + m.titel + '</div>' +
      '<p class="eyebrow">' + m.fach + ' · ' + m.status + '</p>' +
      '<h1>' + m.titel + '</h1>' +
      '<div class="mod-meta"><span class="chip"><b>Wochen:</b> ' + m.wochen + '</span>' +
      '<span class="chip"><b>Rahmenplan:</b> ' + m.rahmenplan + '</span>' + lfChips + normen + '</div>' +
      body +
      '<div class="footer">Modul-ID ' + m.id + '</div>' +
      '</div>'
    );
    if (content && content.teilgebiete) wireKatalog();
  }

  /* ---------- Modul-Aufgabenliste (untereinander, sortiert) ---------- */
  function bsById(content, bid) { return content.bausteine.filter(function (b) { return b.id === bid; })[0]; }

  function renderListe(id, content) {
    var order = (content.lernpfad && content.lernpfad.length) ? content.lernpfad : content.bausteine.map(function (b) { return b.id; });
    var rows = order.map(function (bid, i) {
      var bs = bsById(content, bid); if (!bs) return "";
      var meta = (bs.blattNr || "") + (bs.woche ? " · Woche " + bs.woche : "") +
        (bs.schwierigkeit && bs.schwierigkeit !== "—" ? " · " + bs.schwierigkeit : "");
      return '<a class="pfad-item" data-tg="' + (bs.teilgebiet || "") + '" data-schw="' + (bs.schwierigkeit || "") + '" href="#/modul/' + id + '/' + bs.id + '">' +
        '<span class="pfad-n">' + (i + 1) + '</span>' +
        '<span class="typ ' + bs.typ + '">' + bs.typ + '</span>' +
        '<span class="pfad-t">' + bs.titel + '</span>' +
        '<span class="pfad-tg">' + meta + '</span></a>';
    }).join("");

    var filters = "", count = "";
    if (content.teilgebiete) {
      var tgChips = '<button class="fchip active" data-grp="tg" data-val="alle">Alle Themen</button>' +
        content.teilgebiete.map(function (t) { return '<button class="fchip" data-grp="tg" data-val="' + t.id + '">' + t.titel + '</button>'; }).join("");
      var schwChips = ["alle", "leicht", "mittel", "schwer"].map(function (s, i) {
        return '<button class="fchip' + (i === 0 ? " active" : "") + '" data-grp="schw" data-val="' + s + '">' + (s === "alle" ? "Alle Stufen" : s) + '</button>';
      }).join("");
      filters = '<div class="filters"><div class="fgroup">' + tgChips + '</div><div class="fgroup">' + schwChips + '</div></div>';
      count = '<p class="chk-hint" id="kcount" style="margin-top:10px"></p>';
    }
    return '<p class="lead">' + content.intro + '</p>' +
      '<section style="margin-top:22px"><h2>Aufgaben</h2>' + filters +
      '<div class="pfad">' + rows + '</div>' + count + '</section>';
  }

  function wireKatalog() {
    var state = { tg: "alle", schw: "alle" };
    var chips = Array.prototype.slice.call(document.querySelectorAll(".fchip"));
    var rows = Array.prototype.slice.call(document.querySelectorAll(".pfad-item"));
    var countEl = document.getElementById("kcount");
    function apply() {
      var n = 0;
      rows.forEach(function (c) {
        var ok = (state.tg === "alle" || c.getAttribute("data-tg") === state.tg) &&
          (state.schw === "alle" || c.getAttribute("data-schw") === state.schw);
        c.style.display = ok ? "" : "none"; if (ok) n++;
      });
      if (countEl) countEl.textContent = n + " Aufgabe(n) sichtbar";
    }
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () {
        var grp = ch.getAttribute("data-grp");
        state[grp] = ch.getAttribute("data-val");
        chips.filter(function (x) { return x.getAttribute("data-grp") === grp; })
          .forEach(function (x) { x.classList.toggle("active", x === ch); });
        apply();
      });
    });
    apply();
  }

  /* ---------- View: Blatt (Detail) ---------- */
  function viewBlatt(id, bsId) {
    var f = findModul(id);
    var content = CONTENT[id];
    if (!f || !content) return viewModul(id);
    var m = f.modul, lj = f.lj;
    var idx = -1, bs = null;
    content.bausteine.forEach(function (b, i) { if (b.id === bsId) { bs = b; idx = i; } });
    if (!bs) return viewModul(id);
    setNav("lj" + lj.nr);

    var prev = idx > 0 ? content.bausteine[idx - 1] : null;
    var next = idx < content.bausteine.length - 1 ? content.bausteine[idx + 1] : null;
    var pager =
      (prev ? '<a class="btn" href="#/modul/' + id + '/' + prev.id + '">← ' + prev.titel + '</a>' : '<span></span>') +
      (next ? '<a class="btn" href="#/modul/' + id + '/' + next.id + '">' + next.titel + ' →</a>' : '<span></span>');

    app.innerHTML = h(
      '<div class="wrap">' +
      '<div class="crumb"><a href="#/">Cockpit</a> / <a href="#/lj/' + lj.nr + '">' + lj.titel + '</a> / <a href="#/modul/' + id + '">' + m.titel + '</a> / ' + bs.blattNr + '</div>' +
      '<div class="blatt-print">' +
      '<div class="blatt-head"><span class="no">' + (bs.blattNr || "") + '</span><h2>' + bs.titel + '</h2><span class="app-tag">Azubi Cockpit</span></div>' +
      bs.render() +
      '</div>' +
      '<div class="btnrow"><button class="btn primary" id="btnPrint">🖨 Dieses Blatt drucken (PDF)</button>' +
      '<a class="btn" href="#/modul/' + id + '">Zurück zum Modul</a></div>' +
      '<div class="pager">' + pager + '</div>' +
      '<div class="footer">' + m.titel + ' · ' + bs.blattNr + '</div>' +
      '</div>'
    );
    var pb = document.getElementById("btnPrint");
    if (pb) pb.addEventListener("click", function () {
      document.body.classList.add("print-blatt");
      window.print();
      setTimeout(function () { document.body.classList.remove("print-blatt"); }, 300);
    });
  }

  /* ---------- View: Aufgabe erstellen (Creator, mehrere Teile-Typen) ---------- */
  var C_TYPES = [
    { key: "platte", label: "Platte" }, { key: "welle", label: "Welle (Rundteil)" },
    { key: "scheibe", label: "Scheibe / Flansch" }, { key: "winkel", label: "Winkel (L-Profil)" },
    { key: "buchse", label: "Buchse / Hülse" }, { key: "uprofil", label: "U-Profil" },
    { key: "tprofil", label: "T-Profil" }, { key: "zahnrad", label: "Zahnrad (Grundform)" },
    { key: "biegeteil", label: "Biegeteil" }, { key: "bolzen", label: "Bolzen (Außengewinde)" },
  ];
  function viewCreator() {
    setNav("tools");
    var typOpts = C_TYPES.map(function (t) { return '<option value="' + t.key + '">' + t.label + '</option>'; }).join("");
    app.innerHTML = h(
      '<div class="wrap">' +
      '<div class="crumb"><a href="#/">Cockpit</a> / Aufgabe erstellen</div>' +
      '<p class="eyebrow">Werkzeug</p><h1>Aufgabe erstellen</h1>' +
      '<p class="lead">Wähle einen Werkstück-Typ und beschreibe ihn — die App erzeugt daraus eine normgerechte Zeichnung (Ansicht/Schnitt, Bemaßung, Schriftfeld) mit Prüfmaßen. Als Fertigzeichnung oder „zum Ergänzen“ druckbar.</p>' +
      '<div class="creator">' +
      '<div class="creator-form">' +
      '<h3>Typ &amp; Kopf</h3>' +
      '<div class="frow">Typ <select id="c_typ" style="width:auto;min-width:170px">' + typOpts + '</select></div>' +
      '<div class="frow">Benennung <input type="text" id="c_ben" value="Werkstück"></div>' +
      '<div class="frow">Nummer <input type="text" id="c_nr" value="AC-001" style="width:90px"> &nbsp; Toleranz <select id="c_tol"><option value="f">fein</option><option value="m" selected>mittel</option><option value="c">grob</option></select></div>' +
      '<h3>Maße</h3><div id="c_fields"></div>' +
      '<div class="btnrow"><button type="button" class="btn primary" id="c_print">🖨 Zeichnung drucken (PDF)</button></div>' +
      '</div>' +
      '<div>' +
      '<div class="blatt-print"><div class="blatt-head"><span class="no">NEU</span><h2 id="c_title">Werkstück</h2><span class="app-tag">Azubi Cockpit</span></div>' +
      '<div class="z-toggle" style="margin:4px 0 10px"><button type="button" class="btn small" id="c_toggle">Fertigzeichnung ⇄ Zum Ergänzen</button></div>' +
      '<div id="c_preview"></div>' +
      '<h3>Prüfmaße</h3><div id="c_masse"></div></div>' +
      '</div>' +
      '</div>' +
      '<div class="footer">Teile-Generator · normgerecht nach DIN ISO 128/129/5455/286/6410</div>' +
      '</div>'
    );
    wireCreator();
  }

  function wireCreator() {
    function gv(id) { var e = document.getElementById(id); return e ? e.value : ""; }
    function num(id, d) { var v = parseFloat(gv(id)); return isNaN(v) ? d : v; }
    function kopf() { return { benennung: gv("c_ben") || "Werkstück", nummer: gv("c_nr") || "AC-001", toleranz: gv("c_tol") }; }
    var gewOpts = '<option>M4</option><option>M5</option><option selected>M6</option><option>M8</option><option>M10</option><option>M12</option>';
    var gewOpts10 = '<option>M4</option><option>M5</option><option>M6</option><option>M8</option><option selected>M10</option><option>M12</option>';

    // Feld-Vorlagen je Typ
    var fields = {
      platte: '<div class="frow">Breite <input type="number" id="p_w" value="90"> Höhe <input type="number" id="p_h" value="50"> Dicke <input type="number" id="p_t" value="12"></div>' +
        '<div class="frow">Fase <input type="number" id="p_fase" value="0" step="0.5"> ×45° &nbsp; Ra <input type="text" id="p_ra" placeholder="z.B. 3,2" style="width:56px"></div>' +
        '<h3>Bohrungen &amp; Gewinde</h3><div id="c_feats"></div>' +
        '<div class="addbtns"><button type="button" class="btn small" id="c_addb">+ Bohrung</button><button type="button" class="btn small" id="c_addg">+ Gewinde</button></div>',
      welle: '<div class="frow">Fase (Ende) <input type="number" id="w_fase" value="1" step="0.5"> ×45°</div>' +
        '<h3>Abschnitte (⌀ × Länge)</h3><div id="c_segs"></div>' +
        '<div class="addbtns"><button type="button" class="btn small" id="c_addseg">+ Abschnitt</button></div>',
      scheibe: '<div class="frow">Außen-⌀ <input type="number" id="s_da" value="80"> Dicke <input type="number" id="s_t" value="12"></div>' +
        '<div class="frow">Bohrung ⌀ <input type="number" id="s_b" value="20"> Passung <select id="s_pass"><option value="">ohne</option><option value="H9">H9</option></select></div>' +
        '<div class="frow">Fase <input type="number" id="s_fase" value="0" step="0.5"> ×45°</div>' +
        '<h3>Lochkreis (Anzahl 0 = keiner)</h3><div class="frow">Anzahl <input type="number" id="s_n" value="4"> TK-⌀ <input type="number" id="s_tk" value="60"> Loch-⌀ <input type="number" id="s_d" value="9"></div>',
      winkel: '<div class="frow">Schenkel a <input type="number" id="k_a" value="70"> Schenkel b <input type="number" id="k_b" value="50"></div>' +
        '<div class="frow">Schenkelbreite <input type="number" id="k_s" value="12"> Dicke <input type="number" id="k_t" value="8"></div>' +
        '<h3>Bohrungen</h3><div id="c_feats"></div><div class="addbtns"><button type="button" class="btn small" id="c_addb">+ Bohrung</button></div>',
      buchse: '<div class="frow">Außen-⌀ <input type="number" id="u_da" value="40"> Bohrung ⌀ <input type="number" id="u_di" value="25"></div>' +
        '<div class="frow">Länge <input type="number" id="u_l" value="50"> Passung <select id="u_pass"><option value="">ohne</option><option value="H9">H9</option></select> Fase <input type="number" id="u_fase" value="1" step="0.5"></div>',
      uprofil: '<div class="frow">Breite <input type="number" id="up_w" value="60"> Höhe <input type="number" id="up_h" value="40"> Wandstärke <input type="number" id="up_s" value="6"></div>',
      tprofil: '<div class="frow">Breite <input type="number" id="tp_w" value="60"> Höhe <input type="number" id="tp_h" value="50"></div>' +
        '<div class="frow">Flanschdicke <input type="number" id="tp_s" value="8"> Stegdicke <input type="number" id="tp_sw" value="8"></div>',
      zahnrad: '<div class="frow">Modul m <input type="number" id="zr_m" value="2" step="0.5"> Zähnezahl z <input type="number" id="zr_z" value="20"></div>' +
        '<div class="frow">Bohrung ⌀ <input type="number" id="zr_b" value="20"> Passung <select id="zr_pass"><option value="">ohne</option><option value="H9">H9</option></select></div>',
      biegeteil: '<div class="frow">Schenkel a <input type="number" id="b_a" value="60"> Schenkel b <input type="number" id="b_b" value="40"></div>' +
        '<div class="frow">Dicke <input type="number" id="b_t" value="3"> Radius <input type="number" id="b_r" value="3"> Winkel <input type="number" id="b_w" value="90">°</div>',
      bolzen: '<div class="frow">Gewinde <select id="z_gew">' + gewOpts10 + '</select> Länge <input type="number" id="z_l" value="60"> Fase <input type="number" id="z_fase" value="1.5" step="0.5"></div>',
    };

    // Spec-Builder je Typ -> liefert AZ.parts-Objekt
    function buildApi(type) {
      var k = kopf();
      if (type === "platte") {
        var sp = { benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, w: num("p_w", 80), h: num("p_h", 50), t: num("p_t", 10), features: [] };
        if (num("p_fase", 0) > 0) sp.fase = num("p_fase", 0);
        var ra = (gv("p_ra") || "").trim(); if (ra) sp.ra = ra;
        Array.prototype.forEach.call(document.querySelectorAll("#c_feats .featrow"), function (row) {
          var x = parseFloat(row.querySelector(".f_x").value) || 0, y = parseFloat(row.querySelector(".f_y").value) || 0;
          if (row.getAttribute("data-typ") === "gewinde") sp.features.push({ typ: "gewinde", x: x, y: y, gew: row.querySelector(".f_gew").value });
          else { var f = { typ: "bohrung", x: x, y: y, d: parseFloat(row.querySelector(".f_d").value) || 6 }; if (row.querySelector(".f_pass").value === "H9") f.passung = "H9"; sp.features.push(f); }
        });
        return AZ.parts.platte(sp);
      }
      if (type === "welle") {
        var segs = [];
        Array.prototype.forEach.call(document.querySelectorAll("#c_segs .featrow"), function (row) {
          segs.push({ d: parseFloat(row.querySelector(".s_d").value) || 20, l: parseFloat(row.querySelector(".s_l").value) || 20 });
        });
        if (!segs.length) segs = [{ d: 20, l: 60 }];
        return AZ.parts.welle({ benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, fase: num("w_fase", 1), abschnitte: segs });
      }
      if (type === "scheibe") {
        var sp2 = { benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, da: num("s_da", 80), t: num("s_t", 12) };
        if (num("s_b", 0) > 0) { sp2.bohrung = num("s_b", 0); if (gv("s_pass") === "H9") sp2.passung = "H9"; }
        if (num("s_fase", 0) > 0) sp2.fase = num("s_fase", 0);
        if (num("s_n", 0) > 0) sp2.lochkreis = { n: num("s_n", 4), tk: num("s_tk", 60), d: num("s_d", 9) };
        return AZ.parts.scheibe(sp2);
      }
      if (type === "winkel") {
        var boh = [];
        Array.prototype.forEach.call(document.querySelectorAll("#c_feats .featrow"), function (row) {
          boh.push({ x: parseFloat(row.querySelector(".f_x").value) || 0, y: parseFloat(row.querySelector(".f_y").value) || 0, d: parseFloat(row.querySelector(".f_d").value) || 6 });
        });
        return AZ.parts.winkel({ benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, a: num("k_a", 70), b: num("k_b", 50), s: num("k_s", 12), t: num("k_t", 8), bohrungen: boh });
      }
      if (type === "buchse") {
        var sp3 = { benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, da: num("u_da", 40), di: num("u_di", 25), l: num("u_l", 50), fase: num("u_fase", 1) };
        if (gv("u_pass") === "H9") sp3.passung = "H9";
        return AZ.parts.buchse(sp3);
      }
      if (type === "uprofil")
        return AZ.parts.uprofil({ benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, w: num("up_w", 60), h: num("up_h", 40), s: num("up_s", 6) });
      if (type === "tprofil")
        return AZ.parts.tprofil({ benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, w: num("tp_w", 60), h: num("tp_h", 50), s: num("tp_s", 8), sw: num("tp_sw", 8) });
      if (type === "zahnrad") {
        var sp4 = { benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, m: num("zr_m", 2), z: Math.round(num("zr_z", 20)), bohrung: num("zr_b", 20) };
        if (gv("zr_pass") === "H9") sp4.passung = "H9";
        return AZ.parts.zahnrad(sp4);
      }
      if (type === "biegeteil")
        return AZ.parts.biegeteil({ benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, a: num("b_a", 60), b: num("b_b", 40), t: num("b_t", 3), r: num("b_r", 3), winkel: num("b_w", 90) });
      if (type === "bolzen")
        return AZ.parts.bolzen({ benennung: k.benennung, nummer: k.nummer, toleranz: k.toleranz, gew: gv("z_gew") || "M10", l: num("z_l", 60), fase: num("z_fase", 1.5) });
    }

    function refresh() {
      var type = gv("c_typ") || "platte";
      var t = document.getElementById("c_title"); if (t) t.textContent = gv("c_ben") || "Werkstück";
      try {
        var api = buildApi(type);
        document.getElementById("c_preview").innerHTML =
          '<div class="aufgabe"><div class="zeichnung-halter z-fertig">' + api.svg("fertig") + '</div>' +
          '<div class="zeichnung-halter z-erg">' + api.svg("ergaenzen") + '</div></div>';
        document.getElementById("c_masse").innerHTML = azMasseTable(api);
      } catch (e) { document.getElementById("c_preview").innerHTML = '<p class="chk-hint">Eingabe prüfen: ' + e.message + '</p>'; }
    }

    function bindRow(div) {
      div.querySelector(".rmfeat").addEventListener("click", function () { div.remove(); refresh(); });
      Array.prototype.forEach.call(div.querySelectorAll("input,select"), function (el) { el.addEventListener("input", refresh); });
    }
    function addFeat(typ, x, y, d) {
      var wrap = document.getElementById("c_feats"); if (!wrap) return;
      var div = document.createElement("div"); div.className = "featrow"; div.setAttribute("data-typ", typ);
      if (typ === "gewinde")
        div.innerHTML = '<span class="ftag">Gewinde</span> x<input class="f_x" type="number" value="' + (x || 20) + '"> y<input class="f_y" type="number" value="' + (y || 25) + '"> <select class="f_gew">' + gewOpts + '</select><button type="button" class="rmfeat">✕</button>';
      else
        div.innerHTML = '<span class="ftag">Bohrung</span> x<input class="f_x" type="number" value="' + (x || 20) + '"> y<input class="f_y" type="number" value="' + (y || 25) + '"> ⌀<input class="f_d" type="number" step="0.1" value="' + (d || 8) + '"> <select class="f_pass"><option value="">ohne</option><option value="H9">H9</option></select><button type="button" class="rmfeat">✕</button>';
      wrap.appendChild(div); bindRow(div); refresh();
    }
    function addSeg(d, l) {
      var wrap = document.getElementById("c_segs"); if (!wrap) return;
      var div = document.createElement("div"); div.className = "featrow";
      div.innerHTML = '<span class="ftag">Abschnitt</span> ⌀<input class="s_d" type="number" value="' + (d || 20) + '"> Länge <input class="s_l" type="number" value="' + (l || 30) + '"><button type="button" class="rmfeat">✕</button>';
      wrap.appendChild(div); bindRow(div); refresh();
    }

    function renderFields(type) {
      document.getElementById("c_fields").innerHTML = fields[type] || "";
      Array.prototype.forEach.call(document.querySelectorAll("#c_fields input, #c_fields select"), function (el) { el.addEventListener("input", refresh); });
      if (type === "platte") {
        document.getElementById("c_addb").addEventListener("click", function () { addFeat("bohrung"); });
        document.getElementById("c_addg").addEventListener("click", function () { addFeat("gewinde"); });
        addFeat("bohrung", 25, 25, 12); addFeat("gewinde", 65, 25);
      } else if (type === "welle") {
        document.getElementById("c_addseg").addEventListener("click", function () { addSeg(); });
        addSeg(20, 30); addSeg(30, 40); addSeg(16, 25);
      } else if (type === "winkel") {
        document.getElementById("c_addb").addEventListener("click", function () { addFeat("bohrung"); });
        addFeat("bohrung", 6, 25, 9); addFeat("bohrung", 45, 6, 9);
      } else { refresh(); }
    }

    document.getElementById("c_typ").addEventListener("change", function () { renderFields(this.value); });
    ["c_ben", "c_nr", "c_tol"].forEach(function (id) { document.getElementById(id).addEventListener("input", refresh); });
    document.getElementById("c_toggle").addEventListener("click", function () { var a = document.querySelector("#c_preview .aufgabe"); if (a) a.classList.toggle("erg"); });
    document.getElementById("c_print").addEventListener("click", function () {
      document.body.classList.add("print-blatt"); window.print();
      setTimeout(function () { document.body.classList.remove("print-blatt"); }, 300);
    });
    renderFields("platte");
  }

  /* ---------- View: Freihand-Skizze (Mini-CAD) ---------- */
  var SK_TOOLS = [
    { k: "linie", l: "Linie" }, { k: "center", l: "Mittellinie" }, { k: "kreis", l: "Kreis" },
    { k: "bogen", l: "Bogen" }, { k: "rechteck", l: "Rechteck" }, { k: "mass", l: "Maß" },
    { k: "text", l: "Text" }, { k: "loeschen", l: "Löschen" },
  ];
  function viewSkizze() {
    setNav("skizze");
    var tools = SK_TOOLS.map(function (t, i) { return '<button type="button" class="sk-tool' + (i === 0 ? " active" : "") + '" data-tool="' + t.k + '">' + t.l + '</button>'; }).join("");
    app.innerHTML = h(
      '<div class="wrap">' +
      '<div class="crumb"><a href="#/">Cockpit</a> / Skizze</div>' +
      '<p class="eyebrow">Werkzeug</p><h1>Skizze zeichnen</h1>' +
      '<p class="lead">Freies Zeichenbrett mit Raster (5 mm) und Fang. Werkzeug wählen, zwei Punkte klicken. Maße werden in Millimetern gemessen. Zum Drucken/Speichern als PDF.</p>' +
      '<div class="sk-bar"><div class="sk-tools">' + tools + '</div>' +
      '<div class="sk-actions">' +
      '<label class="sk-chk"><input type="checkbox" id="sk-snap" checked> Raster-Fang</label>' +
      '<label class="sk-chk"><input type="checkbox" id="sk-sf"> Schriftfeld</label>' +
      '<button type="button" class="btn small" id="sk-undo">↶ Rückgängig</button>' +
      '<button type="button" class="btn small" id="sk-clear">Leeren</button>' +
      '<button type="button" class="btn small" id="sk-save">💾 Speichern</button>' +
      '<button type="button" class="btn small" id="sk-load">📂 Laden</button>' +
      '<input type="file" id="sk-file" accept="application/json" style="display:none">' +
      '<button type="button" class="btn primary" id="sk-print">🖨 Drucken (PDF)</button>' +
      '</div></div>' +
      '<p class="chk-hint" id="sk-hint">Werkzeug: Linie — ersten Punkt klicken.</p>' +
      '<div class="blatt-print sk-wrap">' +
      '<svg id="skcanvas" viewBox="0 0 260 180" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<pattern id="skg" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#d7ddd8" stroke-width="0.2"/></pattern>' +
      '<pattern id="skG" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#c2cabf" stroke-width="0.35"/></pattern>' +
      '<marker id="skae" markerWidth="3.2" markerHeight="2.4" refX="3" refY="1.2" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0.3 L3,1.2 L0,2.1 Z" fill="#1a1a1a"/></marker>' +
      '<marker id="skas" markerWidth="3.2" markerHeight="2.4" refX="0.2" refY="1.2" orient="auto" markerUnits="userSpaceOnUse"><path d="M3.2,0.3 L0.2,1.2 L3.2,2.1 Z" fill="#1a1a1a"/></marker>' +
      '</defs>' +
      '<rect x="0" y="0" width="260" height="180" fill="#fdfdfb"/>' +
      '<rect x="0" y="0" width="260" height="180" fill="url(#skg)"/>' +
      '<rect x="0" y="0" width="260" height="180" fill="url(#skG)"/>' +
      '<rect x="6" y="6" width="248" height="168" fill="none" stroke="#1a1a1a" stroke-width="0.4"/>' +
      '<g id="sk-content"></g><g id="sk-schriftfeld"></g><g id="sk-preview"></g>' +
      '<circle id="sk-cursor" r="1.1" fill="none" stroke="#E4531D" stroke-width="0.4" style="display:none"/>' +
      '</svg></div>' +
      '<div class="frow" style="margin-top:10px">Titel <input type="text" id="sk-titel" value="Skizze" style="width:180px"></div>' +
      '<div class="footer">Skizzen-Modus · Raster 5 mm · Maße in mm</div>' +
      '</div>'
    );
    wireSkizze();
  }

  function wireSkizze() {
    var svg = document.getElementById("skcanvas"), content = document.getElementById("sk-content"),
      sfG = document.getElementById("sk-schriftfeld"), preview = document.getElementById("sk-preview"),
      cursor = document.getElementById("sk-cursor"), hint = document.getElementById("sk-hint");
    var GRID = 5, els = [], tool = "linie", pts = [], snap = true, showSF = false, titel = "Skizze";
    var LS = "az-skizze-v1";

    function toMM(evt) {
      var r = svg.getBoundingClientRect();
      var x = (evt.clientX - r.left) / r.width * 260, y = (evt.clientY - r.top) / r.height * 180;
      if (snap) { x = Math.round(x / GRID) * GRID; y = Math.round(y / GRID) * GRID; }
      return { x: Math.max(0, Math.min(260, +x.toFixed(1))), y: Math.max(0, Math.min(180, +y.toFixed(1))) };
    }
    function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
    function dist(a, b) { return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); }
    function ptNeed(t) { return t === "bogen" ? 3 : 2; }
    function ff(v) { return (+v).toFixed(2); }
    function makeEl(t, P) {
      if (t === "linie") return { type: "line", cls: "vis", x1: P[0].x, y1: P[0].y, x2: P[1].x, y2: P[1].y };
      if (t === "center") return { type: "line", cls: "center", x1: P[0].x, y1: P[0].y, x2: P[1].x, y2: P[1].y };
      if (t === "kreis") return { type: "circle", cx: P[0].x, cy: P[0].y, r: +dist(P[0], P[1]).toFixed(1) };
      if (t === "rechteck") return { type: "rect", x: Math.min(P[0].x, P[1].x), y: Math.min(P[0].y, P[1].y), w: Math.abs(P[1].x - P[0].x), h: Math.abs(P[1].y - P[0].y) };
      if (t === "mass") return { type: "dim", x1: P[0].x, y1: P[0].y, x2: P[1].x, y2: P[1].y };
      if (t === "bogen") { var c = P[0]; return { type: "arc", cx: c.x, cy: c.y, r: +dist(c, P[1]).toFixed(1), a0: Math.atan2(P[1].y - c.y, P[1].x - c.x), a1: Math.atan2(P[2].y - c.y, P[2].x - c.x) }; }
      return null;
    }
    function elSvg(e, prev) {
      var c = prev ? "sk-prev" : ("sk-" + (e.cls || "vis"));
      if (e.type === "line") return '<line x1="' + e.x1 + '" y1="' + e.y1 + '" x2="' + e.x2 + '" y2="' + e.y2 + '" class="' + (prev ? "sk-prev" : (e.cls === "center" ? "sk-center" : "sk-vis")) + '"/>';
      if (e.type === "circle") return '<circle cx="' + e.cx + '" cy="' + e.cy + '" r="' + e.r + '" class="' + c + '" fill="none"/>';
      if (e.type === "rect") return '<rect x="' + e.x + '" y="' + e.y + '" width="' + e.w + '" height="' + e.h + '" class="' + c + '" fill="none"/>';
      if (e.type === "text") return '<text x="' + e.x + '" y="' + e.y + '" class="sk-text">' + esc(e.text) + '</text>';
      if (e.type === "arc") {
        var x0 = e.cx + e.r * Math.cos(e.a0), y0 = e.cy + e.r * Math.sin(e.a0), x1 = e.cx + e.r * Math.cos(e.a1), y1 = e.cy + e.r * Math.sin(e.a1);
        var delta = e.a1 - e.a0; while (delta < 0) delta += 2 * Math.PI; while (delta >= 2 * Math.PI) delta -= 2 * Math.PI;
        var large = delta > Math.PI ? 1 : 0;
        return '<path d="M' + ff(x0) + ',' + ff(y0) + ' A' + e.r + ',' + e.r + ' 0 ' + large + ' 1 ' + ff(x1) + ',' + ff(y1) + '" class="' + (prev ? "sk-prev" : "sk-vis") + '" fill="none"/>';
      }
      if (e.type === "dim") {
        var dx = e.x2 - e.x1, dy = e.y2 - e.y1, d2 = Math.sqrt(dx * dx + dy * dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
        var mx = (e.x1 + e.x2) / 2, my = (e.y1 + e.y2) / 2;
        if (ang > 90 || ang < -90) ang += 180;
        return '<line x1="' + e.x1 + '" y1="' + e.y1 + '" x2="' + e.x2 + '" y2="' + e.y2 + '" class="' + (prev ? "sk-prev" : "sk-dim") + '" marker-start="url(#skas)" marker-end="url(#skae)"/>' +
          (prev ? "" : '<text x="' + mx + '" y="' + (my - 1.4) + '" text-anchor="middle" class="sk-dimtx" transform="rotate(' + ang.toFixed(1) + ' ' + mx + ' ' + my + ')">' + Math.round(d2) + '</text>');
      }
      return "";
    }
    function renderSF() {
      if (!showSF) { sfG.innerHTML = ""; return; }
      var x = 164, y = 152, w = 90, hh = 22;
      sfG.innerHTML = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="#fff" stroke="#1a1a1a" stroke-width="0.4"/>' +
        '<line x1="' + x + '" y1="' + (y + 11) + '" x2="' + (x + w) + '" y2="' + (y + 11) + '" stroke="#1a1a1a" stroke-width="0.3"/>' +
        '<text x="' + (x + 2) + '" y="' + (y + 4) + '" class="sk-dimtx" style="fill:#666">BENENNUNG</text>' +
        '<text x="' + (x + 2) + '" y="' + (y + 9.4) + '" class="sk-text">' + esc(titel) + '</text>' +
        '<text x="' + (x + 2) + '" y="' + (y + 15.5) + '" class="sk-dimtx" style="fill:#666">NAME / DATUM</text>' +
        '<text x="' + (x + 2) + '" y="' + (y + 20.5) + '" class="sk-text" style="font-size:3px">____________  ______</text>' +
        '<text x="' + (x + w - 2) + '" y="' + (y + 20.5) + '" text-anchor="end" class="sk-dimtx" style="fill:#888">Azubi Cockpit</text>';
    }
    function save() { try { localStorage.setItem(LS, JSON.stringify({ titel: titel, showSF: showSF, els: els })); } catch (e) { } }
    function render() { content.innerHTML = els.map(function (e) { return elSvg(e, false); }).join(""); renderSF(); save(); }
    function setHint(msg) { if (hint) hint.textContent = msg; }
    function toolLabel() { var f = SK_TOOLS.filter(function (t) { return t.k === tool; })[0]; return f ? f.l : tool; }

    function segDist(px, py, x1, y1, x2, y2) {
      var dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy;
      var tt = L2 ? ((px - x1) * dx + (py - y1) * dy) / L2 : 0; tt = Math.max(0, Math.min(1, tt));
      return Math.sqrt(Math.pow(px - (x1 + tt * dx), 2) + Math.pow(py - (y1 + tt * dy), 2));
    }
    function elDist(e, p) {
      if (e.type === "line" || e.type === "dim") return segDist(p.x, p.y, e.x1, e.y1, e.x2, e.y2);
      if (e.type === "circle" || e.type === "arc") return Math.abs(Math.sqrt(Math.pow(p.x - e.cx, 2) + Math.pow(p.y - e.cy, 2)) - e.r);
      if (e.type === "rect") return Math.min(segDist(p.x, p.y, e.x, e.y, e.x + e.w, e.y), segDist(p.x, p.y, e.x, e.y + e.h, e.x + e.w, e.y + e.h), segDist(p.x, p.y, e.x, e.y, e.x, e.y + e.h), segDist(p.x, p.y, e.x + e.w, e.y, e.x + e.w, e.y + e.h));
      if (e.type === "text") return Math.sqrt(Math.pow(p.x - e.x, 2) + Math.pow(p.y - e.y, 2));
      return 1e9;
    }
    function deleteNear(p) {
      var best = -1, bd = 4;
      els.forEach(function (e, i) { var d = elDist(e, p); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { els.splice(best, 1); render(); }
    }
    function firstHint() { setHint(toolLabel() + (tool === "text" ? " — Position klicken." : tool === "loeschen" ? " — Element anklicken." : " — ersten Punkt klicken.")); }

    svg.addEventListener("click", function (evt) {
      var p = toMM(evt);
      if (tool === "text") { var tx = window.prompt("Text:"); if (tx) { els.push({ type: "text", x: p.x, y: p.y, text: tx }); render(); } return; }
      if (tool === "loeschen") { deleteNear(p); return; }
      pts.push(p);
      if (pts.length >= ptNeed(tool)) { var e = makeEl(tool, pts); if (e) els.push(e); pts = []; preview.innerHTML = ""; render(); firstHint(); }
      else setHint(toolLabel() + " — nächsten Punkt (" + pts.length + "/" + ptNeed(tool) + ", Esc bricht ab).");
    });
    svg.addEventListener("mousemove", function (evt) {
      var p = toMM(evt);
      cursor.setAttribute("cx", p.x); cursor.setAttribute("cy", p.y); cursor.style.display = "";
      if (!pts.length || tool === "text" || tool === "loeschen") { return; }
      var P = pts.concat([p]);
      if (tool === "bogen" && pts.length === 1) { preview.innerHTML = '<line x1="' + pts[0].x + '" y1="' + pts[0].y + '" x2="' + p.x + '" y2="' + p.y + '" class="sk-prev"/>'; return; }
      var e = makeEl(tool, P); preview.innerHTML = e ? elSvg(e, true) : "";
    });
    svg.addEventListener("mouseleave", function () { cursor.style.display = "none"; });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { pts = []; preview.innerHTML = ""; firstHint(); } });

    Array.prototype.forEach.call(document.querySelectorAll(".sk-tool"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll(".sk-tool"), function (b) { b.classList.toggle("active", b === btn); });
        tool = btn.getAttribute("data-tool"); pts = []; preview.innerHTML = ""; firstHint();
      });
    });
    document.getElementById("sk-snap").addEventListener("change", function () { snap = this.checked; });
    document.getElementById("sk-sf").addEventListener("change", function () { showSF = this.checked; renderSF(); save(); });
    document.getElementById("sk-undo").addEventListener("click", function () { els.pop(); pts = []; preview.innerHTML = ""; render(); });
    document.getElementById("sk-clear").addEventListener("click", function () { if (window.confirm("Skizze leeren?")) { els = []; pts = []; preview.innerHTML = ""; render(); } });
    document.getElementById("sk-titel").addEventListener("input", function () { titel = this.value; renderSF(); save(); });
    document.getElementById("sk-save").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify({ titel: titel, showSF: showSF, els: els }, null, 1)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (titel || "skizze").replace(/[^\w-]+/g, "_") + ".json"; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
    });
    document.getElementById("sk-load").addEventListener("click", function () { document.getElementById("sk-file").click(); });
    document.getElementById("sk-file").addEventListener("change", function (ev) {
      var file = ev.target.files[0]; if (!file) return;
      var rd = new FileReader(); rd.onload = function () { try { restore(JSON.parse(rd.result)); } catch (e) { window.alert("Datei konnte nicht gelesen werden."); } };
      rd.readAsText(file); ev.target.value = "";
    });
    document.getElementById("sk-print").addEventListener("click", function () {
      document.body.classList.add("print-blatt"); window.print();
      setTimeout(function () { document.body.classList.remove("print-blatt"); }, 300);
    });

    function restore(obj) {
      els = Array.isArray(obj.els) ? obj.els : []; titel = obj.titel || "Skizze"; showSF = !!obj.showSF;
      var ti = document.getElementById("sk-titel"); if (ti) ti.value = titel;
      var sf = document.getElementById("sk-sf"); if (sf) sf.checked = showSF;
      pts = []; preview.innerHTML = ""; render();
    }

    if (location.hash.indexOf("demo") >= 0) {
      showSF = true; document.getElementById("sk-sf").checked = true; titel = "Demo-Skizze"; document.getElementById("sk-titel").value = titel;
      els = [
        { type: "rect", x: 70, y: 55, w: 120, h: 70 },
        { type: "circle", cx: 130, cy: 90, r: 22 },
        { type: "arc", cx: 130, cy: 90, r: 40, a0: -Math.PI / 2, a1: 0 },
        { type: "line", cls: "center", x1: 130, y1: 45, x2: 130, y2: 135 },
        { type: "line", cls: "center", x1: 60, y1: 90, x2: 200, y2: 90 },
        { type: "dim", x1: 70, y1: 140, x2: 190, y2: 140 },
        { type: "dim", x1: 55, y1: 55, x2: 55, y2: 125 },
        { type: "text", x: 78, y: 50, text: "Demo" },
      ];
      render();
    } else {
      var raw = null; try { raw = localStorage.getItem(LS); } catch (e) { }
      if (raw) { try { restore(JSON.parse(raw)); } catch (e) { render(); } } else render();
    }
    firstHint();
  }

  /* ---------- Router ---------- */
  function route() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    window.scrollTo(0, 0);
    if (parts.length === 0) return viewStart();
    if (parts[0] === "tools") return parts[1] === "skizze" ? viewSkizze() : viewCreator();
    if (parts[0] === "lj") return viewLj(parts[1]);
    if (parts[0] === "modul" && parts.length >= 3) return viewBlatt(parts[1], parts[2]);
    if (parts[0] === "modul") return viewModul(parts[1]);
    return viewStart();
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  if (document.readyState !== "loading") route();
})();
