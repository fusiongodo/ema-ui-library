# Backlog

**Done items are collected in `DONE.md`** (what was asked for and built, by area, with dates; for the presentation).

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

*Preparation steps on the helper's side (first version built 19 Nov 2026, concept only, waiting for Alex's review).* His input: the helper prepares the blinded samples; tablets are hard to mask, opaque capsules can work; and for labelling "the helper could simply take the person's supplement organizer and sort placebo or active into it as the app says: Monday this, Tuesday that". Built on Sam's side: three choices before filling (form, placebo filling = the control substance, where they go), the fill plan as **Alex's pill organizer, one week at a time**, with numbered bags as the second way, a look-alike check (look, weight, sound, smell), an optional photo that stays sealed until the result, done with the next fill date. On Alex's side the result gets "How it was prepared".
Open after this pass:
- The rule on Alex's side still says "each one carries only a number"; with the organizer nothing carries anything. The third point needs new words ("nothing on it says which is which").
- Alex's daily screens still say "capsule no. 19"; with the organizer it would be "today's capsule".
- With the organizer the helper comes back every week and the plan stays with the helper for the whole trial: more chances to slip than one session with numbered bags. Whether the organizer should be the default is his call.
- Several organizers filled at once, and a reminder for the helper, are named but not drawn.
- The form picker is longer than its half sheet; "Examples with pictures" needs scrolling.

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

**The story in his words (Alex, 18 Nov 2026):** millions of people with this illness collect data points every day, each alone; there are hardly any studies because the illness is underfunded. Here the data is collected for free, unified, and brought to one centre where the crossover evaluation is made. If something helps several people (ideally something that can be blinded, checked against placebo), the signal shows in the data; the statistics are published, so others find it too. Swarm intelligence; light into the dark; the Middle Ages are broken through and a kind of Enlightenment begins.

**Scene proposal "One dot each" (Claude, 18 Nov 2026; not yet seen as pictures):** the hero is the dot, the same dot a person sets in the app every day.
1. Dark. One dot lights up: one person, one day. Alone it says nothing.
2. Pull back: dots everywhere in the dark, scattered, each alone, flickering.
3. They set off: thin trails of light travel to one centre.
4. In the centre the heap sorts itself: noise becomes two rows (real and placebo), and one row rises. A signal.
5. The signal turns into light and runs back out along the trails to every dot; the dark ground becomes dawn.
6. Wordmark over the bright sky.
Spoken lines to try: "Every day, millions of us notice what helps." / "Alone, it's a guess." / "Together, it's a signal." / "MEjority."

**Version 2 (19 Nov 2026), after his feedback on the first sketch.** He likes the story ("richtig geil") but frame 4 fell out of the picture: until then the dots were people, then they were suddenly trial data points in a chart. He wants it integrated, not removed. The cause sat in frame 3, where the people themselves moved to the centre. Now two things exist: a **star is a person and stays where it is**; a **spark is a data point and travels**. Sparks all look the same on the way (blinded); only in the centre they show their colour and sort into two layers, and the "real" layer lifts off the "placebo" layer. Same place, same sky, the people still around it; no axes. In frame 5 the lifted layer becomes the light that runs back along the same trails. Sketches: `intro-storyboards/sketches/one-dot-each.png` (first), `one-dot-each-2.png` (version 2). Open: his verdict on version 2; whether the lift should stay modest with some sparks left unsorted, so it reads as a signal and not as proof.

**His feedback on version 2 (19 Nov 2026):** he likes showing the whole process of statistics and empirical studies with glowing points and structures. The solid disc in frame 5 is "much uglier"; the first frame 5 (rays bursting to all points) was much nicer. Open for him: how the points should move and relate to each other so that it makes sense in the end; he asks what else is possible. And a new concern: "people, and data flows from each of them into a centre" feels like **Big Brother**; not nice either.

**Motion studies (being built 19 Nov 2026), `intro-storyboards/motion/index.html`:** six rough looping animations with points only, to choose a way of moving. 1 Sammeln (the storyboard, with the old burst instead of the disc), and five without a hub: 2 Gleichtakt (stars blink at random, then fall into step like fireflies), 3 Sternbild (threads between neighbours, a figure stays lit), 4 Schwarm (drifting sparks align into one rising band), 5 Kompass (each person's points stay with them; only the direction of their own difference shows, and most needles point the same way), 6 Verteilung (sparks pile up into two bell curves of points, one shifted). Claude's leaning: 5 answers the Big Brother concern best and is closest to what really happens (everyone runs their own trial, the per-person results are pooled).

**His verdict on the six study ideas (19 Nov 2026), before seeing them move:** stars sending their data to the middle is **not** Big Brother; that was a misunderstanding. Big Brother would be people shown connected by lines and sharing data. With stars it is fine. Gleichtakt, Sternbild and Schwarm are out ("lame"). **Verteilung is good**: points plus a statistical concept. The two sketches were much better than the study ideas. What the story should carry, in his words: science, sharing data, bringing enlightenment together, detecting signals together and letting the group learn from it, a distributed system, cooperation, integration, the statistical empirical process; take a part of that and make a simple, beautiful picture story with glowing points; at the end light, or hands in a circle, or only points. It does not have to be about people. He wants Claude to work the story out in every detail; the builder only executes.

**Script, version 3:** `intro-storyboards/script-one-dot-each.md`. The sketch story plus the distribution: sparks fall to the horizon and pile up into two heaps of points (placebo, real); the shift between them is the signal, and the warm heap becomes the rising sun whose light reaches every star. Not yet approved; nothing is built from it.

**Where it stands (Alex, 19 Nov 2026, after seeing everything):** the first sketch "One dot each" is his favourite (dot, stars, lines, the curve, the burst); the second sketch has good concepts but its frame 5 is bad; of the motion studies only the two heaps of points count. Next question, his: in which algebraic, geometric and statistical structures the stars could arrange themselves so that a good story comes out. **Method: SVG is finished for him**; candidates are video models fed with good stories, Blender, animation programs. The summary for quick access is `intro-storyboards/README.md`.

Alternatives for the picture world, same six beats: (a) night sky, loose stars are joined into a constellation that can be read, then day breaks; fits the Sky theme. (b) everyone carries a small flame to one place; together they become a beacon whose beam shows the way back to all; closest to "Middle Ages to Enlightenment". (c) Earth at night with lights, most literal for "millions everywhere".
Cautions: historical props (torches, monks) turn into pathos quickly; stay abstract with dark and light. Show a signal, not a cure; the app itself says "likely" at most.

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

### Concept (Claude, 19 Nov 2026; judged by Alex the same day: accepted with the changes under "Alex's verdict")
**What it is for, three jobs.**
1. *Scores without effort.* Steps, sleep, resting heart rate, heart rate variability stand next to the check-in scores as measures of their own.
2. *Exertion for the crash pattern.* "More than your usual, worse for two days" needs a measure of exertion; the tracker gives it without asking. **There is no Apple Health crash detector of its own: one model reads everything that is tracked** (check-in scores and Health measures), and a crash shows in both (see "One model over all data").
3. *In a trial.* Ticked measures are fixed before the start and the app reminds to wear and charge the tracker (his purpose); the result says how complete the data was.

**The stance: your usual, never a goal.** No rings, no 10,000 steps, no "good" or "bad". Every value is shown against the person's own usual (the middle half of the last four weeks) and worded as "higher / lower than your usual". For this illness more steps is not better. Follows principle 2: only a deviation gets a mark. Alex: "Finde ich sehr gut." Later: the usual over several windows (four weeks, three months, a year); "a problem we solve later".

**Where it lives. No new tab.**
- *Connect:* offered once, at the moment it first helps (a card on the Insights tab), not in onboarding. One sheet: which measures, one sentence on what for, "stays on this phone".
- *Check-ins:* a quiet group "From Apple Health" under the own scores; each measure has a detail view like a score: four weeks, the band of the usual, gaps shown as gaps.
- *Today:* one quiet line when today is clearly above the usual ("More active than your usual today"), as a pacing hint, never as praise. Alex: "Geile Idee"; we try it and see (see "Today is the reception").
- *Insights:* patterns and evaluations use the measures (the Rapamycin evaluation already does); Ask can answer about them.
- *Trials:* the picker in the setup (built), a line in the running state when the tracker was not worn, the measures in the result.

**First measures:** steps, sleep duration, resting heart rate, heart rate variability. **Later:** sleep stages, wrist temperature, menstrual cycle (a real confounder for symptoms), workouts.

**Honest data.** Not worn is "no data", never zero. The source is always named ("Apple Health", and the device behind it where known); Garmin, Oura and others come in through Apple Health without extra work.

**Privacy.** Only ticked measures are read; everything stays on the phone until the "Together" step exists, and then only with explicit consent.

### Drawn (19 Nov 2026, not yet judged by Alex)
Flow "Apple Health" in the prototype, start `insights/home` (the connect card sits on the normal Insights tab; "Not now" leads to `insights/home-no-health`): connect card and sheet (`health/connect`), the Insights tab after connecting with the crash pattern (`insights/home-health-on`, `insights/pattern-exertion`: check-ins and tracker data on one page), the group in Check-ins (`checkins/overview-health`) and the Steps detail (`health/steps`), three Today lines (`today/home-health`, `today/home-trial-nudge`, `today/home-trial-week`), days worn on `trials/running`, a Health card on `trials/result`. New widgets `usual`, `usualchart`, `brief`. Open: only Steps has a detail page; the switch 4 weeks / 3 months / 1 year is drawn but does nothing; the × on the Today line does nothing; Apple's own permission sheet is not drawn; the flow map has 107 screens because it follows every link.

### Alex's verdict (19 Nov 2026)
- **One model, not two.** The crash is visible in the scores as well as in the tracker data, so crash detection takes all data. Agreed by both; now written into job 2.
- **Today: try it.** We draw the line and decide later how Today is built.
- **Pacing by heart rate: separate and far later.** He would not base pacing on pulse; "for experts, I cannot say". Not part of this piece.
- **Medications from Apple Health: dropped.** "Hardly anyone uses Apple Health for medications." Writing symptoms to Health is not asked for either.
- Still open: how Health measures fit the general model of scores and rhythms (see "How scores and check-ins are structured").

## One model over all data (Alex, 19 Nov 2026)
Patterns, the crash above all, come from one model that processes every tracked score and every Apple Health measure together. No detector per source. On a screen this means: an evidence page lists what was different in the check-ins and in the tracker data side by side (as the Rapamycin evaluation already does).

## Measuring exertion: tracker, check-in or log (Alex, 19 Nov 2026, open)
The tracker measures exertion well, but it is not the only way. Ideas he threw in, none decided:
- **Asked several times a day:** "How active were you in the last two hours?" Five times over the day is much more precise than one question in the evening about the whole day.
- **The scale drifts.** A subjective 1 to 5 for activity can shift completely over the years: what was a 5 then is a 2 or 3 once the person is better. (Known as response shift.) Speaks against subjective activity as the only measure, for the tracker or for counted things.
- **Just talk, the agent extracts.** The person speaks into the log and the agent pulls out measures such as "read for one hour". Open what counts (what was read, how demanding).

## Trial: how well it is kept, and a gentle heads-up (Alex, 19 Nov 2026)
While a trial runs, check-ins (and the tracker) can be filled in too rarely. There must be a criterion; it could be set in the trial setup (which adherence one wants to reach). If the person falls below it: a heads-up, careful and never pushy, that can be ignored and swiped away or opened. Framed as "about your trial: what we noticed", with what could be done better or a small piece of information about the trial, nothing boring. **Only when needed:** if the person keeps to everything, the trial stays silent in the background. Milestones may speak ("week 2 done"). Tone matters doubly with this illness: no word that sounds like "try harder".

**Refined (Alex, 19 Nov 2026, later the same day):** the criterion follows what was chosen in the trial setup. The scores (and Health measures, questionnaires) picked there are the ones the app reminds about, very carefully; they are the ones that are best tracked consistently. The setup says so where they are chosen: a small sign with an explanation. The explanation also says that other scores are still evaluated afterwards, but the app does not remind about them. Drawn: a line with a bell on step 2 (`trials/measure`); a separate explanation sheet was drawn and removed again (superfluous). Still open: how often is "missed often", and whether the person sets it.

## Today is the reception (Alex, 19 Nov 2026)
Everything else is the back office; Today is what a good personal assistant who manages it all would tell you: not the details, only what you need or profit from most, with emotional intelligence and knowing the person. So Today carries a short briefing (a heads-up line or a careful banner, dismissible), and stays quiet when nothing is due. Examples: more active than your usual today; about your trial; a milestone.

**Scores as a fold (Alex, 19 Nov 2026):** "Scores · 7 days" threw four rows in the face, and there can be more scores. It becomes a fold like Morning / Noon in Protocols: a heading row that opens and closes, open by default so the page does not look empty. An emptier Today is fine; it fills up over time. Drawn: `today/home`, `today/home-scores-closed`.

Later idea: Today is modular and the agent asks after a while "Does the Today page annoy you? Shall we trim it? Just say it", then changes it.

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

## Emblems for patterns on the Insights tab (Alex, 19 Nov 2026)
Part of the design area, not thought through yet. The pattern cards have no real icons. He likes the icon of the Today line ("More active than your usual today": a small graph with a star) and wants something in that style. Patterns come in kinds that could each wear their own emblem: one from Apple Health (the exertion pattern), one about a protocol event and symptoms (the skipped Naltrexon dose, "a special feature: hey, you skipped"), one overall evaluation (Rapamycin). Whether the kinds are really these three is open ("erstmal egal, Design-Prototyp").

**Feedback on the Apple Health screens (Alex, 19 Nov 2026):** "Bin schon sehr, sehr glücklich mit allem", "wirklich richtig gute Arbeit". Corrected after it: step numbers lowered (3,400 steps by 14:00 is too much for someone chronically ill; about 1,800 a day is plausible), only one gap in the Health graphs on a presentation page, the explanation sheet for gentle reminders removed (not well designed, superfluous; the line with the bell stays, "sehr gut"), "Used in 1 pattern" reworded ("used" sounds as if the user had used it), the 0 to 10 scale named under score differences. Still open from his walk-through: only Steps has a detail page (accepted for now).

## Design: a theory of our own from comparable apps (Alex, 19 Nov 2026)
Belongs to the design area (clay tiles, Icon Lab, backgrounds). Analyse the design of other, comparable apps; find out what we like; from that develop a kind of theory of our design requirements, the ones that resonate with Alex as project manager; then apply these principles ourselves. Order: collect and look (with him, since resonance is his call), name what works and why, write it down as principles, only then draw. Not started.

## Play: games from other platforms instead of building them all (Alex, 19 Nov 2026)
For the games section (cognitive benchmarks): we do not have to build every game in our app.
- **Roblox:** if someone builds a game there that really challenges (concentrate, jump, time it: a good brain fog and endurance benchmark), the person could connect their Roblox account and simply play in Roblox; or the Play section holds a link, a tap opens the game in Roblox. The results come back into the app. "Falls Roblox sowas bietet, wäre das sehr geil."
- **Other platforms:** check which games and platforms offer an interface so that results land in the app directly.
- **Needs a broad search:** which game platforms would be good partners (account linking, reading scores, deep links into one game, terms for health use, children on Roblox). Not researched yet; nothing here is verified.

## Design work that is not SVG: backgrounds, pictures, avatars (Alex, 19 Nov 2026)
When the icons are taken up again with Blender or another program (the clay look, see the Icon Lab below), a second, separate piece of design work belongs next to it: **really beautiful backgrounds.** His example: at a certain time of day an orange and pink evening sky, not a sunset as a motif, just the clouds and the sky, running in a gradient into a slightly beige white. More of the same kind is needed: backgrounds, pictures, avatars; "a lot of design work that is not SVG".
- The style he means for the cloud pictures is the **Sky theme as it is now**, with its clouds and its moon: "der Mond, die Wolken, herrlich". That is the reference for skies, not for the clay objects.
- Related, already noted: a real sky as a background picture (he wants to pick references first), time of day in Cozy, the real companion illustration.
- How it is made is open, together with the tool question for the intro and the clay icons (video and image models, Blender, animation programs).

## Trial screens: feedback of 19 Nov 2026
- The helper flow is "really solid"; details later. It still has an **"Excel vibe"** in places, most of all the "You'll need" list. He is unsure whether better design would only clutter a flow that is already complicated for a user; Claude's line: turn only the list of physical things into pictures, leave the rest plain.
- Wording: "Choose how" sounds wrong; "Fill by plan" instead of "Fill by the plan".
- The orange for Magnesium in the organizer only looks right in Sky; in the other themes the organizer's colours do not fit, and even in Sky it could be better.
- After a trial is started, the Trials section should have an "Add" at the right of its heading, like "Your protocols" in Wire.
- Setup: questionnaires chosen specially for this trial, kept abstract for now ("Instrument Q1, Q2, Q3"); which ones is a separate branch of the project (the outcome-measures work).
- Setup: Apple Health data can be ticked. His purpose for ticking: the person takes special care to wear and charge the tracker during the trial. Data that was not ticked can still be evaluated afterwards. What else ticking should mean he does not know yet. Claude's reading, not yet answered by him: ticked = fixed before the start and part of the result; not ticked = looked at afterwards, a hint at most.

## Icons of our own: the Icon Lab (Alex, 18 Nov 2026)
**How it works:** for each icon he sees the reference cut out of the inspiration next to three to five variants of our own, and approves one or rejects all. "Inspired, not copied": he wants to keep working on the variants himself. When every icon is approved, the set goes into Studio and the other themes. Everything is in `icon-lab/` (references, variants as modules and as single SVG files, generators, decisions); see `icon-lab/README.md`.

**Round 1 (15 icons), decided:** tab-today B, tab-checkins D, tab-protocols A, tab-insights D; protocol-pill, sleep, pain, evaluation in clay (A); steps as a footprint (E); calendar soft flat (B). For tiles, clay is clearly his direction.

**On hold (Alex, 18 Nov 2026):** nothing is redrawn until he has found a good method for the clay look. His verdict on round 1: pure SVG did not get it right; above all the very soft shadings of clay did not work. Candidates to try, not decided: a 3D tool (Spline, Blender) with one material and one light for all icons, or an image model with a fixed style prompt and cut-out afterwards; either way the icons would become rendered pictures instead of SVG.

**Open:**
- New variants for protocol-injection, checkin-chat, log-scores and wellbeing (all five rejected); guide is undecided. Waits for the clay method.
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
