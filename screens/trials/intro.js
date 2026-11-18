/* Personal placebo-controlled trial (N-of-1), see BACKLOG "Personal placebo-controlled trial".
   Demo case on every trial screen: Magnesium 300 mg (evening, from protocols/all), main outcome Fatigue (also tracking Pain,
   Brain fog), helper Sam. The person set the design (trials/length): blocks of about 1 week, 2 days left out after each
   switch, 8 weeks = 56 days, one capsule a day from 56 numbered compartments.
   The app drew where each block begins and what it is (TRIAL_PLAN, hidden from the person until the end): blocks vary around
   one week, the trial opens with three placebo days, 28 days real (a) and 28 placebo (b). The first 2 days of every block
   (also at the start, after the person's own Magnesium) are left out of the result.
   Prototype today is Tue 3 Nov 2026, so the trial starts Mon 9 Nov (day 1) and ends Sun 3 Jan (day 56); the result opens
   Mon 4 Jan. The running trial is drawn on Fri 27 Nov = day 19.
   The id trials/intro is fixed: Insights home, the evidence screen (pattern-skip) and a protocol's detail screen link here. */
const TRIAL_PLAN = [[1,3,"b"],[4,11,"a"],[12,17,"b"],[18,24,"a"],[25,33,"b"],[34,39,"a"],[40,46,"b"],[47,53,"a"],[54,56,"b"]];
SCREENS.push({ id:"trials/intro", area:"Insights", status:"idea", title:"Trial · what it is",
  sheet:true,
  why:"Opened from 'Start a trial' on the Insights tab, from 'Run a trial' under a pattern, or from a protocol's detail screen. Three plain points, one honest line on limits, then one action. It reads aloud in under 20 seconds.",
  concept:[
    "<b>Three steps, nothing more:</b> a helper fills look-alike capsules, you take one a day and log as usual without knowing which days are real, at the end the app tells you. No statistics vocabulary on this screen.",
    "<b>No length here:</b> how long the trial runs is the person's decision in step 3, so the intro names none.",
    "<b>Limits up front, not in small print:</b> suited to supplements and optional add-ons; a prescribed medicine needs the doctor; the result is about this one person.",
    "<b>A sheet</b> over where it was opened (PRINCIPLES 4): setting up a trial is configuration, so it never leaves the page below.",
  ],
  w:[
    {t:"shead", left:"", l:"Personal trial", right:"×", goRight:"close"},
    {t:"big", l:"Does it really help you?", n:"Test one thing against a placebo, without knowing which day is which."},
    {t:"tl", rows:[
      ["Before", "A helper fills the capsules", "Some with the real thing, some with a placebo. They look the same."],
      ["During", "You log as usual", "One capsule a day. You don't know which days are real, and the app doesn't show it."],
      ["After", "The app tells you", "Whether your scores were different on the real days."]]},
    {t:"note", l:"Suited to supplements and optional add-ons. A prescribed medicine needs your doctor first. The result is about you, not general evidence."},
    {t:"spacer"},
    {t:"btn", l:"Set up a trial", go:"trials/what"},
  ]});
