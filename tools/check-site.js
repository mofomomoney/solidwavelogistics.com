/* Checks the site in a HIDDEN window (nothing shows on screen), one page at one size per run, and takes a
   picture of the whole page (in one piece) into tools/shots/<page>-<size>.png. Run with Electron from this folder:
     SIZE=p390 PAGE=index.html ..\ProjectTrackerDesktop\node_modules\electron\dist\electron.exe tools\check-site.js
   Sizes: computer (1440), tablet (820), and phones 430, 390, 375 and 320 wide. Pages: index.html, drive.html.
   It looks for: errors on the page, anything wider than the screen or cut off, the fonts and pictures loading,
   the headline's two lines, buttons and boxes too small for a finger, the slideshow moving on by itself, and both
   forms (sent empty, with one wrong box, then right: the email is written and the page says what's next; no
   email app opens). */
"use strict";
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });
app.setPath("userData", path.join(require("os").tmpdir(), "solidwave-site-check"));
const SIZES = { computer: [1440, 900], tablet: [820, 1180], p430: [430, 932], p390: [390, 844], p375: [375, 812], p320: [320, 640] };
const wait = ms => new Promise(r => setTimeout(r, ms));

async function check(name, W, H, page) {
  const phone = W <= 560;
  const win = new BrowserWindow({ show: false, width: W, height: H, useContentSize: true, enableLargerThanScreen: true, webPreferences: { backgroundThrottling: false } });
  const errors = [];
  win.webContents.on("console-message", e => { if (e.level === "error") errors.push(e.message); });
  win.webContents.on("will-navigate", e => e.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  await Promise.race([win.loadFile(path.join(root, page)), wait(20000)]);
  const dbg = win.webContents.debugger; dbg.attach("1.3");
  const size = async h => { win.setContentSize(W, h); await dbg.sendCommand("Emulation.setDeviceMetricsOverride", { width: W, height: h, deviceScaleFactor: 1, mobile: false }); };
  await size(H);
  await win.webContents.insertCSS("html::-webkit-scrollbar{display:none} html{scrollbar-width:none}");
  const js = code => win.webContents.executeJavaScript("(async()=>{" + code + "})()", true);
  const info = await js(`await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,8000))]); await new Promise(r=>setTimeout(r,400));
    document.documentElement.style.scrollBehavior="auto";
    const vw=document.documentElement.clientWidth, say=e=>(e.id ? "#"+e.id : "")+(e.className && typeof e.className==="string" ? "."+e.className.trim().split(/\\s+/).join(".") : "")||e.tagName.toLowerCase();
    const skip=e=>e.closest(".trap,[hidden],.zoom") || (e.closest(".slide") && e.closest(".slide").getAttribute("aria-hidden")==="true") || getComputedStyle(e).display==="none";
    const scrollers=["deck","deck-tabs","track","pic","win"];
    const out=[], cut=[];
    [].slice.call(document.querySelectorAll("body *")).forEach(e=>{
      if(skip(e)) return; const r=e.getBoundingClientRect(); if(!r.width || !r.height) return;
      if(r.right>vw+1 || r.left<-1) out.push(say(e)+" "+Math.round(r.left)+"→"+Math.round(r.right));
      const cs=getComputedStyle(e);
      if(e.scrollWidth>e.clientWidth+1 && cs.overflowX!=="visible" && !scrollers.some(c=>e.classList.contains(c)) && !/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)) cut.push(say(e)+" "+e.scrollWidth+">"+e.clientWidth);
    });
    const tap=[].slice.call(document.querySelectorAll("a,button,input,select,textarea")).filter(e=>!skip(e)).map(e=>({e:e,r:e.getBoundingClientRect()})).filter(x=>x.r.width>0 && x.r.height>0);
    const tiny=tap.filter(x=>x.r.height<24 || x.r.width<24).map(x=>say(x.e)+" "+Math.round(x.r.width)+"x"+Math.round(x.r.height));
    const small=tap.filter(x=>x.r.height<44 && !x.e.closest("p,.msg")).map(x=>say(x.e)+" "+Math.round(x.r.width)+"x"+Math.round(x.r.height));
    const h1=document.querySelector("h1"), lh=parseFloat(getComputedStyle(h1).lineHeight)||parseFloat(getComputedStyle(h1).fontSize);
    const minFont=[].slice.call(document.querySelectorAll("p,label,li,span,a,button,small,b")).filter(e=>!skip(e) && e.getBoundingClientRect().height>0 && e.textContent.trim() && !e.closest(".zoom,.win .tb,.eyebrow,.kicker"))
      .map(e=>({e:e,f:parseFloat(getComputedStyle(e).fontSize)})).filter(x=>x.f<14).map(x=>say(x.e)+" "+x.f+"px");
    return {h:Math.ceil(document.documentElement.scrollHeight), sideways:document.documentElement.scrollWidth>vw, out:out.slice(0,8), cut:cut.slice(0,8),
      fonts:document.fonts.check('800 40px Saira') && document.fonts.check('400 16px "IBM Plex Sans"'),
      brokenPictures:[].slice.call(document.images).filter(i=>i.loading!=="lazy" && (!i.complete || !i.naturalWidth)).length,
      tiny:tiny.slice(0,6), under44:small.slice(0,10), headlineLines:Math.round(h1.getBoundingClientRect().height/lh), h1px:parseFloat(getComputedStyle(h1).fontSize), smallText:minFont.slice(0,6)};`);
  /* the slideshow moves on by itself once it's on screen */
  const moved = await js(`const s=document.querySelector(".deck"); if(!s) return null; s.scrollIntoView({block:"center"}); await new Promise(r=>setTimeout(r,8000));
    return [].slice.call(document.querySelectorAll("#slide-0 .topic")).findIndex(b=>b.classList.contains("on"));`);
  const forms = await js(`window.__openMail=h=>{ window.__mailed=h; };
    const out={}, set=(f,k,v)=>{ const e=f.elements[k]; e.value=v; e.dispatchEvent(new Event("input",{bubbles:true})); e.dispatchEvent(new Event("change",{bubbles:true})); };
    const run=(id, good, wrong)=>{
      const f=document.getElementById(id); if(!f) return null; const r={}; window.__mailed="";
      f.requestSubmit(); r.empty=f.querySelectorAll('[aria-invalid="true"]').length+" marked, "+f.querySelectorAll(".err").length+" notes, focus on "+(document.activeElement && document.activeElement.name);
      Object.keys(good).forEach(k=>set(f,k,good[k])); set(f, wrong[0], wrong[1]);
      f.requestSubmit(); r.oneWrong=[].slice.call(f.querySelectorAll(".err")).map(e=>e.textContent).join(" / ");
      set(f, wrong[0], good[wrong[0]]); f.requestSubmit();
      r.sent=!!window.__mailed && f.querySelectorAll('[aria-invalid="true"],.err').length===0 && /Almost done/.test(f.querySelector(".msg").textContent);
      return r; };
    out.request=run("inquire", {name:"Jordan Avery", org:"Example Freight Co", email:"jordan@example.com", phone:"", region:"Kansas City area", details:"Two routes, Monday to Saturday, starting next month."}, ["email","jordan@example"]);
    out.application=run("apply", {name:"Sam Rivera", phone:"(555) 555-0142", where:"64105", years:"3 to 5", equipment:"Tractor-trailer"}, ["phone","555-0142"]);
    return out;`);
  /* the forms back as they were, then the whole page in one piece (the window as tall as the page) */
  await js(`[].slice.call(document.querySelectorAll("form")).forEach(f=>f.reset()); [].slice.call(document.querySelectorAll(".msg")).forEach(m=>{ m.textContent=""; m.className="msg"; });
    [].slice.call(document.querySelectorAll(".err")).forEach(e=>e.remove()); [].slice.call(document.querySelectorAll("[aria-invalid]")).forEach(e=>e.removeAttribute("aria-invalid"));
    [].slice.call(document.images).forEach(i=>i.loading="eager"); await Promise.all([].slice.call(document.images).map(i=>i.complete ? 0 : new Promise(r=>{ i.onload=i.onerror=r; })));
    if(window.__deck){ __deck.go(0,0); __deck.pause(); } window.scrollTo(0,0);`);
  await win.webContents.insertCSS("*{transition:none!important}");
  await size(info.h); await wait(700);
  await win.webContents.capturePage(undefined, { stayHidden: true }); await wait(300);
  const im = await win.webContents.capturePage(undefined, { stayHidden: true });
  fs.writeFileSync(path.join(OUT, page.replace(".html", "") + "-" + name + ".png"), im.toPNG());
  win.destroy();
  return { page, size: name + " " + W + "px", ...info, slideshowMovedTo: moved == null ? "-" : moved + 1, forms, errors: errors.length ? errors : "none" };
}

app.whenReady().then(async () => {
  const which = (process.env.SIZE || "p390"), page = process.env.PAGE || "index.html";
  if (!SIZES[which]) throw new Error("no size called " + which);
  console.log(JSON.stringify(await check(which, SIZES[which][0], SIZES[which][1], page)));
  app.exit(0);
}).catch(e => { console.error("FAILED", e && e.stack || e); app.exit(1); });
