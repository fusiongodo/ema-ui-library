/* Step 4 → "Send Sam the link": what happens next on the person's side. A small sheet; Continue goes on to the review.
   The last line is a door for reviewing the prototype: it jumps to Sam's own phone (trials/helper-welcome). */
SCREENS.push({ id:"trials/helper-sent", area:"Insights", status:"idea", title:"Trial · 4 Link sent",
  sheet:"half",
  why:"After sending, the person's side simply waits and shows the helper's progress. The last line is a door for reviewing the prototype: it jumps to the helper's own phone.",
  w:[
    {t:"shead", left:"", l:"Link sent", right:"×", goRight:"trials/review"},
    {t:"big", l:"Sam has the link.", n:"Sam prepares everything on their own phone. You'll see here when it is done."},
    {t:"list", rows:[["Sam's part","not started yet"]]},
    {t:"btn", l:"Continue", go:"trials/review"},
    {t:"note", l:"Prototype only: look at Sam's phone ›", go:"trials/helper-welcome"},
  ]});
