SCREENS.push({ id:"voice/guided-5", area:"Voice", status:"idea", title:"Guided · 5 Thirst",
  sheet:"half",
  after:[5000, "voice/guided-done"],
  why:"Last question. 'Not really' becomes a low value (2), drawn as a change from last time (was 4).",
  w:[
    {t:"bud", st:"speaking", l:"Thirsty today?"},
    {t:"say", l:"Not really.", live:true, d:1300},
    {t:"slider", l:"Thirst", v:4, set:2, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["5 of 5","×"], go:[null,"close"]},
  ]});
