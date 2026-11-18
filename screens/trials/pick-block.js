/* Picker for "One block" on trials/length, the pattern of protocols/pick-rhythm: a tap on a value sets it and goes back
   to the step; × or a tap on the dimmed step goes back unchanged. Custom turns this sheet into the entry (pick-block-custom). */
SCREENS.push({ id:"trials/pick-block", area:"Insights", status:"idea", title:"Trial · pick one block",
  sheet:"half",
  why:"Opened from the 'One block' row of the design step. Five plain values, the current one ticked, none marked as better. The value is a rough length: the app varies each block around it.",
  concept:[
    "<b>What a block is,</b> once, above the values: days of the same kind in a row, all real or all placebo.",
    "<b>About, not exactly:</b> the app makes each block a little shorter or longer and places it where it likes, so no boundary can be predicted.",
    "<b>No advice:</b> short blocks give more blocks, long ones let a slow substance settle; that is for the person to weigh, so the sheet stays silent about it.",
  ],
  w:[
    {t:"shead", left:"", l:"One block", n:"about", right:"×", goRight:"back"},
    {t:"note", l:"Days of the same kind in a row, all real or all placebo. The app makes each block a little shorter or longer."},
    {t:"list", rows:[["1 day",""],["3 days",""],["1 week","✓"],["2 weeks",""],["Custom",""]], go:["back","back","back","back","trials/pick-block-custom"]},
  ]});
