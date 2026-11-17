SCREENS.push({ id:"trials/length", area:"Insights", status:"idea", title:"Trial · 3 How long",
  sheet:true,
  why:"Three fixed lengths instead of free settings (one of the open questions in the backlog). Under it, the design in plain words: pairs of weeks, the app draws the order, the first two days of each week are not counted.",
  concept:[
    "<b>Templates, not settings:</b> 4, 8 or 12 weeks. 8 is the recommendation: long enough for a clear effect, short enough to keep going.",
    "<b>Pairs:</b> in each pair of weeks one is A, one is B, in an order the app draws. Pairs keep A and B balanced over time, so a slow drift (a good month) does not land on one side.",
    "<b>Carry-over:</b> days 1 and 2 of each week are not counted, because the substance may linger from the week before.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"3 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"How long?", n:"8 weeks is enough to show a clear effect."},
    {t:"seg", items:["4 weeks","8 weeks","12 weeks"], on:"8 weeks"},
    {t:"tile", tone:"white", l:"How the weeks work", n:"Weeks come in pairs. In each pair, one week is A and one is B; the app draws the order. The first two days of each week are not counted, because the substance may linger."},
    {t:"weekgrid", rows:[["One week","--●●●●●"]]},
    {t:"note", l:"Faint days: not counted. Dots: the days that go into the result."},
    {t:"spacer"},
    {t:"btn", l:"Continue", go:"trials/helper"},
  ]});
