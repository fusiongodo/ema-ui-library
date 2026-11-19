/* Step 4, the same-phone way: "Sam uses this phone instead" switched on (trials/helper). Same sheet and `of` as the step
   itself, so × and back behave the same and the switch flips between the two states in place. No QR code and no preview
   link: the phone itself goes to Sam, behind a helper PIN (trials/helper-pin), and shows only the helper's pages. */
SCREENS.push({ id:"trials/helper-same", area:"Insights", status:"idea", title:"Trial · 4 Your helper (same phone)",
  sheet:true, of:"trials/helper",
  why:"The same-phone way: no second device. The plan opens only behind a PIN that the helper sets and the person never learns.",
  concept:[
    ...byId("trials/helper").concept,
    "<b>Hand over, hand back:</b> the phone changes hands twice; in between it shows only the helper's pages.",
  ],
  w:[
    ...byId("trials/helper").w.filter(x => !(x.t === "qr" || (x.t === "note" && x.go === "trials/peek-welcome"))).map(x =>
      x.t === "toggle" ? {...x, on:true, go:"trials/helper"}
      : x.t === "note" && /helper PIN/.test(x.l) ? {...x, l:"Sam sets a helper PIN. Without it the plan never opens on this phone."}
      : x.t === "btn" ? {...x, l:"Hand the phone to Sam", go:"trials/helper-pin"}
      : x),
  ]});
