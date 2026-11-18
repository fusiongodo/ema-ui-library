/* The trial's terms, each explained on demand: an info icon (render.js `info`) beside the term opens one of these half sheets.
   One kind of sheet for all of them: the term as the title, × back, one `explain` card (a small picture and one or two
   sentences). No paragraph, no advice. The pictures live in render.js (XP); the same pictures return in the guide. */
function trialTerm(k, title, pic, n, why, concept){
  return { id:"trials/term-" + k, area:"Insights", status:"idea", title:"Trial · term: " + title.toLowerCase(),
    sheet:"half", why, concept,
    w:[
      {t:"shead", left:"", l:title, right:"×", goRight:"back"},
      {t:"explain", pic, n, alt:title},
    ]};
}
const TRIAL_TERMS = {
  placebo: ["Placebo", "placebo",
    "A capsule that looks, feels and tastes like the real one but holds nothing active. Comparing against it separates what the substance does from what expecting it does."],
  blinded: ["Blinded", "blinded",
    "You don't know which days are real. What you expect can change how a day feels, so not knowing keeps expectation out of your scores."],
  randomized: ["Randomized", "randomized",
    "The app draws where each block begins and which kind it is, not you or the helper. So no weekday, habit or hunch can line up with the real days."],
  block: ["Block duration", "block",
    "Days of one kind in a row, all real or all placebo, every one of them compared. The app keeps hidden where a block begins."],
  washout: ["Washout period", "washout",
    "After a switch, the earlier kind can still act for a few days, or the new one hasn't built up yet. So a few washout days come before every block, switch or not: taken like any other day, left out of the comparison. They come on top of the block duration, so a block of 1 week still has 7 days compared."],
  primary: ["Primary outcome", "primary",
    "The measure that decides the result, fixed before the start. Chosen afterwards, chance would pick the winner: among several scores, one always looks best."],
  composite: ["Composite score", "composite",
    "Your chosen scores averaged into one number per day, each turned first so that higher always means worse. One result for how you were overall."],
};
SCREENS.push(trialTerm("placebo", ...TRIAL_TERMS.placebo,
  "From the (i) in the first row of trials/intro ('A helper fills the capsules'). Two identical capsules, one real, one with nothing active.",
  ["<b>Picture first:</b> the two capsules look the same; only the words under them differ. One or two sentences, never a paragraph."]));
SCREENS.push(trialTerm("blinded", ...TRIAL_TERMS.blinded,
  "From the (i) in the second row of trials/intro ('You log as usual') and beside 'Blinded' on the helper step. Four numbered capsules that look alike; only the helper knows.",
  ["<b>Why it matters, in one sentence:</b> expectation shapes how a day feels; not knowing keeps it out of the scores."]));
SCREENS.push(trialTerm("randomized", ...TRIAL_TERMS.randomized,
  "From the (i) beside 'Randomized' on trials/length, where the strip of days shows that the app places the blocks. A die and a row of four equal blocks in a drawn order: two placebo blocks follow each other, because the order is drawn, not alternated.",
  ["<b>Who draws:</b> the app, not the person and not the helper: people randomise badly."]));
SCREENS.push(trialTerm("block", ...TRIAL_TERMS.block,
  "From the (i) in the 'Block duration' row on trials/length. Top: the app's plan, 2 washout days (marked as extra), a Magnesium block of 7 compared days, the switch, again 2 washout days, a placebo block of 7 days (every block has its washout before it, switch or not); bottom: what the person sees, 18 days all alike.",
  ["<b>Exact, and only the compared days:</b> a block of 1 week is 7 days that all go into the comparison. The washout days before it are not part of it; they come on top (trials/term-washout says it in words).",
   "<b>Hidden all the same:</b> the blocks do not vary; the app hides where they begin by drawing their order and the day the first one begins (the whole sequence shifted, so one block is split between the start and the end of the trial).",
   "<b>The (i) is its own tap:</b> the row itself still opens the picker (trials/pick-block)."]));
SCREENS.push(trialTerm("washout", ...TRIAL_TERMS.washout,
  "From the (i) in the 'Washout period' row on trials/length. A strip of days: a Magnesium block ends, placebo begins; the effect of Magnesium fades over the first two placebo days, which are marked as washout and extra: taken like any other day, left out of the comparison, on top of the block. The placebo block begins after them.",
  ["<b>On top, not inside:</b> one sentence says that washout days come in addition to the block duration; the picture labels the blocks 'compared' and the washout 'extra'.",
   "<b>Before every block, switch or not:</b> so one block always takes washout + block days, the length of the trial does not depend on the drawn order, and the washout days give nothing away.",
   "<b>Replaces the paragraph</b> that used to sit under both rows and read as if it referred to both.",
   "<b>The same marking as the result:</b> washout days are faint, as in the revealed strip on trials/result."]));
SCREENS.push(trialTerm("primary", ...TRIAL_TERMS.primary,
  "From the (i) beside 'Primary outcome' on trials/measure. A line from the start to the end: fixed before the start, it decides the result.",
  ["<b>Neutral about the choice:</b> the sheet explains what a primary outcome is, not which one to take (composite, one score, or none)."]));
SCREENS.push(trialTerm("composite", ...TRIAL_TERMS.composite,
  "From the (i) beside 'Composite score' on trials/measure. Three scores (6, 3, 5) become one symptom score (4.7).",
  ["<b>Aligned first:</b> a score where higher is better (sleep quality) is turned around before averaging, so the composite always reads 'higher = worse'."]));
