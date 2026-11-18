/* The helper's view: Sam's own phone, opened from the link / QR code on trials/helper. Another person, so another look:
   world "neutral" (warm grey) instead of the Insights colours, no tab bar, no app chrome. */
SCREENS.push({ id:"trials/helper-welcome", area:"Insights", status:"idea", title:"Helper · 1 Welcome",
  world:"neutral",
  why:"What Sam sees after opening the link: who they help, what to do in three steps, and the one rule. No account, no app needed (a web page in the real app).",
  concept:[
    "<b>Neutral look:</b> warm grey, no tab bar. It is obvious at a glance that this is not Alex's app but a page for someone else.",
    "<b>The one rule in bold words:</b> never tell which day is which, not even by a hint.",
    "<b>The rule, not a recipe:</b> 63 capsules that cannot be told apart, each with only its number. How Sam makes them (own capsules with a filler, a capsule inside a larger one, a matching placebo …) is agreed with Alex; the page does not prescribe it. The same words as on Alex's setup.",
  ],
  w:[
    {t:"shead", left:"", l:"Trial helper", right:""},
    {t:"big", l:"You are helping Alex test Magnesium.", n:"Never tell which day is which."},
    {t:"tl", rows:[
      ["Step 1", "Prepare 63 look-alike capsules", `${trialMix(TRIAL_PLAN)}, the way you and Alex agreed. Nobody may be able to tell them apart.`],
      ["Step 2", "Number them from the plan", "The plan says which numbers get Magnesium. Write only the number on each. About 20 minutes."],
      ["Step 3", "Hand them over", "Then the plan locks. You won't need it again."]]},
    {t:"note", l:"Not even a hint: no remarks, no looks, no different colours or marks."},
    {t:"spacer"},
    {t:"btn", l:"Open the fill plan", go:"trials/helper-plan"},
  ]});
