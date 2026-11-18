SCREENS.push({ id:"protocols/add-review-heard", area:"Protocols", status:"idea", title:"Add · Review, filled in by voice",
  sheet:true,
  why:"After listening in the add flow (protocols/add-listen): the same review card as the manual way (protocols/add-review), filled in, with the same calm head. What the agent heard is marked with the words it came from. The one thing it did not hear (how often) says so under its label ('You didn't say how often') and shows the assumption, Every day, as a grey suggestion; one tap on it confirms it (protocols/add-review-heard-2). Until then 'Add to Morning' is greyed out. To say it instead, the mic sits centred under the card; 'Ask me instead' lets the agent ask.",
  concept:[
    "<b>One agent, two doors.</b> The global mic (tab bar) works out what you mean and shows draft cards in the listening layer. A local mic (here) already knows the form and fills it in place.",
    "<b>The result is always the manual overview.</b> Heard rows carry a calm tint and the quote; every row stays tappable and opens its step to correct it. The card states values: When shows 'Morning', not four pills.",
    "<b>Assumed, not hidden:</b> a value that was not said is grey and dashed, a suggestion, with the reason under the label. No extra sign in the card head: the grey line already says what is open.",
    "<b>Confirm, don't save a guess:</b> one tap on the grey value confirms it. While it is open, 'Add to Morning' is greyed out and not tappable; nothing is saved with an unconfirmed value (this replaces the earlier idea of saving it flagged <code>inferred</code>).",
    "<b>Fill the gap by voice:</b> the mic at the bottom, centred as elsewhere in the app, listens for just the open part (protocols/add-listen-gap); 'Ask me instead' asks one short question (protocols/add-ask). Both land on the confirmed card.",
    "<b>Nothing is saved without confirmation</b> (PRINCIPLES 5): 'Add to Morning' is the confirmation; it names the chosen times and follows the When picker (Morning + Noon)."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"from what you said", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New protocol", rows:[
      ["What", "Naltrexon", "heard", "protocols/add-1-name", "naltrexone"],
      ["Dose", "3 mg", "heard", "protocols/add-2-dose", "three milligrams"],
      ["When", "Morning", "heard", "protocols/pick-when", "in the morning"],
      ["Rhythm", "Every day", "unsure", "protocols/add-review-heard-2", "You didn't say how often"],
      ["Start", "Today", "default", "protocols/pick-start"],
      ["End", "No end", "default", "protocols/pick-end"]]},
    {t:"spacer"},
    {t:"mic", go:"protocols/add-listen-gap"},
    {t:"note", l:"Ask me instead", go:"protocols/add-ask"},
    {t:"btn", l:"Add to Morning", slots:true, off:true},
  ]});
