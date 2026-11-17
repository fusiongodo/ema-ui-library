SCREENS.push({ id:"protocols/add-review-heard", area:"Protocols", status:"idea", title:"Add · Review, filled in by voice",
  sheet:true,
  why:"'🎙 Say it' inside the add flow: the local mic fills the open form directly, no listening layer. The result is the same review card as the manual way (protocols/add-review), everything filled in. What the agent heard is marked with the words it came from; the one thing it could not hear (how often) is marked '?' and wants a look.",
  concept:[
    "<b>One agent, two doors.</b> The global mic (tab bar) works out what you mean and shows draft cards in the listening layer. A local mic (here) already knows the form and fills it in place.",
    "<b>The result is always the manual overview.</b> Heard rows carry a calm tint and the quote; every row stays tappable and opens its step to correct it.",
    "<b>Unsure, not guessed:</b> a value the agent assumed gets '?' and a hint, never a silent default.",
    "<b>Nothing is saved without confirmation</b> (PRINCIPLES 5): 'Add to Morning' is the confirmation."
  ],
  w:[
    {t:"shead", left:"‹", l:"Add protocol", n:"from what you said", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"New protocol", rows:[
      ["What", "Naltrexon", "heard", "protocols/add-1-name", "naltrexone"],
      ["Dose", "3 mg", "heard", "protocols/add-2-dose", "three milligrams"],
      ["When", {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"], multi:true}, "heard", null, "in the morning"],
      ["Rhythm", "Every day", "unsure", null, "You didn't say how often"],
      ["Start", "Today", "default"],
      ["End", "None", "default"]]},
    {t:"spacer"},
    {t:"btn", l:"Add to Morning", go:"protocols/today-folds"},
  ]});
