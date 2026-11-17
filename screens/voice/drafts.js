SCREENS.push({ id:"voice/drafts", area:"Voice", status:"idea", title:"Listening layer · understood",
  sheet:"half",
  why:"After the pause: the whole transcript, and below it one compact draft card per thing it understood, each in the colour of its area (PRINCIPLES 9), appearing one after another. 'Confirm all' saves them and closes the layer, back on the page you started from. A tap on a card opens its full overview, the same one the manual way ends in.",
  concept:[
    "<b>Drafts, not entries:</b> the cards are the folded form of the review card (Check-in sheet, deviation card); nothing is saved until 'Confirm all' or the card's own Save (PRINCIPLES 5).",
    "<b>Readable in two seconds:</b> title + one line, only what changed ('rest unchanged').",
    "<b>Colour = place:</b> Check-in mint, Naltrexon periwinkle, the note neutral (it belongs to no area, it is saved with the check-in).",
    "<b>Open question:</b> does saving one card from here return to the remaining drafts, or close the layer? The prototype closes."
  ],
  w:[
    {t:"say", l:"pretty wiped today, head like cotton wool, pain is okay. forgot the naltrexone at noon."},
    {t:"review", compact:true, title:"Check-in", n:"Fatigue 7 · Brain fog 6 · Pain 3 · rest unchanged", go:"checkins/entry-heard"},
    {t:"review", compact:true, title:"Naltrexon", n:"Skipped today · noon", go:"protocols/deviation-heard"},
    {t:"review", compact:true, tone:"neutral", title:"Note", n:"Saved with the check-in"},
    {t:"btn", l:"Confirm all", go:"close"},
  ]});
