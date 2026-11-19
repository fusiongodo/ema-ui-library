/* Step 2 of the trial setup. Neutral wording on purpose (a trial must not suggest a direction): no "improve", "change",
   "help" anywhere in this step. Demo: Fatigue, Pain, Brain fog tracked; primary outcome = their composite (one symptom score).
   The person chooses how the result is judged; three equal ways, none marked as better:
     Composite score  – the tracked scores as one number (averaged per day after aligning them so higher = worse)
     One score        – one of them decides, the others are reported next to it (pills to pick which)
     No primary outcome – all of them side by side, as equals
   The three are states of one screen (`of`), so a tap changes the step in place and Back skips them. */
const MEASURE_WAYS = [
  ["Composite score", "Fatigue, Pain and Brain fog as one symptom score"],
  ["One score", "One of them decides, the others are reported next to it"],
  ["No primary outcome", "All of them side by side, as equals"],
];
const MEASURE_IDS = ["trials/measure", "trials/measure-one", "trials/measure-none"];
function trialMeasure(k, title, why, concept){
  return { id:MEASURE_IDS[k], area:"Insights", status:"idea", title, sheet:true, of:"trials/measure", why, concept,
    w:[
      {t:"shead", left:"‹", l:"Set up a trial", n:"2 of 4", right:"×", goLeft:"back", goRight:"close"},
      {t:"big", l:"Which scores do you want to track?", n:"From the check-in scores you already log."},
      {t:"sec", l:"Check-in scores", r:"choose several"},
      {t:"pills", multi:true, items:["Fatigue","Pain","Brain fog","Sleep","Mood"], on:["Fatigue","Pain","Brain fog"]},
      {t:"note", l:"🔔 You get a gentle reminder for these, only if one is missed often."},
      {t:"note", l:"+ Add a score", go:"checkins/config"},
      {t:"sec", l:"Primary outcome", info:"trials/term-primary", r:"how it is judged"},
      {t:"list", rows:MEASURE_WAYS.map(([l, n], i)=>[l, i === k ? "✓" : "", "", n]),
        go:MEASURE_IDS.map((id, i)=>i === k ? null : id), info:["trials/term-composite", null, null]},
      ...(k === 1 ? [{t:"pills", items:["Fatigue","Pain","Brain fog"], on:["Fatigue"]}] : []),
      {t:"note", l:"Whichever way you choose is fixed before the start. Judged side by side, each score needs a clearer difference before the app calls it ‘likely’: with more scores, one of them stands out by chance more easily."},
      {t:"sec", l:"Also for this trial"},
      {t:"list", rows:[["Questionnaires","Instrument Q1 ›"],["Apple Health","Steps, Sleep ›"]], go:["trials/pick-questionnaires","trials/pick-health"]},
      {t:"btn", l:"Continue", go:"trials/length"},
    ]};
}
SCREENS.push(trialMeasure(0, "Trial · 2 Scores and primary outcome",
  "Which check-in scores the trial looks at, and how the result is judged: as one composite score, by one score, or with no primary outcome (all side by side). Chosen before the start. Demo: the composite of Fatigue, Pain and Brain fog. Below, 'Also for this trial' adds questionnaires and Apple Health measures, each from its own picker.",
  [
    "<b>From the check-ins:</b> the scores the person already logs, nothing new to record. '+ Add a score' opens the check-in configuration, where a new score is created for every check-in.",
    "<b>The person decides how the result is judged.</b> Pain, brain fog, fatigue and sleep all matter for a functioning life; forcing one of them to decide would be a bias of its own. Three equal ways, each with its meaning in one line, none marked as better.",
    "<b>Proper term, explained on demand:</b> 'Primary outcome' with an (i) (trials/term-primary); 'Composite score' with its own (i) (trials/term-composite).",
    "<b>The honest part, one calm sentence:</b> whichever way is chosen is fixed before the start; judged side by side, each score needs a clearer difference before the app calls it 'likely', because with more scores one of them stands out by chance more easily. Information, not a warning.",
    "<b>States in place:</b> a tap on 'One score' or 'No primary outcome' changes this step in place (trials/measure-one, -none, `of`); 'One score' adds a row of pills to pick which.",
    "<b>Neutral wording:</b> the step asks what to track, not what should happen. No word suggests an expected direction.",
    "<b>What is chosen here is what the app reminds about,</b> gently and only when needed (the line with the bell); other scores are still evaluated afterwards, without reminders.",
    "<b>Also for this trial:</b> two rows open pickers for questionnaires (trials/pick-questionnaires) and Apple Health measures (trials/pick-health); both are optional and fixed before the start like the rest.",
  ]));
SCREENS.push(trialMeasure(1, "Trial · 2 Primary outcome: one score",
  "The same step with 'One score' chosen: a row of the tracked scores appears under the choice to pick which one decides (Fatigue here). The others are reported next to it.",
  ["<b>Only tracked scores</b> can be the one that decides; the pills follow the scores chosen above."]));
SCREENS.push(trialMeasure(2, "Trial · 2 Primary outcome: none",
  "The same step with 'No primary outcome' chosen: every tracked score is reported side by side, as equals. The sentence under the choice says what that costs.",
  ["<b>Nothing hidden:</b> with no primary outcome each score is judged on its own, so each needs a clearer difference before it is called 'likely'."]));
