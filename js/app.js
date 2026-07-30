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

  /* ---------- Router ---------- */
  function route() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    window.scrollTo(0, 0);
    if (parts.length === 0) return viewStart();
    if (parts[0] === "lj") return viewLj(parts[1]);
    if (parts[0] === "modul" && parts.length >= 3) return viewBlatt(parts[1], parts[2]);
    if (parts[0] === "modul") return viewModul(parts[1]);
    return viewStart();
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  if (document.readyState !== "loading") route();
})();
