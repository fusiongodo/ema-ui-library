/* Step 3 of the trial setup: the design of the trial. The person sets the shape; the app draws the order of the blocks and
   where the first one begins (randomized), keeps both hidden, and says what the chosen design can show at most.
   Demo: block duration 1 week, washout period 2 days, total duration 8 weeks (TRIAL_PLAN in trials/intro).
   The block model: a block is exact and counts only the days that are compared (1 week = 7 compared days). Every block is
   preceded by its washout days, switch or not: capsule days of the kind that follows, left out of the comparison. So one
   block always takes washout + block = 2 + 7 = 9 days (the owner's example: 2 weeks + 3 days = 17 days), and the length of
   the trial does not depend on the drawn order.
   The total is rounded up to whole blocks, so at least the chosen duration is covered, and the screen says so:
   8 weeks = 56 days → 56 / 9 = 6.2 → 7 blocks = 63 days (63 capsules). (12 weeks with 17-day blocks: 84 / 17 → 5 blocks
   = 85 days.) An odd number of blocks: one kind gets one more (4 and 3); which kind is part of the draw.
   No visible rhythm without varying the blocks: the order is drawn, and so is where the first block begins (the sequence
   is shifted by a drawn number of days, one block split between the start and the end of the trial); the person only
   ever sees numbered capsules.
   What a design can show at most: with b blocks split k / b − k, the app could have drawn C(b, k) orders; at best only the
   drawn one puts every real block below every placebo block, so a result can reach 1 in C(b, k): 4 blocks 1 in 6 ("hint"),
   5 blocks 1 in 10 ("hint"), 6 blocks 1 in 20 ("likely", the word the app uses for about once in 20 elsewhere:
   insights/eval-rapamycin, pattern-skip), 7 blocks (4 / 3) 1 in 35 ("likely"), 8 blocks 1 in 70 ("likely"), 10 or more
   1 in 252 or rarer ("strong", from about 1 in 100). The test asks in the direction fixed before the start (lower on the
   real days). Each score judged side by side has to clear a stricter bar (three scores: about three times rarer, 'likely'
   from about 1 in 60), so with 7 blocks a single score reaches 'hint' at most (trials/result).
   No word here steers ("recommended", "enough", "best", "should" are left out on purpose).
   Terms: Block duration, Washout period, Randomized each carry an (i) (screens/trials/terms.js). */
SCREENS.push({ id:"trials/length", area:"Insights", status:"idea", title:"Trial · 3 How it runs",
  sheet:true,
  why:"The design of the trial, set by the person: block duration, washout period, total duration. Nothing is preselected as a recommendation. The proper terms carry a small (i) that explains them with a picture. Under them a deliberately veiled strip of the days, the plain arithmetic of this design and one line on what it can show at most.",
  concept:[
    "<b>Three values, all the person's:</b> block duration (1 day, 3 days, 1 week, 2 weeks, custom), washout period (none, 1, 2, 5 days, custom), total duration (2, 4, 8, 12 weeks, custom). The rows open a half-height picker, the total stays as chips.",
    "<b>Exact, no 'about':</b> a block of 1 week is 7 days, and all 7 are compared. Washout days are not part of a block; they come on top, before every block, switch or not. So one block takes 9 days here.",
    "<b>Rounded up to whole blocks, said once:</b> 8 weeks are 56 days, 7 blocks of 9 days are 63. The heading of the total says '63 days', the sentence under the strip says why. Rounding up so the chosen duration is really covered.",
    "<b>Proper terms, explained on demand:</b> an (i) in each row opens a half sheet with a small picture and one or two sentences (trials/term-block: a block of 7 compared days, the washout days before it marked as extra, the next block, and what you see instead; trials/term-washout: a switch, the earlier kind fading over the first days, those days marked as washout, on top of the block). The (i) is its own tap; the row still opens its picker.",
    "<b>Where blocks begin is the app's secret, without varying them:</b> the person knows the block length, so if they knew where the first one begins, every boundary would be a moment to notice a change. So the app draws the order of the blocks (which kind gets the extra one too) and where the first one begins: the whole sequence shifted by a few days, one block split between the start and the end. The person only ever sees numbered capsules. The heading over the strip names it: Randomized (i).",
    "<b>The picture is veiled on purpose:</b> 63 dots, all alike, no line between blocks and no weekdays, so it cannot be read as the schedule.",
    "<b>Information, not a requirement:</b> with 7 blocks, 4 of one kind and 3 of the other, the app can draw 35 orders; at best the drawn one is the only one that puts every Magnesium block below every placebo block, 1 in 35, so a result can reach 'likely' at most. The line follows the design; it never says what to choose.",
    "<b>The app's part only:</b> it does not derive the regimen from the substance, does not suggest a length and hides no fixed rules.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"3 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"How should it run?", n:"Real and placebo days come in blocks. You set their length and the total."},
    {t:"list", rows:[["Block duration","1 week ›"],["Washout period","2 days ›"]], go:["trials/pick-block","trials/pick-skip"],
      info:["trials/term-block","trials/term-washout"]},
    {t:"sec", l:"Total duration", r:"rounded up: 63 days"},
    {t:"pills", items:["2 weeks","4 weeks","8 weeks","12 weeks","Custom"], on:["8 weeks"], go:[null,null,null,null,"trials/pick-total"]},
    {t:"sec", l:"Randomized", info:"trials/term-randomized", r:"hidden from you"},
    {t:"daystrip", veil:true, days:63,
      l:"<b>8 weeks → 63 days, one capsule a day.</b> 7 blocks of 7 days, each with 2 washout days before it. That's rounded up to whole blocks, so the 8 weeks are fully covered. One kind gets 4 blocks, the other 3. The app draws the order and where the first block begins, so you won't know when one starts."},
    {t:"note", l:"With 7 blocks a result can reach ‘likely’ at most."},
    {t:"btn", l:"Continue", go:"trials/helper"},
  ]});
