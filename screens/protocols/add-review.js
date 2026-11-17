SCREENS.push({ id:"protocols/add-review", area:"Protocols", status:"idea", title:"Add · 3 Review",
  sheet:true,
  why:"The last step is the overview of the whole protocol, not one more question. When is set right in the card (several slots = several entries in one plan, Naltrexon morning + noon); Rhythm, Start and End show their default muted (PRINCIPLES 2). What and Dose open their step again. The voice agent ends on this same card, only filled in (protocols/add-review-heard).",
  ref:"refs/juno-add-med-schedule.png",
  concept:[
    "<b>Same number of taps as before:</b> What → Dose → Review → Add. The review replaces the old 'When?' step, it does not add one.",
    "<b>One card, both ways:</b> the manual steps and the voice agent end in this card. The agent only skips the steps in between; nothing is saved before 'Add' (PRINCIPLES 5).",
    "<b>Defaults stay quiet:</b> every day, from today, no end. Tapping one of them opens its picker, a half-height sheet (protocols/pick-rhythm, pick-start, pick-end); a choice goes back to the card.",
    "<b>The button names the target fold</b> (Add to Morning) and follows the pills: with Noon added it reads 'Add to Morning + Noon'."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"3 of 3", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New protocol", rows:[
      ["What", "Naltrexon", "", "protocols/add-1-name"],
      ["Dose", "3 mg", "", "protocols/add-2-dose"],
      ["When", {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"], multi:true}],
      ["Rhythm", "Every day", "default", "protocols/pick-rhythm"],
      ["Start", "Today", "default", "protocols/pick-start"],
      ["End", "No end", "default", "protocols/pick-end"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning", slots:true, go:"protocols/today-folds"},
  ]});
