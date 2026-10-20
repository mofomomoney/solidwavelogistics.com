/* Writes the "Our operation" slideshow into tracker.html (its own page since 2026-10-20), between <!-- showcase:start … --> and <!-- showcase:end -->.
   The pictures and where each highlight goes come from tools/slides.json (made by tools/app-shots.js from the
   SolidWave Tracker test copy); the words are below. Run: node tools/showcase.js

   The owner, 2026-10-19: show the app the way the guided tour did, with the highlights moving on by themselves
   and the whole section sliding to another part of the app after the last one. 2026-10-20, the owner's words: "Our
   operation. Powered by software we built." and "Meet SolidWave Tracker—our in-house-developed platform…". 2026-10-20: a shorter site, so this is a focused look at how we stay accountable: three parts,
   two points each, and none of our money (payroll, costs, profit). */
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const S = JSON.parse(fs.readFileSync(path.join(__dirname, "slides.json"), "utf8"));
const pct = (v, of) => +(v / of * 100).toFixed(2);
/* a short code from a picture's contents, put on its link: a changed picture gets a new link, so browsers load it
   fresh instead of showing the copy they kept (the owner, 2026-10-20: "ive hit f5 multiple times") */
const ver = file => require("crypto").createHash("sha1").update(fs.readFileSync(path.join(root, file))).digest("hex").slice(0, 8);

/* each part of the app, in the order of slides.json. A point is [which highlight on the picture, its title, its
   line, and for phones where to zoom: [the middle across, the middle down (parts of the picture), how close]]. The
   highlights are 0, 1 and 2 in the order app-shots.js measured them; with no zoom given, a phone moves in on the
   highlight itself */
const COPY = [
  { tab: "Drivers", kicker: "Drivers", title: "Vetted before day one", topics: [
    [2, "Every check, every driver", "Driving record, background check, drug test and DOT medical card, ticked off one by one.", [0.235, 0.75, 2.1]],
    [1, "Credentials watched", "CDLs and medical cards are flagged 30 days before they expire.", [0.2, 0.435, 2.4]]] },
  { tab: "Routes", kicker: "Routes", title: "Every route covered", topics: [
    [1, "A driver and a truck on each", "Every route shows who's driving it and what they're driving."],
    [2, "Gaps caught the same day", "A route missing its driver or truck is flagged before it becomes a problem.", [0.35, 0.397, 2]]] },
  { tab: "Fleet", kicker: "Fleet", title: "Equipment ready to roll", topics: [
    [1, "Ready before it rolls", "Every unit goes through the same steps, from sourcing to its first route.", [0.48, 0.23, 1.6]],
    [0, "Every unit on record", "Each truck and trailer with its configuration, status and paperwork.", [0.27, 0.11, 1.8]]] },
  { tab: "Documents", kicker: "Documents", title: "Every paper in one place", topics: [
    [0, "All in one place", "CDLs, medical cards, insurance certificates, agreements. One list, nothing lost in a drawer."],
    [1, "Tied to its driver or store", "Every document belongs to a driver or a store, one click from their page."]] },
  { tab: "Financials", kicker: "Forecast", title: "The math before the handshake", topics: [
    [0, "Every deal, line by line", "Rate, driver pay, rent, fuel and insurance for each configuration, before we say yes."],
    [1, "A week, a month, a year", "What a deal leaves each week, month and year, and the cash it takes to start."],
    [2, "Cash, week by week", "Costs out, pay in, and the week it's back to even."]] },
];
if (COPY.length !== S.slides.length) throw new Error("slides.json has " + S.slides.length + " pictures, the words have " + COPY.length);
/* the parts on the page, in this order. Documents and the Forecast stay in the folder, off the page; add their
   names here to show them again */
const SHOW = ["Routes", "Drivers", "Fleet"];
const PARTS = SHOW.map(name => { const i = COPY.findIndex(c => c.tab === name); if (i < 0) throw new Error("no part called " + name); return { c: COPY[i], sl: S.slides[i] }; });

const slideHtml = (part, i) => {
  const sl = part.sl, c = part.c;
  /* a highlight stays inside the picture, so its whole outline shows */
  const fit = t => { const x = Math.max(2, t.x), y = Math.max(2, t.y); return { x: x, y: y, w: Math.min(t.w - (x - t.x), sl.w - 2 - x), h: Math.min(t.h - (y - t.y), sl.h - 3 - y) }; };
  const r = t => { t = fit(t); return [pct(t.x, sl.w), pct(t.y, sl.h), pct(t.w, sl.w), pct(t.h, sl.h)]; };
  const first = r(sl.topics[c.topics[0][0]]);
  return `      <div class="slide" id="slide-${i}" role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${PARTS.length}: ${c.tab}">
        <div><span class="kicker">${c.kicker}</span><h3>${c.title}</h3>
          <div class="topics">${c.topics.map((t, k) => `<button type="button" class="topic${k === 0 ? " on" : ""}" aria-pressed="${k === 0}" data-r="${JSON.stringify(r(sl.topics[t[0]]))}"${t[3] ? ` data-f="${t[3].join(",")}"` : ""}><b>${t[1]}</b><span>${t[2]}</span><i class="time"></i></button>`).join("")}</div>
          <div class="tdots" role="group" aria-label="${c.tab}: points">${c.topics.map((t, k) => `<button type="button" class="tdot" aria-pressed="${k === 0}" aria-label="Point ${k + 1} of ${c.topics.length}: ${t[1]}"><i></i></button>`).join("")}</div></div>
        <figure class="win"><div class="tb"><img src="assets/img/wave-small.png" alt="" width="81" height="22">SolidWave Tracker<span class="ctl" aria-hidden="true">&#8211;&nbsp;&nbsp;&#9633;&nbsp;&nbsp;&#215;</span></div>
          <div class="pic"><div class="zoom"><img src="assets/img/app/${sl.img}?v=${ver("assets/img/app/" + sl.img)}" alt="${c.tab} in SolidWave Tracker" width="${sl.w}" height="${sl.h}"${i ? ' loading="lazy"' : ""}><span class="lit" style="left:${first[0]}%;top:${first[1]}%;width:${first[2]}%;height:${first[3]}%"></span></div></div></figure>
      </div>`;
};

const section = `<!-- showcase:start (written by tools/showcase.js from the app's pictures; change it there) -->
<section class="show" id="operation" aria-labelledby="howH">
  <div class="wrap">
    <p class="eyebrow">Our operation <span class="inhouse">Built in-house</span></p>
    <h1 class="display" id="howH">Our operation.<br><span class="w">Our technology.</span></h1>
    <p class="say">We built SolidWave Tracker in-house to bring our route coverage, driver coordination, and fleet management into one centralized system. It's the technology behind how we organize, oversee, and manage our daily operation.</p>
    <div class="deck-bar">
      <div class="deck-tabs" role="tablist" aria-label="Parts of SolidWave Tracker">${PARTS.map((p, i) => `<button type="button" class="deck-tab" role="tab" id="tab-${i}" aria-controls="slide-${i}" aria-selected="${i === 0}">${p.c.tab}</button>`).join("")}</div>
      <button type="button" class="deck-pause" aria-pressed="false"><svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"/></svg><svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg><span>Pause</span></button>
    </div>
    <div class="deck" aria-roledescription="carousel" aria-label="A look inside SolidWave Tracker">
      <div class="track">
${PARTS.map(slideHtml).join("\n")}
      </div>
    </div>
    <p class="fine">Real pages from our system. The names and numbers are examples.</p>
    <div class="cta"><a class="btn btn-blue" href="index.html#contact">Partner with SolidWave <i data-icon="arrow"></i></a></div>
  </div>
</section>
<!-- showcase:end -->`;

const file = path.join(root, "tracker.html");
let page = fs.readFileSync(file, "utf8");
const a = page.indexOf("<!-- showcase:start"), b = page.indexOf("<!-- showcase:end -->");
if (a < 0 || b < 0) throw new Error("tracker.html has no showcase markers");
page = page.slice(0, a) + section + page.slice(b + "<!-- showcase:end -->".length);
fs.writeFileSync(file, page);
console.log("tracker.html: the slideshow written (" + PARTS.length + " parts of the app)");
