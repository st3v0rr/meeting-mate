// @ts-nocheck
// Unveraenderte Portierung von Vanilla-JS: bewusst nicht typgeprueft.
// Portiert aus output/2026-08-21_gluecksrad-tribe-club.html.
// Der Code arbeitet direkt auf dem DOM und wird nach dem Mount einmalig gestartet.
// Erwartet, dass THREE global verfuegbar ist.

export function initGluecksrad() {
	(function(){
	  "use strict";
	
	  var TAU = Math.PI * 2;
	  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	  /* ---------- Farben der Segmente (Industrial Club: Rostrot und Schwarz) ---------- */
	  var PAL = [
	    { bg:'#7D263F', fg:'#F8E8EE' },
	    { bg:'#171317', fg:'#F4CEDC' },
	    { bg:'#98334F', fg:'#FFF0F5' },
	    { bg:'#21191D', fg:'#F1BBCF' },
	    { bg:'#662136', fg:'#F8E8EE' },
	    { bg:'#100E10', fg:'#F4CEDC' },
	    { bg:'#873047', fg:'#FFF0F5' },
	    { bg:'#2A1B21', fg:'#F1BBCF' }
	  ];
	  function palFor(i, n){
	    var k = i % PAL.length;
	    if (n > 1 && i === n - 1 && k === 0) k = 1 % PAL.length;
	    return PAL[k];
	  }
	
	
	  /* ---------- Pixel-Avatare (12x12, aus dem Namen abgeleitet) ---------- */
	  var SKIN  = ['#F6CDA4','#EAB587','#D09263','#AC6F45','#7E4E2D','#FADFC6','#E0A482'];
	  var HAIR  = ['#241812','#5A3A22','#8E5A2B','#C98A3A','#E8CB77','#A33A28','#33333D','#7A7A88','#DAD5CB','#2E5E8C','#9B3AA8','#1F6E5A'];
	  var SHIRT = ['#EE99AE','#F5CDE1','#C55451','#A35150','#D8757B','#B96072','#FFF2F7','#783340'];
	  var TILE  = ['#35141D','#57212B','#783340','#642A3A','#4A1D29'];
	  var DARK = '#35141D';
	
	  function hashStr(str){
	    var h = 2166136261;
	    for (var i = 0; i < str.length; i++){ h = Math.imul(h ^ str.charCodeAt(i), 16777619); }
	    return h >>> 0;
	  }
	  function rngFrom(seed){
	    var a = seed >>> 0;
	    return function(){
	      a = (a + 0x6D2B79F5) | 0;
	      var t = Math.imul(a ^ (a >>> 15), 1 | a);
	      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	    };
	  }
	  function shade(hex, f){
	    var n = parseInt(hex.slice(1), 16);
	    var r = Math.round(((n >> 16) & 255) * f);
	    var g = Math.round(((n >> 8) & 255) * f);
	    var b = Math.round((n & 255) * f);
	    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	  }
	
	  /* ---------- Seifenschaum / Blasen im Hintergrund ---------- */
	  var foamCanvas = document.getElementById('foamBg');
	  var foamCtx = foamCanvas && foamCanvas.getContext('2d');
	  var foamBase = document.createElement('canvas');
	  var foamBaseCtx = foamBase.getContext('2d');
	  var floatingBubbles = [];
	  var foamDpr = 1, foamAnim = 0, foamLastFrame = 0;
	
	  function paintFloatingBubble(ctx, bubble, now){
	    var pulse = 1 + Math.sin(now * bubble.pulse + bubble.phase) * .075;
	    var r = bubble.r * pulse;
	    var x = bubble.x + Math.sin(now * bubble.speed + bubble.phase) * bubble.drift;
	    var y = bubble.y
	      + Math.cos(now * bubble.speed * .72 + bubble.phase) * bubble.drift * .65
	      + Math.sin(now * bubble.rise + bubble.phase * 1.53) * bubble.travel * .5;
	    var shimmer = .52 + Math.sin(now * bubble.pulse * .67 + bubble.phase * 1.7) * .22;
	
	    var halo = ctx.createRadialGradient(x, y, r * .66, x, y, r * 1.55);
	    halo.addColorStop(0, 'rgba(232,91,150,0)');
	    halo.addColorStop(.66, 'rgba(225,73,139,' + (.025 + shimmer * .04) + ')');
	    halo.addColorStop(1, 'rgba(225,73,139,0)');
	    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, r * 1.55, 0, TAU); ctx.fill();
	
	    var skin = ctx.createRadialGradient(x-r*.3, y-r*.35, r*.03, x, y, r);
	    skin.addColorStop(0, 'rgba(255,235,244,' + (.62 + shimmer * .25) + ')');
	    skin.addColorStop(.09, 'rgba(102,47,69,.66)');
	    skin.addColorStop(.35, 'rgba(8,5,8,.94)');
	    skin.addColorStop(.76, 'rgba(3,2,4,.97)');
	    skin.addColorStop(.91, 'rgba(178,45,98,' + (.38 + shimmer * .24) + ')');
	    skin.addColorStop(1, 'rgba(238,111,163,.08)');
	    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
	    ctx.lineWidth = Math.max(.7, r * .055);
	    ctx.strokeStyle = 'rgba(243,127,173,' + (.17 + shimmer * .20) + ')'; ctx.stroke();
	
	    var glintAngle = 3.55 + Math.sin(now * bubble.speed * .45 + bubble.phase) * .22;
	    ctx.beginPath(); ctx.arc(x-r*.04, y-r*.04, r*.72, glintAngle, glintAngle + .95);
	    ctx.lineWidth = Math.max(.8, r * .075); ctx.lineCap = 'round';
	    ctx.strokeStyle = 'rgba(255,226,238,' + (.24 + shimmer * .34) + ')'; ctx.stroke();
	
	    // ein kleiner Satellit schwebt bei einigen großen Blasen mit
	    if (bubble.satellite){
	      var orbit = now * bubble.speed * .9 + bubble.phase;
	      var sr = Math.max(1.4, r * .18);
	      var sx = x + Math.cos(orbit) * r * 1.28, sy = y + Math.sin(orbit) * r * .82;
	      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU);
	      ctx.fillStyle = 'rgba(5,3,5,.82)'; ctx.fill();
	      ctx.lineWidth = .8; ctx.strokeStyle = 'rgba(238,112,163,.42)'; ctx.stroke();
	    }
	  }
	
	  function animateFoam(now){
	    foamAnim = requestAnimationFrame(animateFoam);
	    if (!foamCtx || document.hidden || now - foamLastFrame < 15) return;
	    foamLastFrame = now;
	    foamCtx.setTransform(1,0,0,1,0,0);
	    foamCtx.clearRect(0,0,foamCanvas.width,foamCanvas.height);
	    foamCtx.drawImage(foamBase,0,0);
	    foamCtx.setTransform(foamDpr,0,0,foamDpr,0,0);
	    for (var fb = 0; fb < floatingBubbles.length; fb++) paintFloatingBubble(foamCtx, floatingBubbles[fb], now);
	  }
	
	  function drawFoam(){
	    if (!foamCtx) return;
	    if (foamAnim) cancelAnimationFrame(foamAnim);
	    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
	    foamDpr = dpr;
	    var w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
	    foamCanvas.width = Math.round(w * dpr); foamCanvas.height = Math.round(h * dpr);
	    foamCanvas.style.width = w + 'px'; foamCanvas.style.height = h + 'px';
	    foamCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
	    foamCtx.clearRect(0, 0, w, h);
	
	    var narrow = w < 880;
	    var cx = narrow ? w * .50 : w * .69;
	    var cy = narrow ? h * .70 : h * .53;
	    var rx = narrow ? w * .50 : Math.min(w * .34, h * .56);
	    var ry = narrow ? h * .26 : Math.min(h * .40, w * .26);
	    var rnd = rngFrom(0x51A9F00D ^ Math.round(w / 40) ^ Math.round(h / 40));
	
	    // Pinke Flüssigkeitswolke unter dem Rad
	    foamCtx.save();
	    foamCtx.globalCompositeOperation = 'screen';
	    var puddle = foamCtx.createRadialGradient(cx, cy + ry * .17, rx * .08, cx, cy + ry * .17, rx * 1.12);
	    puddle.addColorStop(0, 'rgba(170,42,91,.15)');
	    puddle.addColorStop(.55, 'rgba(115,24,61,.12)');
	    puddle.addColorStop(.82, 'rgba(224,67,133,.08)');
	    puddle.addColorStop(1, 'rgba(0,0,0,0)');
	    foamCtx.fillStyle = puddle;
	    foamCtx.beginPath(); foamCtx.ellipse(cx, cy + ry * .15, rx * 1.25, ry * 1.08, -.05, 0, TAU); foamCtx.fill();
	    foamCtx.restore();
	
	    // Viele kleine miteinander verbundene Schaumzellen entlang des Radrands
	    for (var b = 0; b < (narrow ? 430 : 780); b++){
	      var a = rnd() * TAU;
	      var band = .73 + Math.pow(rnd(), 1.7) * .62;
	      var scatter = (rnd() + rnd() - 1);
	      var bx = cx + Math.cos(a) * rx * band + scatter * rx * .10;
	      var by = cy + Math.sin(a) * ry * band + (rnd() + rnd() - 1) * ry * .10;
	      var br = 1.2 + Math.pow(rnd(), 2.4) * 8;
	      if (bx < -br || bx > w + br || by < -br || by > h + br) continue;
	      foamCtx.beginPath(); foamCtx.arc(bx, by, br, 0, TAU);
	      foamCtx.fillStyle = 'rgba(3,2,4,' + (.28 + rnd() * .42) + ')'; foamCtx.fill();
	      foamCtx.lineWidth = Math.max(.45, br * .16);
	      foamCtx.strokeStyle = 'rgba(' + (190 + (rnd() * 45 | 0)) + ',' + (70 + (rnd() * 45 | 0)) + ',' + (125 + (rnd() * 50 | 0)) + ',' + (.14 + rnd() * .34) + ')';
	      foamCtx.stroke();
	      if (br > 3.8){
	        foamCtx.beginPath(); foamCtx.arc(bx - br * .2, by - br * .24, br * .55, 3.65, 5.15);
	        foamCtx.lineWidth = Math.max(.5, br * .09); foamCtx.strokeStyle = 'rgba(255,220,235,.28)'; foamCtx.stroke();
	      }
	    }
	
	    // Einzelne große, schwarze Hochglanzblasen wie in der Vorlage
	    var bigCount = narrow ? 12 : 24;
	    for (var q = 0; q < bigCount; q++){
	      var qa = rnd() * TAU;
	      var qr = .83 + rnd() * .52;
	      var qx = cx + Math.cos(qa) * rx * qr;
	      var qy = cy + Math.sin(qa) * ry * qr;
	      var size = 7 + Math.pow(rnd(), 1.5) * (narrow ? 15 : 25);
	      var bubble = foamCtx.createRadialGradient(qx - size * .28, qy - size * .34, size * .04, qx, qy, size);
	      bubble.addColorStop(0, 'rgba(255,225,238,.82)');
	      bubble.addColorStop(.10, 'rgba(83,35,55,.88)');
	      bubble.addColorStop(.43, 'rgba(7,5,8,.98)');
	      bubble.addColorStop(.80, 'rgba(3,2,4,.98)');
	      bubble.addColorStop(.92, 'rgba(164,43,91,.66)');
	      bubble.addColorStop(1, 'rgba(238,107,160,.08)');
	      foamCtx.fillStyle = bubble; foamCtx.beginPath(); foamCtx.arc(qx, qy, size, 0, TAU); foamCtx.fill();
	      foamCtx.lineWidth = 1; foamCtx.strokeStyle = 'rgba(238,126,169,.26)'; foamCtx.stroke();
	    }
	
	    // statische Schaumschicht einfrieren, bewegliche Blasen separat darüber zeichnen
	    foamBase.width = foamCanvas.width; foamBase.height = foamCanvas.height;
	    foamBaseCtx.setTransform(1,0,0,1,0,0); foamBaseCtx.clearRect(0,0,foamBase.width,foamBase.height);
	    foamBaseCtx.drawImage(foamCanvas,0,0);
	    floatingBubbles = [];
	    var moving = narrow ? 13 : 25;
	    for (var mb = 0; mb < moving; mb++){
	      var mba = rnd() * TAU;
	      var mbr = .82 + rnd() * .48;
	      floatingBubbles.push({
	        x:cx + Math.cos(mba) * rx * mbr,
	        y:cy + Math.sin(mba) * ry * mbr,
	        r:4 + Math.pow(rnd(),1.35) * (narrow ? 13 : 22),
	        phase:rnd() * TAU,
	        speed:.00030 + rnd() * .00050,
	        pulse:.00065 + rnd() * .0011,
	        rise:.00022 + rnd() * .00038,
	        travel:10 + rnd() * 26,
	        drift:3 + rnd() * 12,
	        satellite:rnd() > .62
	      });
	    }
	    foamLastFrame = 0;
	    if (!reduced) foamAnim = requestAnimationFrame(animateFoam);
	  }
	  drawFoam();
	  window.addEventListener('resize', drawFoam, { passive:true });
	
	  // feste Haarfarben für vorgegebene Personen
	  var HAIRC = {
	    blond:'#E8CB77', dunkelblond:'#C79A4E', braun:'#5A3A22',
	    schwarz:'#241812', rot:'#B4472B', grau:'#B9B4AC'
	  };
	
	  function buildAvatar(name, av, look){
	    var rand = rngFrom(hashStr(String(name || '?').toLowerCase()) ^ Math.imul((av || 0) + 1, 2654435761));
	    var pick = function(arr){ return arr[Math.floor(rand() * arr.length)]; };
	    var skin = pick(SKIN), hair = pick(HAIR), shirt = pick(SHIRT), tile = pick(TILE);
	    look = look || {};
	    if (look.hair) hair = HAIRC[look.hair] || look.hair;
	    if (typeof look.skin === 'number') skin = SKIN[look.skin % SKIN.length];
	
	    var g = [], y, x;
	    for (y = 0; y < 12; y++) g.push([null,null,null,null,null,null,null,null,null,null,null,null]);
	    function put(px, py, c){ if (px >= 0 && px < 12 && py >= 0 && py < 12 && c) g[py][px] = c; }
	    function mir(px, py, c){ put(px, py, c); put(11 - px, py, c); }
	
	    // Schultern, Hals, Kragen
	    for (x = 1; x <= 10; x++){ put(x, 10, shirt); put(x, 11, shirt); }
	    for (x = 2; x <= 9; x++) put(x, 9, shirt);
	    put(5, 8, shade(skin, .88)); put(6, 8, shade(skin, .88));
	    mir(5, 9, shade(shirt, .72));
	
	    // Kopf
	    for (y = 2; y <= 7; y++) for (x = 3; x <= 8; x++) put(x, y, skin);
	    mir(2, 5, skin);                        // Ohren
	
	    // Frisur
	    var STYLES = ['kurz', 'lang', 'scheitel', 'stachel', 'dutt', 'muetze'];
	    var st = look.style || STYLES[Math.floor(rand() * STYLES.length)];
	
	    if (st === 'kurz'){
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	      mir(2, 2, hair); mir(3, 2, hair);
	    } else if (st === 'stoppel'){           // sehr kurz
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	      mir(3, 2, hair);
	    } else if (st === 'lang'){
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	      for (y = 2; y <= 8; y++) mir(2, y, hair);
	      mir(3, 2, hair);
	    } else if (st === 'mittel'){
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	      for (y = 2; y <= 5; y++) mir(2, y, hair);
	      mir(3, 2, hair);
	    } else if (st === 'scheitel'){
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	      put(3, 2, hair); put(4, 2, hair); put(8, 2, hair);
	    } else if (st === 'stachel'){
	      put(3, 0, hair); put(5, 0, hair); put(6, 0, hair); put(8, 0, hair);
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	    } else if (st === 'dutt'){
	      mir(5, 0, hair);
	      for (x = 3; x <= 8; x++) put(x, 1, hair);
	      mir(2, 2, hair);
	    } else if (st === 'muetze'){
	      var cap = look.cap || pick(SHIRT);
	      for (x = 3; x <= 8; x++){ put(x, 0, cap); put(x, 1, cap); }
	      for (x = 2; x <= 9; x++) put(x, 2, shade(cap, .7));
	    } else {                                // Glatze
	      mir(2, 3, hair); mir(3, 1, hair);
	    }
	
	    // Bart
	    var beard = typeof look.beard === 'boolean' ? look.beard : rand() < 0.28;
	    if (beard){
	      mir(3, 6, hair);
	      for (x = 3; x <= 8; x++) put(x, 7, hair);
	    }
	
	    // Gesicht zuletzt, damit es oben liegt
	    mir(4, 4, DARK);                        // Augen
	    put(5, 5, shade(skin, .88));            // Nase
	    mir(5, 6, shade(skin, .52));            // Mund
	    if (rand() < 0.4) mir(3, 5, shade(skin, .9));
	
	    // Brille über die Augen
	    if (look.glasses){
	      var fr = '#AEBDCB';
	      mir(3, 4, fr); mir(5, 4, fr);
	      mir(4, 4, DARK);
	    }
	
	    return { g:g, tile:tile };
	  }
	
	  var avCache = {};
	  function avatarOf(p){
	    var key = p.name + '|' + (p.av || 0) + '|' + (p.look ? JSON.stringify(p.look) : '');
	    if (!avCache[key]) avCache[key] = buildAvatar(p.name, p.av || 0, p.look);
	    return avCache[key];
	  }
	
	  // zeichnet einen Avatar in einen beliebigen 2D-Kontext
	  function paintAvatar(ctx, spec, x, y, size, withTile){
	    var cell = size / 12, gx, gy;
	    if (withTile){
	      ctx.fillStyle = spec.tile;
	      ctx.fillRect(x, y, size, size);
	    }
	    for (gy = 0; gy < 12; gy++){
	      for (gx = 0; gx < 12; gx++){
	        var c = spec.g[gy][gx];
	        if (!c) continue;
	        var x0 = x + Math.round(gx * cell), x1 = x + Math.round((gx + 1) * cell);
	        var y0 = y + Math.round(gy * cell), y1 = y + Math.round((gy + 1) * cell);
	        ctx.fillStyle = c;
	        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
	      }
	    }
	  }
	
	  // Pixelporträt auf einem zerkratzten, genieteten Blechschild
	  function paintMetalPortrait(ctx, person, x, y, size){
	    var pr = rngFrom(hashStr(person.name + '|blech'));
	    var plate = size * 1.22;
	    var inset = size * .91;
	    ctx.save();
	    ctx.translate(x, y);
	    ctx.rotate((pr() - .5) * .075);
	
	    // tiefer Schlagschatten unter dem leicht verbogenen Schild
	    ctx.fillStyle = 'rgba(0,0,0,.58)';
	    ctx.beginPath();
	    ctx.moveTo(-plate*.49 + 8, -plate*.48 + 10);
	    ctx.lineTo(plate*.45 + 8, -plate*.45 + 10);
	    ctx.lineTo(plate*.49 + 8, plate*.44 + 10);
	    ctx.lineTo(-plate*.44 + 8, plate*.49 + 10);
	    ctx.closePath(); ctx.fill();
	
	    // unregelmäßig geschnittenes Blech mit gebürstetem Verlauf
	    var pg = ctx.createLinearGradient(-plate*.5, -plate*.5, plate*.5, plate*.5);
	    pg.addColorStop(0, '#D0C2C7'); pg.addColorStop(.16, '#62545A');
	    pg.addColorStop(.43, '#A58F98'); pg.addColorStop(.68, '#44383D'); pg.addColorStop(1, '#B29DA5');
	    ctx.fillStyle = pg;
	    ctx.beginPath();
	    ctx.moveTo(-plate*.46, -plate*.50); ctx.lineTo(plate*.43, -plate*.47);
	    ctx.lineTo(plate*.50, -plate*.40); ctx.lineTo(plate*.47, plate*.45);
	    ctx.lineTo(plate*.36, plate*.50); ctx.lineTo(-plate*.44, plate*.47);
	    ctx.lineTo(-plate*.50, plate*.34); ctx.lineTo(-plate*.48, -plate*.42);
	    ctx.closePath(); ctx.fill();
	    ctx.lineWidth = Math.max(2, size * .025); ctx.strokeStyle = 'rgba(246,218,228,.52)'; ctx.stroke();
	
	    // gebürstete Riefen und Rostnarben
	    for (var ps = 0; ps < 32; ps++){
	      var psy = (pr() - .5) * plate * .88;
	      var psx = (pr() - .5) * plate * .72;
	      ctx.beginPath(); ctx.moveTo(psx, psy); ctx.lineTo(psx + 5 + pr() * plate * .34, psy + (pr() - .5) * 3);
	      ctx.lineWidth = .7 + pr() * 1.6;
	      ctx.strokeStyle = pr() > .45 ? 'rgba(238,218,225,.27)' : 'rgba(18,8,12,.42)'; ctx.stroke();
	    }
	    for (var rust = 0; rust < 12; rust++){
	      var rux = (pr() - .5) * plate * .82, ruy = (pr() - .5) * plate * .82;
	      var rur = 1 + pr() * size * .055;
	      ctx.fillStyle = 'rgba(102,38,31,' + (.18 + pr() * .38) + ')';
	      ctx.beginPath(); ctx.arc(rux, ruy, rur, 0, TAU); ctx.fill();
	    }
	
	    // dunkle Einlassung, darin bleibt das farbige Pixelporträt lesbar
	    ctx.fillStyle = '#171216';
	    ctx.fillRect(-inset*.5 - 3, -inset*.5 - 3, inset + 6, inset + 6);
	    ctx.strokeStyle = 'rgba(5,3,4,.9)'; ctx.lineWidth = 4;
	    ctx.strokeRect(-inset*.5 - 3, -inset*.5 - 3, inset + 6, inset + 6);
	    paintAvatar(ctx, avatarOf(person), -inset*.5, -inset*.5, inset, false);
	
	    // vier alte Schraubnieten
	    var nr = Math.max(3, size * .035);
	    var no = plate * .405;
	    [[-no,-no],[no,-no],[no,no],[-no,no]].forEach(function(pos){
	      var ng = ctx.createRadialGradient(pos[0]-nr*.3,pos[1]-nr*.3,0,pos[0],pos[1],nr);
	      ng.addColorStop(0,'#F1DEE5'); ng.addColorStop(.35,'#8A747D'); ng.addColorStop(1,'#251A1F');
	      ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(pos[0],pos[1],nr,0,TAU); ctx.fill();
	      ctx.beginPath(); ctx.moveTo(pos[0]-nr*.55,pos[1]); ctx.lineTo(pos[0]+nr*.55,pos[1]);
	      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(20,10,14,.72)'; ctx.stroke();
	    });
	    ctx.restore();
	  }
	
	  var urlCache = {};
	  function avatarURL(p, size){
	    var key = p.name + '|' + (p.av || 0) + '|' + size + '|' + (p.look ? JSON.stringify(p.look) : '');
	    if (urlCache[key]) return urlCache[key];
	    var cv = document.createElement('canvas');
	    cv.width = cv.height = size;
	    var c2 = cv.getContext('2d');
	    paintAvatar(c2, avatarOf(p), 0, 0, size, true);
	    urlCache[key] = cv.toDataURL('image/png');
	    return urlCache[key];
	  }
	
	  /* ---------- Zustand ---------- */
	  var state = {
	    people: [
	      { id:'p1',  name:'Annina', on:true, look:{ hair:'blond',       style:'lang'    , beard:false } },
	      { id:'p2',  name:'Andi',   on:true, look:{ hair:'schwarz',     style:'kurz',    beard:true } },
	      { id:'p3',  name:'Nadja',  on:true, look:{ hair:'dunkelblond', style:'mittel'  , beard:false } },
	      { id:'p4',  name:'Jana',   on:true, look:{ hair:'schwarz',     style:'lang',    skin:1 , beard:false } },
	      { id:'p5',  name:'Sajjad', on:true, look:{ hair:'schwarz',     style:'kurz',    skin:2 , beard:false } },
	      { id:'p6',  name:'Tobi',   on:true, look:{ hair:'blond',       style:'kurz'    , beard:false } },
	      { id:'p7',  name:'Flo',    on:true, look:{ style:'muetze' , beard:false } },
	      { id:'p8',  name:'Mario',  on:true, look:{ hair:'schwarz',     style:'kurz'    , beard:false } },
	      { id:'p9',  name:'Nina',   on:true, look:{ hair:'blond',       style:'mittel'  , beard:false } },
	      { id:'p10', name:'Gunnar', on:true, look:{ hair:'dunkelblond', style:'stoppel' , beard:false } },
	      { id:'p11', name:'Thomas', on:true, look:{ hair:'rot',         style:'kurz',    glasses:true , beard:false } }
	    ],
	    removeWinner:false,
	    sound:true
	  };
	  var uid = 100;
	  function newId(){ uid += 1; return 'p' + uid; }
	  function active(){ return state.people.filter(function(p){ return p.on; }); }
	
	  var store = {
	    save:function(){
	      try{
	        if(!window.storage) return;
	        window.storage.set('gluecksrad:v2', JSON.stringify(state))['catch'](function(){});
	      }catch(e){}
	    },
	    load:function(){
	      try{
	        if(!window.storage) return Promise.resolve(null);
	        return window.storage.get('gluecksrad:v2').then(function(r){
	          return r ? JSON.parse(r.value) : null;
	        })['catch'](function(){ return null; });
	      }catch(e){ return Promise.resolve(null); }
	    }
	  };
	
	  /* ---------- DOM ---------- */
	  var $ = function(id){ return document.getElementById(id); };
	  var listEl = $('list'), countEl = $('count'), inputEl = $('nameInput');
	  var spinBtn = $('spinBtn'), overlay = $('overlay'), whoEl = $('who'), subEl = $('sub');
	  var liveEl = $('live'), stage = $('stage'), confettiEl = $('confetti');
	
	  /* ---------- Rad-Textur ---------- */
	  var TEX = 2048;
	  var texCanvas = document.createElement('canvas');
	  texCanvas.width = texCanvas.height = TEX;
	  var tctx = texCanvas.getContext('2d');
	
	  // verkleinert die Schrift, solange sie zu breit ist, und kürzt erst danach
	  function fitName(ctx, name, maxW, size){
	    var face = "'Inter Tight', 'Inter', system-ui, sans-serif";
	    var sz = size;
	    ctx.font = '700 ' + sz + 'px ' + face;
	    while (sz > 30 && ctx.measureText(name).width > maxW){
	      sz -= 4;
	      ctx.font = '700 ' + sz + 'px ' + face;
	    }
	    var txt = name;
	    if (ctx.measureText(txt).width > maxW){
	      while (txt.length > 1 && ctx.measureText(txt + '…').width > maxW) txt = txt.slice(0, -1);
	      txt += '…';
	    }
	    return { text:txt, size:sz };
	  }
	
	  function drawWheelTexture(){
	    var act = active();
	    var n = act.length;
	    var S = TEX, c = S / 2, R = S / 2 - 10;
	
	    tctx.clearRect(0, 0, S, S);
	
	    if (n === 0){
	      tctx.beginPath(); tctx.arc(c, c, R, 0, TAU);
	      tctx.fillStyle = '#783340'; tctx.fill();
	      tctx.setLineDash([26, 22]); tctx.lineWidth = 6;
	      tctx.strokeStyle = 'rgba(255,242,247,.30)';
	      tctx.beginPath(); tctx.arc(c, c, R * 0.72, 0, TAU); tctx.stroke();
	      tctx.setLineDash([]);
	      tctx.fillStyle = 'rgba(255,242,247,.78)';
	      tctx.textAlign = 'center'; tctx.textBaseline = 'middle';
	      tctx.font = '600 96px ' + "'Inter Tight', system-ui, sans-serif";
	      tctx.fillText('Noch keine Namen', c, c - 40);
	      tctx.font = '400 70px ' + "'Inter Tight', system-ui, sans-serif";
	      tctx.fillStyle = 'rgba(217,168,182,.86)';
	      tctx.fillText('Trag ein, wer mitspielt', c, c + 60);
	      if (texture) texture.needsUpdate = true;
	      return;
	    }
	
	    var step = TAU / n;
	
	    for (var i = 0; i < n; i++){
	      var col = palFor(i, n);
	      // Winkel im Canvas: three.js bildet die Deckfläche mit a = -theta ab,
	      // damit liegt Segment i genau auf theta = [i*step, (i+1)*step]
	      var a0 = -(i + 1) * step;
	      var a1 = -i * step;
	
	      tctx.beginPath();
	      tctx.moveTo(c, c);
	      tctx.arc(c, c, R, a0, a1);
	      tctx.closePath();
	      tctx.fillStyle = col.bg;
	      tctx.fill();
	
	      // Deterministische Kratzer und Pigmentflecken für die raue Emaille-Optik
	      tctx.save();
	      tctx.clip();
	      var grit = rngFrom(Math.imul(i + 17, 2654435761) ^ Math.imul(n + 3, 1597334677));
	      for (var g = 0; g < 260; g++){
	        var gx = grit() * S, gy = grit() * S;
	        var gs = 1 + grit() * 10;
	        var ga = 0.018 + grit() * 0.07;
	        tctx.fillStyle = grit() > 0.52 ? 'rgba(255,224,235,' + ga + ')' : 'rgba(0,0,0,' + (ga * 1.6) + ')';
	        tctx.fillRect(gx, gy, gs * (1 + grit() * 3), Math.max(1, gs * 0.22));
	      }
	      for (var st = 0; st < 44; st++){
	        var stx = grit() * S, sty = grit() * S;
	        var str = 5 + Math.pow(grit(), 2) * 66;
	        var stain = tctx.createRadialGradient(stx, sty, 0, stx, sty, str);
	        if (grit() > .42){
	          stain.addColorStop(0, 'rgba(0,0,0,.15)'); stain.addColorStop(.55, 'rgba(0,0,0,.07)');
	        } else {
	          stain.addColorStop(0, 'rgba(255,209,222,.10)'); stain.addColorStop(.55, 'rgba(255,209,222,.035)');
	        }
	        stain.addColorStop(1, 'rgba(0,0,0,0)');
	        tctx.fillStyle = stain; tctx.beginPath();
	        tctx.ellipse(stx, sty, str, str * (.25 + grit() * .65), grit() * TAU, 0, TAU); tctx.fill();
	      }
	      tctx.globalAlpha = .12;
	      tctx.strokeStyle = '#F6C5D7';
	      tctx.lineWidth = 2;
	      for (var sc = 0; sc < 13; sc++){
	        var sx = grit() * S, sy = grit() * S;
	        tctx.beginPath();
	        tctx.moveTo(sx, sy);
	        tctx.lineTo(sx + 30 + grit() * 150, sy + (grit() - .5) * 24);
	        tctx.stroke();
	      }
	      tctx.restore();
	
	      if (n > 1){
	        tctx.strokeStyle = 'rgba(244,183,205,.74)';
	        tctx.lineWidth = 5;
	        tctx.stroke();
	      }
	
	      // Name von der Mitte nach außen
	      var mid = (a0 + a1) / 2;
	      var slot = n === 1 ? R * 1.2 : Math.min(R * 1.1, step * R * 0.78);
	      var size = Math.max(34, Math.min(124, slot * 0.66));
	
	      // Avatar sitzt außen im Segment, solange genug Platz ist
	      var avSize = n <= 12 ? Math.min(step * R * 0.5, R * 0.18) : 0;
	      if (avSize < 44) avSize = 0;
	      var textEnd = avSize ? (R * 0.82 - avSize / 2 - 28) : (R - 128);
	      var maxW = textEnd - R * 0.17;
	
	      if (avSize){
	        tctx.save();
	        tctx.translate(c, c);
	        tctx.rotate(mid);
	        tctx.translate(R * 0.82, 0);
	        tctx.rotate(Math.PI / 2);              // Kopf zeigt nach außen
	        paintMetalPortrait(tctx, act[i], 0, 0, avSize);
	        tctx.restore();
	      }
	
	      tctx.save();
	      tctx.translate(c, c);
	      tctx.rotate(mid);
	      tctx.textAlign = 'right';
	      tctx.textBaseline = 'middle';
	      var fit = fitName(tctx, act[i].name.toUpperCase(), maxW, size);
	      tctx.lineJoin = 'round';
	      tctx.lineWidth = Math.max(4, fit.size * 0.11);
	      tctx.strokeStyle = 'rgba(8,7,9,.78)';
	      tctx.strokeText(fit.text, textEnd, 0);
	      tctx.fillStyle = col.fg;
	      tctx.fillText(fit.text, textEnd, 0);
	      tctx.restore();
	    }
	
	    // Deutlich sichtbare, segmentübergreifende Schmutz- und Abriebschicht
	    tctx.save();
	    tctx.beginPath(); tctx.arc(c, c, R * .985, 0, TAU); tctx.clip();
	    var wear = rngFrom(0xD17A6E21 ^ Math.imul(n, 374761393));
	    for (var wd = 0; wd < 210; wd++){
	      var wx = c + (wear() * 2 - 1) * R;
	      var wy = c + (wear() * 2 - 1) * R;
	      var wr = 8 + Math.pow(wear(), 1.7) * 95;
	      var wa = .065 + wear() * .18;
	      var dirt = tctx.createRadialGradient(wx, wy, 0, wx, wy, wr);
	      if (wear() > .34){
	        dirt.addColorStop(0, 'rgba(5,3,4,' + wa + ')');
	        dirt.addColorStop(.55, 'rgba(18,8,11,' + (wa * .55) + ')');
	      } else {
	        dirt.addColorStop(0, 'rgba(120,52,43,' + (wa * .8) + ')');
	        dirt.addColorStop(.55, 'rgba(75,29,30,' + (wa * .42) + ')');
	      }
	      dirt.addColorStop(1, 'rgba(0,0,0,0)');
	      tctx.fillStyle = dirt; tctx.beginPath();
	      tctx.ellipse(wx, wy, wr, wr * (.18 + wear() * .55), wear() * TAU, 0, TAU); tctx.fill();
	    }
	    tctx.lineCap = 'round';
	    for (var ws = 0; ws < 210; ws++){
	      var wsa = wear() * TAU;
	      var wsr = Math.sqrt(wear()) * R * .91;
	      var wsx = c + Math.cos(wsa) * wsr;
	      var wsy = c + Math.sin(wsa) * wsr;
	      var wsl = 12 + Math.pow(wear(), 1.8) * 125;
	      var wsv = wear() > .66;
	      tctx.beginPath();
	      tctx.moveTo(wsx, wsy);
	      tctx.lineTo(wsx + Math.cos(wsa + (wear() - .5) * .6) * wsl, wsy + Math.sin(wsa + (wear() - .5) * .6) * wsl);
	      tctx.lineWidth = wsv ? 3.1 : 1 + wear() * 2;
	      tctx.strokeStyle = wsv ? 'rgba(248,217,226,.34)' : 'rgba(4,2,3,.46)';
	      tctx.stroke();
	    }
	    // Abgeplatzte Lackinseln: helle Grundierung und dunkles blankes Material
	    for (var wc = 0; wc < 165; wc++){
	      var wca = wear() * TAU;
	      var wcr = Math.sqrt(wear()) * R * .94;
	      var wcx = c + Math.cos(wca) * wcr;
	      var wcy = c + Math.sin(wca) * wcr;
	      var wcw = 3 + Math.pow(wear(), 2) * 34;
	      var wch = 1.5 + wear() * wcw * .42;
	      tctx.save(); tctx.translate(wcx, wcy); tctx.rotate(wear() * TAU);
	      tctx.beginPath();
	      tctx.moveTo(-wcw*.5, 0); tctx.lineTo(-wcw*.18, -wch*.7);
	      tctx.lineTo(wcw*.28, -wch*.45); tctx.lineTo(wcw*.5, wch*.12);
	      tctx.lineTo(wcw*.08, wch*.65); tctx.lineTo(-wcw*.36, wch*.45); tctx.closePath();
	      tctx.fillStyle = wear() > .43 ? 'rgba(7,5,6,.54)' : 'rgba(215,188,195,.30)';
	      tctx.fill(); tctx.restore();
	    }
	    // Feine verzweigte Risse in der alten Lackschicht
	    for (var cr = 0; cr < 34; cr++){
	      var cra = wear() * TAU, crr = Math.sqrt(wear()) * R * .82;
	      var crx = c + Math.cos(cra) * crr, cry = c + Math.sin(cra) * crr;
	      var crang = wear() * TAU;
	      tctx.beginPath(); tctx.moveTo(crx, cry);
	      for (var cj = 0; cj < 4; cj++){
	        var crlen = 8 + wear() * 22;
	        crang += (wear() - .5) * .9;
	        crx += Math.cos(crang) * crlen; cry += Math.sin(crang) * crlen;
	        tctx.lineTo(crx, cry);
	      }
	      tctx.lineWidth = .8 + wear() * 1.2; tctx.strokeStyle = 'rgba(2,1,2,.48)'; tctx.stroke();
	    }
	    // Abgewetzte helle Stellen dort, wo Hände und Zeiger häufig entlanglaufen
	    tctx.setLineDash([34,13,7,22,3,16]);
	    tctx.beginPath(); tctx.arc(c, c, R * .72, 0, TAU);
	    tctx.lineWidth = 20; tctx.strokeStyle = 'rgba(235,185,199,.15)'; tctx.stroke();
	    tctx.setLineDash([]);
	    tctx.restore();
	
	    // Abgegriffene Kante und unregelmäßige Lackabplatzer
	    tctx.save();
	    tctx.beginPath(); tctx.arc(c, c, R * .966, 0, TAU);
	    tctx.setLineDash([18,7,3,11,30,5]);
	    tctx.lineWidth = 11; tctx.strokeStyle = 'rgba(247,204,219,.34)'; tctx.stroke();
	    tctx.beginPath(); tctx.arc(c, c, R * .938, 0, TAU);
	    tctx.setLineDash([7,13,2,19,22,8]);
	    tctx.lineWidth = 8; tctx.strokeStyle = 'rgba(0,0,0,.46)'; tctx.stroke();
	    tctx.setLineDash([]); tctx.restore();
	
	    // Laufring, auf dem die Stifte sitzen
	    tctx.beginPath(); tctx.arc(c, c, R * 0.945, 0, TAU);
	    tctx.lineWidth = R * 0.085;
	    tctx.strokeStyle = 'rgba(8,7,9,.52)';
	    tctx.stroke();
	
	    // Nabe
	    tctx.beginPath(); tctx.arc(c, c, R * 0.115, 0, TAU);
	    tctx.fillStyle = '#151115'; tctx.fill();
	    tctx.lineWidth = 14; tctx.strokeStyle = '#9B7B86'; tctx.stroke();
	
	    if (texture) texture.needsUpdate = true;
	  }
	
	  /* ---------- Three.js ---------- */
	  var RADIUS = 2.4, THICK = 0.54;
	  var TILT = 0.98;                 // Neigung des Rads (Studio-Perspektive)
	  var LOOK_Y = -0.15;
	  var PIVOT_OUT = 0.30;            // Pfosten sitzt so weit außerhalb des Rands
	  var FLAP_LEN = 0.66;             // Länge der Zunge
	  var FLAP_H = 0.12;              // Höhe der Zunge über der Radfläche
	  var PIN_R = RADIUS - 0.16;       // Radius, auf dem die Stifte stehen
	  var renderer, scene, camera, texture, tilt, spinGroup, pointerPivot, pegGroup;
	  var ready = false;
	
	  function makeMetalTexture(){
	    var mc = document.createElement('canvas'); mc.width = 1024; mc.height = 256;
	    var mx = mc.getContext('2d');
	    var mr = rngFrom(0xC0FFEE21);
	    var base = mx.createLinearGradient(0, 0, 0, mc.height);
	    base.addColorStop(0, '#C8BAC0'); base.addColorStop(.18, '#574C51');
	    base.addColorStop(.48, '#A29399'); base.addColorStop(.72, '#3C3438'); base.addColorStop(1, '#776A70');
	    mx.fillStyle = base; mx.fillRect(0, 0, mc.width, mc.height);
	    for (var m = 0; m < 3400; m++){
	      var mv = 35 + (mr() * 165 | 0), ma = .04 + mr() * .23;
	      mx.fillStyle = 'rgba(' + mv + ',' + Math.max(0,mv-8) + ',' + Math.max(0,mv-3) + ',' + ma + ')';
	      var my = mr() * mc.height;
	      mx.fillRect(mr() * mc.width, my, 2 + mr() * 95, .5 + mr() * 2.4);
	    }
	    for (var k = 0; k < 180; k++){
	      var kx = mr() * mc.width, ky = mr() * mc.height, kr = 2 + mr() * 18;
	      mx.beginPath(); mx.arc(kx, ky, kr, 0, TAU);
	      mx.fillStyle = mr() > .38
	        ? 'rgba(20,10,14,' + (.12 + mr() * .34) + ')'
	        : 'rgba(105,39,31,' + (.15 + mr() * .38) + ')';
	      mx.fill();
	      mx.beginPath(); mx.arc(kx - kr * .18, ky - kr * .18, kr * .72, 3.5, 5.2);
	      mx.strokeStyle = 'rgba(245,220,228,.20)'; mx.lineWidth = 1; mx.stroke();
	    }
	    for (var gouge = 0; gouge < 75; gouge++){
	      var ggx = mr() * mc.width, ggy = mr() * mc.height;
	      mx.beginPath(); mx.moveTo(ggx, ggy);
	      mx.lineTo(ggx + 30 + mr() * 130, ggy + (mr() - .5) * 9);
	      mx.lineWidth = .7 + mr() * 2.3;
	      mx.strokeStyle = mr() > .55 ? 'rgba(10,6,8,.62)' : 'rgba(246,222,229,.42)';
	      mx.stroke();
	    }
	    var mt = new THREE.CanvasTexture(mc);
	    mt.wrapS = mt.wrapT = THREE.RepeatWrapping; mt.repeat.set(5, 2);
	    mt.encoding = THREE.sRGBEncoding;
	    return mt;
	  }
	
	  function initThree(){
	    if (typeof THREE === 'undefined') return false;
	
	    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
	    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	    renderer.outputEncoding = THREE.sRGBEncoding;
	    stage.appendChild(renderer.domElement);
	
	    scene = new THREE.Scene();
	    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
	    camera.position.set(0, 1.1, 9.2);
	    camera.lookAt(0, LOOK_Y, 0);
	
	    scene.add(new THREE.HemisphereLight(0xE8D9DE, 0x090709, 0.82));
	    var key = new THREE.DirectionalLight(0xFFEAF2, 1.25);
	    key.position.set(-3.5, 5, 6); scene.add(key);
	    var warm = new THREE.PointLight(0xEF4F95, 1.15, 24);
	    warm.position.set(4, -2.5, 5); scene.add(warm);
	
	    texture = new THREE.CanvasTexture(texCanvas);
	    texture.encoding = THREE.sRGBEncoding;
	    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	
	    tilt = new THREE.Group();
	    tilt.rotation.x = Math.PI / 2 - TILT;   // Rad liegt schräg, Kamera schaut von vorn drauf
	    tilt.scale.set(0.86, 0.86, 0.86);        // etwas kleiner, Mechanik bleibt proportional
	    scene.add(tilt);
	
	    spinGroup = new THREE.Group();
	    tilt.add(spinGroup);
	
	    var metalTex = makeMetalTexture();
	
	    var faceMat = new THREE.MeshStandardMaterial({ map:texture, roughness:0.74, metalness:0.08 });
	    var sideMat = new THREE.MeshStandardMaterial({ color:0x75666D, map:metalTex, bumpMap:metalTex, bumpScale:0.055, roughness:0.36, metalness:0.82 });
	    var backMat = new THREE.MeshStandardMaterial({ color:0x080708, roughness:0.72, metalness:0.25 });
	    var wheel = new THREE.Mesh(
	      new THREE.CylinderGeometry(RADIUS, RADIUS, THICK, 128, 1, false),
	      [sideMat, faceMat, backMat]
	    );
	    spinGroup.add(wheel);
	
	    var steel = new THREE.MeshStandardMaterial({ color:0xA08F96, map:metalTex, bumpMap:metalTex, bumpScale:0.045, roughness:0.31, metalness:0.92 });
	    var neon = new THREE.MeshStandardMaterial({ color:0xEF75AA, emissive:0x5A1533, emissiveIntensity:0.8, roughness:0.24, metalness:0.54 });
	    var ring = new THREE.Mesh(new THREE.TorusGeometry(RADIUS + 0.025, 0.14, 20, 128), steel);
	    ring.rotation.x = Math.PI / 2;
	    ring.position.y = THICK / 2 + 0.015;
	    spinGroup.add(ring);
	
	    var neonRing = new THREE.Mesh(new THREE.TorusGeometry(RADIUS - 0.055, 0.032, 12, 128), neon);
	    neonRing.rotation.x = Math.PI / 2;
	    neonRing.position.y = THICK / 2 + 0.145;
	    spinGroup.add(neonRing);
	
	    var innerRim = new THREE.Mesh(new THREE.TorusGeometry(RADIUS - 0.135, 0.048, 12, 128), steel);
	    innerRim.rotation.x = Math.PI / 2;
	    innerRim.position.y = THICK / 2 + 0.105;
	    spinGroup.add(innerRim);
	
	    var ring2 = new THREE.Mesh(new THREE.TorusGeometry(RADIUS + 0.02, 0.06, 12, 128), steel);
	    ring2.rotation.x = Math.PI / 2;
	    ring2.position.y = -THICK / 2 + 0.02;
	    spinGroup.add(ring2);
	
	    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.29, THICK + 0.24, 32), steel);
	    spinGroup.add(hub);
	    var hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.18, 0.18, 32), steel);
	    hubCap.position.y = THICK / 2 + 0.19;
	    spinGroup.add(hubCap);
	
	    // umlaufende, leicht erhabene Nieten auf dem Metallring
	    var rivetGeo = new THREE.CylinderGeometry(0.034, 0.045, 0.085, 12);
	    for (var rv = 0; rv < 24; rv++){
	      var ra = rv / 24 * TAU;
	      var rivet = new THREE.Mesh(rivetGeo, steel);
	      rivet.position.set(Math.sin(ra) * (RADIUS + .025), THICK / 2 + .16, Math.cos(ra) * (RADIUS + .025));
	      spinGroup.add(rivet);
	    }
	
	    pegGroup = new THREE.Group();
	    spinGroup.add(pegGroup);
	
	    // Halterung der Zunge – steht fest am oberen Rand
	    var post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.11, 2.2, 20), steel);
	    post.position.set(0, THICK / 2 + 0.05 - 1.0, -(RADIUS + PIVOT_OUT));
	    tilt.add(post);
	    var collar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 20), steel);
	    collar.position.set(0, THICK / 2 + 0.16, -(RADIUS + PIVOT_OUT));
	    tilt.add(collar);
	
	    // Zunge: hängt am Pfosten, wird von den Stiften zur Seite gedrückt und schnappt zurück
	    pointerPivot = new THREE.Group();
	    pointerPivot.position.set(0, THICK / 2 + FLAP_H, -(RADIUS + PIVOT_OUT));
	    tilt.add(pointerPivot);
	
	    var rubber = new THREE.MeshStandardMaterial({ color:0x35141D, roughness:0.75, metalness:0.05 });
	    var tongue = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.04, FLAP_LEN), rubber);
	    tongue.position.z = FLAP_LEN / 2;
	    pointerPivot.add(tongue);
	
	    var tip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.055, 0.16), neon);
	    tip.position.z = FLAP_LEN - 0.06;
	    pointerPivot.add(tip);
	
	    var hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.17, 16), steel);
	    hinge.rotation.z = Math.PI / 2;
	    pointerPivot.add(hinge);
	
	    ready = true;
	    return true;
	  }
	
	  function buildPegs(n){
	    if (!ready) return;
	    while (pegGroup.children.length) pegGroup.remove(pegGroup.children[0]);
	    if (n < 2) return;
	    var geo = new THREE.CylinderGeometry(0.028, 0.032, 0.26, 10);
	    var mat = new THREE.MeshStandardMaterial({ color:0xB8A4AC, roughness:0.22, metalness:0.9 });
	    var step = TAU / n;
	    for (var i = 0; i < n; i++){
	      var th = i * step;
	      var pin = new THREE.Mesh(geo, mat);
	      pin.position.set(Math.sin(th) * PIN_R, THICK / 2 + 0.15, Math.cos(th) * PIN_R);
	      pegGroup.add(pin);
	    }
	  }
	
	  var camZ = 9.2;
	  function resize(){
	    if (!ready) return;
	    var w = stage.clientWidth, h = stage.clientHeight;
	    if (!w || !h) return;
	    renderer.setSize(w, h, false);
	    camera.aspect = w / h;
	    camera.updateProjectionMatrix();
	
	    // Abstand so wählen, dass das Rad immer ins Bild passt
	    var need = 2 * (RADIUS + 0.55);
	    var vFov = camera.fov * Math.PI / 180;
	    var dV = (need * Math.cos(TILT) * 0.62) / Math.tan(vFov / 2);
	    var dH = (need / 2) / (Math.tan(vFov / 2) * camera.aspect);
	    camZ = Math.max(dV, dH) + 0.35;
	  }
	
	  /* ---------- Ton ---------- */
	  var actx = null;
	  var cheerTrack = new Audio('/sounds/2026-08-21_short-crowd-cheer.mp3');
	  var witchTrack = new Audio('/sounds/2026-08-21_witch.mp3');
	  var celebrationTracks = [cheerTrack, witchTrack];
	  celebrationTracks.forEach(function(track){ track.preload = 'auto'; });
	  cheerTrack.volume = .72; witchTrack.volume = .72;
	
	  function primeTrack(track, normalVolume){
	    if (track._primed) return;
	    track.volume = 0;
	    var attempt = track.play();
	    if (attempt && attempt.then){
	      attempt.then(function(){
	        track.pause(); track.currentTime = 0; track.volume = normalVolume; track._primed = true;
	      })['catch'](function(){ track.volume = normalVolume; });
	    } else {
	      track.pause(); track.currentTime = 0; track.volume = normalVolume; track._primed = true;
	    }
	  }
	
	  // Während des Klicks einmal stumm anspielen, damit spätere Wiedergabe erlaubt ist
	  function primeCheer(){
	    if (!state.sound) return;
	    primeTrack(cheerTrack,.72);
	    primeTrack(witchTrack,.72);
	  }
	
	  function stopCelebrationTracks(){
	    celebrationTracks.forEach(function(track){
	      try{ track.pause(); track.currentTime = 0; }catch(ignore){}
	    });
	  }
	
	  function playMediaTrack(track, volume, fallback){
	    if (!state.sound) return;
	    try{
	      stopCelebrationTracks(); track.volume = volume; track.currentTime = 0;
	      var playing = track.play();
	      if (playing && playing['catch']) playing['catch'](fallback || function(){});
	    }catch(e){ if (fallback) fallback(); }
	  }
	
	  function playCheer(){
	    playMediaTrack(cheerTrack,.72,applause);
	  }
	
	  function easterEggTime(now){
	    var starts = new Date(2026,7,21,0,0,0,0); // lokale Zeit: 21. August 2026
	    return now >= starts && now.getDay() === 5 && now.getHours() >= 11 && now.getHours() < 14;
	  }
	
	  function playWinnerSound(){
	    var now = new Date();
	    if (easterEggTime(now) && Math.random() < .10){
	      playMediaTrack(witchTrack,.72,playCheer);
	    } else {
	      playCheer();
	    }
	  }
	
	  function audio(){
	    if (!state.sound) return null;
	    try{
	      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
	      if (actx.state === 'suspended') actx.resume();
	      return actx;
	    }catch(e){ return null; }
	  }
	  function blip(freq, dur, vol, type){
	    var a = audio(); if (!a) return;
	    var t = a.currentTime;
	    var o = a.createOscillator(), g = a.createGain();
	    o.type = type || 'triangle';
	    o.frequency.setValueAtTime(freq, t);
	    g.gain.setValueAtTime(0.0001, t);
	    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
	    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
	    o.connect(g); g.connect(a.destination);
	    o.start(t); o.stop(t + dur + 0.02);
	  }
	  var noiseBufs = null;
	  function makeNoise(a){
	    noiseBufs = [];
	    for (var v = 0; v < 4; v++){
	      var len = Math.floor(a.sampleRate * 0.07);
	      var buf = a.createBuffer(1, len, a.sampleRate);
	      var d = buf.getChannelData(0);
	      for (var i = 0; i < len; i++){
	        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 7);
	      }
	      noiseBufs.push(buf);
	    }
	  }
	  // Klack: kurzer Rauschimpuls (Anschlag) plus tiefer Körper (Kunststoffzunge)
	  function tickSound(speed){
	    var a = audio(); if (!a) return;
	    if (!noiseBufs) makeNoise(a);
	    var t = a.currentTime;
	    var vol = Math.max(0.05, Math.min(0.18, 0.05 + speed * 0.02));
	
	    var src = a.createBufferSource();
	    src.buffer = noiseBufs[(Math.random() * noiseBufs.length) | 0];
	    var bp = a.createBiquadFilter();
	    bp.type = 'bandpass';
	    bp.frequency.value = 1250 + Math.random() * 700;
	    bp.Q.value = 1.1;
	    var hp = a.createBiquadFilter();
	    hp.type = 'highpass'; hp.frequency.value = 420;
	    var g = a.createGain(); g.gain.value = vol;
	    src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(a.destination);
	    src.start(t);
	
	    var o = a.createOscillator(), og = a.createGain();
	    o.type = 'triangle';
	    o.frequency.setValueAtTime(300 + Math.random() * 90, t);
	    o.frequency.exponentialRampToValueAtTime(115, t + 0.05);
	    og.gain.setValueAtTime(vol * 0.75, t);
	    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
	    o.connect(og); og.connect(a.destination);
	    o.start(t); o.stop(t + 0.09);
	  }
	
	  // Ein einzelner Handklatscher aus gefiltertem Rauschen
	  function clapAt(a, when, vol, pan, pitch){
	    if (!noiseBufs) makeNoise(a);
	    var src = a.createBufferSource();
	    src.buffer = noiseBufs[(Math.random() * noiseBufs.length) | 0];
	    src.playbackRate.value = pitch || (0.82 + Math.random() * 0.48);
	    var bp = a.createBiquadFilter();
	    bp.type = 'bandpass'; bp.frequency.value = 950 + Math.random() * 1150; bp.Q.value = .62 + Math.random() * .7;
	    var hp = a.createBiquadFilter();
	    hp.type = 'highpass'; hp.frequency.value = 360 + Math.random() * 260;
	    var gain = a.createGain();
	    gain.gain.setValueAtTime(0.0001, when);
	    gain.gain.exponentialRampToValueAtTime(Math.max(.001, vol), when + .004);
	    gain.gain.exponentialRampToValueAtTime(0.0001, when + .075 + Math.random() * .045);
	    src.connect(bp); bp.connect(hp);
	    if (a.createStereoPanner){
	      var panner = a.createStereoPanner(); panner.pan.value = Math.max(-1, Math.min(1, pan || 0));
	      hp.connect(panner); panner.connect(gain);
	    } else {
	      hp.connect(gain);
	    }
	    gain.connect(a.destination);
	    src.start(when); src.stop(when + .16);
	  }
	
	  // Erst ein deutlicher Klatscher, danach ein kurzer räumlicher Publikumsapplaus
	  function applause(){
	    var a = audio(); if (!a) return;
	    var start = a.currentTime + .025;
	
	    // markanter Auftaktklatscher mit drei minimal versetzten Transienten
	    clapAt(a, start, .16, 0, .94);
	    clapAt(a, start + .018, .10, -.12, 1.12);
	    clapAt(a, start + .036, .075, .16, .82);
	
	    // leises Publikumsrauschen verbindet die einzelnen Klatscher
	    var dur = 3.15;
	    var bed = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
	    var bd = bed.getChannelData(0);
	    for (var bi = 0; bi < bd.length; bi++){
	      var bt = bi / a.sampleRate;
	      var env = Math.min(1, bt / .28) * Math.min(1, (dur - bt) / .72);
	      bd[bi] = (Math.random() * 2 - 1) * env * (.34 + Math.random() * .18);
	    }
	    var bedSrc = a.createBufferSource(); bedSrc.buffer = bed;
	    var bedBp = a.createBiquadFilter(); bedBp.type = 'bandpass'; bedBp.frequency.value = 780; bedBp.Q.value = .42;
	    var bedGain = a.createGain();
	    bedGain.gain.setValueAtTime(.0001, start + .08);
	    bedGain.gain.exponentialRampToValueAtTime(.032, start + .42);
	    bedGain.gain.setValueAtTime(.026, start + 2.15);
	    bedGain.gain.exponentialRampToValueAtTime(.0001, start + dur);
	    bedSrc.connect(bedBp); bedBp.connect(bedGain); bedGain.connect(a.destination);
	    bedSrc.start(start + .08); bedSrc.stop(start + dur + .05);
	
	    // viele leicht unterschiedliche Hände, verteilt von links nach rechts
	    for (var ac = 0; ac < 68; ac++){
	      var at = .16 + Math.random() * 2.78;
	      var fade = Math.min(1, at / .45) * Math.min(1, (3.02 - at) / .68);
	      clapAt(a, start + at, (.018 + Math.random() * .035) * Math.max(.2, fade), Math.random() * 1.7 - .85, .76 + Math.random() * .62);
	    }
	  }
	
	  function fanfare(){
	    var a = audio(); if (!a) return;
	    [0, 110, 220, 400].forEach(function(ms, i){
	      setTimeout(function(){ blip([523, 659, 784, 1046][i], 0.32, 0.09, 'triangle'); }, ms);
	    });
	    setTimeout(playWinnerSound, 760);
	  }
	
	  /* ---------- Dreh-Logik ---------- */
	  var phi = 0;                 // aktueller Winkel des Rads
	  var spin = null;             // laufende Drehung
	  var flickAng = 0, flickVel = 0;
	  var lastIdx = -1;
	  var pointerAt = 0;
	
	  function mod(a, m){ return ((a % m) + m) % m; }
	
	  function idxAt(angle, n){
	    if (n < 1) return -1;
	    var step = TAU / n;
	    return Math.floor(mod(Math.PI - angle, TAU) / step) % n;
	  }
	
	  function doSpin(chargeMs){
	    var list = active();
	    var n = list.length;
	    if (n === 0 || spin) return;
	    primeCheer();
	
	    // Haltedauer bestimmt die Kraft; ein kleiner Offset hält jede Drehung lebendig
	    var held = Math.max(0, Math.min(1900, Number(chargeMs) || 0));
	    var charged = held / 1900;
	    var forceOffset = (Math.random() - .5) * .22;
	    var force = Math.max(.08, Math.min(1.08, charged + forceOffset));
	    var winner = Math.floor(Math.random() * n);
	    var step = TAU / n;
	    var jitter = (Math.random() - 0.5) * step * 0.68;
	    var target = Math.PI - (winner + 0.5) * step - jitter;
	    var turns = reduced ? 2 : 2 + Math.floor(force * 6.2) + Math.floor(Math.random() * 2);
	    var delta = mod(target - phi, TAU) + turns * TAU;
	
	    spin = {
	      from: phi,
	      delta: delta,
	      t0: performance.now(),
	      dur: reduced ? 1600 : 2550 + force * 2700 + Math.random() * 620,
	      force: force,
	      winner: list[winner]
	    };
	    spinBtn.disabled = true;
	    spinBtn.classList.remove('charging');
	    spinBtn.style.setProperty('--charge','0%');
	    spinBtn.textContent = 'Dreht …';
	    liveEl.textContent = 'Das Rad dreht sich mit ' + Math.round(force * 100) + ' Prozent Kraft.';
	  }
	
	  var lastWinnerId = null;
	
	  function finish(person){
	    spin = null;
	    lastWinnerId = person.id;
	    spinBtn.disabled = active().length === 0;
	    spinBtn.textContent = 'Halten & drehen';
	    var big = $('avatarBig');
	    big.src = avatarURL(person, 192);
	    big.style.animation = 'none';
	    void big.offsetWidth;
	    big.style.animation = '';
	    whoEl.textContent = person.name;
	    var rest = active().length;
	    subEl.textContent = rest > 1 ? ('Gezogen aus ' + rest + ' Namen.') : 'Der letzte Name im Rad.';
	    overlay.classList.add('show');
	    liveEl.textContent = 'Gewinner: ' + person.name;
	    $('againBtn').focus();
	    fanfare();
	    if (!reduced) confetti();
	    if (state.removeWinner) takeOut(person.id);
	  }
	
	  function takeOut(id){
	    var p = state.people.find(function(x){ return x.id === id; });
	    if (p) p.on = false;
	    render();
	  }
	
	  /* ---------- Konfetti ---------- */
	  function confetti(){
	    var colors = ['#EE99AE', '#F5CDE1', '#C55451', '#A35150', '#FFF2F7'];
	    for (var i = 0; i < 70; i++){
	      (function(i){
	        var f = document.createElement('div');
	        f.className = 'flake';
	        f.style.background = colors[i % colors.length];
	        f.style.left = (50 + (Math.random() - 0.5) * 30) + '%';
	        f.style.top = '46%';
	        confettiEl.appendChild(f);
	        var ang = Math.random() * Math.PI * 2;
	        var pow = 140 + Math.random() * 420;
	        var dx = Math.cos(ang) * pow;
	        var dy = Math.sin(ang) * pow - 220;
	        f.animate([
	          { transform:'translate(0,0) rotate(0deg)', opacity:1 },
	          { transform:'translate(' + dx + 'px,' + (dy + 780) + 'px) rotate(' + (Math.random()*1200 - 600) + 'deg)', opacity:0 }
	        ], { duration: 1800 + Math.random() * 1200, easing:'cubic-bezier(.15,.6,.4,1)' })
	        .onfinish = function(){ f.remove(); };
	      })(i);
	    }
	  }
	
	  /* ---------- Renderschleife ---------- */
	  var mouse = { x:0, y:0 };
	  var prev = 0;
	
	  function frame(now){
	    requestAnimationFrame(frame);
	    if (!ready) return;
	    var dt = Math.min(0.05, (now - prev) / 1000 || 0.016);
	    prev = now;
	
	    var n = active().length;
	
	    if (spin){
	      var t = Math.min(1, (now - spin.t0) / spin.dur);
	      var e = 1 - Math.pow(1 - t, 4.2);
	      var last = phi;
	      phi = spin.from + spin.delta * e;
	      pointerAt = Math.abs(phi - last) / dt;
	      if (t >= 1){
	        var w = spin.winner;
	        finish(w);
	      }
	    } else {
	      pointerAt *= 0.9;
	    }
	
	    // Stift drückt die Zunge weg, sie schnappt zurück
	    if (n > 1){
	      var idx = idxAt(phi, n);
	      if (idx !== lastIdx){
	        if (lastIdx !== -1 && pointerAt > 0.04){
	          flickVel += 3.6 + Math.min(7, pointerAt * 0.42);
	          tickSound(pointerAt);
	        }
	        lastIdx = idx;
	      }
	    }
	
	    flickVel += (-flickAng * 300 - flickVel * 12) * dt;
	    flickAng += flickVel * dt;
	    if (flickAng > 0.55) { flickAng = 0.55; flickVel = 0; }
	    if (flickAng < -0.08) { flickAng = -0.08; flickVel *= -0.3; }
	    pointerPivot.rotation.y = -flickAng;
	
	    spinGroup.rotation.y = phi;
	
	    camera.position.x += (mouse.x * 0.45 - camera.position.x) * 0.06;
	    camera.position.y += (camZ * 0.12 + mouse.y * 0.3 - camera.position.y) * 0.06;
	    camera.position.z += (camZ - camera.position.z) * 0.12;
	    camera.lookAt(0, LOOK_Y, 0);
	
	    renderer.render(scene, camera);
	  }
	
	  /* ---------- Liste rendern ---------- */
	  var CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 6.2 4.3 9.5 11 2.8" fill="none" stroke="#35141D" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
	
	  function render(){
	    var act = active(), n = act.length;
	    listEl.innerHTML = '';
	
	    if (state.people.length === 0){
	      var li = document.createElement('li');
	      li.className = 'empty-list';
	      li.textContent = 'Die Liste ist leer. Trag oben ein, wer mitspielen soll.';
	      listEl.appendChild(li);
	    } else {
	      state.people.forEach(function(p){
	        var pos = act.indexOf(p);
	        var col = pos >= 0 ? palFor(pos, n).bg : '#B78594';
	        var li = document.createElement('li');
	        li.className = 'row' + (p.on ? ' on' : '');
	        li.tabIndex = 0;
	        li.setAttribute('role', 'button');
	        li.setAttribute('aria-pressed', p.on ? 'true' : 'false');
	        li.innerHTML =
	          '<span class="box">' + CHECK + '</span>' +
	          '<span class="swatch" style="background:' + col + '"></span>' +
	          '<img class="av" width="24" height="24" alt="" title="Anderes Aussehen würfeln" src="' + avatarURL(p, 48) + '">' +
	          '<span class="nm"></span>' +
	          '<button class="del" title="Löschen" aria-label="Löschen">×</button>';
	        li.querySelector('.nm').textContent = p.name;
	        li.addEventListener('click', function(ev){
	          if (ev.target.closest('.del') || ev.target.closest('.av')) return;
	          if (spin) return;
	          p.on = !p.on; render(); store.save();
	        });
	        li.querySelector('.av').addEventListener('click', function(ev){
	          ev.stopPropagation();
	          if (spin) return;
	          p.av = (p.av || 0) + 1;
	          render(); store.save();
	        });
	        li.addEventListener('keydown', function(ev){
	          if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); li.click(); }
	        });
	        li.querySelector('.del').addEventListener('click', function(){
	          if (spin) return;
	          state.people = state.people.filter(function(x){ return x.id !== p.id; });
	          render(); store.save();
	        });
	        listEl.appendChild(li);
	      });
	    }
	
	    countEl.textContent = n === 1 ? '1 im Rad' : n + ' im Rad';
	    $('rmBox').style.opacity = 1;
	    $('rmBox').parentElement.classList.toggle('on', state.removeWinner);
	    $('rmBox').style.background = state.removeWinner ? 'var(--brass)' : 'transparent';
	    $('rmBox').style.borderColor = state.removeWinner ? 'var(--brass)' : 'rgba(255,242,247,.38)';
	    $('rmBox').querySelector('svg').style.opacity = state.removeWinner ? 1 : 0;
	    $('rmChk').checked = state.removeWinner;
	
	    spinBtn.disabled = n === 0 || !!spin;
	    drawWheelTexture();
	    buildPegs(n);
	    lastIdx = idxAt(phi, n);
	  }
	
	  /* ---------- Eingaben ---------- */
	  function addNames(raw){
	    var parts = String(raw).split(/[\n,;]+/)
	      .map(function(s){ return s.trim().replace(/\s+/g, ' '); })
	      .filter(function(s){ return s.length > 0; })
	      .map(function(s){ return s.length > 40 ? s.slice(0, 40) : s; });
	    if (!parts.length) return;
	    parts.forEach(function(nm){
	      state.people.push({ id:newId(), name:nm, on:true });
	    });
	    inputEl.value = '';
	    inputEl.style.height = 'auto';
	    render(); store.save();
	  }
	
	  $('addBtn').addEventListener('click', function(){ addNames(inputEl.value); inputEl.focus(); });
	  inputEl.addEventListener('keydown', function(e){
	    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); addNames(inputEl.value); }
	  });
	  inputEl.addEventListener('input', function(){
	    inputEl.style.height = 'auto';
	    inputEl.style.height = Math.min(120, inputEl.scrollHeight) + 'px';
	  });
	
	  $('allBtn').addEventListener('click', function(){
	    if (spin) return;
	    state.people.forEach(function(p){ p.on = true; }); render(); store.save();
	  });
	  $('noneBtn').addEventListener('click', function(){
	    if (spin) return;
	    state.people.forEach(function(p){ p.on = false; }); render(); store.save();
	  });
	  $('clearBtn').addEventListener('click', function(){
	    if (spin) return;
	    state.people = []; render(); store.save();
	  });
	  $('rmChk').addEventListener('change', function(){
	    state.removeWinner = $('rmChk').checked; render(); store.save();
	  });
	
	  /* ---------- Drehknopf: Haltedauer lädt die Kraft auf ---------- */
	  var charging = false;
	  var chargeStarted = 0;
	  var chargeFrame = 0;
	  var MAX_CHARGE_MS = 1900;
	
	  function paintCharge(now){
	    if (!charging) return;
	    var held = Math.min(MAX_CHARGE_MS, now - chargeStarted);
	    var pct = Math.round(held / MAX_CHARGE_MS * 100);
	    spinBtn.style.setProperty('--charge', pct + '%');
	    spinBtn.textContent = pct >= 100 ? 'MAXIMALE KRAFT' : 'Kraft ' + pct + ' %';
	    chargeFrame = requestAnimationFrame(paintCharge);
	  }
	
	  function startCharge(){
	    if (charging || spin || spinBtn.disabled) return;
	    charging = true;
	    chargeStarted = performance.now();
	    spinBtn.classList.add('charging');
	    spinBtn.style.setProperty('--charge','0%');
	    spinBtn.textContent = 'Kraft 0 %';
	    primeCheer();
	    chargeFrame = requestAnimationFrame(paintCharge);
	  }
	
	  function releaseCharge(){
	    if (!charging) return;
	    var held = Math.min(MAX_CHARGE_MS, performance.now() - chargeStarted);
	    charging = false;
	    cancelAnimationFrame(chargeFrame);
	    spinBtn.classList.remove('charging');
	    spinBtn.textContent = 'Halten & drehen';
	    doSpin(held);
	  }
	
	  function cancelCharge(){
	    if (!charging) return;
	    charging = false;
	    cancelAnimationFrame(chargeFrame);
	    spinBtn.classList.remove('charging');
	    spinBtn.style.setProperty('--charge','0%');
	    spinBtn.textContent = 'Halten & drehen';
	  }
	
	  spinBtn.addEventListener('pointerdown', function(e){
	    if (e.button !== undefined && e.button !== 0) return;
	    e.preventDefault();
	    try{ spinBtn.setPointerCapture(e.pointerId); }catch(ignore){}
	    startCharge();
	  });
	  spinBtn.addEventListener('pointerup', function(e){
	    e.preventDefault(); releaseCharge();
	  });
	  spinBtn.addEventListener('pointercancel', cancelCharge);
	  spinBtn.addEventListener('lostpointercapture', function(){ if (charging) releaseCharge(); });
	  spinBtn.addEventListener('click', function(e){ e.preventDefault(); });
	  spinBtn.addEventListener('keydown', function(e){
	    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat){ e.preventDefault(); startCharge(); }
	  });
	  spinBtn.addEventListener('keyup', function(e){
	    if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); releaseCharge(); }
	  });
	  spinBtn.addEventListener('blur', cancelCharge);
	
	  $('againBtn').addEventListener('click', function(){
	    overlay.classList.remove('show');
	    setTimeout(function(){ doSpin(820 + Math.random() * 420); }, 240);
	  });
	  $('removeBtn').addEventListener('click', function(){
	    if (lastWinnerId) takeOut(lastWinnerId);
	    overlay.classList.remove('show');
	    store.save();
	  });
	  $('closeBtn').addEventListener('click', function(){ overlay.classList.remove('show'); });
	  overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.classList.remove('show'); });
	  document.addEventListener('keydown', function(e){
	    if (e.key === 'Escape') overlay.classList.remove('show');
	    if (e.key === ' ' && document.activeElement === document.body && !overlay.classList.contains('show')){
	      e.preventDefault(); doSpin(620 + Math.random() * 380);
	    }
	  });
	
	  var SND_ON = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
	  var SND_OFF = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>';
	  function paintSound(){ $('soundBtn').innerHTML = state.sound ? SND_ON : SND_OFF; }
	  $('soundBtn').addEventListener('click', function(){
	    state.sound = !state.sound; paintSound(); store.save();
	    if (state.sound){
	      blip(660, 0.12, 0.05, 'triangle');
	      primeCheer();
	    } else {
	      stopCelebrationTracks();
	    }
	  });
	
	  stage.addEventListener('pointermove', function(e){
	    var r = stage.getBoundingClientRect();
	    mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
	    mouse.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
	  });
	  stage.addEventListener('pointerleave', function(){ mouse.x = 0; mouse.y = 0; });
	  stage.addEventListener('click', function(e){ if (renderer && e.target === renderer.domElement) doSpin(620 + Math.random() * 480); });
	
	  window.addEventListener('resize', resize);
	  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
	  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWheelTexture);
	
	  /* ---------- Start ---------- */
	  paintSound();
	  var ok = initThree();
	  if (!ok){
	    stage.innerHTML = '<p style="padding:24px;text-align:center;color:#D9A8B6">Die 3D-Bibliothek konnte nicht geladen werden. Prüf die Internetverbindung und lade die Seite neu.</p>';
	    spinBtn.disabled = true;
	  } else {
	    store.load().then(function(saved){
	      if (saved && Array.isArray(saved.people)){
	        state.people = saved.people;
	        state.removeWinner = !!saved.removeWinner;
	        state.sound = saved.sound !== false;
	        saved.people.forEach(function(p){
	          var num = parseInt(String(p.id).replace(/\D/g, ''), 10);
	          if (num > uid) uid = num;
	        });
	        paintSound();
	      }
	      render();
	      resize();
	      requestAnimationFrame(frame);
	    });
	  }
	})();
}
