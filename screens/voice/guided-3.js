SCREENS.push({ id:"voice/guided-3", area:"Voice", status:"idea", title:"Guided · 3 Brain fog",
  sheet:"half",
  after:[5600, "voice/guided-4"],
  why:"An answer in everyday words: 'completely hung over' becomes a brain fog of 6 on the slider, which a tap corrects.",
  w:[
    {t:"bud", st:"speaking", l:"Any brain fog?"},
    {t:"say", l:"Feel completely hung over for no reason.", live:true, d:700},
    {t:"slider", l:"Brain fog", v:4, set:6, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["3 of 5","×"], go:[null,"close"]},
  ]});
