SCREENS.push({ id:"checkins/entry-heard", area:"Check-ins", status:"idea", title:"Check-in · filled in by voice",
  sheet:true,
  why:"The normal check-in sheet, filled in from what was said: Fatigue, Brain fog and Pain stand where the words put them, the words beside the value; the rest stays muted on the last value (unchanged). Reached from the Check-in card in the listening layer, from 'Change' at the end of the guided questions and from '🎙 Say it' inside the check-in itself.",
  concept:[
    "<b>The result is always the manual overview:</b> the same sliders, only already moved. Moving one by hand replaces the quote with 'was N'.",
    "<b>Heard is calm:</b> a light tint of the Check-ins colour and the quote, no blinking.",
    "<b>The note</b> keeps the words as said, saved with the check-in.",
    "<b>Save is the confirmation</b> (PRINCIPLES 5). ‹ goes back without saving."
  ],
  w:[
    {t:"shead", left:"‹", l:"Check-in", n:"Today · 13:52", right:"×", goLeft:"back", goRight:"close"},
    {t:"slider", l:"Fatigue / energy",  v:6, set:7, heard:"pretty wiped", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Overall wellbeing", v:5, min:0, max:10, lo:"0", hi:"10", better:"high"},
    {t:"slider", l:"Pain",              v:3, set:3, heard:"pain is okay", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Thirst",            v:4, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Brain fog",         v:4, set:6, heard:"head like cotton wool", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"field", l:"Note · as you said it", v:"“pretty wiped today, head like cotton wool”"},
    {t:"btn", l:"Save", go:"close"},
  ]});
