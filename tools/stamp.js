/* Puts a short code from site.css and site.js on every page's links to them (?v=...), so after a change browsers load
   the new look and script instead of the copy they kept (the owner, 2026-10-20: "ive hit f5 multiple times").
   Run after changing assets/css/site.css or assets/js/site.js:  node tools/stamp.js */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const root = path.join(__dirname, "..");
const files = ["assets/css/site.css", "assets/js/site.js"];
const code = f => crypto.createHash("sha1").update(fs.readFileSync(path.join(root, f))).digest("hex").slice(0, 8);
for (const page of ["index.html", "tracker.html", "drive.html", "404.html"]) {
  const p = path.join(root, page);
  let h = fs.readFileSync(p, "utf8"), n = 0;
  for (const f of files) {
    const re = new RegExp("(/?)" + f.replace(/[.]/g, "[.]") + "([?]v=[0-9a-f]+)?", "g");
    h = h.replace(re, (m, slash) => { n++; return slash + f + "?v=" + code(f); });
  }
  fs.writeFileSync(p, h);
  console.log(page + ": " + n + " links stamped");
}
