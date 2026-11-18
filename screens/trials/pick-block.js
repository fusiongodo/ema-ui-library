/* Picker for "Block duration" on trials/length, the pattern of protocols/pick-rhythm: a tap on a value sets it and goes back
   to the step; × or a tap on the dimmed step goes back unchanged. Custom turns this sheet into the entry (pick-block-custom). */
SCREENS.push({ id:"trials/pick-block", area:"Insights", status:"idea", title:"Trial · pick the block duration",
  sheet:"half",
  why:"Opened from the 'Block duration' row of the design step. Five plain values, the current one ticked, none marked as better. The value is exact: every block has this many days, all of them compared.",
  concept:[
    "<b>What a block is,</b> once, above the values: days of the same kind in a row, all real or all placebo, all compared.",
    "<b>Exact, washout on top:</b> the washout days are not part of a block, so 1 week means 7 compared days; the washout comes before every block. The app hides where blocks begin by drawing their order and where the first one begins, not by changing their length.",
    "<b>No advice:</b> short blocks give more blocks, long ones let a slow substance settle; that is for the person to weigh, so the sheet stays silent about it.",
  ],
  w:[
    {t:"shead", left:"", l:"Block duration", right:"×", goRight:"back"},
    {t:"note", l:"Days of the same kind in a row, all real or all placebo, all of them compared. Washout days come on top."},
    {t:"list", rows:[["1 day",""],["3 days",""],["1 week","✓"],["2 weeks",""],["Custom",""]], go:["back","back","back","back","trials/pick-block-custom"]},
  ]});
