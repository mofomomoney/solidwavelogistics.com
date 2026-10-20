/* Real pictures of SolidWave Tracker for the website's slideshow: three screens from the test copy (test/harness on
   127.0.0.1:8761, pretend sign-in), sharp (2x), all the same size (1260 x 900), with where each highlight goes.
   Made-up people only, and nothing a contractor shouldn't see: no store, company or rental company names, no rates
   or rent. HIDDEN window. Writes assets/app/slide-*.png and assets/app/slides.json. */
"use strict";
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "assets", "img", "app");   /* the pictures go straight into the site */
fs.mkdirSync(OUT, { recursive: true });
app.setPath("userData", path.join(require("os").tmpdir(), "solidwave-site-app-shots"));
const W = 1304, H = 944, DPR = 2;   /* a page window is 1260 wide at this size; the list is shown at 1304 x 931 (the same shape) */
const wait = ms => new Promise(r => setTimeout(r, ms));
app.whenReady().then(run).catch(err => { console.error("FAILED", err && err.stack || err); app.exit(1); });

async function run() {
  /* sharp: a window twice the size, zoomed in twice, so the page is laid out at 1260 wide with twice the pixels */
  const win = new BrowserWindow({ show: false, width: W * DPR, height: H * DPR, useContentSize: true, enableLargerThanScreen: true, webPreferences: { backgroundThrottling: false, zoomFactor: DPR } });
  const errors = [];
  win.webContents.on("console-message", e => { if (e.level === "error") errors.push(e.message); });
  await win.loadURL("http://127.0.0.1:8761/index.html?v=slides" + Date.now());
  const dbg = win.webContents.debugger; dbg.attach("1.3");
  await dbg.sendCommand("Emulation.setDeviceMetricsOverride", { width: W * DPR, height: H * DPR, deviceScaleFactor: 1, mobile: false });
  win.webContents.setZoomFactor(DPR);
  const js = code => win.webContents.executeJavaScript("(async()=>{" + code + "})()", true);
  /* the Routes list's pay column stays off the picture (its heading too) */
  await win.webContents.insertCSS(`*{transition:none!important;animation:none!important;caret-color:transparent!important} ::-webkit-scrollbar{display:none}
    .lrows.route .lr-main > span:nth-child(5), .lhead.route .lh-main > span:nth-child(5){visibility:hidden}`);
  await js(`await new Promise(r=>setTimeout(r,800));
    window.Notification = class { static get permission(){ return "denied"; } static requestPermission(){ return Promise.resolve("denied"); } };
    window.offerOldData=()=>{};
    const Wt=ms=>new Promise(r=>setTimeout(r,ms)), rnd=()=>Math.random().toString(36).slice(2,10);
    const em='slides'+rnd()+'@example.test', pw='Pw-'+rnd()+rnd()+'!';
    const B=re=>Array.from(document.querySelectorAll('#gate button')).find(b=>re.test(b.textContent));
    B(/Create your account/).click(); await Wt(300);
    const set=(id,v)=>{const i=document.getElementById(id); i.value=v; i.dispatchEvent(new Event('input',{bubbles:true}));};
    set('gEmail',em); set('gPass',pw); set('gPass2',pw);
    B(/Create my account/).click(); await Wt(900);
    window.__cloud.verify(em);
    B(/clicked the link/).click(); await Wt(1500);
    window.offerOldData=()=>{};
    loadExample(); await Wt(500); hideToast();
    /* for a public page: no store, company or rental company names, no rates or rent */
    S.stores.forEach(s=>{ s.retailer=""; });
    S.routes.forEach(r=>{ r.company=""; r.pay={}; });
    const rename={Penske:"Plains Truck Rental", Ryder:"Northway Leasing"};
    S.trucks.forEach(t=>{ if(rename[t.vendor]) t.vendor=rename[t.vendor]; (t.log||[]).forEach(l=>{ l.text=String(l.text).replace(/Penske corporate/g, "The rental office").replace(/Penske/g, "the rental company"); }); });
    S.tasks.forEach(k=>{ k.title=String(k.title).replace(/Penske/g, "the rental company"); });
    /* Luis, part way through being vetted: on a route, every detail filled in, his medical card due soon */
    const d=S.drivers.find(x=>x.name==="Luis Ortega"), r=S.routes.find(x=>String(x.num)==="4401");
    r.driverId=d.id; d.email="luis.ortega@example.com"; d.cdl=Object.assign({}, d.cdl, {cls:"A", med:isoPlus(20)}); d.pay={basis:"route", rate:"250"}; d.start=isoPlus(10);
    save();`);
  const R = sel => js(`const e=document.querySelector(${JSON.stringify(sel)}); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.left, y:r.top, w:r.width, h:r.height};`);
  const shoot = async (name, box) => {
    await wait(700);
    await win.webContents.capturePage(undefined, { stayHidden: true }); await wait(300);
    const full = await win.webContents.capturePage(undefined, { stayHidden: true });
    const img = full.crop({ x: Math.round(box.x * DPR), y: Math.round(box.y * DPR), width: Math.round(box.w * DPR), height: Math.round(box.h * DPR) });
    fs.writeFileSync(path.join(OUT, name + ".png"), img.toPNG());
    console.log("saved", name, img.getSize().width + "x" + img.getSize().height);
  };
  const rel = (r, box, pad) => r && { x: +(r.x - box.x - (pad || 0)).toFixed(1), y: +(r.y - box.y - (pad || 0)).toFixed(1), w: +(r.w + 2 * (pad || 0)).toFixed(1), h: +(r.h + 2 * (pad || 0)).toFixed(1) };
  const slides = [];

  /* 1. Drivers: Luis's page */
  await js(`go("drivers"); await new Promise(r=>setTimeout(r,300)); openSheet("driver", S.drivers.find(x=>x.name==="Luis Ortega").id); await new Promise(r=>setTimeout(r,700)); if(document.activeElement) document.activeElement.blur();`);
  let sheet = await R("#sheet .sheet") || await R(".sheet"), box = { x: sheet.x, y: sheet.y, w: sheet.w, h: Math.min(H - sheet.y, 900) };
  box = { x: sheet.x, y: sheet.y, w: 1260, h: 900 };
  if (sheet.x !== 0) console.log("note: the page sits at", sheet.x, sheet.y);
  await shoot("slide-drivers", box);
  slides.push({ img: "slide-drivers.png", w: 1260, h: 900, topics: [rel(await R("#sheet .stbar"), box, 6), rel(await R("#sheet .td-sec.att"), box), rel(await R("#sheet .td-sec.stage"), box)] });

  /* 2. Routes: the list, every store's routes with who and what is on each */
  await js(`if(sheet.open) closeSheet(); go("routes"); await new Promise(r=>setTimeout(r,500)); window.scrollTo(0,0); if(document.activeElement) document.activeElement.blur();`);
  box = { x: 0, y: 0, w: 1304, h: 931 };
  await shoot("slide-routes", box);
  const cols = await js(`const g=document.querySelector(".lgroup"), hd=g.querySelector(".lhead .lh-main"), a=hd.children[2].getBoundingClientRect(), b=hd.children[3].getBoundingClientRect(), gr=g.getBoundingClientRect(), lh=g.querySelector(".lhead").getBoundingClientRect();
    return {x:a.left-10, y:lh.top-4, w:(b.left+b.width*0.55)-(a.left-10), h:gr.bottom-lh.top+8};`);
  const gap = await js(`const c=document.querySelector(".lrows.route .lc-need"); const li=c.closest("li").getBoundingClientRect(); return {x:li.left, y:li.top, w:li.width, h:li.height};`);
  slides.push({ img: "slide-routes.png", w: 1304, h: 931, topics: [rel(await R("#lTabs"), box, 8), rel(cols, box), rel(gap, box, 2)] });

  /* 3. Equipment: a truck's page (T-01, in service) */
  await js(`go("trucks"); await new Promise(r=>setTimeout(r,300)); openSheet("truck", S.trucks.find(x=>x.unit==="T-01").id); await new Promise(r=>setTimeout(r,700)); if(document.activeElement) document.activeElement.blur();`);
  sheet = await R("#sheet .sheet") || await R(".sheet"); box = { x: sheet.x, y: sheet.y, w: 1260, h: 900 };
  await shoot("slide-equipment", box);
  const title = await js(`const a=document.querySelector("#sheet .sh-ident").getBoundingClientRect(), b=document.querySelector("#sheet .sh-tt").getBoundingClientRect(); return {x:a.left-8, y:a.top-8, w:(b.right)-(a.left)+24, h:Math.max(a.height,b.height)+16};`);
  slides.push({ img: "slide-equipment.png", w: 1260, h: 900, topics: [rel(title, box), rel(await R("#sheet .stbar"), box, 6), rel(await R("#sheet .td-sec.att"), box)] });

  /* 4. Documents: made-up papers, each with the driver or store it goes with */
  await js(`if(sheet.open) closeSheet();
    const D=n=>S.drivers.find(x=>x.name===n), st=n=>S.stores.find(x=>String(x.num)===n), day=864e5, now=Date.now();
    const doc=(name, kind, mime, kb, owner, tags, ago)=>{ const ext=name.split(".").pop(); S.docs.push({id:uid("d"), name:name, ext:ext, mime:mime, kind:kind, size:kb*1024, file:"", parts:0,
      storeId:owner && owner.num ? owner.id : "", driverId:owner && owner.name ? owner.id : "", tags:tags, created:now-ago*day, updated:now-ago*day}); };
    doc("CDL - Luis Ortega.pdf", "pdf", "application/pdf", 412, D("Luis Ortega"), ["CDL"], 0.2);
    doc("DOT medical card - Luis Ortega.jpg", "image", "image/jpeg", 1830, D("Luis Ortega"), ["Medical card"], 0.3);
    doc("Drug test result - Marcus Thompson.pdf", "pdf", "application/pdf", 188, D("Marcus Thompson"), ["Drug test"], 1);
    doc("Certificate of insurance - Store 1001.pdf", "pdf", "application/pdf", 640, st("1001"), ["Insurance"], 2);
    doc("Driving record (MVR) - Dana Brooks.pdf", "pdf", "application/pdf", 256, D("Dana Brooks"), ["MVR"], 3);
    doc("Dock hours and store rules - Store 1002.docx", "word", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 96, st("1002"), ["Store info"], 4);
    doc("CDL - Marcus Thompson.pdf", "pdf", "application/pdf", 398, D("Marcus Thompson"), ["CDL"], 6);
    doc("Delivery agreement - Store 1001.pdf", "pdf", "application/pdf", 1220, st("1001"), ["Agreement"], 9);
    S.ui.docKind=""; S.ui.docStore=""; S.ui.docTag=""; S.ui.docQ="";
    save(); go("docs"); await new Promise(r=>setTimeout(r,600)); window.scrollTo(0,0); if(document.activeElement) document.activeElement.blur();`);
  box = { x: 0, y: 0, w: 1304, h: 931 };
  await shoot("slide-documents", box);
  const docRows = await js(`const ls=[].slice.call(document.querySelectorAll(".dlines > li")); const a=ls[0].getBoundingClientRect(), b=ls[Math.min(4, ls.length-1)].getBoundingClientRect(); return {x:a.left-6, y:a.top-4, w:a.width+12, h:b.bottom-a.top+8};`);
  const docOwner = await js(`const li=document.querySelectorAll(".dlines > li")[3], r=li.getBoundingClientRect(); return {x:r.left-6, y:r.top-2, w:r.width+12, h:r.height+4};`);
  slides.push({ img: "slide-documents.png", w: 1304, h: 931, topics: [rel(docRows, box), rel(docOwner, box), rel(await R(".docbar"), box, 8)] });

  /* 5. Financials: a healthy example week. Three routes running, each with its driver and truck, paid by a made-up contractor */
  await js(`const rr=n=>S.routes.find(x=>String(x.num)===n), T=u=>S.trucks.find(x=>x.unit===u), D=n=>S.drivers.find(x=>x.name===n);
    S.routes.forEach(r=>{ r.company="Northline Freight"; });
    [["1142",650],["1150",650],["2210",700]].forEach(p=>{ const r=rr(p[0]); r.pay={basis:"day", rate:String(p[1])}; r.stage="running"; r.start=isoPlus(-21); });
    T("T-05").stage="service"; T("T-02").stage="service"; rr("1150").truckId=T("T-05").id; rr("2210").truckId=T("T-02").id;
    const k=D("Keisha Grant"); k.stage="active"; k.pay={basis:"route", rate:"250"}; rr("2210").driverId=k.id; D("Dana Brooks").stage="active";
    const u=MU(); u.tab="week"; u.week=""; save(); go("money"); await new Promise(r=>setTimeout(r,700)); window.scrollTo(0,0); if(document.activeElement) document.activeElement.blur();`);
  await shoot("slide-financials", box);
  const heads = await js(`const h=[].slice.call(document.querySelectorAll(".mw-heads > *")); if(!h.length) return null; const a=h[0].getBoundingClientRect(), b=h[h.length-1].getBoundingClientRect(); return {x:a.left-6, y:a.top-6, w:b.right-a.left+12, h:Math.max(a.height,b.height)+12};`);
  /* the routes' rows (from the first store's line to the last route), and the costs (from Drivers, fuel, insurance to Left over) */
  const span = (from, to) => js(`const rows=[].slice.call(document.querySelectorAll(".mw-t > *")), txt=e=>e.textContent.replace(/\\s+/g," ").trim();
    const i=rows.findIndex(e=>${from}.test(txt(e))), j=rows.findIndex(e=>${to}.test(txt(e))); if(i<0||j<0) return null;
    const a=rows[i].getBoundingClientRect(), b=rows[j].getBoundingClientRect(); return {x:a.left-4, y:a.top-3, w:a.width+8, h:b.bottom-a.top+6};`);
  const routesRows = await span("/^#1001/", "/^2210/");
  const costRows = await span("/^Drivers, fuel/", "/^Left over/");
  console.log("financials found:", !!heads, !!routesRows, !!costRows);
  slides.push({ img: "slide-financials.png", w: 1304, h: 931, topics: [rel(heads, box), rel(routesRows, box), rel(costRows, box)] });

  fs.writeFileSync(path.join(__dirname, "slides.json"), JSON.stringify({ w: 1260, h: 900, slides }, null, 1));   /* then: node tools/showcase.js */
  console.log(JSON.stringify(slides.map(s => s.topics)));
  console.log("errors:", errors.length ? errors.join(" | ") : "none");
  app.exit(0);
}
