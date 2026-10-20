/* The whole page as one picture, taken in one go (HIDDEN window): the window is made as tall as the page, so
   nothing is stitched together. W = the width. Saves tools/shots/full-<W>.png */
"use strict";
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });
app.setPath("userData", path.join(require("os").tmpdir(), "solidwave-site-full"));
const W = +(process.env.W || 1440);
const wait = ms => new Promise(r => setTimeout(r, ms));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: W, height: 900, useContentSize: true, enableLargerThanScreen: true, webPreferences: { backgroundThrottling: false } });
  await win.loadFile(path.join(__dirname, "..", "index.html"));
  const dbg = win.webContents.debugger; dbg.attach("1.3");
  const size = async h => { win.setContentSize(W, h); await dbg.sendCommand("Emulation.setDeviceMetricsOverride", { width: W, height: h, deviceScaleFactor: 1, mobile: false }); };
  await size(900);
  await win.webContents.insertCSS("html{scroll-behavior:auto!important} html::-webkit-scrollbar{display:none} *{transition:none!important}");
  const js = code => win.webContents.executeJavaScript("(async()=>{" + code + "})()", true);
  await js(`await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,8000))]); [].slice.call(document.images).forEach(i=>i.loading="eager");
    await Promise.all([].slice.call(document.images).map(i=>i.complete ? 0 : new Promise(r=>{ i.onload=i.onerror=r; }))); if(window.__deck) __deck.pause();`);
  let h = await js("return Math.ceil(document.documentElement.scrollHeight)");
  await size(h); await wait(600);
  h = await js("return Math.ceil(document.documentElement.scrollHeight)");
  await size(h); await wait(900);
  await win.webContents.capturePage(undefined, { stayHidden: true }); await wait(300);
  const im = await win.webContents.capturePage(undefined, { stayHidden: true });
  fs.writeFileSync(path.join(OUT, "full-" + W + ".png"), im.toPNG());
  console.log("saved full-" + W + " " + im.getSize().width + "x" + im.getSize().height);
  app.exit(0);
}).catch(e => { console.error("FAILED", e); app.exit(1); });
