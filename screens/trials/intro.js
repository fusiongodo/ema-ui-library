/* Personal placebo-controlled trial (N-of-1), see BACKLOG "Personal placebo-controlled trial".
   Demo case on every trial screen: Magnesium 300 mg (evening, from protocols/all), scores tracked Fatigue, Pain, Brain fog,
   primary outcome their composite (one symptom score), helper Sam. The person set the design (trials/length): block
   duration 1 week (exactly 7 days, all of them compared), washout period 2 days, total duration 8 weeks.
   The model: a block counts only the days that go into the comparison. Every block is preceded by its washout days, whether
   or not the kind changes; they are ordinary capsule days of the kind that follows, taken as usual, left out of the
   comparison. So one block always takes washout + block duration = 2 + 7 = 9 days, and the length of the trial does not
   depend on the drawn order. The total is rounded up to whole blocks, so at least the chosen duration is covered:
   8 weeks = 56 days, 56 / 9 = 6.2 → 7 blocks = 63 days, 63 numbered capsules, one a day, numbered 1 to 63.
   7 blocks cannot be balanced: one kind gets 4 blocks, the other 3, and which kind gets the extra one is drawn too.
   Where the first block begins is drawn as well (the person knows the block length, so the phase must be hidden): the
   sequence of blocks is shifted by a drawn number of days, so one block is split between the start and the end of the
   trial. No lead-in or tail: every day belongs to a washout or a block.
   The app drew (TRIAL_PLAN, hidden from the person until the end): 3 Magnesium and 4 placebo blocks, shifted by 3 days.
   Blocks in time order: M (split) · P · P · M · P · M · P. Day by day:
     1–3 Mg block, first part (the split block) · 4–5 washout (P) · 6–12 P block · 13–14 washout (P) · 15–21 P block ·
     22–23 washout (Mg) · 24–30 Mg block · 31–32 washout (P) · 33–39 P block · 40–41 washout (Mg) · 42–48 Mg block ·
     49–50 washout (P) · 51–57 P block · 58–59 washout (Mg) · 60–63 Mg block, second part (with 1–3: 7 days).
   Days 1–3 are Magnesium days right after the person's own Magnesium, so nothing needs washing out before them.
   Compared: 21 Magnesium days (3 × 7), 28 placebo days (4 × 7). Washout: 14 days (7 × 2).
   Capsules: 27 Magnesium (3 × 9), 36 placebo (4 × 9).
   Runs for the helper (same kind merged): 1–3 M · 4–21 P · 22–30 M · 31–39 P · 40–48 M · 49–57 P · 58–63 M.
   Format: [from, to, kind, role]; kind "a" = real, "b" = placebo; role: none = block days (compared), "w" = washout
   (render.js: fill merges runs of one kind, daystrip draws washout faint).
   Prototype today is Tue 3 Nov 2026, so the trial starts Mon 9 Nov (day 1) and ends Sun 10 Jan (day 63); the result opens
   Mon 11 Jan. The running trial is drawn on Fri 27 Nov = day 19.
   Terms a newcomer meets carry an info icon (render.js `info`) that opens a half sheet with a picture and one or two
   sentences (screens/trials/terms.js). The optional guide (trials/guide, guide-prepare) is offered here, on the helper step
   and on the Insights tab; it is never a step of the setup.
   The id trials/intro is fixed: Insights home, the evidence screen (pattern-skip) and a protocol's detail screen link here. */
const TRIAL_PLAN = [[1,3,"a"],[4,5,"b","w"],[6,12,"b"],[13,14,"b","w"],[15,21,"b"],[22,23,"a","w"],[24,30,"a"],[31,32,"b","w"],
  [33,39,"b"],[40,41,"a","w"],[42,48,"a"],[49,50,"b","w"],[51,57,"b"],[58,59,"a","w"],[60,63,"a"]];
/* While the trial runs, Magnesium itself is the trial item under Protocols: one row, its name with a small calm "Trial"
   badge (class trb in lib/style.css; data-world="insights" = the trial's world, Cozy draws it in that light tint) and the
   number of today's trial capsule. Used on protocols/today-folds-trial, protocols/all-trial and protocols/item-capsule. */
const TRIAL_BADGE = `<span class="trb" data-world="insights">Trial</span>`;
/* How many units of each kind a plan holds ("27 with Magnesium, 36 placebo"), for the helper's welcome page and its preview. */
const trialMix = p => { const n = k => p.filter(r=>r[2] === k).reduce((s, r)=>s + r[1] - r[0] + 1, 0); return `${n("a")} with Magnesium, ${n("b")} placebo`; };
/* What blinding requires: the rule, not a method (trials/helper names the helper, trials/guide says "the helper"). */
const trialRule = who => ({t:"tl", ic:["twins","key","hash"], rows:[
  ["", "You can't tell them apart", "Same look, size, weight and taste, the same sound when shaken."],
  ["", `Only ${who} knows which is which`, `The plan opens on ${who === "Sam" ? "Sam's" : "the helper's"} phone, never on yours.`],
  ["", "Each one carries only a number", "1 to 63, one a day. The number tells you nothing."]]});
SCREENS.push({ id:"trials/intro", area:"Insights", status:"idea", title:"Trial · what it is",
  sheet:true,
  why:"Opened from 'Start a trial' on the Insights tab, from 'Run a trial' under a pattern, or from a protocol's detail screen. Three plain points, one honest line on limits, then one action. The two terms a newcomer meets here (placebo, blinded) carry a small info icon; a quiet link offers the two-minute guide. It reads aloud in under 20 seconds.",
  concept:[
    "<b>Three steps, nothing more, as actions:</b> a helper fills the capsules, you log as usual, the app tells you. Relaxed everyday words that still use the proper terms: 'real' and 'placebo' by name, 'blinded' said once with what it means.",
    "<b>Proper terms, explained on demand:</b> 'placebo' and 'blinded' are named as what they are; the (i) after the first row (placebo) and the second row (blinded) opens a half sheet with a small picture and one or two sentences (trials/term-placebo, term-blinded). 'Randomized' follows where the app draws the blocks (trials/length).",
    "<b>The guide is optional:</b> 'New to this? A two-minute guide' opens trials/guide (what a blinded trial is, the one rule, ways to prepare). Never a step one has to pass; also on the Insights tab at any time.",
    "<b>No length here:</b> how long the trial runs is the person's decision in step 3, so the intro names none.",
    "<b>Limits up front, not in small print:</b> suited to supplements and optional add-ons; a prescribed medicine needs the doctor; the result is about this one person.",
    "<b>A sheet</b> over where it was opened (PRINCIPLES 4): setting up a trial is configuration, so it never leaves the page below.",
  ],
  w:[
    {t:"shead", left:"", l:"Personal trial", right:"×", goRight:"close"},
    {t:"big", l:"Does it really help you?", n:"Test one thing against a placebo, without knowing which day is which."},
    {t:"tl", rows:[
      ["Before", "A helper fills the capsules", "Some with the real thing, some with a placebo. They look the same."],
      ["During", "You log as usual", "One capsule a day. The trial is blinded: you can't tell real from placebo, and the app keeps it hidden until the end."],
      ["After", "The app tells you", "Whether your scores differed between real and placebo days."]],
      info:["trials/term-placebo","trials/term-blinded",null]},
    {t:"note", l:"Suited to supplements and optional add-ons. A prescribed medicine needs your doctor first. The result is about you, not general evidence."},
    {t:"note", l:"New to this? A two-minute guide ›", go:"trials/guide"},
    {t:"spacer"},
    {t:"btn", l:"Set up a trial", go:"trials/what"},
  ]});
