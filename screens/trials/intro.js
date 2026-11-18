/* Personal placebo-controlled trial (N-of-1), see BACKLOG "Personal placebo-controlled trial".
   Demo case on every trial screen: Magnesium 300 mg (evening, from protocols/all), main outcome Fatigue (also tracking Pain, Brain fog),
   8 weeks = 4 pairs of one-week periods, helper Sam. Prototype today is Tue 3 Nov 2026, so the trial starts Mon 9 Nov
   and ends Sun 3 Jan; the result opens Mon 4 Jan. Order drawn by the app (weeks 1–8): B A A B A B B A
   (A = Magnesium in weeks 2, 3, 5, 8; B = placebo in weeks 1, 4, 6, 7), one A and one B in every pair.
   The id trials/intro is fixed: Insights home, the evidence screen (pattern-skip) and a protocol's detail screen link here. */
SCREENS.push({ id:"trials/intro", area:"Insights", status:"idea", title:"Trial · what it is",
  sheet:true,
  why:"Opened from 'Start a trial' on the Insights tab, from 'Run a trial' under a pattern, or from a protocol's detail screen. Three plain points, one honest line on limits, then one action. It reads aloud in under 20 seconds.",
  concept:[
    "<b>Three steps, nothing more:</b> a helper fills look-alike capsules, you log as usual without knowing which week is which, after 8 weeks the app tells you. No statistics vocabulary on this screen.",
    "<b>Limits up front, not in small print:</b> suited to supplements and optional add-ons; a prescribed medicine needs the doctor; the result is about this one person.",
    "<b>A sheet</b> over where it was opened (PRINCIPLES 4): setting up a trial is configuration, so it never leaves the page below.",
  ],
  w:[
    {t:"shead", left:"", l:"Personal trial", right:"×", goRight:"close"},
    {t:"big", l:"Does it really help you?", n:"Test one thing against a placebo, without knowing which week is which."},
    {t:"tl", rows:[
      ["Before", "A helper fills the capsules", "Some with the real thing, some with a placebo. They look the same."],
      ["8 weeks", "You log as usual", "You don't know which week is which. Neither does the app show it."],
      ["After", "The app tells you", "Whether your scores were different in the real weeks."]]},
    {t:"note", l:"Suited to supplements and optional add-ons. A prescribed medicine needs your doctor first. The result is about you, not general evidence."},
    {t:"spacer"},
    {t:"btn", l:"Set up a trial", go:"trials/what"},
  ]});
