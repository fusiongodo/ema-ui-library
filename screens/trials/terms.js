/* The trial's terms, each explained on demand: an info icon (render.js `info`) beside the term opens one of these half sheets.
   One kind of sheet for all of them: the term as the title, × back, one `explain` card (a small picture and one or two
   sentences). No paragraph, no advice. The pictures live in render.js (XP); the same pictures return in the guide.
   Budget (the people reading have ME/CFS, reading costs energy): at most two short sentences, about 20 to 25 words, plain
   words, the term at most once. What needs more words goes into the picture, or goes. */
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
    "A capsule that looks like the real one but holds nothing active. Comparing with it shows what the substance itself does."],
  blinded: ["Blinded", "blinded",
    "You can't tell real from placebo, so your expectations can't tip the result."],
  randomized: ["Randomized", "randomized",
    "The app, not you or the helper, draws the order of the blocks. So no habit or hunch can line up with the real days."],
  block: ["Block duration", "block",
    "Days of one kind in a row, all real or all placebo. A block is exactly as long as you choose; washout days come first."],
  washout: ["Washout period", "washout",
    "After a switch, the earlier kind can still act. So washout days come before each block: taken like any other day, but not compared."],
  primary: ["Primary outcome", "primary",
    "Fixed before the start, it decides the result. Choose it afterwards and you'd pick whichever score looks best by chance."],
  composite: ["Composite score", "composite",
    "Your scores averaged into one number a day, higher always meaning worse. One result for how you were overall."],
};
SCREENS.push(trialTerm("placebo", ...TRIAL_TERMS.placebo,
  "From the (i) in the first row of trials/intro ('A helper fills the capsules'). Two identical capsules, one real, one with nothing active.",
  ["<b>Picture first:</b> the two capsules look the same; only the words under them differ. One or two sentences, never a paragraph."]));
SCREENS.push(trialTerm("blinded", ...TRIAL_TERMS.blinded,
  "From the (i) in the second row of trials/intro ('You log as usual') and beside 'Blinded' on the helper step. Four numbered capsules that look alike; only the helper knows.",
  ["<b>Why it matters, in one sentence:</b> expectation shapes how a day feels; not knowing keeps it out of the scores."]));
SCREENS.push(trialTerm("randomized", ...TRIAL_TERMS.randomized,
  "From the (i) beside 'Randomized' on trials/length, where the strip of days shows that the app places the blocks. A die and a row of four equal blocks in a drawn order: two placebo blocks follow each other, because the order is drawn, not alternated.",
  ["<b>Who draws:</b> the app, not the person and not the helper: people randomise badly.",
   "<b>The picture carries the rest:</b> where a block begins and which kind, hidden from you. That with 7 blocks one kind gets one more is left to the reveal (trials/result); the design step no longer says it."]));
SCREENS.push(trialTerm("block", ...TRIAL_TERMS.block,
  "From the (i) in the 'Block duration' row on trials/length. One picture that says one thing: two blocks of 7 days (one real, filled; one placebo, rings), each with its 2 washout days in front (faint, in a dashed frame). Three labels: '7 days' over each block, 'washout' under the first.",
  ["<b>One message:</b> a block is days of one kind in a row, exactly as long as chosen, its washout days in front of it. No headings inside the picture, no 'switch', 'compared' or 'extra'.",
   "<b>Left out on purpose:</b> what washout is (trials/term-washout) and that the app hides where blocks begin (said on the step itself: 'Randomized · hidden from you').",
   "<b>The (i) is its own tap:</b> the row itself still opens the picker (trials/pick-block)."]));
SCREENS.push(trialTerm("washout", ...TRIAL_TERMS.washout,
  "From the (i) in the 'Washout period' row on trials/length. A strip of days: a Magnesium block ends, placebo begins; the effect of Magnesium fades over the first two placebo days, which are marked as washout and extra: taken like any other day, left out of the comparison, on top of the block. The placebo block begins after them.",
  ["<b>Two facts survive any shortening:</b> washout days are taken like any other day, and they are not compared. 'On top of the block' is in the picture ('compared' vs 'extra').",
   "<b>Before every block, switch or not:</b> so one block always takes washout + block days, the length of the trial does not depend on the drawn order, and the washout days give nothing away.",
   "<b>The same marking as the result:</b> washout days are faint, as in the revealed strip on trials/result."]));
SCREENS.push(trialTerm("primary", ...TRIAL_TERMS.primary,
  "From the (i) beside 'Primary outcome' on trials/measure. A line from the start to the end: fixed at the start (a lock), it decides at the end (a tick). Labels: 'fixed', 'decides', 'before the start', 'end'.",
  ["<b>Neutral about the choice:</b> the sheet explains what a primary outcome is, not which one to take (composite, one score, or none)."]));
SCREENS.push(trialTerm("composite", ...TRIAL_TERMS.composite,
  "From the (i) beside 'Composite score' on trials/measure. Three scores (6, 3, 5) become one symptom score (4.7).",
  ["<b>Aligned first:</b> a score where higher is better (sleep quality) is turned around before averaging, so the composite always reads 'higher = worse'."]));
