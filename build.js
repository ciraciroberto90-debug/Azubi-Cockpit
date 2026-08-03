/* ============================================================================
   Build: erzeugt eine EINZIGE, in sich geschlossene HTML-Datei
   (azubi-cockpit.html) mit eingebettetem CSS + JS. Diese Datei laeuft ohne
   weitere Dateien -> einfach doppelklicken / im Browser oeffnen.
   Aufruf:  node build.js
   ==========================================================================*/
var fs = require("fs");
function read(p) { return fs.readFileSync(p, "utf8"); }

var css = read("css/cockpit.css") + "\n" + read("css/print.css");
var js = [
  "js/data/curriculum.js",
  "js/lib/zeichnung.js",
  "js/lib/teile.js",
  "js/module/_helpers.js",
  "js/module/m1-arbeitssicherheit.js",
  "js/module/m2-technisches-zeichnen.js",
  "js/module/m3-planen-organisieren.js",
  "js/module/m4-pruefen-anreissen.js",
  "js/module/m5-grundkurs-metall.js",
  "js/module/m6-fuegen.js",
  "js/module/m7-zwischenpruefung.js",
  "js/app.js",
].map(read).join("\n\n");

var themeJs =
  "(function(){var t=document.getElementById('themeToggle');if(!t)return;" +
  "t.addEventListener('click',function(e){e.preventDefault();var r=document.documentElement;" +
  "var c=r.getAttribute('data-theme');r.setAttribute('data-theme',c==='dark'?'light':'dark');});})();";

var html =
  '<!doctype html>\n<html lang="de">\n<head>\n' +
  '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  "<title>Azubi Cockpit — Mechatroniker/in</title>\n" +
  '<meta name="description" content="Digitales Ausbildungs-Cockpit fuer Mechatroniker/innen: Ausbildungsrahmenplan und Lernfelder, druckfertige Arbeitsblaetter, normgerechte technische Zeichnungen, Loesungshefte.">\n' +
  "<style>\n" + css + "\n</style>\n</head>\n<body>\n" +
  '<header class="topbar">\n' +
  '  <a class="brand" href="#/"><span class="dot"></span><span>Azubi&nbsp;Cockpit <small>Mechatroniker/in</small></span></a>\n' +
  '  <nav class="nav">\n' +
  '    <a data-k="start" href="#/">Start</a>\n' +
  '    <a data-k="lj1" href="#/lj/1">1. Lehrjahr</a>\n' +
  '    <a data-k="lj2" href="#/lj/2">2. Lehrjahr</a>\n' +
  '    <a data-k="lj3" href="#/lj/3">3. Lehrjahr</a>\n' +
  '    <a data-k="tools" href="#/tools/erstellen">＋ Erstellen</a>\n' +
  '    <a data-k="theme" href="#" id="themeToggle" title="Hell/Dunkel">◐</a>\n' +
  "  </nav>\n</header>\n" +
  '<main id="app"></main>\n' +
  "<script>\n" + js + "\n\n" + themeJs + "\n</scr" + "ipt>\n" +
  "</body>\n</html>\n";

fs.writeFileSync("azubi-cockpit.html", html);
console.log("azubi-cockpit.html geschrieben (" + html.length + " Zeichen).");
