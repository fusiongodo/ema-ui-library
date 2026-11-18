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

*Trial length.* He wants 2 weeks as an option; the UI is liked but the method behind it is not right yet. Proposal: the length is a result, not a choice. Two things decide it:
1. How fast the substance acts and wears off → length of one period. Within a day (e.g. caffeine, a painkiller): 1–2 days. Within a few days (most supplements): 1 week. Slower: 2 weeks or unsuitable.
2. How sure the result should be → number of A/B pairs. The swap test has 2^pairs possible orders, so 3 pairs can at best show a hint (1 in 8), 4 pairs "likely" (1 in 16), 6 pairs "strong" (1 in 64).
Total = 2 × pairs × period. So 2 weeks is fine for a fast-acting substance (seven pairs of single days) and impossible for a slow one. UI: ask "How quickly do you notice it?" first, then show the same length chips, each labelled with what it can show ("can show: hint / likely / strong"), impossible ones greyed. Days not counted at the start of a period scale with the speed.

*Helper.* The idea is liked, but neither the user nor he understood the step when first seeing it. What is missing is the physical story before the question "who fills the capsules": what you need (empty opaque capsules, a filler, 8 small boxes), what the helper does once (about 20 minutes), what you do each week (take the next numbered box). Proposal: one illustrated "How it works in real life" step before the helper step, and a preview of what the helper will see. Also add a way without a helper, since many users are housebound: self-blinding with coded boxes (you fill both kinds yourself, seal them in identical boxes with a code sticker from the app, shuffle them; each week you scan the box and only the app knows which kind it was). This is the method of the self-blinding microdose study (Szigeti et al. 2021).

*Rhythm of check-in scores.* Today every check-in asks every score (EMA style). Open: some scores belong in every check-in, some once a day, some every few days or weekly. Options: (a) one check-in that assembles itself from whatever is due, (b) the check-in holds only the several-times-a-day scores and a separate format holds the rest, (c) several kinds of check-in. Proposal: (a). Each score has a rhythm (every check-in / once a day at a chosen check-in / every n days / weekly); the check-in asks what is due and shows less often asked scores as a short extra block that can be postponed. One habit, one entry point, and the voice and trial flows keep working unchanged. Anything tracked is a check-in score; "add a score" in the trial setup creates one with a rhythm.

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

## Apple Health data
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

## Meadow: background shapes
Low priority (Alex, 17 Nov 2026). The moving discrete blobs in the Meadow background distract. Replace with very soft gradient fields that shift slowly. Keep the shape inside the "Check-in now" card; he likes how it frames the button.

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
