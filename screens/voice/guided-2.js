SCREENS.push({ id:"voice/guided-2", area:"Voice", status:"idea", title:"Guided · 2 Brain fog",
  sheet:"half",
  after:[5200, "voice/guided-done"],
  why:"Second and last question, same shape: one question, the heard answer, the recognised value on its slider.",
  w:[
    {t:"bud", st:"speaking", l:"And your head? Any brain fog?"},
    {t:"say", l:"foggy, maybe a six", live:true, d:1300},
    {t:"slider", l:"Brain fog", v:4, set:6, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["2 of 2","×"], go:[null,"close"]},
  ]});
