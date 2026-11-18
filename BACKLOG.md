# Backlog

## Where we are (17 Nov 2026)

**Clickable in the prototype**
- Today, Check-ins with the slider sheet, Protocols (today, all, detail with intake calendar)
- Add flow ending in the review card
- Voice: listening layer with draft cards, guided mode, mic inside forms
- Insights: patterns, evidence screen, Ask (three questions) with pinned answers
- Personal trial: setup, running, weekly guess, early stop, result, and the helper's fill plan (flows `trial`, `trial-helper`)
- Protocol detail: several doses per day in the calendar, pickers for rhythm / start / end, Magnesium with "Test this"
- Looks: Cozy (one colour per area), Sky, Dusk, Meadow, Wire; intro (Hands)

**Decided**
- Principles 8 (one tinted card) and 9 (colour = place)
- Voice: speak first, conversation only when needed; one agent, global and local door; result is always the review of the manual flow; unsure values are saved with an `inferred` flag
- Frame of the app: Log → Understand → Together (see below)

**Open, by size**
- Small gaps in the prototype: Skip / Pause for today exist in the Swift app's check-in but not in the prototype's sheet (would be one quiet line, both closing the sheet); items without a detail screen are not tappable
- Trial, questions that showed up when it was drawn: "strong" can never appear with 8 weeks (4 pairs give at best about 1 in 8), so the hint / likely / strong labels need defining per trial length; the weekly guess only works if the person knows A is the substance; how the person's own Magnesium is paused during the trial and who buys capsules and filler; the prototype jumps from week 3 to the result
- Larger concepts, not designed yet: Apple Health and activity, sending a voice message to the app, time of day in Cozy, shared data
- Look and feel: intro (Hands is animated and in the prototype as a stopgap; a real animation with a story comes later, see below), the real companion illustration, Meadow background, ambient sound
- The real app: nothing is built in Swift yet; the prototype lives on branch `claude/clickable-prototype`, not merged, not pushed

**Suggested order**
1. ~~Pick an intro from the storyboards and animate it.~~ Done: Hands.
2. ~~Design the trial flow as a clickable prototype.~~ Done.
3. ~~Close the small gaps in the prototype.~~ Done, except Skip / Pause.
4. Port a first slice to the Swift app (Today and the check-in sheet in the Cozy look) to feel it on the phone.
5. Design Apple Health and activity in the prototype (feeds Patterns without logging effort).

Below: ideas that are not being built yet. Newest first.

## Review of Insights and the trial flow (Alex, 18 Nov 2026)
**Being changed now**
- Pattern cards say what happened in words, numbers only after a tap: "After a skipped noon dose of Naltrexon, your fatigue, pain and brain fog were worse the same evening." / "Since you increased Naltrexon from 0.5 to 1 mg, your fatigue has decreased by 18 %." / a third card that is an evaluation of one protocol ("Your Rapamycin evaluation": shorter and worse sleep, slightly worse recovery, but lower pain, lower brain fog, more steps).
- Evidence screen: the chart card is liked; the plain list "The days" under it falls out of the quality of the app and goes.
- Trial step 2: "What should it change?" is too suggestive. New: "Which scores do you want to track?", chosen from the check-in scores, one marked as main outcome. The app should keep to scientific standards wherever that is practicable.

**To frame together before building (proposals, not decided)**

*Trial design: the app gives structures, the user decides (Alex, 18 Nov 2026).* My first proposal (the app derives period length from how fast the substance acts) was rejected: that is the app steering the trial, one level too high. Half-life, build-up time and block length are the user's design decisions. The app only offers the building blocks underneath.

His core sentence: **a trial is a protocol that is blinded and randomized in a structure that fits the substance. That is the only difference.** The same evaluations should exist for plain protocols (when a protocol starts, changes or stops).

Frame that follows from it (proposal, to discuss):
- *One evaluation, three levels of evidence.* The evaluation screen (like "Your Rapamycin evaluation") compares scores between two sets of time. Only the source of the two sets differs: observed (before / since a start or change, days after a dose), planned (open on / off phases), tested (blinded and randomized). The trial result is the same screen with the strongest badge.
- *What the app must do, because a person cannot:* draw the order by chance, keep the key hidden until the end, and report honestly what the chosen design can show at most ("can show: hint / likely / strong" as information, never as a requirement).
- *What the user decides, from a few structures:*
  1. What carries a label. Either **two containers A and B** plus a schedule that says which one to take from when (simple; fits two vials; weakness he named: over time you notice which one helps, so the blind dissolves), or **numbered single units** taken in order (each capsule, each pre-drawn syringe, each day's or week's box has its own number; the number tells nothing).
  2. How long the same kind runs in a row: every intake, every day, blocks of n days or weeks. Free choice, with a few presets as starting points.
  3. How long overall, and optionally how many days at the start of a block are not counted.
  4. Who holds the key: a helper who prepares from a fill plan, or yourself with coded stickers and shuffling.
- The fill plan is then just the list "label → real or placebo" in whatever unit was chosen.
- Open: does a trial live under Protocols (it is a protocol with two switches, "blinded" and "randomized") with only its result in Insights? Should "planned, not blinded" (open on / off phases) be offered as its own lighter option?

*Helper.* The idea is liked, but neither the user nor he understood the step when first seeing it. What is missing is the physical story before the question "who fills the capsules": what you need (empty opaque capsules, a filler, 8 small boxes), what the helper does once (about 20 minutes), what you do each week (take the next numbered box). Proposal: one illustrated "How it works in real life" step before the helper step, and a preview of what the helper will see. Also add a way without a helper, since many users are housebound: self-blinding with coded boxes (you fill both kinds yourself, seal them in identical boxes with a code sticker from the app, shuffle them; each week you scan the box and only the app knows which kind it was). This is the method of the self-blinding microdose study (Szigeti et al. 2021).

*Where a trial lives (Alex, 18 Nov 2026, undecided).* By clean architecture it belongs under Protocols. By feel it belongs to Insights: Protocols is the everyday side, Insights the scientific, statistical one, and Protocols is already crowded while Insights is calm, so a trial stands out there. He suspects "less clutter" might be a lazy reason. Working rule until decided: doing lives in Protocols, understanding lives in Insights. The capsule taken every day is a protocol item; the trial as an experiment (setup, status, result) is in Insights and can be started from both sides. This is what the prototype does now.

*Where a trial lives: decided (Alex, 18 Nov 2026).* The working rule above holds: doing lives in Protocols (the daily routine), understanding lives in Insights. A running trial also appears under Protocols as the capsule of the day.

*The person must not see any pattern (Alex, 18 Nov 2026).* Visible block boundaries slowly break the blind: if blocks always start on a Monday and last a week, every boundary is a moment where a change can be noticed. So: the capsule is taken every day without a visible rhythm, numbered single units taken in order; the app draws the order and also where each block begins (no fixed weekday, block lengths vary around the chosen length, the trial may open with a few placebo days); the days after a switch are left out by the app, which knows the key, and the person never learns which days those were. The person still has to set these values, but never sees the resulting schedule. The blind check asks what one thinks one took over the last days, not "A or B this week".

*Outcome of a trial is the person's choice (Alex, 18 Nov 2026).* Being forced to pick one score that decides is rejected: pain, brain fog, fatigue and sleep all matter. The person chooses: a composite score of all tracked scores, one score as primary outcome, or no primary outcome (all reported as equals). Note for later: a single pre-specified primary outcome is the convention in confirmatory trials, and the reason behind it stays true here: the more scores are judged side by side, the more easily one stands out by chance. The app does not force the choice but accounts for it: the choice is fixed before the start, and with several scores each needs a clearer difference before it is called "likely".

*Proper terms with an info icon (Alex, 18 Nov 2026).* A little more technical vocabulary (block duration, washout period, total duration, primary outcome, placebo, blinded, randomized), each explained on demand by a small picture and one or two sentences instead of being paraphrased on the screen.

*Blinding: teach the rule, not a recipe (Alex, 18 Nov 2026).* There are endlessly many ways to prepare (own capsules from powder, a small capsule inside a larger opaque one filled so it does not rattle, a placebo of equal size and weight, injections …). The app states what blinding requires (indistinguishable in look, size, weight, sound, taste; only the helper knows; units carry only a number) and offers example approaches in an optional guide. The guide is also the optional tutorial for a first trial and stays reachable from the Trials section.

*Block duration is exact and excludes the washout (Alex, 18 Nov 2026).* "About 1 week" is out. A block of 1 week with a washout of 3 days means: washout days, then 7 counted days, after a switch again washout days, then 7 counted days. Hiding where blocks begin does not need varying lengths: the order is drawn at random and not simply alternating (two blocks of the same kind can follow each other), and the trial can open with lead-in days.

*Rounding and phase (Alex, 18 Nov 2026).* One block takes washout + block duration (2 weeks + 3 days = 17 days). The total duration is rounded up to whole blocks so that at least the chosen duration is covered (12 weeks → 5 blocks = 85 days), and the screen says so. Since exact blocks would make boundaries predictable for someone who knows their settings, the app also draws where the first block begins (one block is split between start and end). Later, on the helper's side: the helper states what the control substance is (sugar, rice flour …).

*Tone of the trial texts (Alex, 18 Nov 2026).* Relaxed everyday language that still uses the proper terms ("real" and "placebo", "blinded"); action titles on the intro ("A helper fills the capsules", "You log as usual").

*How a trial starts: decided (Alex, 18 Nov 2026).* The kind of the first block is drawn at random, real or placebo, whether or not the substance was taken before. The person must not be able to tell whether the trial opens with a washout. Consequence: nothing about the start is visible or configurable. If the substance was taken right before the start (the app knows this from Protocols) and placebo comes first, the app leaves the first washout days out of the comparison; otherwise it does not. The number of capsules and the length of the trial are the same in every case, so the length gives nothing away.

*Preparation steps on the helper's side (next larger piece, not built).* The helper's page is still thin: preparing step by step, stating the control substance (sugar, rice flour …), optional photo or video as proof of the blind (see below).

*Magnesium is the trial item (Alex, 18 Nov 2026, being built).* "Magnesium · paused for the trial" next to a separate "Study capsule" confused him. Under Protocols, Magnesium itself is shown as the active item with a "Trial" mark and today's capsule number; wording for the thing one takes: "trial capsule".

*A running trial under Protocols (being built).* The study capsule appears on today's page and under All protocols with the number to take today, has its own detail screen (intake so far, what to do about a missed capsule) and links to the trial status in Insights.

*Blind check once, at the end (18 Nov 2026).* A weekly "what do you think you took?" makes the person watch for an effect and can feed expectation; trials usually ask at the end. The prototype asks one question right before the reveal ("Could you tell when you were on Magnesium?"). A correct guess is not treated as failure: it can mean the blind slipped or that the substance did something noticeable. If the weekly data point is wanted later, it becomes a setting in the design step (at the end / weekly / never).

*Needs a statistics check before anything real is built:* the "can reach 'likely' at most" line and the chance figure in Details assume a test that re-draws the blocks the way the app drew them (random boundaries, varying lengths).

*Trial design step (built in the prototype, to react to).* Three values the person sets, nothing recommended: about how long one block lasts (1 day … 2 weeks, custom), days after each switch that are left out of the result (capsules are still taken), total length (2 / 4 / 8 / 12 weeks, custom). The helper step gets the physical story (what you need, what the helper does once, what you do) and a way to look at the helper's side. Further blinding variants (two labelled containers vs. numbered single units, injections, self-blinding) come later.

## Protocols: physical therapies from a shared catalogue (Alex, 18 Nov 2026)
Protocols should become uniform across kinds. Besides substances there are physical therapies (HBOT, IHHT, mats and the like), and each needs its own configuration fields (IHHT has other settings than HBOT). Idea: a catalogue of therapies maintained by the app's team, each entry defining its configuration items. If a therapy is missing, the user sends a request to the backend and the maintainers add it. Seed it by hand with the standard therapies, with or without evidence; people may enter whatever they use.
Not for trials for now: physical therapies can hardly be blinded, so "What do you want to test?" stays with substances.

## Trial: which scores (Alex, 18 Nov 2026, open)
Two thoughts that pull apart. (a) Simply everything one tracks anyway: all check-ins, the weekly ones, whatever exists; not yet framed. (b) For the weeks of a trial, a small chosen subset gets special discipline, and the app motivates the person to log at least those consistently. Possible reconciliation (mine): everything tracked is evaluated; the selection in the setup is a focus set the person commits to and gets reminded of, and the composite is built from it.

## Trial, helper side later: document the blinding (Alex, 18 Nov 2026)
Optional: the helper takes a photo or a short video showing that real and placebo look alike and make no sound when shaken, or documents a small visible difference. Later, when data are read across users (meta level), an AI can look at this material to judge the quality of the blind and weight the trial accordingly.

## How scores and check-ins are structured (open, Alex, 18 Nov 2026)
Not known yet; it will probably settle once the general outcome-measure model is chosen (a common standard such as PROMIS). What it has to hold:
- Check-ins several times a day, daily, every few days; some weekly ones that look at other things.
- Benchmarks (the games), already in the app.
- Tracker data from Apple Health: also outcome measures.
- Maybe official questionnaires (Canadian Consensus Criteria, DSQ and the like). Too specific and not user-friendly as they are; open whether they come in at all.

Consequence for trials: scores are tracked independently of a trial. A trial only makes the intake of a protocol happen under certain conditions, so that statements about the scores become possible. "Which scores do you want to track?" in the trial setup is therefore not a function but a psychological step: start tracking something new, or decide what to keep up reliably during the trial. What does stay a real decision before the start is the main outcome.

Earlier thought on rhythm (mine, one option among several): one check-in that assembles itself. Each score has a rhythm (every check-in / once a day / every n days / weekly); the check-in asks what is due and shows the rarer scores as a short extra block that can be postponed. Alternatives: a separate format for everything that is not several times a day, or several kinds of check-in.

## Intro: a real animation with a story
**Alex, 17 Nov 2026:** the seven storyboards are nice but none shows what he wants to say: everyone contributes their part of the data to the whole, and together that changes something and brings light into the dark. No literal cloud. The animated Hands intro is "a bit annoying" and stays only until this is done. He wants to think about the story himself first.

Picture ideas to start from:
- A blurry picture gets sharp: every contribution is one pixel.
- A dark room and many lamps: each lights one patch, only together they show what is in the room. Closest to "sharing data" plus "light into the dark"; could be combined with the hands (each hand puts down a light).
- A mosaic: everyone lays one stone, the motif shows from afar.
- Points become a line: single measurements say nothing, many show a curve.

Making it: Claude has no image or video model; the storyboards are hand-written SVG. External services are an option (he is open to it). Video from a start and end frame: Kling about $0.07–0.14 per second, Veo 3.1 Fast about $0.10–0.12, Veo 3.1 Standard $0.40 (prices read 17 Nov 2026); an experiment of 20–30 clips is roughly $10–30. Generated video garbles text, so the wordmark is always laid over in code.

## Decisions on voice (Alex, 17 Nov 2026)
- Opening one draft card and saving it returns to the remaining drafts, not to the page.
- An unsure value may be saved without forcing the user, but the stored entry carries a flag (`inferred` / unconfirmed).
- Uncertainty is shown visually, not as text or a hard progress bar. Direction: a small sky sign per entry (clear sun = all confirmed, sun behind a cloud = partly inferred, cloud = mostly guessed).
- The guided mode asks all scores, not only the likely changes.
- The prototype is also used for presentations; example texts should read well aloud.

## Send a voice message to the app
**Idea (Alex, 17 Nov 2026):** not always in the mood to open the app. Record a voice message anywhere (WhatsApp chat with yourself, Voice Memos, even one sent to a friend), then share it to MEjority; the app builds the entries from it and shows the usual draft cards. Technically a share target for audio. He calls it over-engineered but wants it as a user.

Addition (18 Nov 2026): the check-in should carry the time the message was recorded, not the time it was shared, if the timestamp survives sharing (to be checked for WhatsApp and Voice Memos). Some people keep a WhatsApp group with themselves for exactly this.

## Apple Health data
Asked for again on 18 Nov 2026 as a backlog item of its own: connect the app with Apple Health. The Rapamycin evaluation in the prototype already shows three Health measures (sleep duration, recovery, steps) with their source.

Show imported data (sleep, steps, heart rate variability and the like) in the UI in a realistic way. For the prototype this is a display question only; the import is the technical side.

Feeds Patterns without any logging effort: steps above the personal usual → fatigue two days later (the overexertion crash), short sleep → brain fog next day, resting heart rate / HRV as early warning. Makes an exertion slider in the check-in optional.

## The app follows the time of day
Dark blue at night, lighter in the morning, more colour during the day (Alex, 17 Nov 2026). The Sky theme already does this; open how it combines with one colour per area in Cozy. Goes with: a loving companion that is always there, and soft background sound (see Ambient sound).

## How the app hangs together (frame, 17 Nov 2026)
Three steps, one per area:
1. **Log** – Check-ins, Protocols, and later activity ("did too much today").
2. **Understand** – the Insights tab. Three sections:
   - *Patterns*: found automatically, one sentence each (see below).
   - *Ask*: the agent. It picks from a fixed set of built analyses and shows the result as a chart card; the language model only chooses and words, the numbers come from the built functions. "Pin to Insights" turns an answer into a widget, so every user's Insights tab becomes their own.
   - *Trials*: where a personal placebo-controlled trial lives (see below). Started from a pattern ("Want to know for sure?") or from a protocol's detail screen ("Test this").
3. **Together** – later: users share data on a privacy-compliant server so statistics across people become possible. This is what the name MEjority points at.

Activity matters most for step 2: the crash one or two days after overdoing it is the hallmark of ME/CFS, so "did too much → worse two days later" is the first pattern worth building. Needs an exertion score in the check-in.

## Intro: several concepts to choose from
**Idea (Alex, 17 Nov 2026, not to build yet):** the intro should say "many people together". His picture: cartoon hands come together in a circle, stacked, go up together, then a warm orange sun and the wordmark MEjority. Plan: work out several different concepts, he picks a few, those get built as animations, then compare.

Seeds:
- Hands huddle → hands go up → sun rises behind them → wordmark.
- Many small lights, one per person, drift together and become the sun.
- A town at dusk: windows light up one by one (people at home, each alone), until the lit windows form the wordmark. Speaks to being housebound and unseen.
- One cloud, joined by more, parting to show the sun (grows out of the current intro).

## Patterns on the protocol detail screen
**Idea (Alex, 17 Nov 2026, brainstorm only):** on a protocol's detail screen, show what goes along with intake events, e.g. "skipped noon dose" as a predictor of worse fatigue, pain, brain fog. Too many possible statistics to expose directly.

**Direction**
- The app looks for a small fixed set of events: skips, dose changes, start/stop of a course, as-needed intakes.
- Each finding is one plain sentence in a "Patterns" section, at most three, ranked: "After a skipped noon dose your fatigue was 1.4 higher the next day (6 times)."
- Tap opens the evidence: "days after a skip" next to "other days", the single days listed, a plain confidence label (hint / likely / strong). Numbers like n, effect size and method sit behind "Details".
- Wording stays "goes along with", never "causes". Skips happen more often on bad days, so the direction is unclear; say that on the screen.
- A pattern can offer the next step: "Want to know for sure? Run a trial" → N-of-1 trial below.
- The Insights tab collects the patterns of all protocols.

## Several doses per day
**Open (Alex, 17 Nov 2026):** the intake calendar shows one dot per day; unclear for medication taken 2–3 times a day.

**Direction:** keep the calendar, split the day dot into one segment per planned dose (morning / noon / evening); a missed dose is a hollow segment. Tap shows "Thu 30 Oct · morning ✓ · noon skipped · evening ✓". One line under the calendar names a repeated gap: "Noon dose missed on 4 of 8 Thursdays."

## Themes (Alex, 18 Nov 2026)
- A sixth theme, "Studio", is being built from an inspiration he found (a calm consumer health app): neutral stage, grey cards, black pills for the main action, the area colour only in pastel icon tiles, soft dimensional icons, floating tab bar. Not a copy; principles only. Plan: several themes exist side by side, later the best parts are mixed into one look of our own.
- Cozy: "not bad, but can be developed further".
- A really beautiful sky as a background picture: he wants to pick reference graphics himself first.
- Icons he is unsure about: the capsule on the pattern cards (being replaced by an Insights icon in the source area's colour) and the flask on the Trials tile (left as it is for now).
- No visible scrollbar inside the phone in the prototype (done).

## Icons of our own: the Icon Lab (Alex, 18 Nov 2026)
**How it works:** for each icon he sees the reference cut out of the inspiration next to three to five variants of our own, and approves one or rejects all. "Inspired, not copied": he wants to keep working on the variants himself. When every icon is approved, the set goes into Studio and the other themes. Everything is in `icon-lab/` (references, variants as modules and as single SVG files, generators, decisions); see `icon-lab/README.md`.

**Round 1 (15 icons), decided:** tab-today B, tab-checkins D, tab-protocols A, tab-insights D; protocol-pill, sleep, pain, evaluation in clay (A); steps as a footprint (E); calendar soft flat (B). For tiles, clay is clearly his direction.

**Open:**
- New variants for protocol-injection, checkin-chat, log-scores and wellbeing (all five rejected, no reason given yet); guide is undecided.
- The four chosen tab glyphs come from three different families; they need one pass to become a set.
- Not drawn yet: empty-state illustration, the companion, control glyphs, trial flask, the finding and overview icons on pattern cards.
- The references are another app's artwork: never ship them, remove them before the repository becomes public.

## Meadow: background shapes
(Alex, 17 Nov 2026; being done 18 Nov.) The moving discrete blobs in the Meadow background distract. Replace with very soft gradient fields that shift slowly. Keep the shape inside the "Check-in now" card; he likes how it frames the button.

## Personal placebo-controlled trial (N-of-1)

**Idea (Alex, 17 Nov 2026):** Find out whether one substance really helps *this* person. A helper fills opaque capsules, some with the substance (A), some with placebo (B). The user logs intake and symptoms as usual without knowing which is which. After about two months the app unblinds and shows the result, e.g. "Your fatigue is measurably better in A weeks."

**Roles**
- Participant: blinded. Sees only "study capsule taken / missed".
- Helper: unblinded. Fills the capsules from a fill plan and never tells.

**How the secret is kept**
- The app draws the random order, not the helper (people randomize badly).
- The fill plan is shown only in a helper view: opened on the helper's phone via link or QR, or behind a helper PIN on the user's phone.
- The app locks the allocation and all A/B comparisons until the trial ends. No peeking.

**Design choices to make**
- Period length and count: e.g. 8 one-week periods in 4 pairs, order randomized within each pair. Pairs keep A and B balanced over time.
- Carry-over: substances that act slowly or linger blur the periods. Option to ignore the first 1–2 days of each period; warn that some substances are unsuitable.
- One primary outcome chosen before the start (e.g. fatigue), others shown as secondary. Prevents picking the best-looking score afterwards.
- Blinding check: at the end of each period ask "A or B this week?" If guesses are right most of the time, the blind failed and the result says so.

**Daily use**
- No new habit: the study capsule is one protocol item, check-ins are the outcome data.
- Missed doses are logged, not hidden; the analysis reports adherence.

**Result**
- Compare period averages, not single days (days within a week are not independent).
- Randomization test over the possible A/B orders gives an honest p-value for few periods.
- Show effect size with uncertainty first, "significant or not" second. With 8 periods only clear effects will show; say that up front.

**Limits to state in the app**
- Suited to supplements and optional add-ons. Swapping a prescribed drug for placebo needs the doctor.
- One person's result, not general evidence.

**Open questions**
- Helper view: second device or PIN on the same phone?
- Can the trial be stopped early, and what is shown then?
- Fixed templates (4, 8, 12 weeks) or free configuration?

## Ambient sound
Soft background sound in the real app (Alex, 17 Nov 2026: calm, focus-music feel). Not in the browser prototype; sound does not start reliably there. Needs an off switch and must never start on its own.

## Insights tab
Empty in the prototype. Needs a first screen.

## Add flow shows no result
After "Add to Morning" the Morning fold is still empty. The prototype has no state; decide whether a second "after" screen is worth it.
