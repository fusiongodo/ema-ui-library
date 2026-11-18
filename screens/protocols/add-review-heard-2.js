SCREENS.push({ id:"protocols/add-review-heard-2", area:"Protocols", status:"idea", title:"Add · Review, all confirmed",
  sheet:true, of:"protocols/add-review-heard",
  why:"The grey Every day was confirmed: by a tap on it, or by saying it (protocols/add-listen-gap) or answering the question (protocols/add-ask). The line now looks like any other value and opens the rhythm picker again (protocols/pick-rhythm). Nothing is open, so the mic and 'Ask me instead' are gone and 'Add to Morning' is the normal primary button.",
  concept:[
    "<b>In place:</b> a state of protocols/add-review-heard (<code>of</code>), the card does not move; only the one line changes.",
    "<b>Confirmed, not necessarily said:</b> the value is plain, without quote; nothing is saved as a guess."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"from what you said", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New protocol", rows:[
      ["What", "Naltrexon", "heard", "protocols/add-1-name", "naltrexone"],
      ["Dose", "3 mg", "heard", "protocols/add-2-dose", "three milligrams"],
      ["When", "Morning", "heard", "protocols/pick-when", "in the morning"],
      ["Rhythm", "Every day", "", "protocols/pick-rhythm"],
      ["Start", "Today", "default", "protocols/pick-start"],
      ["End", "No end", "default", "protocols/pick-end"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning", slots:true, go:"protocols/today-folds"},
  ]});
