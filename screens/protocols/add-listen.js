SCREENS.push({ id:"protocols/add-listen", area:"Protocols", status:"idea", title:"Add · listening",
  sheet:true,
  after:[3800, "protocols/add-review-heard"],
  why:"The local mic in the add flow ('just say it', 'Say it'): the sheet stays in the Protocols world and listens in place. The words build up at the top; below them the overview card fills in line by line as each piece is said (What → Dose → When). What was not said stays muted. When you pause, the card becomes the review card to check (protocols/add-review-heard).",
  concept:[
    "<b>You see it being understood:</b> each line fills in at the moment its words are said, so a misheard word shows up right away, not only at the end.",
    "<b>Same card as the manual way</b> (protocols/add-review), so there is nothing new to learn.",
    "<b>Prototype:</b> moves on after a few seconds; a tap moves on at once. Reduced motion: the card is complete at once."
  ],
  w:[
    {t:"shead", left:"", l:"Add protocol", n:"Listening · pause when you're done", right:"×", goRight:"close"},
    {t:"say", l:"Naltrexone, three milligrams, in the morning.", live:true, d:400},
    {t:"review", title:"New protocol", live:[1000, 1500, 2200], rows:[
      ["What", "Naltrexon", "heard"],
      ["Dose", "3 mg", "heard"],
      ["When", {t:"pills", items:["Morning","Noon","Evening","Night"], on:["Morning"], multi:true}, "heard"],
      ["Rhythm", "How often?", "empty"],
      ["Start", "Today", "default"],
      ["End", "None", "default"]]},
  ]});
