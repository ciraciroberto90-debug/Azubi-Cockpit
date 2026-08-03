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
    if (content && content.teilgebiete) {
      body = renderKatalog(id, content);
    } else if (content && content.bausteine) {
      var cards = content.bausteine.map(function (bs) {
        return '<a class="bs" href="#/modul/' + id + '/' + bs.id + '">' +
          '<span class="typ ' + bs.typ + '">' + bs.typ + '</span>' +
          '<div class="t"><h3>' + bs.titel + '</h3><small>' + (bs.blattNr || "") + '</small></div>' +
          '<span class="mono" style="color:var(--ink-3)">→</span></a>';
      }).join("");
      body = '<p class="lead">' + content.intro + '</p>' +
        '<section style="margin-top:22px"><h2>Blätter</h2><div class="baustein-grid">' + cards + '</div></section>';
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

  /* ---------- Katalog (Lernpfad + Filter) ---------- */
  function bsById(content, bid) { return content.bausteine.filter(function (b) { return b.id === bid; })[0]; }

  function renderKatalog(id, content) {
    // Empfohlener Lernpfad (nummeriert)
    var pfad = content.lernpfad.map(function (bid, i) {
      var bs = bsById(content, bid); if (!bs) return "";
      return '<a class="pfad-item" href="#/modul/' + id + '/' + bs.id + '">' +
        '<span class="pfad-n">' + (i + 1) + '</span>' +
        '<span class="typ ' + bs.typ + '">' + bs.typ + '</span>' +
        '<span class="pfad-t">' + bs.titel + '</span>' +
        '<span class="pfad-tg">' + (bs.teilgebietTitel || "") + (bs.woche ? " · W" + bs.woche : "") + '</span></a>';
    }).join("");

    // Filter-Chips
    var tgChips = '<button class="fchip active" data-grp="tg" data-val="alle">Alle Themen</button>' +
      content.teilgebiete.map(function (t) { return '<button class="fchip" data-grp="tg" data-val="' + t.id + '">' + t.titel + '</button>'; }).join("");
    var schwChips = ["alle", "leicht", "mittel", "schwer"].map(function (s, i) {
      return '<button class="fchip' + (i === 0 ? " active" : "") + '" data-grp="schw" data-val="' + s + '">' + (s === "alle" ? "Alle Stufen" : s) + '</button>';
    }).join("");

    // Katalog-Karten
    var cards = content.bausteine.map(function (bs) {
      return '<a class="kcard" data-tg="' + bs.teilgebiet + '" data-schw="' + bs.schwierigkeit + '" href="#/modul/' + id + '/' + bs.id + '">' +
        '<span class="typ ' + bs.typ + '">' + bs.typ + '</span>' +
        '<div class="t"><h3>' + bs.titel + '</h3><small>' + bs.blattNr + (bs.woche ? " · W" + bs.woche : "") + ' · ' + (bs.schwierigkeit !== "—" ? bs.schwierigkeit : "Theorie") + '</small></div>' +
        '<span class="mono" style="color:var(--ink-3)">→</span></a>';
    }).join("");

    return '<p class="lead">' + content.intro + '</p>' +
      '<section style="margin-top:24px"><p class="eyebrow">Empfohlener Lernpfad</p><h2>Schritt für Schritt</h2>' +
      '<div class="pfad">' + pfad + '</div></section>' +
      '<section style="margin-top:34px"><p class="eyebrow">Aufgaben-Katalog</p><h2>Frei auswählen</h2>' +
      '<div class="filters"><div class="fgroup">' + tgChips + '</div><div class="fgroup">' + schwChips + '</div></div>' +
      '<div class="kgrid">' + cards + '</div>' +
      '<p class="chk-hint" id="kcount" style="margin-top:12px"></p></section>';
  }

  function wireKatalog() {
    var state = { tg: "alle", schw: "alle" };
    var chips = Array.prototype.slice.call(document.querySelectorAll(".fchip"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".kcard"));
    var countEl = document.getElementById("kcount");
    function apply() {
      var n = 0;
      cards.forEach(function (c) {
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

  /* ---------- View: Aufgabe erstellen (Creator) ---------- */
  function viewCreator() {
    setNav("tools");
    app.innerHTML = h(
      '<div class="wrap">' +
      '<div class="crumb"><a href="#/">Cockpit</a> / Aufgabe erstellen</div>' +
      '<p class="eyebrow">Werkzeug</p><h1>Aufgabe erstellen</h1>' +
      '<p class="lead">Beschreibe ein Werkstück (Platte mit Bohrungen/Gewinden) — die App erzeugt daraus eine normgerechte Zeichnung mit Schnitt, Bemaßung und Prüfmaßen. Als Fertigzeichnung oder „zum Ergänzen“ druckbar.</p>' +
      '<div class="creator">' +
      '<div class="creator-form">' +
      '<h3>Werkstück</h3>' +
      '<div class="frow">Benennung <input type="text" id="c_ben" value="Übungsplatte"></div>' +
      '<div class="frow">Nummer <input type="text" id="c_nr" value="AC-001" style="width:90px"></div>' +
      '<div class="frow">Breite <input type="number" id="c_w" value="90"> Höhe <input type="number" id="c_h" value="50"> Dicke <input type="number" id="c_t" value="12"></div>' +
      '<div class="frow">Toleranz <select id="c_tol"><option value="f">fein</option><option value="m" selected>mittel</option><option value="c">grob</option></select></div>' +
      '<div class="frow">Fase <input type="number" id="c_fase" value="0" step="0.5"> ×45° &nbsp; Ra <input type="text" id="c_ra" value="" style="width:60px" placeholder="z.B. 3,2"></div>' +
      '<h3>Bohrungen &amp; Gewinde</h3>' +
      '<div id="c_feats"></div>' +
      '<div class="addbtns"><button class="btn small" id="c_addb">+ Bohrung</button><button class="btn small" id="c_addg">+ Gewinde</button></div>' +
      '<div class="btnrow"><button class="btn primary" id="c_print">🖨 Zeichnung drucken (PDF)</button></div>' +
      '<p class="chk-hint">Tipp: x/y sind die Positionen der Bohrmitte in mm (von links/unten der Platte).</p>' +
      '</div>' +
      '<div>' +
      '<div class="blatt-print"><div class="blatt-head"><span class="no">NEU</span><h2 id="c_title">Übungsplatte</h2><span class="app-tag">Azubi Cockpit</span></div>' +
      '<div class="z-toggle" style="margin:4px 0 10px"><button class="btn small" id="c_toggle">Fertigzeichnung ⇄ Zum Ergänzen</button></div>' +
      '<div id="c_preview"></div>' +
      '<h3>Prüfmaße</h3><div id="c_masse"></div></div>' +
      '</div>' +
      '</div>' +
      '<div class="footer">Erzeugt mit dem Teile-Generator (AZ.parts.platte) · normgerecht nach DIN ISO</div>' +
      '</div>'
    );
    wireCreator();
  }

  function wireCreator() {
    function gv(id) { var e = document.getElementById(id); return e ? e.value : ""; }
    function num(id, d) { var v = parseFloat(gv(id)); return isNaN(v) ? d : v; }
    function buildSpec() {
      var spec = { benennung: gv("c_ben") || "Werkstück", nummer: gv("c_nr") || "AC-001", w: num("c_w", 80), h: num("c_h", 50), t: num("c_t", 10), toleranz: gv("c_tol"), features: [] };
      var fase = num("c_fase", 0); if (fase > 0) spec.fase = fase;
      var ra = (gv("c_ra") || "").trim(); if (ra) spec.ra = ra;
      Array.prototype.forEach.call(document.querySelectorAll("#c_feats .featrow"), function (row) {
        var typ = row.getAttribute("data-typ");
        var x = parseFloat(row.querySelector(".f_x").value) || 0, y = parseFloat(row.querySelector(".f_y").value) || 0;
        if (typ === "gewinde") spec.features.push({ typ: "gewinde", x: x, y: y, gew: row.querySelector(".f_gew").value });
        else { var f = { typ: "bohrung", x: x, y: y, d: parseFloat(row.querySelector(".f_d").value) || 6 }; if (row.querySelector(".f_pass").value === "H9") f.passung = "H9"; spec.features.push(f); }
      });
      return spec;
    }
    function refresh() {
      var spec = buildSpec();
      var t = document.getElementById("c_title"); if (t) t.textContent = spec.benennung;
      try {
        var api = AZ.parts.platte(spec);
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
    function addFeat(typ, x, y) {
      var wrap = document.getElementById("c_feats"), div = document.createElement("div");
      div.className = "featrow"; div.setAttribute("data-typ", typ);
      if (typ === "gewinde")
        div.innerHTML = '<span class="ftag">Gewinde</span> x<input class="f_x" type="number" value="' + (x || 20) + '"> y<input class="f_y" type="number" value="' + (y || 25) + '"> ' +
          '<select class="f_gew"><option>M4</option><option>M5</option><option selected>M6</option><option>M8</option><option>M10</option><option>M12</option></select><button class="rmfeat" title="entfernen">✕</button>';
      else
        div.innerHTML = '<span class="ftag">Bohrung</span> x<input class="f_x" type="number" value="' + (x || 20) + '"> y<input class="f_y" type="number" value="' + (y || 25) + '"> ⌀<input class="f_d" type="number" step="0.1" value="8"> ' +
          '<select class="f_pass"><option value="">ohne</option><option value="H9">H9</option></select><button class="rmfeat" title="entfernen">✕</button>';
      wrap.appendChild(div); bindRow(div); refresh();
    }
    ["c_ben", "c_nr", "c_w", "c_h", "c_t", "c_tol", "c_fase", "c_ra"].forEach(function (id) { var e = document.getElementById(id); if (e) e.addEventListener("input", refresh); });
    document.getElementById("c_addb").addEventListener("click", function () { addFeat("bohrung"); });
    document.getElementById("c_addg").addEventListener("click", function () { addFeat("gewinde"); });
    document.getElementById("c_toggle").addEventListener("click", function () { var a = document.querySelector("#c_preview .aufgabe"); if (a) a.classList.toggle("erg"); });
    document.getElementById("c_print").addEventListener("click", function () {
      document.body.classList.add("print-blatt"); window.print();
      setTimeout(function () { document.body.classList.remove("print-blatt"); }, 300);
    });
    // Startbeispiel
    addFeat("bohrung", 25, 25); addFeat("gewinde", 65, 25);
  }

  /* ---------- Router ---------- */
  function route() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    window.scrollTo(0, 0);
    if (parts.length === 0) return viewStart();
    if (parts[0] === "tools") return viewCreator();
    if (parts[0] === "lj") return viewLj(parts[1]);
    if (parts[0] === "modul" && parts.length >= 3) return viewBlatt(parts[1], parts[2]);
    if (parts[0] === "modul") return viewModul(parts[1]);
    return viewStart();
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  if (document.readyState !== "loading") route();
})();
