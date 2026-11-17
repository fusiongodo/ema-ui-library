SCREENS.push({ id:"voice/voice", area:"Voice", status:"idea", title:"Voice · earlier idea (full page)",
  why:"Superseded by voice/listen (half-height listening layer over the page, drafts as review cards). Kept as the earlier idea. Speak; the app shows what it understood as drafts to confirm. Nothing is saved without ✓.",
  w:[
    {t:"shead", left:"", l:"Talk to me", right:"×", goRight:"back"},
    {t:"spacer"},
    {t:"mic"},
    {t:"tile", tone:"white", l:"“Skipped Epitalon, took half the Naltrexon, foggy since noon”", n:"transcript"},
    {t:"draft", l:"Epitalon · skipped", a:"✓ ✕"},
    {t:"draft", l:"Naltrexon 1 mg instead of 2 mg", a:"✓ ✕"},
    {t:"draft", l:"Check-in · brain fog 6", a:"✓ ✕"},
    {t:"chips", items:["Confirm all","Edit"], go:["back",null]},
    {t:"spacer"},
  ]});
