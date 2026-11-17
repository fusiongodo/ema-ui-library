SCREENS.push({ id:"checkins/entry", area:"Check-ins", status:"idea", title:"Check-in · all scores",
  sheet:true,
  why:"Opened by 'Check in now' (Check-ins tab, Today) and by the next check-in tile. One page, all sliders, Save at any time. Scales as in the app: 0–10, step 1, ends unnamed (0 / 10), Overall wellbeing higher = better, the rest higher = worse.",
  concept:[
    "<b>Starts on the last value.</b> Every slider opens where the last answered check-in left it (the app's preset; 5 if there is none) and is drawn muted: unchanged.",
    "<b>Only moves are marked.</b> A touched slider shows its value strong, fills dark and keeps a tick at the last value ('was 6'). Untouched ones stay quiet.",
    "<b>Save is always possible.</b> Nothing has to be touched first: an untouched slider saves 'same as last time'.",
    "<b>Voice is optional.</b> One row at the bottom; the sliders never wait for it.",
  ],
  w:[
    {t:"shead", left:"", l:"Check-in", n:"Today · 13:52", right:"×", goRight:"close"},
    {t:"slider", l:"Fatigue / energy",  v:6, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Overall wellbeing", v:5, min:0, max:10, lo:"0", hi:"10", better:"high"},
    {t:"slider", l:"Pain",              v:3, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Thirst",            v:4, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"slider", l:"Brain fog",         v:4, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"list", rows:[["🎙  Add a voice note","›"]], go:"voice/voice"},
    {t:"btn", l:"Save", go:"close"},
  ]});
