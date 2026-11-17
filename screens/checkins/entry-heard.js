SCREENS.push({ id:"checkins/entry-heard", area:"Check-ins", status:"idea", title:"Check-in · filled in by voice",
  sheet:true,
  why:"The normal check-in sheet, filled in from what was said in the listening layer: Fatigue, Brain fog and Pain stand where the words put them, the words beside the value. Overall wellbeing and Thirst were not mentioned: they stay on the last value and step back, name and value slightly greyed, until you touch them. Save returns to the remaining drafts (voice/drafts-1).",
  concept:[
    "<b>The result is always the manual overview:</b> the same sliders, only already moved. Moving one by hand replaces the quote with 'was N'.",
    "<b>Heard is calm:</b> a light tint of the Check-ins colour and the quote, no blinking.",
    "<b>Not said = unchanged, quietly:</b> an untouched slider is greyed in name, value and scale (still ≥ 4.5:1); touching it brings it forward. It saves 'same as last time'.",
    "<b>The note</b> keeps the words as said, saved with the check-in.",
    "<b>Save is the confirmation</b> (PRINCIPLES 5) and goes back to the other drafts, this one ticked. ‹ goes back without saving."
  ],
  w:[
    {t:"shead", left:"‹", l:"Check-in", n:"Today · 13:52", right:"×", goLeft:"back", goRight:"close"},
    {t:"slider", l:"Fatigue / energy",  v:6, set:7, heard:"pretty wiped", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Overall wellbeing", v:5, min:0, max:10, lo:"0", hi:"10", better:"high"},
    {t:"slider", l:"Pain",              v:3, set:3, heard:"pain is okay", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Thirst",            v:4, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Brain fog",         v:4, set:6, heard:"hung over for no reason", min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"field", l:"Note · as you said it", v:"“Pretty wiped today. Feel completely hung over for no reason. But pain is okay.”"},
    {t:"btn", l:"Save", go:"voice/drafts-1"},
  ]});
