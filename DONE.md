# Done

What was asked for and is built or decided, by area, with the day it landed. Kept for the presentation. Open ideas stay in `BACKLOG.md`; this file only grows. "Built" means: clickable in the prototype (`wireframes.html`, published as an artifact), not in the Swift app. Nothing here was tested on a real iPhone unless it says so.

Maintained by Claude: when a backlog item is finished, it gets a line here.

## The prototype itself
- **3 Nov** · Soft wireframes; screens split into "current" and "proposed" per area; concept notes next to every screen.
- **17 Nov** · Clickable prototype: flows drawn as maps, Play mode on a phone frame, themes.
- **18 Nov** · Hidden phone scrollbar in Play.
- **19 Nov** · Flow view zooms out until the whole flow fits (like Figma).

## Looks
- **17 Nov** · Cozy (one colour per area), Sky, Dusk, Meadow, Wire.
- **17 Nov** · Principles 8 (one tinted card) and 9 (colour = place).
- **18 Nov** · Theme Studio. Meadow with a gradient field.
- **19 Nov** · Organizer and day strip share their colours in every theme (orange only fitted Sky).

## Today
- **17 Nov** · Widget home: greeting, "Check-in now" as the one tinted tile, two status tiles, scores of the week, Play.
- **19 Nov** · Principle 11: Today is the reception. One quiet, dismissible line when something is due: more active than your usual, about your trial, a trial milestone.
- **19 Nov** · "Scores · 7 days" is a fold, open by default, closable.

## Check-ins
- **17 Nov** · Check-in as one sheet with all scores as sliders, each on its last value; Save works without touching anything.
- **19 Nov** · Group "From Apple Health" under the own scores (see Apple Health).

## Protocols
- **3 Nov** · Add flow for one item and for a group (several items, one plan).
- **17 Nov** · Today as folds (Morning, Noon, Evening); collection "All protocols"; detail with an 8-week intake calendar and history; review card as the end of every add flow.
- **17 Nov** · Several doses per day in the calendar; pickers for rhythm, start, end, time.
- **18 Nov** · Split days drawn in place in the calendar.

## Voice
- **17 Nov** · Listening layer over the current page with draft cards and a sign for how sure the app is; guided mode ("Ask me instead") with five spoken questions; mic inside forms.
- **17 Nov** · Decisions: speak first, conversation only when needed; nothing is saved without confirmation; unsure values carry an `inferred` flag.

## Insights
- **17 Nov** · The tab: Patterns, Ask, Trials. Evidence screen; three questions with answers; "Pin to Insights".
- **18 Nov** · Pattern cards say what happened in words, numbers after a tap; evidence for three scores; the Rapamycin evaluation (better / worse, check-ins and Apple Health side by side); finding icon on pattern cards.
- **19 Nov** · "+ Add" on the Trials heading in every state of the tab.

## Personal trial (N-of-1)
- **17 Nov** · The flow: setup, running, early stop, result; the helper's fill plan.
- **18 Nov** · Hidden blocks (no visible block pattern); design step with three values (block, washout, total) and the sum; blind check once at the end instead of a weekly guess; Magnesium as the trial item under Protocols.
- **18 Nov** · Outcome choice: composite score, one score, or none; proper terms with an (i) each (principle 10: few words, proper terms); blinding as three rules instead of a recipe; optional two-minute guide.
- **18 Nov** · Exact block duration with washout before every block; total rounded up to whole blocks; day strip tidy to the last dot.
- **19 Nov** · Helper side: three choices (form, placebo filling, where they go), the plan as the person's own pill organizer week by week (numbered bags as the alternative), look-alike check, sealed photo, "How it was prepared" in the result.
- **19 Nov** · Helper pages reachable inside the app from setup step 4: same phone with a helper PIN, or a link sent.
- **19 Nov** · Feedback round: wording ("Get ready", "Fill by plan"), picture tiles for "You'll need", amounts in doses, questionnaires and Apple Health in the setup.
- **19 Nov** · Setup says which scores the app gently reminds about (a line with a bell); running trial shows check-ins and days the tracker was worn; result has a card for the Health measures chosen before the start.

## Apple Health
- **19 Nov** · Concept, accepted by Alex with changes: your usual instead of a goal; no new tab; one model over all data; honest gaps; pacing by pulse and medications left out.
- **19 Nov** · Built: connect card and sheet; the crash pattern right after connecting, with check-ins and tracker data on one page; four measures in Check-ins against your usual (deviation, as usual, no data); Steps detail with four weeks, the band of the usual and gaps as gaps.

## Intro
- **17 Nov** · Seven storyboards; the animated Hands intro in the prototype (a stopgap).
- **18 to 19 Nov** · Story in Alex's words; sketches "One dot each" 1 and 2; six motion studies; his ranking written down (`intro-storyboards/README.md`).
- **19 Nov** · His own sequence "The cloud" as a script; a first playable draft as particles in Three.js. Not judged yet.
- **19 Nov** · The playable draft is judged: "pures Gold". Kept as the reference; the final version comes later in other tools. A short version (5 to 7 seconds) is written down.
- **19 Nov** · Three rounds on the motion of "The cloud": one turning direction, thin rays and small signals, a gentle centre, all movements overlapping. His verdict on round 3: "YES!!!".
- **19 Nov** · Decided: no SVG for the intro or the clay icons.

## Icons
- **18 Nov** · Icon Lab: for each icon the reference next to five variants of our own, he approves or rejects. Round 1 with 15 icons: 10 decided, 4 rejected, 1 open. References, variants and decisions are kept in the repo (`icon-lab/`).
- **18 Nov** · Decided: no redraw until a method for the clay look is found.

## How we work
- **19 Nov** · Claude writes concept and every detail; Opus agents only build. While a direction is open, the plan is named first.
- **19 Nov** · This file.
- **19 Nov** · `LINKS.md`: every published page with its link and its source file.

## Research
- **19 Nov** · Play: which game platforms give results back, which cognitive tasks fit, what iOS allows for games (`research/play-games.md`).

## Play
- **19 Nov** · Play section: game of the day, games in the app, level chosen freely and saved with the result, a calm result against your usual, "Not today" with a reason, connecting through the agent with tiles, "How you played" over four weeks. The game itself is a stand-in.
- **19 Nov** · Calm game cards: each game with a soft picture strip of its own (CSS, pastel, nothing moves); a stand-in screen for Dual n-back; a card "Word groups".
