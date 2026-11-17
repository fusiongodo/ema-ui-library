# Backlog

Ideas that are not being built yet. Newest first.

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
