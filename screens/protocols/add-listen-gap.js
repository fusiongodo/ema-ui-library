SCREENS.push({ id:"protocols/add-listen-gap", area:"Protocols", status:"idea", title:"Add · say what is open",
  sheet:"half",
  after:[3400, "protocols/add-review-heard-2"],
  why:"The mic under the review card (protocols/add-review-heard): it listens for what is still open, here only how often. No question first; that is 'Ask me instead' (protocols/add-ask). The answer lands on the rhythm choices (a tap corrects it), then the card comes back with the line confirmed (protocols/add-review-heard-2). The card stays visible above, dimmed.",
  concept:[
    "<b>One mic, in its usual place:</b> centred at the bottom of the sheet, not inside the line that needs it.",
    "<b>Prototype:</b> moves on after the answer; a tap moves on at once; × or a tap on the dimmed card goes back without an answer."
  ],
  w:[
    {t:"shead", left:"", l:"Rhythm", n:"Listening · say how often", right:"×", goRight:"back"},
    {t:"say", l:"every day", live:true, d:700},
    {t:"pills", items:["Every day","Every 2 days","Weekly","As needed"], on:["Every day"]},
  ]});
