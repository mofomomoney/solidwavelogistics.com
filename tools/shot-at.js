/* One screen of the site, scrolled to a section, as a picture (HIDDEN window). AT = comma list of section ids;
   W and H = the window's size. DECK=4,1 shows the slideshow's fifth part with its second highlight lit (held still).
   Pictures go to tools/shots/at-<id>-<W>.png (with DECK: at-<id>-<W>-<part>-<highlight>.png) */
"use strict";
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });
app.setPath("userData", path.join(require("os").tmpdir(), "solidwave-site-shot"));
const W = +(process.env.W || 1440), H = +(process.env.H || 900);
const DECK = (process.env.DECK || "").split(",").filter(Boolean).map(Number);
const wait = ms => new Promise(r => setTimeout(r, ms));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: W, height: H, useContentSize: true, webPreferences: { backgroundThrottling: false } });
  await win.loadFile(path.join(__dirname, "..", "index.html"));
  const dbg = win.webContents.debugger; dbg.attach("1.3");
  await dbg.sendCommand("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  /* a hidden window doesn't run the slide's movement, so a picture of another part needs it to jump there */
  await win.webContents.insertCSS("html{scroll-behavior:auto!important} html::-webkit-scrollbar{display:none}" + (DECK.length ? " *{transition:none!important}" : ""));
  const js = code => win.webContents.executeJavaScript("(async()=>{" + code + "})()", true);
  await js(`await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,8000))]); [].slice.call(document.images).forEach(i=>i.loading="eager"); await new Promise(r=>setTimeout(r,600));`);
  for (const id of (process.env.AT || "contact").split(",")) {
    await js(`const e=document.getElementById(${JSON.stringify(id)})||document.querySelector(${JSON.stringify(id)}), bar=document.querySelector(".bar").offsetHeight; window.scrollTo(0, e.getBoundingClientRect().top + scrollY - bar - 8);
      if(window.__deck){ ${DECK.length ? "__deck.go(" + DECK[0] + ", " + (DECK[1] || 0) + ");" : ""} __deck.pause(); }`);
    await wait(900);
    await win.webContents.capturePage(undefined, { stayHidden: true }); await wait(250);
    const im = await win.webContents.capturePage(undefined, { stayHidden: true });
    const name = "at-" + id.replace(/[^a-z0-9-]/gi, "") + "-" + W + (DECK.length ? "-" + DECK.join("-") : "");
    fs.writeFileSync(path.join(OUT, name + ".png"), im.toPNG()); console.log("saved " + name);
  }
  app.exit(0);
}).catch(e => { console.error("FAILED", e); app.exit(1); });
