/* Insights tab (14 Sep … today Tue 3 Nov 2026, 51 days, one check-in score each evening). Strongest pattern first.
   The cards say what happened in plain words; the numbers appear only after a tap.
   DEMO NUMBERS for presentations: chosen to show a clear effect, they no longer match the calendars / score series on the
   protocol screens; within the Insights screens they agree (see pattern-skip.js, ask-skip.js, ask-answer.js, eval-rapamycin.js).
   · Naltrexon noon dose skipped 6 times. The same evening vs. other evenings: fatigue 7.5 vs. 5.9 (+1.6), pain 4.0 vs. 3.1
     (+0.9), brain fog 4.7 vs. 4.0 (+0.7), likely (insights/pattern-skip and its states -pain, -fog).
   · Naltrexon 0.5 → 1 mg on 12 Oct. Fatigue 14 Sep–11 Oct 6.2 (28 days), 12 Oct–3 Nov 5.1 (23 days) → 1.1 lower = 18 %
     (of the 6.2 shown on insights/ask-answer), likely. (Brain fog rose 3.8 → 4.4 over the same weeks; the Ask answer says so.)
   · Rapamycin 19 Sep, 29 Sep, 6 Oct, 16 Oct, 25 Oct (5 doses): an evaluation of the two days after each dose, 6 measures
     differ (insights/eval-rapamycin). */
const INSIGHTS_PATTERNS = [
  {t:"pattern", src:"protocols", l:"After a skipped noon dose of Naltrexon, your fatigue, pain and brain fog were worse the same evening.", n:"Seen 6 times", conf:"likely", go:"insights/pattern-skip"},
  {t:"pattern", src:"protocols", l:"Since you increased Naltrexon from 0.5 to 1 mg, your fatigue has decreased by 18 %.", n:"Over 3 weeks", conf:"likely"},
  {t:"pattern", src:"protocols", l:"Your Rapamycin evaluation", n:"6 things were different in the two days after", go:"insights/eval-rapamycin"},
];
const INSIGHTS_ASK = {t:"tile", tone:"white", l:"Ask about your data", n:"Tap a question or ask in your own words.",
  chips:["Did the dose change help?","What happens after I skip a dose?","How were my last two weeks?","Ask by voice"],
  go:["insights/ask-answer","insights/ask-skip","insights/ask-weeks","voice/listen"]};
const INSIGHTS_TRIALS = {t:"tile", tone:"white", l:"Find out if something really helps", n:"A blinded test against a placebo, with a helper.",
  chips:["Start a trial"], go:["trials/intro"]};
/* the optional trial guide, a small entry under the trial card in every state of the tab (trials/guide) */
const INSIGHTS_GUIDE = {t:"note", l:"New to trials? A two-minute guide ›", go:"trials/guide"};
const INSIGHTS_CONCEPT = [
  "<b>Three steps, one per area:</b> log (Check-ins, Protocols), understand (this tab), later together. This tab has three parts: Patterns, Ask, Trials.",
  "<b>Patterns</b> are found automatically from a small fixed set of events (skips, dose changes, start / stop of a course, as-needed intakes). One plain sentence each, at most three, a quiet word for how sure (hint · likely · strong) and the icon of the area it comes from. The card says what happened in words; the numbers come after a tap. Wording: 'goes along with', never 'causes'.",
  "<b>Evaluation:</b> for an as-needed protocol the app can also look at everything that was different after it (Rapamycin: six measures from check-ins and Apple Health). Its card names the evaluation, not one finding, and opens an overview (insights/eval-rapamycin).",
  "<b>Ask</b> is the agent. It picks from a fixed set of built analyses (before / after a change, days after an event, last weeks vs. earlier …); the language model only chooses the analysis and words the answer, the numbers come from the built functions. The answer is one chart card plus one sentence.",
  "<b>Pin to Insights</b> turns an answer into a widget on this page, so every user's Insights tab becomes their own (insights/home-pinned).",
  "<b>Trials:</b> a personal placebo-controlled test (N-of-1, see BACKLOG). Started here, from a pattern ('Run a trial' on the evidence screen) or from a protocol's detail screen; all open trials/intro (flow 'Personal trial'). A quiet line under the trial card opens the optional two-minute guide (trials/guide) in every state of the tab. While a trial runs, its card takes this place (insights/home-trial); when it is over, the result card (insights/home-result).",
  "<b>Placeholders:</b> the first and the third pattern and all three questions have their own screen; the second pattern has none yet. 'Ask by voice' opens the listening layer.",
  "<b>Colour:</b> the page is the Insights world (lilac rosé); a pattern's icon tile wears the world of its source (Protocols periwinkle, PRINCIPLES 9). No tinted card here: nothing on this page wants something from the user right now (PRINCIPLES 8)."
];
SCREENS.push({ id:"insights/home", area:"Insights", status:"idea", title:"Insights · patterns, ask, trials",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 2 likely",
  why:"The first Insights tab: what the app found (Patterns), a way to ask your own question (Ask), and a place for a personal trial (Trials). Patterns come first and fit the first screen; Ask starts below them.",
  concept: INSIGHTS_CONCEPT,
  w:[
    {t:"head", l:"Insights"},
    {t:"sec", l:"Patterns", r:"found in your data"},
    ...INSIGHTS_PATTERNS,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    {t:"sec", l:"Trials"},
    INSIGHTS_TRIALS,
    INSIGHTS_GUIDE,
  ]});
