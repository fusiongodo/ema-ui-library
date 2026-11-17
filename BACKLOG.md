# Backlog

Ideas that are not being built yet. Newest first.

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
