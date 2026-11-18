/* Step 3 of the trial setup: the design of the trial. The person sets the rough shape; the app draws where each block
   begins and what it is (randomized), keeps both hidden, and says what the chosen design can show at most.
   Demo: block duration about 1 week, washout period 2 days after each switch, total duration 8 weeks = 56 days, one capsule
   a day (TRIAL_PLAN in trials/intro). No visible rhythm: no fixed weekday, no fixed start, block lengths vary, 28 days real
   and 28 placebo.
   What a design can show at most, from the rough number of blocks b (about b/2 of each kind; the test re-draws the
   blocks the way the app drew them): about 4 blocks: nothing beyond chance · about 6: "hint" · about 8–10: "likely" ·
   about 12 or more: "strong". No word here steers ("recommended", "enough", "best", "should" are left out on purpose).
   Terms: Block duration, Washout period, Randomized each carry an (i) (screens/trials/terms.js). */
SCREENS.push({ id:"trials/length", area:"Insights", status:"idea", title:"Trial · 3 How it runs",
  sheet:true,
  why:"The design of the trial, set by the person: block duration, washout period, total duration. Nothing is preselected as a recommendation. The proper terms carry a small (i) that explains them with a picture. Under them a deliberately veiled strip of the days and one plain line on what this design can show at most.",
  concept:[
    "<b>Three values, all the person's:</b> block duration (about 1 day, 3 days, 1 week, 2 weeks, custom), washout period (none, 1, 2, 5 days, custom), total duration (2, 4, 8, 12 weeks, custom). The rows open a half-height picker, the total stays as chips.",
    "<b>Proper terms, explained on demand:</b> an (i) in each row opens a half sheet with a small picture and one or two sentences (trials/term-block: a few blocks of about that length and what you see instead; trials/term-washout: a switch, the earlier kind fading over the first days, those days marked as washout). The (i) is its own tap; the row still opens its picker. No paragraph under the rows any more: it sat under both and read as if it referred to both.",
    "<b>Where blocks begin is the app's secret:</b> if the person knew 'blocks are a week and start on Monday', every boundary would be a moment to notice a change, and the blind would slowly break. So the app varies each block around the chosen length, places them anywhere (the trial may open with three placebo days) and keeps real and placebo days balanced. The heading over the strip names it: Randomized (i).",
    "<b>The picture is veiled on purpose:</b> 56 dots, all alike, no line between blocks and no weekdays, so it cannot be read as the schedule. The sentence under it says why.",
    "<b>Information, not a requirement:</b> with about 8 blocks a result can reach 'likely' at most. About 6 blocks: 'hint' at most; about 12 or more: 'strong'. The line follows the design; it never says what to choose.",
    "<b>The app's part only:</b> it does not derive the regimen from the substance, does not suggest a length and hides no fixed rules.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"3 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"How should it run?", n:"Real and placebo days come in blocks. You set their rough length and the total."},
    {t:"list", rows:[["Block duration","About 1 week ›"],["Washout period","2 days ›"]], go:["trials/pick-block","trials/pick-skip"],
      info:["trials/term-block","trials/term-washout"]},
    {t:"sec", l:"Total duration"},
    {t:"pills", items:["2 weeks","4 weeks","8 weeks","12 weeks","Custom"], on:["8 weeks"], go:[null,null,null,null,"trials/pick-total"]},
    {t:"sec", l:"Randomized", info:"trials/term-randomized", r:"hidden from you"},
    {t:"daystrip", veil:true, days:56,
      l:"<b>56 days, one capsule a day.</b> About 8 blocks, 28 days real and 28 placebo. The app places the blocks and draws their order; you will not know when one begins."},
    {t:"note", l:"With about 8 blocks a result can reach ‘likely’ at most."},
    {t:"btn", l:"Continue", go:"trials/helper"},
  ]});
