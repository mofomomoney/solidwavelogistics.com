SOLID WAVE LOGISTICS WEBSITE — how this folder works

The company website for solidwavelogistics.com (bought by the owner at Porkbun on 2026-10-19; it renews each
October). One page, no build step: index.html, assets/css/site.css and assets/js/site.js. It's kept here, outside
OneDrive, like the app (ProjectTrackerDesktop), with its history in git.

THE PAGES (2026-10-20: the owner's brief: say what we do, with substance, before the software; each part says
something new; then "put the tracker on a separate page on its own")
  index.html, top to bottom:
  - The top: "Your routes. Our responsibility." and one sentence (we supply and manage the fleet and Class A CDL
    drivers that cover your contracted routes), Partner with SolidWave, a quiet driver link. On the logo's wave:
    How we work, three steps (the partnership, in order).
  - What we do (#what-we-do): "Last-mile delivery. Fully managed." The subcontractor intro, the three services
    (contracted route coverage; fleet and driver solutions; daily operations management), and on navy "Why
    subcontract your routes to SolidWave?" with its paragraph and six points. No savings claims or guarantees.
  - Our operation (#operation): "Our operation. Our technology." with the Built in-house label, what Tracker is,
    and See SolidWave Tracker (its own page).
  - Let's cover your routes (#contact): the request form and the email link.
  - Drive with SolidWave (#drive): one line and Apply now (the application is drive.html).
  - The bottom: logo, links, the email, the year.
  tracker.html: the SolidWave Tracker page, written by tools/showcase.js: the same heading and line, then the
    slideshow (Routes, Drivers, Fleet, two points each; on a phone one at a time, dots, swipe, the picture moves
    in on the lit part), and Partner with SolidWave. Documents and the Forecast stay in the folder, off the page.
  drive.html: the recruiting page for Class A drivers (the owner, 2026-10-20, from a flyer: "try hard to recruit
    drivers", trucks provided, Moffett training, worded as the subcontractor): "Class A drivers wanted. We provide
    the truck.", Driver benefits: six (truck provided; competitive pay; weekly pay; consistent routes; up to 6
    days a week; local routes), what you need (Moffett or forklift experience preferred), what you need, what
    happens next, and the application (name, phone, city or ZIP, years with a Class A, equipment). Weekly pay and
    up to 6 days a week come from the flyer.
  Both forms check every box and say what's wrong under it. There's no server behind the site, so sending one
  opens the visitor's own email with everything filled in, addressed to info@; if nothing opens, they can copy
  it. (Applications going straight into SolidWave Tracker is waiting on the owner.)

WHAT SOLIDWAVE IS (so the words stay right; the owner's briefs, 2026-10-20)
  A last-mile delivery subcontractor: an outsourced fleet and driver operations partner for contracted routes: a business needs delivery
  routes covered, and SolidWave supplies and manages the vehicles and drivers to cover them. Not defined by any
  kind of truck or a fleet on hand (whatever equipment the routes need), and not a trucking company, rental
  business, broker or staffing agency. Drivers: Class A CDL only (the owner, 2026-10-20,
  over the brief's line that not every role needs one). Don't invent testimonials, years in business, fleet sizes, statistics, coverage areas or
  guarantees; Tracker is shown as how we run, without our payroll, costs or profit, and without promising
  customers tracking or GPS.

CHANGING THINGS
  - The phone number and email: CONTACT at the top of assets/js/site.js. Every button and link that shows them
    follows it.
  - The USDOT and MC numbers: the comment in the footer of index.html shows where they go.
  - The slideshow's words: the COPY list in tools/showcase.js, then run:  node tools/showcase.js
  - The slideshow's pictures: they're real pages of SolidWave Tracker with made-up people and numbers and no
    real store, company or rental-company names. tools/app-shots.js takes them from the app's test copy
    (ProjectTrackerDesktop\test\harness, served at 127.0.0.1:8761) and writes tools/slides.json (where each
    highlight goes) and puts the pictures in assets/img/app; then run tools/showcase.js. Run it with the
    Electron below while the test copy is being served.
  - The small icons and the picture shown when the link is shared (assets/img/og.png): tools/make-assets.js.

CHECKING (phones: 320, 375, 390 and 430 wide; tablet; computer)
  tools/check-site.js opens the site in a hidden window at a computer's, a tablet's and a phone's width and
  looks for errors, sideways scrolling, fonts, pictures, the slideshow moving, the application's messages and
  buttons too small to tap; it saves full-page pictures to tools/shots (not kept in git). tools/shot-at.js
  takes one screen at a section; tools/full-page.js takes the whole page in one piece (W=1440 or W=390). Both run with the Electron that ProjectTrackerDesktop already has:
    ..\ProjectTrackerDesktop\node_modules\electron\dist\electron.exe tools\check-site.js

DRIVER APPLICATIONS
  For now, sending one opens the driver's email app with the application filled in, addressed to the email in
  CONTACT. The plan (waiting on the owner's yes): applications go straight into SolidWave Tracker as Leads.

PUTTING IT ONLINE
  Hosted free on GitHub Pages: the public repository github.com/mofomomoney/solidwavelogistics.com (the owner's
  GitHub account, the same one the app's updates come from), published from its master branch with the owner's
  OK on 2026-10-19. A save pushed there goes live in a minute or two. The CNAME file tells GitHub the site's
  address; _config.yml keeps tools/ and this file off the website (they stay in the repository).
  The address is set at Porkbun by the owner. Porkbun's two starter records (the ones pointing at
  uixie.porkbun.com) come out, and these go in:
    A     @    185.199.108.153     A     @    185.199.109.153
    A     @    185.199.110.153     A     @    185.199.111.153
    CNAME www  mofomomoney.github.io
  Email: Porkbun's free email forwarding sends info@solidwavelogistics.com to the owner's inbox (set up at
  Porkbun; it adds its own mail records, which stay).
