/* Day 19 of 63, Friday 27 Nov, evening (the trial started Mon 9 Nov). Capsules: week 1 all 7, week 2 missed Thu,
   week 3 Mon–Fri all 5 → 18 of 19. Nothing on this screen shows where a block begins (no pair, no A/B): the weeks of
   the capsule grid are only the calendar. */
SCREENS.push({ id:"trials/running", area:"Insights", status:"idea", title:"Trial · running (day 19 of 63)",
  tabs:"idea", tab:"Insights", tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},   // the trial states of both tabs
  why:"The trial while it runs, here on the evening of day 19. Only what is safe to see: how far along, which capsules were taken. Real and placebo, the blocks and every comparison are hidden, so there is nothing to watch, nothing to sway how you log and no boundary to notice.",
  concept:[
    "<b>Nothing asks for attention:</b> no tinted card, no question. A weekly 'what do you think you took?' would make the person watch for an effect and feed expectation, so the guess is asked once, at the end (trials/guess).",
    "<b>Prototype jump:</b> a tap on the progress card skips to day 63 (insights/home-result).",
    "<b>Progress by days:</b> day 19 of 63 and the day the result opens. No weeks of the design, no pairs: the person must not know where a block begins.",
    "<b>Capsules, not effects:</b> Magnesium stays a protocol item like any other, marked 'Trial' and taken as numbered trial capsules (Evening fold of Protocols, protocols/today-folds-trial); missed ones are logged, not hidden, and reported with the result. The grid's weeks are the calendar, nothing more. No chart compares days.",
    "<b>Locked:</b> one calm line, no countdown drama.",
    "<b>Stop the trial</b> is quiet, at the end (trials/stop).",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Magnesium trial", n:"Primary outcome: one symptom score from Fatigue, Pain and Brain&nbsp;fog"},
    {t:"tile", tone:"white", l:"Day 19 of 63", n:"Result on Mon 11 Jan", bar:30.2, go:"insights/home-result"},
    {t:"sec", l:"Capsules", r:"18 of 19"},
    {t:"weekgrid", rows:[["9 Nov","●●●●●●●"],["16 Nov","●●●○●●●"],["23 Nov","●●●●●"]]},
    {t:"note", l:"Taken from your Evening protocol ›", go:"protocols/today-folds-trial"},
    {t:"tile", tone:"white", l:"Locked until the end", n:"Which days were Magnesium, and every comparison, stay hidden until 11 Jan. Take the next number and log as usual."},
    {t:"note", l:"Stop the trial", danger:true, go:"trials/stop"},
  ]});
