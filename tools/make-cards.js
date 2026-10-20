/* The three app pictures for the homepage's fan of cards (Our operation): smaller copies of the slideshow's
   pictures, 800 wide, so the homepage stays light. HIDDEN (no window). Run with Electron from this folder:
     ..\ProjectTrackerDesktop\node_modules\electron\dist\electron.exe tools\make-cards.js */
"use strict";
const { app, nativeImage } = require("electron");
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "assets", "img", "app");
app.whenReady().then(() => {
  for (const [from, to] of [["slide-drivers.png", "card-drivers.jpg"], ["slide-routes.png", "card-routes.jpg"], ["slide-equipment.png", "card-fleet.jpg"]]) {
    const im = nativeImage.createFromPath(path.join(dir, from)).resize({ width: 800, quality: "best" });
    fs.writeFileSync(path.join(dir, to), im.toJPEG(88));
    const s = im.getSize();
    console.log(to, s.width + "x" + s.height, Math.round(fs.statSync(path.join(dir, to)).size / 1024) + " KB");
  }
  /* the homepage's links to the cards carry a code from each picture, so a new picture loads fresh */
  const page = path.join(__dirname, "..", "index.html"); let h = fs.readFileSync(page, "utf8");
  for (const f of ["card-drivers.jpg", "card-routes.jpg", "card-fleet.jpg"]) {
    const v = require("crypto").createHash("sha1").update(fs.readFileSync(path.join(dir, f))).digest("hex").slice(0, 8);
    h = h.replace(new RegExp("assets/img/app/" + f.replace(/[.]/g, "[.]") + "([?]v=[0-9a-f]+)?", "g"), "assets/img/app/" + f + "?v=" + v);
  }
  fs.writeFileSync(page, h); console.log("index.html: card links carry their codes");
  app.exit(0);
}).catch(e => { console.error("FAILED", e); app.exit(1); });
