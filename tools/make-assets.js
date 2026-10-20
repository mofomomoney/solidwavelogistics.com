/* The site's small pictures, made in a HIDDEN window (nothing shows on screen). Run with Electron from the
   SolidWave Tracker folder:  ..\ProjectTrackerDesktop\node_modules\electron\dist\electron.exe tools\make-assets.js
   - assets/img/wave-small.png: the wave alone, small, for the app window's title bar in the slideshow
   - assets/img/favicon-32.png and icon-180.png: the browser tab and phone home-screen icons (from icon.png)
   - assets/img/og.png: the picture shown when the site's link is shared (1200 x 630) */
"use strict";
const { app, BrowserWindow, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const img = f => path.join(root, "assets", "img", f);
app.setPath("userData", path.join(require("os").tmpdir(), "solidwave-site-assets"));
const wait = ms => new Promise(r => setTimeout(r, ms));

app.whenReady().then(async () => {
  /* small copies */
  const wave = nativeImage.createFromPath(path.join(__dirname, "wave-dark-full.png"));
  fs.writeFileSync(img("wave-small.png"), wave.resize({ height: 44, quality: "best" }).toPNG());
  const icon = nativeImage.createFromPath(img("icon.png"));
  fs.writeFileSync(img("favicon-32.png"), icon.resize({ width: 32, height: 32, quality: "best" }).toPNG());
  fs.writeFileSync(img("icon-180.png"), icon.resize({ width: 180, height: 180, quality: "best" }).toPNG());

  /* the link picture: the logo on navy, the promise in the logo's letters */
  const logo = "data:image/png;base64," + fs.readFileSync(img("logo-dark.png")).toString("base64");
  const html = `<!doctype html><html><head><meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@500&family=Saira:wdth,wght@100..125,500..900&display=swap" rel="stylesheet">
    <style>*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;overflow:hidden}
    body{background:radial-gradient(900px 500px at 100% 100%,#0046C2 0%,#001334 62%);color:#fff;font-family:"IBM Plex Sans",sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
    img{height:120px;width:auto}
    h1{font:800 62px/1.02 "Saira",sans-serif;font-stretch:125%;text-transform:uppercase;letter-spacing:.004em}
    h1 span{color:#3EA0FF}
    p{font-size:26px;color:#C9D6EA;margin-top:18px}</style></head>
    <body><img src="${logo}" alt=""><div><h1>The last-mile partner<br><span>contractors count on.</span></h1><p>Vetted Class A drivers and the equipment each route needs.</p></div></body></html>`;
  const tmp = path.join(require("os").tmpdir(), "solidwave-og.html");
  fs.writeFileSync(tmp, html);
  const win = new BrowserWindow({ show: false, width: 1200, height: 630, useContentSize: true, webPreferences: { backgroundThrottling: false } });
  await win.loadFile(tmp);
  const dbg = win.webContents.debugger; dbg.attach("1.3");
  await dbg.sendCommand("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  await win.webContents.executeJavaScript("Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,8000))]).then(()=>document.fonts.check('800 62px Saira'))", true);
  await wait(800);
  await win.webContents.capturePage(undefined, { stayHidden: true }); await wait(300);
  const shot = await win.webContents.capturePage(undefined, { stayHidden: true });
  fs.writeFileSync(img("og.png"), shot.toPNG());
  for (const f of ["wave-small.png", "favicon-32.png", "icon-180.png", "og.png"]) { const s = nativeImage.createFromPath(img(f)).getSize(); console.log(f, s.width + "x" + s.height, Math.round(fs.statSync(img(f)).size / 1024) + " KB"); }
  app.exit(0);
}).catch(e => { console.error("FAILED", e && e.stack || e); app.exit(1); });
