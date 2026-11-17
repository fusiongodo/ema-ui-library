SCREENS.push({ id:"trials/review", area:"Insights", status:"idea", title:"Trial · Review",
  sheet:true,
  why:"The whole trial on one card before it starts, like the add flow's review. Each choice opens its step again. Nothing starts before 'Start on Monday'. Also reached from 'Run it again' on the result.",
  concept:[
    "<b>Same card as Add protocol:</b> label left, value right; the steps you chose open again with a tap.",
    "<b>What changes in daily life is on the card:</b> the study capsule replaces Magnesium in the evening, days 1 and 2 of each week are not counted. Both are fixed by the design, so they are drawn muted (PRINCIPLES 2).",
    "<b>Start on Monday:</b> weeks run Monday to Sunday, and Sam needs a few days to fill the boxes.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"Check and start", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"Personal trial", icon:"flask", n:"Starts Mon 9 Nov · ends Sun 3 Jan", rows:[
      ["Test", "Magnesium 300 mg", "", "trials/what"],
      ["Measure", "Fatigue", "", "trials/measure"],
      ["Length", "8 weeks · 4 pairs", "", "trials/length"],
      ["Helper", "Sam has the fill plan", "", "trials/helper"],
      ["Each evening", "Study capsule instead", "default"],
      ["Not counted", "First 2 days a week", "default"]]},
    {t:"note", l:"Sam fills eight boxes before Monday. You start with box 1 on Monday evening."},
    {t:"spacer"},
    {t:"btn", l:"Start on Monday", go:"insights/home-trial"},
  ]});
