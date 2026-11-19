/* Helper · 3, the organizer way: Alex's pill organizer, filled week by week. Only the current week is shown; its seven days
   come from TRIAL_PLAN (week 1 = days 1–7, Mon 9 – Sun 15 Nov: Mon–Wed Magnesium, Thu–Sun placebo). Washout days carry
   the kind of their block and are not marked. Drawn with Mon–Wed already filled. The numbered way: trials/helper-plan-numbered. */
SCREENS.push({ id:"trials/helper-plan", area:"Insights", status:"idea", title:"Helper · 3 Fill plan (organizer)",
  world:"neutral",
  why:"The plan as an organizer: seven compartments, each says Magnesium or placebo for that day. Sam fills them and ticks them off. Only this week is shown; the next opens when it is due.",
  concept:[
    "<b>Day by day, as the app drew it:</b> the order comes from the app, not from Sam. Washout days are not marked: for Sam every day is simply one or the other.",
    "<b>Only one week at a time:</b> less to give away, less to get wrong.",
    "<b>Weekly visit:</b> the app reminds Sam before each Monday. With more organizers, several weeks could be filled at once (not drawn).",
    "<b>Numbered instead:</b> the other way is still there (trials/helper-plan-numbered).",
  ],
  w:[
    {t:"shead", left:"‹", l:"Week 1 of 9", n:"Mon 9 – Sun 15 Nov", right:"", goLeft:"back"},
    {t:"big", l:"Fill Alex's organizer", n:"One capsule per day. Tap a day when it is in."},
    {t:"organizer", plan:TRIAL_PLAN, week:1, a:"Magnesium 300 mg", b:"Placebo (rice flour)", done:3},
    {t:"note", l:"Alex takes one each evening. Both kinds must look the same lying side by side."},
    {t:"list", rows:[["Next fill","Sun 15 Nov · week 2"],["After that","7 more weeks"]]},
    {t:"btn", l:"Week 1 is filled", go:"trials/helper-check"},
  ]});
