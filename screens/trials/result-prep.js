/* "How it was prepared ›" on trials/result: the helper's record, sealed during the trial and shown only after the reveal.
   Demo values from the helper's choices (trials/helper-setup, helper-check, helper-photo). */
SCREENS.push({ id:"trials/result-prep", area:"Insights", status:"idea", title:"Trial · how it was prepared",
  sheet:true,
  why:"The record of the preparation, shown only after the trial is unblinded: who prepared it, in what form, what the placebo was, how it was checked, and the helper's photo.",
  w:[
    {t:"shead", left:"", l:"How it was prepared", right:"×", goRight:"back"},
    {t:"list", rows:[["Prepared by","Sam"],["Form","Opaque capsules"],["Placebo filling","Rice flour"],["Given as","Pill organizer, filled weekly"],["Look-alike check","4 of 4 matched"]]},
    {t:"photo", state:"taken", l:"Week 1, as handed over"},
    {t:"note", l:"Sealed until the result, so it could not give anything away."},
  ]});
