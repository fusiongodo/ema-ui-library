SCREENS.push({ id:"voice/guided-4", area:"Voice", status:"idea", title:"Guided · 4 Pain",
  sheet:"half",
  after:[5000, "voice/guided-5"],
  why:"'Pain is okay': the last value stays (3), now confirmed.",
  w:[
    {t:"bud", st:"speaking", l:"How is the pain?"},
    {t:"say", l:"Pain is okay.", live:true, d:1300},
    {t:"slider", l:"Pain", v:3, set:3, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["4 of 5","×"], go:[null,"close"]},
  ]});
