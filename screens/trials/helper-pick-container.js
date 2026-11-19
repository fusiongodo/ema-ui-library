/* Picker for "Where they go" on trials/helper-setup (pattern: trials/pick-block). The organizer closes back to the setup;
   numbered bags lead on to the numbered fill plan (trials/helper-plan-numbered). */
SCREENS.push({ id:"trials/helper-pick-container", area:"Insights", status:"idea", title:"Helper · Where they go",
  sheet:"half", world:"neutral",
  why:"Two ways to say which capsule belongs to which day without writing what it is: the place in the organizer, or a number.",
  concept:[
    "<b>Organizer:</b> lowest effort and no labels, and it is how many people take their supplements anyway. The price: the helper comes back every week and the plan stays with the helper for the whole trial.",
    "<b>Numbered:</b> one session, then the plan locks for good. The price: 63 labels.",
  ],
  w:[
    {t:"shead", left:"", l:"Where do they go?", right:"×", goRight:"back"},
    {t:"list", rows:[
      ["Alex's pill organizer","✓","","You fill it once a week, day by day. Nothing is written on the capsules."],
      ["Numbered bags or boxes","","","You prepare all 63 at once. Each carries only its number."]],
      go:["back","trials/helper-plan-numbered"]},
    {t:"note", l:"Organizer: about 5 minutes each week. Numbered: once, about 20 minutes."},
  ]});
