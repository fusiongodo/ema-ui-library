/* Magnesium in its trial state: the detail screen of the trial item, in the Protocols world, modelled on
   protocols/item-magnesium (the id protocols/item-capsule is kept). Lives in screens/trials/ because the trial owns it.
   Drawn on day 19 (Fri 27 Nov), the same moment as trials/running: one trial capsule a day, number = day of the trial
   (started Mon 9 Nov); taken 1–10 and 12–19, no. 11 skipped (Thu 19 Nov) → 18 of 19, tonight's no. 19 already taken;
   63 capsules in all, 44 to go. The capsule of a skipped day stays in the box: the next day is the next number, never
   two at once. Nothing here may hint at which days were real: every taken day is the same dot, no sizes, no dose, no
   score chart (the comparison opens at the end, in Insights). */
SCREENS.push({ id:"protocols/item-capsule", area:"Protocols", status:"idea", title:"Protocol · Magnesium in a trial",
  tabs:"idea", tab:"Protocols", tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},
  why:"The everyday side of the trial, where one does it: Magnesium, marked 'Trial', opened from the Evening fold or All protocols. It answers what one needs while taking it: tonight's capsule number, what was taken, what to do after a missed day. What the trial means stays in Insights, one quiet link away.",
  concept:[
    "<b>Magnesium is the item:</b> the title is Magnesium with the 'Trial' badge; while the trial runs it is taken as numbered trial capsules. No dose in the subtitle: a capsule may hold Magnesium or placebo.",
    "<b>Today's number first:</b> 'Capsule no. 19' is the one thing to get right each evening. Taken already, so the card stays white (PRINCIPLES 8).",
    "<b>Calendar of the trial so far:</b> taken = filled, skipped = ring, nothing else. All trial capsules look alike, so every taken day is the same dot: no size, no dose, no sign of a block. The calendar's weeks are the calendar, nothing more.",
    "<b>A missed capsule</b> is logged like any skipped dose ('Different?' on the Evening fold, or by voice) and shows as a ring here, in All protocols and as 18 of 19 on the trial. 'Skipped' lists it with its number; the sentence under it is all one needs to know.",
    "<b>No score chart:</b> unlike Magnesium outside a trial, nothing puts scores next to the days while the trial runs (it would invite watching for an effect). The comparison opens at the end, in Insights.",
    "<b>Trial status ›</b> leads to the trial in Insights (trials/running). No Edit, no End protocol: the trial owns Magnesium while it runs; stopping is on the trial's page.",
    "<b>Tabs:</b> while the trial runs, Protocols leads to the trial state of the tab (protocols/today-folds-trial), Insights back to the trial state of Insights (insights/home-trial)."
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"Magnesium" + TRIAL_BADGE, n:"One trial capsule a day · evening"},
    {t:"tile", tone:"white", l:"Taken today · capsule no. 19", n:"Tomorrow evening: no. 20 of 63"},
    {t:"sec", l:"Since 9 Nov"},
    {t:"cal", from:"2026-11-09", key:{x:["taken",1,"taken"]}, weeks:["xxxxxxx", "xxxoxxx", "xxxxx"]},
    {t:"stats", items:[["18 of 19","taken"],["1","skipped"],["44","to go"]]},
    {t:"sec", l:"Skipped"},
    {t:"list", rows:[["Thu 19 Nov · no. 11","skipped","acc"]]},
    {t:"note", l:"Missed one? Log it as skipped, leave it in the box and take today's number, never two at once."},
    {t:"list", rows:[["Trial status","›"]], go:"trials/running"},
  ]});
