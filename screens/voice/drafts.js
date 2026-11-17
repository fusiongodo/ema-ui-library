SCREENS.push({ id:"voice/drafts", area:"Voice", status:"idea", title:"Listening layer · understood",
  sheet:"half",
  why:"After the pause: the whole transcript, and below it one compact draft card per thing it understood, each in the colour of its area (PRINCIPLES 9), appearing one after another. A small sky sign on each card says how sure the agent is. 'Confirm all' saves them and closes the layer, back on the page you started from. A tap on a card opens its full overview, the same one the manual way ends in; saving it comes back here with that card ticked (voice/drafts-1).",
  concept:[
    "<b>Drafts, not entries:</b> the cards are the folded form of the review card (Check-in sheet, deviation card); nothing is saved until 'Confirm all' or the card's own Save (PRINCIPLES 5).",
    "<b>Readable in two seconds:</b> title + one line, only what changed ('rest unchanged'). Overall wellbeing and Thirst were not mentioned: they stay on the last value, muted in the sheet.",
    "<b>How sure, without text:</b> a small sky sign right in the card head. Clear sun = all of it was said and is unambiguous; sun half behind a cloud = partly worked out; cloud = mostly guessed. A tap on the sign says why in one line. Both cards here are clear.",
    "<b>Unsure is allowed:</b> 'Confirm all' also saves a card with an unchecked value. In the data such an entry carries the flag <code>inferred</code> (which fields were assumed), so it can be looked at later; nobody is forced to check first.",
    "<b>One card at a time:</b> open a card, Save, and you are back here; that card is ticked and drawn back (voice/drafts-1 → voice/drafts-2 → Done). 'Confirm all' stays possible at any point.",
    "<b>Colour = place:</b> Check-in mint, Naltrexon periwinkle, the note neutral (it belongs to no area, it is saved with the check-in).",
    "<b>Prototype:</b> the variants follow the order Check-in → Naltrexon. Opening Naltrexon first also lands on the all-ticked state (no state in the prototype)."
  ],
  w:[
    {t:"say", l:"Pretty wiped today. Feel completely hung over for no reason. But pain is okay. Forgot the naltrexone at noon."},
    {t:"review", compact:true, title:"Check-in", n:"Fatigue 7 · Brain fog 6 · Pain 3 · rest unchanged", go:"checkins/entry-heard",
      clarity:"clear", hint:"Fatigue, brain fog and pain were said; wellbeing and thirst stay as last time"},
    {t:"review", compact:true, title:"Naltrexon", n:"Skipped today · noon", go:"protocols/deviation-heard",
      clarity:"clear", hint:"Said clearly: forgot it at noon"},
    {t:"review", compact:true, tone:"neutral", title:"Note", n:"Saved with the check-in"},
    {t:"btn", l:"Confirm all", go:"close"},
  ]});
