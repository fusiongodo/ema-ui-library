/* Step 4 of the trial setup. What blinding requires comes first (the rule, trialRule in trials/intro), not one recipe: there
   are endlessly many ways to prepare look-alike units, and the person picks one. "Ways to prepare" opens the optional guide
   with examples (trials/guide-prepare). `of` names the screen itself: × / "Back to your setup" on the helper preview
   (trials/peek-*) return to where this step already stands in the stack. */
SCREENS.push({ id:"trials/helper", area:"Insights", status:"idea", title:"Trial · 4 Your helper",
  sheet:true, of:"trials/helper",
  why:"Who prepares the capsules, after the three things blinding needs: you can't tell real and placebo apart, only the helper knows which is which, each one carries only a number. How they are made is the person's choice; 'Ways to prepare' shows examples. By default the helper opens the fill plan on their own phone (a link or this QR code), so the plan never touches this phone. The same-phone way is a quiet switch behind a helper PIN. 'See what Sam will see' shows Sam's pages and comes back here.",
  concept:[
    "<b>The rule, not a recipe:</b> three short points in the tone of the intro, each with a small picture: indistinguishable to you (look, size, weight, sound when shaken, taste); only the helper knows; each unit carries only a number. 'Blinded' in the heading carries an (i) (trials/term-blinded).",
    "<b>The method is the person's:</b> powder in own opaque capsules, a small capsule inside a larger one, a matching placebo, sachets … 'Ways to prepare ›' opens the optional guide (trials/guide-prepare): examples, clearly not requirements. Not a step one has to pass.",
    "<b>Organizer or numbers:</b> Sam can fill the person's own pill organizer week by week (the place says the day, nothing is written on a capsule) or number all 63 at once; Sam chooses on their own phone (trials/helper-setup).",
    "<b>Same words as Sam's plan:</b> numbered capsules, one a day. The number tells nothing.",
    "<b>Own phone by default:</b> the safest secret is one that is never on your device. Send a link or let the helper scan the code; it opens the fill plan once (flow 'Trial · helper').",
    "<b>See what Sam will see:</b> a quiet link under the code opens Sam's three pages as a preview (trials/peek-welcome → peek-plan → peek-done, drawn from the helper's own screens) and returns here. The preview shows the plan's form, not the real order.",
    "<b>Same phone, quietly:</b> for people without a helper with a smartphone. The plan then opens only with a helper PIN.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"4 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"Who prepares the capsules?", n:"Someone you trust, once, before the start. How is up to you, as long as this holds:"},
    {t:"sec", l:"Blinded", info:"trials/term-blinded"},
    trialRule("Sam"),
    {t:"note", l:"Ways to prepare ›", go:"trials/guide-prepare"},
    {t:"note", l:"Sam can fill your pill organizer week by week, or number them all at once."},
    {t:"field", l:"Helper", v:"Sam"},
    {t:"qr", l:"Sam scans this", n:"Opens the fill plan on Sam's phone."},
    {t:"note", l:"See what Sam will see ›", go:"trials/peek-welcome"},
    {t:"toggle", l:"Sam uses this phone instead", on:false},
    {t:"note", l:"Then the plan opens only with a helper PIN."},
    {t:"btn", l:"Send Sam the link", go:"trials/review"},
  ]});
