/* The helper's view: Sam's own phone, opened from the link / QR code on trials/helper. Another person, so another look:
   world "neutral" (warm grey) instead of the Insights colours, no tab bar, no app chrome. */
SCREENS.push({ id:"trials/helper-welcome", area:"Insights", status:"idea", title:"Helper · 1 Welcome",
  world:"neutral",
  why:"What Sam sees after opening the link: who they help, what to do in three steps, and the one rule. No account, no app needed (a web page in the real app).",
  concept:[
    "<b>Neutral look:</b> warm grey, no tab bar. It is obvious at a glance that this is not Alex's app but a page for someone else.",
    "<b>The one rule in bold words:</b> never tell which day is which, not even by a hint.",
    "<b>Materials:</b> 56 numbered compartments (eight weekly pill organisers or numbered bags), opaque capsules that all look the same, Magnesium and a placebo filler (rice flour). The same words as on Alex's setup.",
  ],
  w:[
    {t:"shead", left:"", l:"Trial helper", right:""},
    {t:"big", l:"You are helping Alex test Magnesium.", n:"Never tell which day is which."},
    {t:"tl", rows:[
      ["Step 1", "Get 56 numbered compartments", "Eight weekly pill organisers or 56 small bags, numbered 1 to 56."],
      ["Step 2", "Fill them from the plan", "One capsule each: Magnesium or placebo. All capsules look the same. About 20 minutes."],
      ["Step 3", "Hand them over", "Then the plan locks. You won't need it again."]]},
    {t:"note", l:"Not even a hint: no remarks, no looks, no different colours."},
    {t:"spacer"},
    {t:"btn", l:"Open the fill plan", go:"trials/helper-plan"},
  ]});
