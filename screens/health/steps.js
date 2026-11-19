/* Steps, opened from the Steps tile (checkins/overview-health) and from Today's line (today/home-health). Four weeks,
   7 Oct … today 3 Nov, HEALTH_STEPS (shared.js); usual 1,800 to 2,800 a day; no data on 15 and 27 Oct. */
SCREENS.push({ id:"health/steps", area:"Check-ins", status:"idea", title:"Steps · four weeks against your usual",
  tabs:"idea", tab:"Check-ins", tabto:HEALTH_TABTO,
  why:"A detail view like a score: four weeks, the band of your usual, gaps as gaps. Above the band is marked, below is not.",
  concept:[
    "<b>A detail view like a score:</b> four weeks, the band of the usual, gaps as gaps.",
    "<b>Above the band is marked, below is not:</b> fewer steps is not 'bad'.",
    "<b>Other windows</b> (3 months, 1 year) are drawn as a switch only; how the usual is computed over them is open.",
    "<b>No goal, no streak, no praise.</b>",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Steps", n:"From Apple Health · Apple Watch"},
    {t:"seg", items:["4 weeks","3 months","1 year"], on:"4 weeks"},
    {t:"usualchart", from:"2026-10-07", unit:"steps", band:[1800,2800], today:true, series:HEALTH_STEPS},
    {t:"stats", items:[["3,420","today so far"],["1,800–2,800","your usual a day"],["26 of 28","days with data"]]},
    {t:"note", l:"Higher than your usual today. On 4 days of these four weeks you were above it."},
    {t:"note", l:"2 days without data: the watch was not worn. They count as no data, not as zero."},
    {t:"list", rows:[["Used in 1 pattern","›"]], go:"insights/pattern-exertion"},
  ]});
