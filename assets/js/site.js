/* SolidWave Logistics — the website's script: the icons, the slideshow of SolidWave Tracker, and the two forms
   (a business's request for route coverage, and the Class A driver application). */
(function () {
  "use strict";

  /* ---------- how to reach us: the one place these are kept (README.txt says what to change) ---------- */
  var CONTACT = { email: "info@solidwavelogistics.com", phone: "" };

  /* ---------- small icons, drawn in lines like the rest of the page ---------- */
  var line = function (paths) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>'; };
  var ICON = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: line('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
    mail: line('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>')
  };
  document.querySelectorAll("[data-icon]").forEach(function (el) { el.outerHTML = ICON[el.dataset.icon] || ""; });

  /* ---------- how to reach us, filled in wherever the page asks for it ---------- */
  var tel = CONTACT.phone.replace(/[^\d+]/g, "");
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    var k = el.dataset.contact;
    if (k === "email") { el.href = "mailto:" + CONTACT.email; var t = el.querySelector("[data-text]"); if (t) t.textContent = CONTACT.email; }
    if (k === "phone") {
      /* no phone number yet: its link (and its line) stays off the page */
      if (!tel) { el.hidden = true; if (el.parentElement.tagName === "LI") el.parentElement.hidden = true; return; }
      el.href = "tel:" + tel; var p = el.querySelector("[data-text]"); if (p) p.textContent = CONTACT.phone;
    }
  });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = CONTACT.email; });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- the slideshow: the lit topic moves on every few seconds; after the last one, the next part of the
     app slides in. It waits while someone is pointing at it or using it, and while it's off screen; Pause stops
     it; with reduced motion it doesn't move on its own ---------- */
  var deck = document.querySelector(".deck");
  if (deck) {
    var track = deck.querySelector(".track"), slides = [].slice.call(deck.querySelectorAll(".slide"));
    var tabs = [].slice.call(document.querySelectorAll(".deck-tab")), pause = document.querySelector(".deck-pause");
    var STEP = 4500, still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var s = 0, t = 0, spent = 0, last = 0, paused = !!still, away = true;
    /* it waits while a mouse is over it, while the keyboard is in it, and for a few seconds after a finger */
    var hover = false, kbd = false, touchUntil = 0;
    var held = function () { return hover || kbd || Date.now() < touchUntil; };
    var phone = window.matchMedia ? matchMedia("(max-width: 900px)") : { matches: false };
    var topicsOf = function (i) { return [].slice.call(slides[i].querySelectorAll(".topic")); };
    var dotsOf = function (i) { return [].slice.call(slides[i].querySelectorAll(".tdot")); };
    /* on a phone the picture moves in on the lit part, so it can be read; on a computer it shows whole */
    var focus = function (i, k) {
      var z = slides[i].querySelector(".zoom"), l = slides[i].querySelector(".lit"); if (!z) return;
      if (!phone.matches) { z.style.transform = ""; l.style.outlineWidth = ""; l.style.borderRadius = ""; return; }
      /* where to look: the point says (data-f: the middle across, the middle down, how close), or the highlight itself */
      var b = topicsOf(i)[k], f = b.dataset.f ? b.dataset.f.split(",").map(Number) : null, r = JSON.parse(b.dataset.r);
      var x = r[0] / 100, y = r[1] / 100, w = r[2] / 100, h = r[3] / 100;
      var m = f ? f[2] : Math.max(1, Math.min(2.4, 0.92 / w, 0.86 / h)), cx = f ? f[0] : x + w / 2, cy = f ? f[1] : y + h / 2;
      var tx = Math.min(0, Math.max(1 - m, 0.5 - cx * m)), ty = Math.min(0, Math.max(1 - m, 0.5 - cy * m));
      z.style.transform = "translate(" + (tx * 100).toFixed(2) + "%," + (ty * 100).toFixed(2) + "%) scale(" + m.toFixed(3) + ")";
      l.style.outlineWidth = (3 / m).toFixed(2) + "px"; l.style.borderRadius = (8 / m).toFixed(2) + "px";
    };
    var place = function (i, k) {
      var r = JSON.parse(topicsOf(i)[k].dataset.r), l = slides[i].querySelector(".lit");
      l.style.left = r[0] + "%"; l.style.top = r[1] + "%"; l.style.width = r[2] + "%"; l.style.height = r[3] + "%";
      focus(i, k);
    };
    var show = function () {
      track.style.transform = "translateX(-" + (s * 100) + "%)";
      slides.forEach(function (el, i) { var on = i === s; el.setAttribute("aria-hidden", on ? "false" : "true"); el.inert = !on; if (!on) place(i, 0); });
      tabs.forEach(function (b, i) { b.setAttribute("aria-selected", i === s ? "true" : "false"); b.tabIndex = i === s ? 0 : -1; });
      topicsOf(s).forEach(function (b, k) { b.classList.toggle("on", k === t); b.setAttribute("aria-pressed", k === t ? "true" : "false"); b.querySelector(".time").style.width = "0"; });
      dotsOf(s).forEach(function (d, k) { d.setAttribute("aria-pressed", k === t ? "true" : "false"); });
      place(s, t);
    };
    var go = function (i, k) { s = i; t = k; spent = 0; show(); };
    /* the next or the one before; past the last point, the next part of the app */
    var step = function (d) {
      var i = s, k = t + d;
      if (k >= topicsOf(s).length) { i = (s + 1) % slides.length; k = 0; }
      else if (k < 0) { i = (s - 1 + slides.length) % slides.length; k = topicsOf(i).length - 1; }
      go(i, k);
    };
    var frame = function (now) {
      if (!last) last = now;
      var dt = Math.min(now - last, 1000); last = now;   /* a tab coming back from the background doesn't jump ahead */
      if (!paused && !held() && !away) {
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
    slides.forEach(function (el, i) {
      topicsOf(i).forEach(function (b, k) { b.addEventListener("click", function () { go(i, k); }); });
      dotsOf(i).forEach(function (b, k) { b.addEventListener("click", function () { go(i, k); }); });
    });
    if (window.matchMedia && matchMedia("(hover: hover)").matches) {
      deck.addEventListener("mouseenter", function () { hover = true; });
      deck.addEventListener("mouseleave", function () { hover = false; });
    }
    deck.addEventListener("focusin", function (e) { kbd = !!(e.target.matches && e.target.matches(":focus-visible")); });
    deck.addEventListener("focusout", function () { kbd = false; });
    /* a phone: swipe left or right for the next point or the one before */
    var sx = 0, sy = 0;
    deck.addEventListener("touchstart", function (e) { var p = e.changedTouches[0]; sx = p.clientX; sy = p.clientY; touchUntil = Date.now() + 8000; }, { passive: true });
    deck.addEventListener("touchend", function (e) {
      var p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy;
      touchUntil = Date.now() + 6000;
      if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    var refit = function () { slides.forEach(function (el, i) { focus(i, i === s ? t : 0); }); };
    if (phone.addEventListener) phone.addEventListener("change", refit); else if (phone.addListener) phone.addListener(refit);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { away = !es[0].isIntersecting; }, { threshold: .35 }).observe(deck);
    else away = false;
    var setPause = function (p) { paused = p; pause.setAttribute("aria-pressed", p ? "true" : "false"); pause.querySelector("span").textContent = p ? "Play" : "Pause"; pause.setAttribute("aria-label", p ? "Play the slideshow" : "Pause the slideshow"); };
    pause.addEventListener("click", function () { setPause(!paused); });
    setPause(paused); show();
    /* for checking the page: where it is, and why it might be waiting */
    window.__deck = { go: go, pause: function () { setPause(true); }, play: function () { setPause(false); }, state: function () { return { slide: s, topic: t, paused: paused, held: held(), away: away, spent: Math.round(spent) }; } };
    requestAnimationFrame(frame);
  }

  /* ---------- the forms. There's no server behind the site yet, so sending one opens the visitor's own email
     with everything filled in, addressed to us; if their email doesn't open, they can copy it and send it
     themselves. Each box says what's wrong right under it ---------- */
  var digits = function (v) { return v.replace(/\D/g, "").length; };
  var FORMS = {
    inquire: {
      what: "request",
      checks: {
        name: function (v) { return v.length >= 2 ? "" : "Enter your name."; },
        org: function (v) { return v.length >= 2 ? "" : "Enter your company's name."; },
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : v ? "Check the email address, like name@company.com." : "Enter your email address."; },
        phone: function (v) { return !v || digits(v) >= 10 ? "" : "Enter all 10 digits, or leave it empty."; },
        region: function (v) { return v.length >= 2 ? "" : "Enter where your routes run."; },
        details: function (v) { return v.length >= 10 ? "" : "Tell us a little about your routes."; }
      },
      subject: function (v) { return "Route coverage request: " + v.org; },
      body: function (v) { return ["Contact name: " + v.name, "Company: " + v.org, "Email: " + v.email, "Phone: " + (v.phone || "(not given)"),
        "Service location or region: " + v.region, "", "Route requirements:", v.details].join("\n"); }
    },
    apply: {
      what: "application",
      checks: {
        name: function (v) { return v.length >= 2 ? "" : "Enter your full name."; },
        phone: function (v) { return digits(v) >= 10 ? "" : v ? "Enter all 10 digits of your phone number." : "Enter your phone number."; },
        where: function (v) { return v.length >= 2 ? "" : "Enter your city or ZIP code."; },
        years: function (v) { return v ? "" : "Choose how long you've had your Class A."; },
        equipment: function () { return ""; }
      },
      subject: function (v) { return "Driver application: " + v.name; },
      body: function (v) { return ["Name: " + v.name, "Phone: " + v.phone, "City or ZIP: " + v.where, 
        "Years with a Class A: " + v.years, "Equipment driven: " + (v.equipment || "(not given)")].join("\n"); }
    }
  };
  var mark = function (el, err) {
    var box = el.closest(".f"), id = el.id + "-err", small = document.getElementById(id);
    el.setAttribute("aria-invalid", err ? "true" : "false");
    if (err) {
      if (!small) { small = document.createElement("small"); small.className = "err"; small.id = id; box.appendChild(small); }
      small.textContent = err; el.setAttribute("aria-describedby", id);
    } else if (small) { small.remove(); el.removeAttribute("aria-describedby"); }
  };
  /* the email app opens by following a mailto: link; the page checks can watch it instead */
  var openMail = function (href) { if (window.__openMail) window.__openMail(href); else window.location.href = href; };
  var copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, fail) {
      var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select(); var done = false; try { done = document.execCommand("copy"); } catch (e) { done = false; } ta.remove(); done ? ok() : fail();
    });
  };
  Object.keys(FORMS).forEach(function (fid) {
    var form = document.getElementById(fid), F = FORMS[fid]; if (!form) return;
    var msg = form.querySelector(".msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var E = form.elements;
      if (E.website && E.website.value) return;   /* only a robot fills in the hidden box */
      var v = {}, bad = [];
      Object.keys(F.checks).forEach(function (k) {
        var el = E[k]; v[k] = el.value.trim();
        var err = F.checks[k](v[k]); mark(el, err); if (err) bad.push(el);
      });
      if (bad.length) {
        msg.className = "msg bad";
        msg.textContent = bad.length === 1 ? "One box needs a fix: it's marked above." : bad.length + " boxes need a fix: they're marked above.";
        bad[0].focus(); return;
      }
      var body = F.body(v), subject = F.subject(v);
      openMail("mailto:" + CONTACT.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body + "\n"));
      /* what happens next, and what to do if no email app opened */
      msg.className = "msg good"; msg.textContent = "";
      var b = document.createElement("b"); b.textContent = "Almost done: your email app should have opened with your " + F.what + " filled in. Press Send there.";
      var p = document.createElement("span"); p.textContent = "Nothing opened? Copy your " + F.what + " and email it to ";
      var a = document.createElement("a"); a.href = "mailto:" + CONTACT.email; a.textContent = CONTACT.email;
      var c = document.createElement("button"); c.type = "button"; c.className = "copy"; c.textContent = "Copy my " + F.what;
      c.addEventListener("click", function () {
        copyText("To: " + CONTACT.email + "\nSubject: " + subject + "\n\n" + body).then(function () { c.textContent = "Copied"; }, function () { c.textContent = "Couldn't copy: select the text in the boxes instead"; });
      });
      msg.append(b, p, a, document.createTextNode(". "), c);
    });
    form.addEventListener("input", function (e) { if (e.target.getAttribute("aria-invalid") === "true") mark(e.target, ""); });
    form.addEventListener("change", function (e) { if (e.target.tagName === "SELECT" && e.target.value && e.target.getAttribute("aria-invalid") === "true") mark(e.target, ""); });
  });
})();
