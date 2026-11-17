SCREENS.push({ id:"protocols/add-ask", area:"Protocols", status:"idea", title:"Add · ask for the gap",
  sheet:"half",
  after:[4600, "protocols/add-review-heard-2"],
  why:"'Ask me instead' on the review card: a short guided step for what is open, here only how often. The companion asks, the answer arrives as a line of transcript and lands on the rhythm choices (a tap corrects it), then the card comes back with the line filled in (protocols/add-review-heard-2). The card stays visible above, dimmed.",
  concept:[
    "<b>Only what is open:</b> one question per open line, nothing that was already said.",
    "<b>Prototype:</b> moves on after the answer; a tap moves on at once; × or a tap on the dimmed card goes back without an answer."
  ],
  w:[
    {t:"bud", st:"speaking", l:"How often do you take it?"},
    {t:"say", l:"every day", live:true, d:1400},
    {t:"pills", items:["Every day","Every 2 days","Weekly","As needed"], on:["Every day"]},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["Rhythm","×"], go:[null,"back"]},
  ]});
