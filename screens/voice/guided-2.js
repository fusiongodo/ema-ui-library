SCREENS.push({ id:"voice/guided-2", area:"Voice", status:"idea", title:"Guided · 2 Wellbeing",
  sheet:"half",
  after:[5000, "voice/guided-3"],
  why:"Same shape for every score: one short question, the heard answer, the recognised value on its slider. 'About the same' keeps the last value.",
  w:[
    {t:"bud", st:"speaking", l:"And overall, how are you?"},
    {t:"say", l:"About the same.", live:true, d:1300},
    {t:"slider", l:"Overall wellbeing", v:5, set:5, min:0, max:10, lo:"0", hi:"10", better:"high"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["2 of 5","×"], go:[null,"close"]},
  ]});
