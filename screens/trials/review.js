SCREENS.push({ id:"trials/review", area:"Insights", status:"idea", title:"Trial · Review",
  sheet:true,
  why:"The whole trial on one card before it starts, like the add flow's review. Each choice opens its step again. Nothing starts before 'Start on Monday'. Also reached from 'Run it again' on the result.",
  concept:[
    "<b>Same card as Add protocol:</b> label left, value right; the steps you chose open again with a tap.",
    "<b>The design as the person set it:</b> one block (about 1 week), left out after a switch (2 days), total (8 weeks · 56 days). All three open step 3. Where the blocks fall is not on the card: the app keeps it hidden.",
    "<b>What changes in daily life:</b> one study capsule a day replaces Magnesium in the evening, number after number. Drawn muted (PRINCIPLES 2): it follows from the trial, nothing to choose.",
    "<b>Start on Monday:</b> Sam needs a few days to fill the compartments. The start day says nothing about the blocks.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"Check and start", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"Personal trial", icon:"flask", n:"Starts Mon 9 Nov · ends Sun 3 Jan", rows:[
      ["Test", "Magnesium 300 mg", "", "trials/what"],
      ["Main outcome", "Fatigue", "", "trials/measure"],
      ["Also tracking", "Pain, Brain fog", "", "trials/measure"],
      ["One block", "About 1 week", "", "trials/length"],
      ["Left out", "2 days after each switch", "", "trials/length"],
      ["Total", "8 weeks · 56 days", "", "trials/length"],
      ["Helper", "Sam has the fill plan", "", "trials/helper"],
      ["Each evening", "Study capsule instead", "default"]]},
    {t:"note", l:"Sam fills 56 numbered compartments before Monday. You start with number 1 on Monday evening."},
    {t:"spacer"},
    {t:"btn", l:"Start on Monday", go:"insights/home-trial"},
  ]});
