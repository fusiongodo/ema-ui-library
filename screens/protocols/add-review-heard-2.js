SCREENS.push({ id:"protocols/add-review-heard-2", area:"Protocols", status:"idea", title:"Add · Review, gap said",
  sheet:true, of:"protocols/add-review-heard",
  why:"The mic in the Rhythm row listened in place: 'every day'. The line turns heard, with the words below it, and the sky sign clears to a sun. Reached the same way from 'Ask me instead' (protocols/add-ask).",
  concept:[
    "<b>In place:</b> a state of protocols/add-review-heard (<code>of</code>), the card does not move; only the one line fills in.",
    "<b>Everything was said now:</b> nothing is flagged <code>inferred</code>."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"from what you said", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New protocol", clarity:"clear", hint:"Everything was said", live:[null, null, null, 900], rows:[
      ["What", "Naltrexon", "heard", "protocols/add-1-name", "naltrexone"],
      ["Dose", "3 mg", "heard", "protocols/add-2-dose", "three milligrams"],
      ["When", {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"], multi:true}, "heard", null, "in the morning"],
      ["Rhythm", "Every day", "heard", "protocols/pick-rhythm", "every day"],
      ["Start", "Today", "default", "protocols/pick-start"],
      ["End", "No end", "default", "protocols/pick-end"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning", slots:true, go:"protocols/today-folds"},
  ]});
