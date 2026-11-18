/* The optional guide for a first trial: what a blinded trial is (three ideas, the same pictures as the info sheets), the one
   rule, and ways to prepare. Offered quietly, never a step: "New to this? A two-minute guide" on trials/intro, a small entry in
   the Trials section of the Insights tab (INSIGHTS_GUIDE, every state of the tab), and "Ways to prepare" on the helper step,
   which opens the second page directly. Both pages close with "back", so they return to wherever they were opened. */
SCREENS.push({ id:"trials/guide", area:"Insights", status:"idea", title:"Trial guide · what a blinded trial is",
  sheet:true,
  why:"A two-minute read for a first trial: the three ideas behind it (placebo, blinded, randomized), each as a small picture with one or two sentences, then the one rule for preparing the capsules, then a way on to the examples. Opened from the intro or the Insights tab; nothing here is required before a trial.",
  concept:[
    "<b>The same pictures as the (i) sheets:</b> one visual language for each term, wherever it is met (trials/term-*).",
    "<b>The rule, then the methods:</b> what must hold comes before any example, so no example reads as the way to do it.",
    "<b>Optional:</b> × and Done go back to where the guide was opened; the setup never waits for it.",
  ],
  w:[
    {t:"shead", left:"", l:"Guide", n:"about 2 minutes", right:"×", goRight:"back"},
    {t:"big", l:"How a blinded trial works", n:"Three ideas and one rule."},
    {t:"explain", pic:"placebo", l:TRIAL_TERMS.placebo[0], n:TRIAL_TERMS.placebo[2]},
    {t:"explain", pic:"blinded", l:TRIAL_TERMS.blinded[0], n:TRIAL_TERMS.blinded[2]},
    {t:"explain", pic:"randomized", l:TRIAL_TERMS.randomized[0], n:TRIAL_TERMS.randomized[2]},
    {t:"sec", l:"The one rule", r:"for preparing"},
    trialRule("the helper"),
    {t:"tile", tone:"white", l:"Ways to prepare", r:"›", n:"Four examples, from capsules to sachets", go:"trials/guide-prepare"},
    {t:"btn", l:"Done", go:"back"},
  ]});
SCREENS.push({ id:"trials/guide-prepare", area:"Insights", status:"idea", title:"Trial guide · ways to prepare",
  sheet:true,
  why:"Examples of how a helper can make real and placebo look alike, as short illustrated cards. Clearly examples, not requirements; it ends with the reminder that any way is fine as long as the rule holds. Opened from the helper step ('Ways to prepare ›') or from the first page of the guide.",
  concept:[
    "<b>Examples, said at the top:</b> the cards show ways people do it, not the way. The substance and the person decide.",
    "<b>Four cards, one picture and one or two sentences each:</b> own capsules with powder and a filler; a small capsule inside a larger opaque one, the gap filled so it does not rattle; a matching placebo of the same size and weight; numbered sachets for a drink.",
    "<b>The rule closes it:</b> you can't tell them apart, only the helper knows, each carries only a number. Injections and other forms need their own setup, said in one line.",
  ],
  w:[
    {t:"shead", left:"", l:"Ways to prepare", n:"examples", right:"×", goRight:"back"},
    {t:"big", l:"Many ways work", n:"A few examples. Pick what suits your substance, or your own way."},
    {t:"explain", pic:"prep-fill", l:"Fill your own capsules", n:"Buy the substance as a powder and fill empty opaque capsules: some with it, some with a filler such as rice flour."},
    {t:"explain", pic:"prep-nest", l:"A capsule inside a capsule", n:"Put the small capsule whole into a larger opaque one and fill the gap so it doesn't rattle. For placebo, the large one holds filler only."},
    {t:"explain", pic:"prep-match", l:"A matching placebo", n:"A placebo capsule of the same size and weight, bought or made. Check that both also look and sound the same."},
    {t:"explain", pic:"prep-sachet", l:"Sachets for a drink", n:"Numbered sachets with the powder or a filler that looks alike, stirred into a strong-tasting drink."},
    {t:"note", l:"Any way is fine as long as the rule holds: you can't tell them apart, only the helper knows which is which, and each carries only a number. Injections and other forms need a setup of their own."},
    {t:"btn", l:"Done", go:"back"},
  ]});
