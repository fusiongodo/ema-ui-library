/* Order B A A B A B B A (see trials/intro): box n = week n. Drawn with the first three boxes ticked off. */
SCREENS.push({ id:"trials/helper-plan", area:"Insights", status:"idea", title:"Helper · 2 Fill plan",
  world:"neutral",
  why:"Eight numbered boxes, one per week, each with what goes in. Tick a box off when it is filled. The weeks of a pair sit together, one Magnesium, one placebo.",
  concept:[
    "<b>Box = week:</b> Alex takes box 1 in week 1, and so on; the number is the only thing written on the box.",
    "<b>Check-off:</b> tap a box when it is filled (Play: visual only). Three are already done.",
    "<b>The app drew the order,</b> not Sam: people randomise badly.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Fill plan", n:"for Alex · Magnesium", right:"", goLeft:"back"},
    {t:"fill", rows:"BAABABBA", a:"Magnesium 300 mg", b:"Placebo", per:7, done:3},
    {t:"note", l:"Placebo: the same capsule filled with rice flour. Write only the number on each box."},
    {t:"btn", l:"All boxes filled", go:"trials/helper-done"},
  ]});
