/* Writes the "How we run" slideshow into index.html, between <!-- showcase:start … --> and <!-- showcase:end -->.
   The pictures and where each highlight goes come from tools/slides.json (made by tools/app-shots.js from the
   SolidWave Tracker test copy); the words are below. Run: node tools/showcase.js

   The owner, 2026-10-19: show the app the way the guided tour did, with the highlights moving on by themselves
   and the whole section sliding to another part of the app after the last one; Financials and Documents too
   ("Really trying to sell this"); the headline "Every mile accounted for". */
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const S = JSON.parse(fs.readFileSync(path.join(__dirname, "slides.json"), "utf8"));
const pct = (v, of) => +(v / of * 100).toFixed(2);

/* what each part of the app is for, in the partners' terms (no last-mile basics, no real names) */
const COPY = [
  { tab: "Drivers", kicker: "Hiring", title: "Hiring by the book", topics: [
    ["Same steps, every driver", "Interview, background, offer, hired. Nobody skips ahead."],
    ["Paperwork watched", "Licenses and DOT medical cards are flagged 30 days before they run out."],
    ["Nothing gets skipped", "Driving record, background check, drug test, DOT medical card. Ticked off one by one."]] },
  { tab: "Routes", kicker: "Routes", title: "Every route at a glance", topics: [
    ["Every route, by stage", "Offered, accepted, setting up, running: we see where each one stands."],
    ["A driver and a truck on each", "Every route shows the driver and the truck running it."],
    ["Gaps show up the same day", "A route missing its driver or truck turns amber, so it's handled before it's a problem."]] },
  { tab: "Equipment", kicker: "Equipment", title: "Equipment ready to roll", topics: [
    ["The right setup", "Every unit on record with its configuration: tractor, flatbed, Moffett."],
    ["Ready before it rolls", "Every truck goes through the same steps, from sourcing to in service."],
    ["Inspections watched", "Registrations and inspections are flagged 30 days before they run out."]] },
  { tab: "Documents", kicker: "Documents", title: "Every paper in one place", topics: [
    ["All in one place", "CDLs, medical cards, insurance certificates, agreements. One list, nothing lost in a drawer."],
    ["Tied to its driver or store", "Every document belongs to a driver or a store, one click from their page."],
    ["Found in seconds", "Search by name, or narrow it down by type, driver, store or tag."]] },
  { tab: "Financials", kicker: "Financials", title: "We know our numbers", topics: [
    ["Every week, in and out", "What came in and what went out, side by side with what we expected."],
    ["Every route, every day", "What each route brought in, day by day, store by store."],
    ["Every cost counted", "Drivers, fuel, insurance and rentals, down to what's left over."]] },
];
if (COPY.length !== S.slides.length) throw new Error("slides.json has " + S.slides.length + " pictures, the words have " + COPY.length);

const slideHtml = (sl, i) => {
  /* a highlight stays inside the picture, so its whole outline shows */
  const fit = t => { const x = Math.max(2, t.x), y = Math.max(2, t.y); return { x: x, y: y, w: Math.min(t.w - (x - t.x), sl.w - 2 - x), h: Math.min(t.h - (y - t.y), sl.h - 3 - y) }; };
  const r = t => { t = fit(t); return [pct(t.x, sl.w), pct(t.y, sl.h), pct(t.w, sl.w), pct(t.h, sl.h)]; };
  const c = COPY[i], first = r(sl.topics[0]);
  return `      <div class="slide" id="slide-${i}" role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${S.slides.length}: ${c.tab}">
        <div><span class="kicker">${c.kicker}</span><h3>${c.title}</h3>
          <div class="topics">${c.topics.map((t, k) => `<button type="button" class="topic${k === 0 ? " on" : ""}" aria-pressed="${k === 0}" data-r="${JSON.stringify(r(sl.topics[k]))}"><b>${t[0]}</b><span>${t[1]}</span><i class="time"></i></button>`).join("")}</div></div>
        <figure class="win"><div class="tb"><img src="assets/img/wave-small.png" alt="" width="81" height="22">SolidWave Tracker<span class="ctl" aria-hidden="true">&#8211;&nbsp;&nbsp;&#9633;&nbsp;&nbsp;&#215;</span></div>
          <div class="pic"><img src="assets/img/app/${sl.img}" alt="${c.tab} in SolidWave Tracker" width="${sl.w}" height="${sl.h}"${i ? ' loading="lazy"' : ""}><span class="lit" style="left:${first[0]}%;top:${first[1]}%;width:${first[2]}%;height:${first[3]}%"></span></div></figure>
      </div>`;
};

const section = `<!-- showcase:start (written by tools/showcase.js from the app's pictures; change it there) -->
<section class="show" id="how" aria-labelledby="howH">
  <div class="wrap">
    <p class="eyebrow">How we run</p>
    <h2 class="display" id="howH">Every mile<br><span class="w">accounted for.</span></h2>
    <p class="say">Every driver, route and truck we run lives in SolidWave Tracker, the system we built for our own operation. Here's a look inside.</p>
    <div class="deck-bar">
      <div class="deck-tabs" role="tablist" aria-label="Parts of SolidWave Tracker">${COPY.map((c, i) => `<button type="button" class="deck-tab" role="tab" id="tab-${i}" aria-controls="slide-${i}" aria-selected="${i === 0}">${c.tab}</button>`).join("")}</div>
      <button type="button" class="deck-pause" aria-pressed="false"><svg class="ic-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"/></svg><svg class="ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg><span>Pause</span></button>
    </div>
    <div class="deck" aria-roledescription="carousel" aria-label="A look inside SolidWave Tracker">
      <div class="track">
${S.slides.map(slideHtml).join("\n")}
      </div>
    </div>
    <p class="fine">Real pages from our system. The names and numbers are examples.</p>
    <div class="cta"><a class="btn btn-blue" href="#contact">Partner with us <i data-icon="arrow"></i></a><span>Want to see it live? <b>We'll walk you through it.</b></span></div>
  </div>
</section>
<!-- showcase:end -->`;

const file = path.join(root, "index.html");
let page = fs.readFileSync(file, "utf8");
const a = page.indexOf("<!-- showcase:start"), b = page.indexOf("<!-- showcase:end -->");
if (a < 0 || b < 0) throw new Error("index.html has no showcase markers");
page = page.slice(0, a) + section + page.slice(b + "<!-- showcase:end -->".length);
fs.writeFileSync(file, page);
console.log("index.html: the slideshow written (" + S.slides.length + " parts of the app)");
