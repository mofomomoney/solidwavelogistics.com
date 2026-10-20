/* Checks the site in a HIDDEN window (nothing shows on screen) at a computer's, a tablet's and a phone's width, and
   takes a full-page picture of each into tools/shots/. Run with Electron from this folder:
     ..\ProjectTrackerDesktop\node_modules\electron\dist\electron.exe tools\check-site.js
   It looks for: errors on the page, sideways scrolling, the fonts loading, every picture loading, the slideshow
   moving on by itself, the application saying what's missing, and any button smaller than a finger. */
"use strict";
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });
app.setPath("userData", path.join(require("os").tmpdir(), "solidwave-site-check"));
const SIZES = [[1440, 900, "computer"], [820, 1180, "tablet"], [390, 844, "phone"]];
const wait = ms => new Promise(r => setTimeout(r, ms));

async function check(W, H, name) {
  const win = new BrowserWindow({ show: false, width: W, height: H, useContentSize: true, webPreferences: { backgroundThrottling: false } });
  const errors = [];
  win.webContents.on("console-message", e => { if (e.level === "error") errors.push(e.message); });
  await Promise.race([win.loadFile(path.join(root, "index.html")), wait(20000)]);
  const dbg = win.webContents.debugger; dbg.attach("1.3");
  await dbg.sendCommand("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });   /* phone mode scrolls a layer the pictures don't follow; the layout only needs the width */
  await win.webContents.insertCSS("html::-webkit-scrollbar{display:none} html{scrollbar-width:none}");
  const js = code => win.webContents.executeJavaScript("(async()=>{" + code + "})()", true);
  const info = await js(`await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,8000))]); await new Promise(r=>setTimeout(r,400));
    document.documentElement.style.scrollBehavior="auto";
    const small=[].slice.call(document.querySelectorAll("a,button,input,select")).filter(e=>{ const r=e.getBoundingClientRect(), cs=getComputedStyle(e);
      return r.width>0 && r.height>0 && cs.visibility!=="hidden" && !e.closest(".trap,[hidden],[aria-hidden=true]") && (r.height<24 || r.width<24); }).map(e=>(e.className||e.tagName)+" "+Math.round(e.getBoundingClientRect().width)+"x"+Math.round(e.getBoundingClientRect().height));
    return {h:Math.ceil(document.documentElement.scrollHeight), sideways:document.documentElement.scrollWidth>document.documentElement.clientWidth,
      saira:document.fonts.check('800 40px Saira'), plex:document.fonts.check('400 16px "IBM Plex Sans"'),
      brokenPictures:[].slice.call(document.images).filter(i=>i.loading!=="lazy" && (!i.complete || !i.naturalWidth)).length, small:small.slice(0,6)};`);
  /* the slideshow moves on by itself once it's on screen */
  const moved = await js(`document.getElementById("how").scrollIntoView(); await new Promise(r=>setTimeout(r,5600));
    return [].slice.call(document.querySelectorAll("#slide-0 .topic")).findIndex(b=>b.classList.contains("on"));`);
  /* the application says what's missing */
  const formSays = await js(`window.scrollTo(0,0); const f=document.getElementById("apply"); f.requestSubmit(); return f.querySelector(".msg").textContent;`);
  await js(`document.querySelector(".msg").textContent=""; [].slice.call(document.querySelectorAll("[aria-invalid]")).forEach(e=>e.removeAttribute("aria-invalid")); window.scrollTo(0,0);`);
  /* the whole page, a screen at a time, joined (the top bar stays put for the pictures, so it shows once) */
  await win.webContents.insertCSS(".bar{position:static!important} html{scroll-behavior:auto!important}");
  await js(`[].slice.call(document.images).forEach(i=>i.loading="eager"); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,900));`);
  await win.webContents.capturePage(undefined, { stayHidden: true });   /* the first grab can be an old frame */
  const tiles = [];
  for (let y = 0; y < info.h; y += H) {
    const top = Math.min(y, Math.max(0, info.h - H));
    await js("window.scrollTo(0," + top + "); await new Promise(r=>setTimeout(r,60)); return scrollY"); await wait(450);
    const im = await win.webContents.capturePage(undefined, { stayHidden: true });
    tiles.push({ top: top, data: im.toPNG().toString("base64") });
  }
  const joined = await js(`const T=${JSON.stringify(tiles)}, c=document.createElement('canvas'); c.width=${W}; c.height=${info.h}; const x=c.getContext('2d');
    for(const t of T){ const im=new Image(); im.src='data:image/png;base64,'+t.data; await im.decode(); x.drawImage(im,0,t.top); } return c.toDataURL('image/png');`);
  fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(joined.split(",")[1], "base64"));
  win.destroy();
  return { size: name, ...info, slideshowMovedTo: moved + 1, formSays, errors: errors.length ? errors : "none" };
}

app.whenReady().then(async () => {
  const which = (process.env.SIZE || "").toLowerCase();
  for (const s of SIZES) if (!which || s[2] === which) console.log(JSON.stringify(await check(...s)));
  app.exit(0);
}).catch(e => { console.error("FAILED", e && e.stack || e); app.exit(1); });
