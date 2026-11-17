SCREENS.push({ id:"protocols/add-review-heard", area:"Protocols", status:"idea", title:"Add · Review, filled in by voice",
  sheet:true,
  why:"After listening in the add flow (protocols/add-listen): the same review card as the manual way (protocols/add-review), filled in. What the agent heard is marked with the words it came from; the one thing it could not hear (how often) is marked '?', and the sky sign in the card head shows a sun half behind a cloud: partly worked out. The open line has its own small mic to say it now; 'Ask me instead' lets the agent ask.",
  concept:[
    "<b>One agent, two doors.</b> The global mic (tab bar) works out what you mean and shows draft cards in the listening layer. A local mic (here) already knows the form and fills it in place.",
    "<b>The result is always the manual overview.</b> Heard rows carry a calm tint and the quote; every row stays tappable and opens its step to correct it.",
    "<b>Unsure, not guessed silently:</b> an assumed value gets '?' and a hint. A tap on the sky sign says it in one line ('Rhythm was not said, assumed every day').",
    "<b>Fill the gap the easy way:</b> the mic in the row listens for just that (protocols/add-review-heard-2); 'Ask me instead' asks one short question (protocols/add-ask).",
    "<b>No obligation:</b> 'Add' works with the open line too. The saved protocol then carries the flag <code>inferred</code> for Rhythm in the data, so it can be checked later.",
    "<b>Nothing is saved without confirmation</b> (PRINCIPLES 5): 'Add to Morning' is the confirmation; it names the chosen times and follows the pills (Morning + Noon)."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"from what you said", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New protocol", clarity:"partly", hint:"Rhythm was not said, assumed every day", ask:"protocols/add-ask", rows:[
      ["What", "Naltrexon", "heard", "protocols/add-1-name", "naltrexone"],
      ["Dose", "3 mg", "heard", "protocols/add-2-dose", "three milligrams"],
      ["When", {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"], multi:true}, "heard", null, "in the morning"],
      ["Rhythm", "Every day", "unsure", "protocols/pick-rhythm", "You didn't say how often", "protocols/add-review-heard-2"],
      ["Start", "Today", "default", "protocols/pick-start"],
      ["End", "No end", "default", "protocols/pick-end"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning", slots:true, go:"protocols/today-folds"},
  ]});
