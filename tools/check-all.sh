#!/usr/bin/env bash
# Runs tools/check-site.js for each page at each size (one hidden window each) and prints one line per run.
cd "$(dirname "$0")/.." || exit 1
E=../ProjectTrackerDesktop/node_modules/electron/dist/electron.exe
for page in ${PAGES:-index.html tracker.html drive.html}; do
  for size in ${SIZES:-p320 p375 p390 p430 tablet computer}; do
    SIZE=$size PAGE=$page "$E" tools/check-site.js 2>&1 | grep -E '^\{|FAILED' | node -e '
      let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{ if(!s.startsWith("{")){console.log(s.trim());return;}
        const j=JSON.parse(s), f=j.forms||{}, show=a=>a&&a.length?JSON.stringify(a):"none", fs=x=>x?(x.sent?"ok":"PROBLEM "+JSON.stringify(x)):"-";
        console.log([j.page.padEnd(10), j.size.padEnd(14), "sideways:"+j.sideways, "out:"+show(j.out), "cut:"+show(j.cut), "tiny:"+show(j.tiny),
          (parseInt(j.size.slice(1))<=560||/^p/.test(j.size)?"under44:"+show(j.under44):""), "headline:"+j.headlineLines+" lines "+j.h1px+"px", "smalltext:"+show(j.smallText),
          "slideshow:"+j.slideshowMovedTo, "cards shuffle:"+j.fanTurns, "request:"+fs(f.request), "application:"+fs(f.application), "errors:"+(j.errors==="none"?"none":JSON.stringify(j.errors))].filter(Boolean).join(" | "));
      });'
  done
done
