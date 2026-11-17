SCREENS.push({ id:"checkins/entry-heard-all", area:"Check-ins", status:"idea", title:"Check-in · all five said",
  sheet:true,
  why:"The check-in sheet when every score was said: from 'Change' at the end of the guided questions, and from 'Say it' inside the check-in itself (the local mic fills this sheet in place, no listening layer). Every slider stands where the words put them, the words beside the value.",
  concept:[
    "<b>Same sheet as by hand,</b> only already moved; a tap corrects any value ('was N').",
    "<b>Save is the confirmation</b> (PRINCIPLES 5) and closes the sheet."
  ],
  w:[
    {t:"shead", left:"‹", l:"Check-in", n:"Today · 13:52", right:"×", goLeft:"back", goRight:"close"},
    {t:"slider", l:"Fatigue / energy",  v:6, set:7, heard:"pretty wiped", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Overall wellbeing", v:5, set:5, heard:"about the same", min:0, max:10, lo:"0", hi:"10", better:"high"},
    {t:"slider", l:"Pain",              v:3, set:3, heard:"pain is okay", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Thirst",            v:4, set:2, heard:"not really", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Brain fog",         v:4, set:6, heard:"hung over for no reason", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"btn", l:"Save", go:"close"},
  ]});
