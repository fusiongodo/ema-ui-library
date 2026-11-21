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
/* stat: the data strip under the sentence in Studio (lib/cozy.js studio pass; every other theme ignores it). num = the effect
   size, big; lab = what it is (shown uppercase); n = how many behind it, left in the footer (replaces "Seen 6 times");
   chart = the small chart beside the number, on the 0–10 score scale (dom = the part shown):
     {t:"above", usual:[low, mid, high], v:[values]}  the usual band (middle half of the other evenings) and one dot per event
     {t:"box", rows:[[label, [min, q1, median, q3, max]], …]}  box plots, the first the comparison (dashed), the last the finding
     {t:"dots", rows:[[label, [values]], …]}  one dot per value (a trial's blocks) with a median tick, rows as for box
   The pattern's conf (hint · likely · strong) becomes the three-step meter beside n. An evaluation (rows instead of num):
   rows = [label, relative change in % (sets the bar, around zero; left = the measure went down), value as said], more = the
   line under them.
   Values: skip 7.5 vs. 5.9, the six evenings 8 7 7 8 8 7 (insights/pattern-skip), the band the quartiles 5 · 6 · 7 of the 45
   other evenings; dose 6.2 (28 days on 0.5 mg) → 5.1 (23 days on 1 mg) = −18 %, five-number summaries of the ask-answer series
   0.5 mg 4 5 6 7 8, 1 mg 4 5 5 5 7; Rapamycin pain 3.4 vs. 4.2 = −19 %, sleep 6 h 50 vs. 7 h 25 = −35 min (−8 %), brain fog
   3.6 vs. 4.2 = −14 % (insights/eval-rapamycin). */
const INSIGHTS_PATTERNS = [
  {t:"pattern", src:"protocols", em:"stat-earlier-later", l:"After a skipped noon dose of Naltrexon, your fatigue, pain and brain fog were worse the same evening.", n:"Seen 6 times", conf:"likely", go:"insights/pattern-skip",
    stat:{num:"+1.6", lab:"Fatigue · vs. usual", n:"n = 6 skips · same evening",
      chart:{t:"above", dom:[4, 9], usual:[5, 6, 7], v:[8, 7, 7, 8, 8, 7]}}},
  {t:"pattern", src:"protocols", em:"stat-before-after", l:"Since you increased Naltrexon from 0.5 to 1 mg, your fatigue has decreased by 18 %.", n:"Over 3 weeks", conf:"likely",
    stat:{num:"−18%", lab:"Fatigue · 3 weeks", n:"n = 28 vs 23 days",
      chart:{t:"box", dom:[3, 9], rows:[["0.5 mg", [4, 5, 6, 7, 8]], ["1 mg", [4, 5, 5, 5, 7]]]}}},
  {t:"pattern", src:"protocols", ic:"overview", em:"stat-evaluation", l:"Your Rapamycin evaluation", n:"6 things were different in the two days after", go:"insights/eval-rapamycin",
    stat:{rows:[["Pain", -19, "−19%"], ["Sleep", -8, "−35 min"], ["Brain fog", -14, "−14%"]], more:"+ 3 more · tap for all"}},
];
/* the Patterns heading of every state of the tab; span = the stretch of data looked at (Studio's note: "Last 8 weeks") */
const INSIGHTS_PATTERNS_SEC = {t:"sec", l:"Patterns", r:"found in your data", span:"8 weeks"};
const INSIGHTS_ASK = {t:"tile", tone:"white", l:"Ask about your data", n:"Tap a question or ask in your own words.",
  chips:["Did the dose change help?","What happens after I skip a dose?","How were my last two weeks?","Ask by voice"],
  go:["insights/ask-answer","insights/ask-skip","insights/ask-weeks","voice/listen"]};
/* the Trials heading in every state of the tab: "+ Add" at its right end, as "Your protocols" in Protocols; sets up a
   (further) trial. The start tile below it (INSIGHTS_TRIALS) only stands where no trial exists yet. */
const INSIGHTS_TRIALS_SEC = {t:"sec", l:"Trials", act:"+ Add", go:"trials/intro"};
const INSIGHTS_TRIALS = {t:"tile", tone:"white", l:"Find out if something really helps", n:"A blinded test against a placebo, with a helper.",
  chips:["Start a trial"], go:["trials/intro"]};
/* Apple Health, offered once in the default tab (between the patterns and Ask); "Not now" leads to the state without it
   (insights/home-no-health), "Connect" to the sheet (health/connect, flow "Apple Health"). Other states of the tab have none. */
const INSIGHTS_HEALTH = {t:"tile", tone:"white", l:"Your tracker already knows more", n:"Steps, sleep and heart rate from Apple Health can show what comes before a bad day. Nothing to log.",
  chips:["Connect Apple Health","Not now"], go:["health/connect","insights/home-no-health"]};
/* the optional trial guide, a small entry under the trial card in every state of the tab (trials/guide) */
const INSIGHTS_GUIDE = {t:"note", l:"New to trials? A two-minute guide ›", go:"trials/guide"};
const INSIGHTS_CONCEPT = [
  "<b>Three steps, one per area:</b> log (Check-ins, Protocols), understand (this tab), later together. This tab has three parts: Patterns, Ask, Trials.",
  "<b>Patterns</b> are found automatically from a small fixed set of events (skips, dose changes, start / stop of a course, as-needed intakes). One plain sentence each, at most three, a quiet word for how sure (hint · likely · strong) and an Insights icon of its own (a finding: a rising line with a spark; an evaluation: an overview) on a tile in the colour of the area it comes from. The card says what happened in words; the numbers come after a tap. Wording: 'goes along with', never 'causes'.",
  "<b>Evaluation:</b> for an as-needed protocol the app can also look at everything that was different after it (Rapamycin: six measures from check-ins and Apple Health). Its card names the evaluation, not one finding, and opens an overview (insights/eval-rapamycin).",
  "<b>Ask</b> is the agent. It picks from a fixed set of built analyses (before / after a change, days after an event, last weeks vs. earlier …); the language model only chooses the analysis and words the answer, the numbers come from the built functions. The answer is one chart card plus one sentence.",
  "<b>Pin to Insights</b> turns an answer into a widget on this page, so every user's Insights tab becomes their own (insights/home-pinned).",
  "<b>Trials:</b> a personal placebo-controlled test (N-of-1, see BACKLOG). Started here, from a pattern ('Run a trial' on the evidence screen) or from a protocol's detail screen; all open trials/intro (flow 'Personal trial'), as does '+ Add' on the Trials heading in every state of the tab; the start tile stands only while no trial exists. A quiet line under the trial card opens the optional two-minute guide (trials/guide) in every state of the tab. While a trial runs, its card takes this place (insights/home-trial); when it is over, the result card (insights/home-result).",
  "<b>Placeholders:</b> the first and the third pattern and all three questions have their own screen; the second pattern has none yet. 'Ask by voice' opens the listening layer.",
  "<b>Apple Health</b> is offered once, at the moment it first helps, not in onboarding: a white card, not tinted, because nothing is demanded (PRINCIPLES 8). 'Not now' removes the card (insights/home-no-health); it comes back in the Check-ins settings (not drawn).",
  "<b>Colour:</b> the page is the Insights world (lilac rosé); a pattern's icon is Insights' own, its tile wears the world of its source (Protocols periwinkle, PRINCIPLES 9), so a finding about a protocol no longer looks like a Protocols item but still says where it comes from. No tinted card here: nothing on this page wants something from the user right now (PRINCIPLES 8)."
];
SCREENS.push({ id:"insights/home", area:"Insights", status:"idea", title:"Insights · patterns, ask, trials",
  tabs:"idea", tab:"Insights", sub:"3 patterns · 2 likely",
  why:"The first Insights tab: what the app found (Patterns), a way to ask your own question (Ask), and a place for a personal trial (Trials). Patterns come first and fit the first screen; Ask starts below them.",
  concept: INSIGHTS_CONCEPT,
  w:[
    {t:"head", l:"Insights"},
    INSIGHTS_PATTERNS_SEC,
    ...INSIGHTS_PATTERNS,
    INSIGHTS_HEALTH,
    {t:"sec", l:"Ask"},
    INSIGHTS_ASK,
    INSIGHTS_TRIALS_SEC,
    INSIGHTS_TRIALS,
    INSIGHTS_GUIDE,
  ]});
