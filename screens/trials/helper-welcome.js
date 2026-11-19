/* The helper's view: Sam's own phone, opened from the link / QR code on trials/helper. Another person, so another look:
   world "neutral" (warm grey) instead of the Insights colours, no tab bar, no app chrome.
   The flow: welcome → before you fill (trials/helper-setup: form, placebo filling, where they go) → fill plan (Alex's pill
   organizer week by week, trials/helper-plan, or numbered all at once, trials/helper-plan-numbered) → look-alike check
   (trials/helper-check) → optional sealed photo (trials/helper-photo) → done. */
SCREENS.push({ id:"trials/helper-welcome", area:"Insights", status:"idea", title:"Helper · 1 Welcome",
  world:"neutral",
  why:"What Sam sees after opening the link: who they help and the one rule first, then the three steps ahead: get ready, fill by plan, check and hand over. No account, no app needed (a web page in the real app).",
  concept:[
    "<b>Neutral look:</b> warm grey, no tab bar. It is obvious at a glance that this is not Alex's app but a page for someone else.",
    "<b>The one rule in bold words, first:</b> never tell which day is which, not even by a hint.",
    "<b>Three steps, the shape of the flow:</b> get ready (form, placebo filling, and where they go: Alex's pill organizer or numbered bags, trials/helper-setup), fill by plan (trials/helper-plan), check and hand over (trials/helper-check, helper-photo, helper-done).",
    "<b>The rule, not a recipe:</b> the page names the choices, it does not make them. The same words as on Alex's setup.",
  ],
  w:[
    {t:"shead", left:"", l:"Trial helper", right:""},
    {t:"big", l:"You are helping Alex test Magnesium.", n:"Never tell which day is which."},
    {t:"tl", rows:[
      ["Step 1", "Get ready", "How real and placebo are made to look alike, and where they go: Alex's pill organizer or numbered bags."],
      ["Step 2", "Fill by plan", `The app tells you what goes where: ${trialMix(TRIAL_PLAN)} in all.`],
      ["Step 3", "Check and hand over", "A quick look-alike check. The plan stays closed in between."]]},
    {t:"note", l:"Not even a hint: no remarks, no looks, no different colours or marks."},
    {t:"spacer"},
    {t:"btn", l:"Start", go:"trials/helper-setup"},
  ]});
