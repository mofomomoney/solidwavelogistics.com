SOLID WAVE LOGISTICS WEBSITE — how this folder works

The company website for solidwavelogistics.com (bought by the owner at Porkbun on 2026-10-19; it renews each
October). One page, no build step: index.html, assets/css/site.css and assets/js/site.js. It's kept here, outside
OneDrive, like the app (ProjectTrackerDesktop), with its history in git.

THE PAGE, TOP TO BOTTOM (the owner's picks from the mockups, 2026-10-19)
  - The top: two doors split by the logo's wave. For contractors ("Your routes, covered.", Partner with us) and
    for CDL drivers ("Drive local. Day-rate pay.", Apply in two minutes). On a phone they stack, with the wave
    between them.
  - Our mission: "The last-mile partner contractors count on.", the tractor + flatbed + Moffett drawing (drawn
    in site.js), Safety first / On time / Care on every drop.
  - How we run: "Every mile accounted for." A slideshow of SolidWave Tracker (the owner's own app): Drivers,
    Routes, Equipment, Documents, Financials, three selling points each. Every 4.5 seconds the next point lights
    up on the real app picture; after the third, the whole section slides to the next part, and after Financials
    it starts over. It waits while it's pointed at or off screen, has Pause/Play, and doesn't move on its own for
    people who turn motion off. Written by tools/showcase.js (see below).
  - Partner with us (#contact): how to reach us. The Call button shows only once there's a phone number.
  - Drive with us (#drive): the driver application.
  - The bottom: the links, the email, the year.

WHAT SOLID WAVE IS (so the words stay right)
  A last-mile SUBCONTRACTOR. Contractors hold the routes and hand them down; Solid Wave brings vetted Class A
  drivers (no CDL B) and whatever equipment the job is missing, anywhere. Never write as if Solid Wave owns
  routes or a fleet, and don't explain last-mile basics to contractors.

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

CHECKING
  tools/check-site.js opens the site in a hidden window at a computer's, a tablet's and a phone's width and
  looks for errors, sideways scrolling, fonts, pictures, the slideshow moving, the application's messages and
  buttons too small to tap; it saves full-page pictures to tools/shots (not kept in git). tools/shot-at.js
  takes one screen at a section. Both run with the Electron that ProjectTrackerDesktop already has:
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
  pixie.porkbun.com) come out, and these go in:
    A     @    185.199.108.153     A     @    185.199.109.153
    A     @    185.199.110.153     A     @    185.199.111.153
    CNAME www  mofomomoney.github.io
  Email: Porkbun's free email forwarding sends info@solidwavelogistics.com to the owner's inbox (set up at
  Porkbun; it adds its own mail records, which stay).
