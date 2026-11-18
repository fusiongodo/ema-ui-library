/* "Custom" chip under Total on trials/length: a number and a unit. */
SCREENS.push({ id:"trials/pick-total", area:"Insights", status:"idea", title:"Trial · total duration, custom",
  sheet:"half",
  why:"A custom length for the whole trial: a number and a unit. Done sets it and goes back to the step, where the strip of days and the line on what the design can show follow.",
  concept:[
    "<b>Any length:</b> the app fits the blocks into it and keeps real and placebo days balanced.",
  ],
  w:[
    {t:"shead", left:"", l:"Total duration", n:"custom", right:"×", goRight:"back"},
    {t:"stepper", l:"Length", v:6},
    {t:"seg", items:["days","weeks"], on:"weeks"},
    {t:"btn", l:"Done", go:"back"},
  ]});
