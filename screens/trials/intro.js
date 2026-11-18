/* Personal placebo-controlled trial (N-of-1), see BACKLOG "Personal placebo-controlled trial".
   Demo case on every trial screen: Magnesium 300 mg (evening, from protocols/all), scores tracked Fatigue, Pain, Brain fog,
   primary outcome their composite (one symptom score), helper Sam. The person set the design (trials/length): block
   duration about 1 week, washout period 2 days after each switch, total duration 8 weeks = 56 days, one capsule a day,
   numbered 1 to 56.
   The app drew where each block begins and what it is (TRIAL_PLAN, hidden from the person until the end): blocks vary around
   one week, the trial opens with three placebo days, 28 days real (a) and 28 placebo (b). The first 2 days of every block
   (also at the start, after the person's own Magnesium) are the washout: taken as usual, left out of the comparison.
   Prototype today is Tue 3 Nov 2026, so the trial starts Mon 9 Nov (day 1) and ends Sun 3 Jan (day 56); the result opens
   Mon 4 Jan. The running trial is drawn on Fri 27 Nov = day 19.
   Terms a newcomer meets carry an info icon (render.js `info`) that opens a half sheet with a picture and one or two
   sentences (screens/trials/terms.js). The optional guide (trials/guide, guide-prepare) is offered here, on the helper step
   and on the Insights tab; it is never a step of the setup.
   The id trials/intro is fixed: Insights home, the evidence screen (pattern-skip) and a protocol's detail screen link here. */
const TRIAL_PLAN = [[1,3,"b"],[4,11,"a"],[12,17,"b"],[18,24,"a"],[25,33,"b"],[34,39,"a"],[40,46,"b"],[47,53,"a"],[54,56,"b"]];
/* What blinding requires: the rule, not a method (trials/helper names the helper, trials/guide says "the helper"). */
const trialRule = who => ({t:"tl", ic:["twins","key","hash"], rows:[
  ["", "You can't tell them apart", "Same look, size and weight, the same sound when shaken, the same taste."],
  ["", `Only ${who} knows which is which`, `The plan opens on ${who === "Sam" ? "Sam's" : "the helper's"} phone, never on yours.`],
  ["", "Each one carries only a number", "1 to 56, one a day. The number tells you nothing."]]});
SCREENS.push({ id:"trials/intro", area:"Insights", status:"idea", title:"Trial · what it is",
  sheet:true,
  why:"Opened from 'Start a trial' on the Insights tab, from 'Run a trial' under a pattern, or from a protocol's detail screen. Three plain points, one honest line on limits, then one action. The two terms a newcomer meets here (placebo, blinded) carry a small info icon; a quiet link offers the two-minute guide. It reads aloud in under 20 seconds.",
  concept:[
    "<b>Three steps, nothing more:</b> a helper fills look-alike capsules, you take one a day and log as usual without knowing which days are real, at the end the app tells you.",
    "<b>Proper terms, explained on demand:</b> 'placebo' and 'blinded' are named as what they are; the (i) beside each opens a half sheet with a small picture and one or two sentences (trials/term-placebo, term-blinded). 'Randomized' follows where the app draws the blocks (trials/length).",
    "<b>The guide is optional:</b> 'New to this? A two-minute guide' opens trials/guide (what a blinded trial is, the one rule, ways to prepare). Never a step one has to pass; also on the Insights tab at any time.",
    "<b>No length here:</b> how long the trial runs is the person's decision in step 3, so the intro names none.",
    "<b>Limits up front, not in small print:</b> suited to supplements and optional add-ons; a prescribed medicine needs the doctor; the result is about this one person.",
    "<b>A sheet</b> over where it was opened (PRINCIPLES 4): setting up a trial is configuration, so it never leaves the page below.",
  ],
  w:[
    {t:"shead", left:"", l:"Personal trial", right:"×", goRight:"close"},
    {t:"big", l:"Does it really help you?", n:"Test one thing against a placebo, without knowing which day is which."},
    {t:"tl", rows:[
      ["Before", "Real and placebo capsules", "A helper fills them, some with the real thing, some with nothing active. They look the same."],
      ["During", "Blinded", "One capsule a day. You don't know which days are real, and the app doesn't show it. Log as usual."],
      ["After", "The app tells you", "Whether your scores were different on the real days."]],
      info:["trials/term-placebo","trials/term-blinded",null]},
    {t:"note", l:"Suited to supplements and optional add-ons. A prescribed medicine needs your doctor first. The result is about you, not general evidence."},
    {t:"note", l:"New to this? A two-minute guide ›", go:"trials/guide"},
    {t:"spacer"},
    {t:"btn", l:"Set up a trial", go:"trials/what"},
  ]});
