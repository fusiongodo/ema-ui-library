/* Insights tab (14 Sep … today Tue 3 Nov 2026, 51 days, one score per day). Strongest pattern first.
   DEMO NUMBERS for presentations: patterns 1 and 3 are set to show a clear effect and no longer match the calendars /
   score series on the protocol screens; within the Insights screens they agree (see pattern-skip.js, ask-answer.js).
   · Naltrexon skipped 6 times. Fatigue the next day 7.5, the other 45 days 5.9 → +1.6, likely (insights/pattern-skip).
   · Naltrexon 0.5 → 1 mg on 12 Oct. Fatigue 14 Sep–11 Oct 6.21 (28 days), 12 Oct–3 Nov 5.13 (23 days) → 1.1 lower, likely.
     (Brain fog rose 3.8 → 4.4 over the same weeks; the Ask answer says so.)
   · Still from the sample data, deliberately weak: Rapamycin 19 Sep, 29 Sep, 6 Oct, 16 Oct, 25 Oct. Fatigue on the two
     days after (10 days) 5.60, other 41 days 5.95 → 0.4 lower, hint. */
const INSIGHTS_PATTERNS = [
  {t:"pattern", src:"protocols", l:"After a skipped noon dose of Naltrexon, your fatigue was 1.6 higher the next day.", n:"Seen 6 times", conf:"likely", go:"insights/pattern-skip"},
  {t:"pattern", src:"protocols", l:"Since Naltrexon went from 0.5 to 1 mg, your fatigue is 1.1 lower.", n:"Over 3 weeks", conf:"likely"},
  {t:"pattern", src:"protocols", l:"In the two days after Rapamycin, your fatigue was 0.4 lower.", n:"Seen 5 times", conf:"hint"},
];
const INSIGHTS_ASK = {t:"tile", tone:"white", l:"Ask about your data", n:"Tap a question or ask in your own words.",
  chips:["Did the dose change help?","What happens after I skip a dose?","How were my last two weeks?","Ask by voice"],
  go:["insights/ask-answer","insights/ask-skip","insights/ask-weeks","voice/listen"]};
const INSIGHTS_TRIALS = {t:"tile", tone:"white", l:"Find out if something really helps", n:"A blinded test with a helper, about 8 weeks.",
  chips:["Start a trial"], go:["trials/intro"]};
const INSIGHTS_CONCEPT = [
  "<b>Three steps, one per area:</b> log (Check-ins, Protocols), understand (this tab), later together. This tab has three parts: Patterns, Ask, Trials.",
  "<b>Patterns</b> are found automatically from a small fixed set of events (skips, dose changes, start / stop of a course, as-needed intakes). One plain sentence each, at most three, a quiet word for how sure (hint · likely · strong) and the icon of the area it comes from. Wording: 'goes along with', never 'causes'.",
  "<b>Ask</b> is the agent. It picks from a fixed set of built analyses (before / after a change, days after an event, last weeks vs. earlier …); the language model only chooses the analysis and words the answer, the numbers come from the built functions. The answer is one chart card plus one sentence.",
  "<b>Pin to Insights</b> turns an answer into a widget on this page, so every user's Insights tab becomes their own (insights/home-pinned).",
  "<b>Trials:</b> a personal placebo-controlled test (N-of-1, see BACKLOG). Started here, from a pattern ('Run a trial' on the evidence screen) or from a protocol's detail screen; all open trials/intro (flow 'Personal trial'). While a trial runs, its card takes this place (insights/home-trial); when it is over, the result card (insights/home-result).",
  "<b>Placeholders:</b> only the first pattern and the first question have their own screen. 'Ask by voice' opens the listening layer.",
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
  ]});
