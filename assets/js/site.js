/* Solid Wave Logistics — the website's script: the truck drawing and icons, the slideshow of SolidWave Tracker,
   and the driver application. */
(function () {
  "use strict";

  /* ---------- how to reach us: the one place these are kept (README.txt says what to change) ---------- */
  var CONTACT = { email: "info@solidwavelogistics.com", phone: "" };

  /* ---------- drawings: the tractor with its flatbed trailer and Moffett, and small icons ---------- */
  var wheel = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="24" fill="var(--tire)"/><circle cx="' + x + '" cy="' + y + '" r="9" fill="var(--hub)"/>'; };
  var lumber = function (x, y, w, h) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="var(--load)"/>'
      + '<path d="M' + x + ' ' + (y + h / 3) + 'H' + (x + w) + 'M' + x + ' ' + (y + 2 * h / 3) + 'H' + (x + w) + '" stroke="var(--load-2)" stroke-width="2"/>';
  };
  var drywall = function (x, y, w, h) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="2" fill="var(--load-2)"/>'
      + '<path d="M' + x + ' ' + (y + 6) + 'H' + (x + w) + 'M' + x + ' ' + (y + 12) + 'H' + (x + w) + 'M' + x + ' ' + (y + 18) + 'H' + (x + w) + '" stroke="var(--load)" stroke-width="1.5"/>';
  };
  var strap = function (x, y, h) { return '<rect x="' + x + '" y="' + y + '" width="5" height="' + h + '" rx="1" fill="var(--strap)"/>'; };
  var cab = function (dx) {
    return '<g transform="translate(' + dx + ',0)">'
      + '<path d="M0 134V60Q0 46 14 46H80Q93 46 101 56L140 102Q147 109 156 111V138Q156 144 150 144H0Z" fill="var(--body)"/>'
      + '<path d="M50 56H78Q85 56 90 62L122 100H50Z" fill="var(--glass)"/>'
      + '<path d="M42 56V134" stroke="var(--seam)" stroke-width="2"/>'
      + '<path d="M6 124C46 106 92 106 150 120" stroke="var(--accent)" stroke-width="6" fill="none" stroke-linecap="round"/>'
      + '<rect x="140" y="136" width="24" height="10" rx="3" fill="var(--body)"/><rect x="146" y="116" width="9" height="7" rx="2" fill="var(--accent)"/></g>';
  };
  var ART = {
    tractor: '<svg viewBox="0 0 980 190" role="img" aria-label="A tractor pulling a flatbed trailer loaded with lumber and drywall, with a truck-mounted forklift on the back">'
      + '<ellipse cx="490" cy="174" rx="470" ry="8" fill="var(--shadow)"/>'
      /* the truck-mounted forklift (Moffett) on the back of the trailer */
      + '<path d="M28 98V70H60V98" stroke="var(--body)" stroke-width="5" fill="none" stroke-linejoin="round"/>'
      + '<rect x="20" y="96" width="48" height="36" rx="5" fill="var(--accent)"/><rect x="68" y="46" width="8" height="94" rx="2" fill="var(--body)"/>'
      + '<rect x="76" y="126" width="26" height="5" rx="1" fill="var(--body)"/>'
      + '<circle cx="32" cy="146" r="11" fill="var(--tire)"/><circle cx="58" cy="146" r="11" fill="var(--tire)"/>'
      /* the trailer and its load */
      + '<rect x="98" y="110" width="572" height="14" rx="2" fill="var(--deck)"/><rect x="98" y="124" width="572" height="8" fill="var(--body)"/>'
      + lumber(112, 74, 150, 36) + strap(148, 70, 42) + strap(222, 70, 42)
      + lumber(274, 74, 150, 36) + strap(310, 70, 42) + strap(384, 70, 42)
      + drywall(436, 86, 150, 24) + strap(506, 82, 30)
      + '<rect x="560" y="132" width="6" height="26" fill="var(--body)"/><rect x="552" y="156" width="22" height="5" rx="2" fill="var(--body)"/>'
      + wheel(160, 150) + wheel(216, 150)
      /* the tractor */
      + '<rect x="610" y="128" width="320" height="10" fill="var(--body)"/><rect x="700" y="126" width="46" height="18" rx="7" fill="var(--hub)"/>'
      + '<rect x="752" y="18" width="7" height="64" rx="2" fill="var(--hub)"/>'
      + cab(764) + wheel(652, 150) + wheel(706, 150) + wheel(884, 150) + '</svg>'
  };
  var ICON = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };
  document.querySelectorAll("[data-art]").forEach(function (el) { el.innerHTML = ART[el.dataset.art] || ""; });
  document.querySelectorAll("[data-icon]").forEach(function (el) { el.outerHTML = ICON[el.dataset.icon] || ""; });

  /* ---------- how to reach us, filled in wherever the page asks for it ---------- */
  var tel = CONTACT.phone.replace(/[^\d+]/g, "");
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    var k = el.dataset.contact;
    if (k === "email") { el.href = "mailto:" + CONTACT.email; var t = el.querySelector("[data-text]"); if (t) t.textContent = CONTACT.email; }
    if (k === "phone") {
      /* no phone number yet: its button (and its line in the footer) stays off the page */
      if (!tel) { el.hidden = true; if (el.parentElement.tagName === "LI") el.parentElement.hidden = true; return; }
      el.href = "tel:" + tel; var p = el.querySelector("[data-text]"); if (p) p.textContent = CONTACT.phone;
    }
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- the slideshow: the lit topic moves on every few seconds; after the last one, the next part of the
     app slides in. It waits while someone is pointing at it or using it, and while it's off screen; Pause stops
     it; with reduced motion it doesn't move on its own ---------- */
  var deck = document.querySelector(".deck");
  if (deck) {
    var track = deck.querySelector(".track"), slides = [].slice.call(deck.querySelectorAll(".slide"));
    var tabs = [].slice.call(document.querySelectorAll(".deck-tab")), pause = document.querySelector(".deck-pause");
    var STEP = 4500, still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var s = 0, t = 0, spent = 0, last = 0, paused = !!still, held = false, away = true;
    var topicsOf = function (i) { return [].slice.call(slides[i].querySelectorAll(".topic")); };
    var place = function (i, k) {
      var r = JSON.parse(topicsOf(i)[k].dataset.r), l = slides[i].querySelector(".lit");
      l.style.left = r[0] + "%"; l.style.top = r[1] + "%"; l.style.width = r[2] + "%"; l.style.height = r[3] + "%";
    };
    var show = function () {
      track.style.transform = "translateX(-" + (s * 100) + "%)";
      slides.forEach(function (el, i) { var on = i === s; el.setAttribute("aria-hidden", on ? "false" : "true"); el.inert = !on; if (!on) place(i, 0); });
      tabs.forEach(function (b, i) { b.setAttribute("aria-selected", i === s ? "true" : "false"); b.tabIndex = i === s ? 0 : -1; });
      var row = slides[s].querySelector(".topics");
      topicsOf(s).forEach(function (b, k) {
        b.classList.toggle("on", k === t); b.setAttribute("aria-pressed", k === t ? "true" : "false"); b.querySelector(".time").style.width = "0";
        /* on a phone the topics sit in a row: the lit one slides into view (the page itself doesn't move) */
        if (k === t && row.scrollWidth > row.clientWidth) row.scrollTo({ left: b.offsetLeft - row.offsetLeft - 4, behavior: still ? "auto" : "smooth" });
      });
      place(s, t);
    };
    var go = function (i, k) { s = i; t = k; spent = 0; show(); };
    var frame = function (now) {
      if (!last) last = now;
      var dt = Math.min(now - last, 1000); last = now;   /* a tab coming back from the background doesn't jump ahead */
      if (!paused && !held && !away) {
        spent += dt;
        if (spent >= STEP) { spent = 0; t++; if (t >= topicsOf(s).length) { t = 0; s = (s + 1) % slides.length; } show(); }
      }
      topicsOf(s)[t].querySelector(".time").style.width = (paused ? 0 : Math.min(100, spent / STEP * 100)) + "%";
      requestAnimationFrame(frame);
    };
    tabs.forEach(function (b, i) {
      b.addEventListener("click", function () { go(i, 0); });
      /* the tabs: left and right arrows move along them */
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
        e.preventDefault(); var n = (i + d + tabs.length) % tabs.length; go(n, 0); tabs[n].focus();
      });
    });
    slides.forEach(function (el, i) { topicsOf(i).forEach(function (b, k) { b.addEventListener("click", function () { go(i, k); }); }); });
    deck.addEventListener("mouseenter", function () { held = true; });
    deck.addEventListener("mouseleave", function () { held = false; });
    deck.addEventListener("focusin", function () { held = true; });
    deck.addEventListener("focusout", function () { held = false; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { away = !es[0].isIntersecting; }, { threshold: .35 }).observe(deck);
    else away = false;
    var setPause = function (p) { paused = p; pause.setAttribute("aria-pressed", p ? "true" : "false"); pause.querySelector("span").textContent = p ? "Play" : "Pause"; pause.setAttribute("aria-label", p ? "Play the slideshow" : "Pause the slideshow"); };
    pause.addEventListener("click", function () { setPause(!paused); });
    setPause(paused); show();
    /* for checking the page: where it is, and why it might be waiting */
    window.__deck = { go: go, pause: function () { setPause(true); }, play: function () { setPause(false); }, state: function () { return { slide: s, topic: t, paused: paused, held: held, away: away, spent: Math.round(spent) }; } };
    requestAnimationFrame(frame);
  }

  /* ---------- the driver application. Until applications go straight into SolidWave Tracker, sending one opens
     the driver's email with it filled in, addressed to us ---------- */
  var form = document.getElementById("apply");
  if (form) {
    var msg = form.querySelector(".msg");
    var say = function (text, good) { msg.textContent = text; msg.className = "msg " + (good ? "good" : "bad"); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var E = form.elements;
      if (E.company && E.company.value) return;   /* only a robot fills in the hidden box */
      var name = E.name.value.trim(), phone = E.phone.value.trim(), where = E.where.value.trim(), years = E.years.value, moffett = E.moffett.value;
      var bad = [];
      [["name", name.length >= 2], ["phone", phone.replace(/\D/g, "").length >= 10], ["where", where.length >= 2], ["years", !!years], ["moffett", !!moffett]].forEach(function (c) {
        E[c[0]].setAttribute("aria-invalid", c[1] ? "false" : "true"); if (!c[1]) bad.push(c[0]);
      });
      if (bad.length) {
        say(bad.indexOf("phone") >= 0 && phone ? "Check the phone number: it needs all 10 digits." : "Fill in every box, please.", false);
        E[bad[0]].focus(); return;
      }
      var body = ["Name: " + name, "Phone: " + phone, "City or ZIP: " + where, "Years with a Class A: " + years, "Moffett experience: " + moffett].join("\n");
      window.location.href = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Driver application: " + name) + "&body=" + encodeURIComponent(body + "\n");
      say("Your email opened with your application filled in. Press Send and we'll call you." + (tel ? " No email? Call or text " + CONTACT.phone + "." : ""), true);
    });
    form.addEventListener("input", function (e) { if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false"); });
  }
})();
