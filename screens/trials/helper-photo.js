/* Helper · 5: an optional photo of the filled organizer, sealed until the result (shown on trials/result-prep). */
SCREENS.push({ id:"trials/helper-photo", area:"Insights", status:"idea", title:"Helper · 5 Photo",
  world:"neutral",
  why:"An optional record of how the set looked when it was handed over. Sealed in the app until the result is revealed, so it cannot give anything away.",
  concept:[
    "<b>Documentation, not control:</b> the photo is for the person's own record of the trial.",
    "<b>Sealed:</b> shown only with the result (trials/result-prep).",
    "<b>Later:</b> an automatic check of such photos is an idea in the backlog, not part of this.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Photo", n:"optional", right:"", goLeft:"back"},
    {t:"big", l:"A photo of the filled organizer", n:"It stays sealed until the trial ends. Alex can't see it before."},
    {t:"photo", state:"empty", l:"Lid open, all seven days visible"},
    {t:"btn", l:"Take photo", go:"trials/helper-done"},
    {t:"note", l:"Skip ›", go:"trials/helper-done"},
  ]});
