SCREENS.push({ id:"voice/drafts-2", area:"Voice", status:"idea", title:"Listening layer · all confirmed",
  sheet:"half", of:"voice/drafts",
  why:"Back from the Naltrexon card after Save: every draft is ticked. 'Done' closes the layer, back on the page you started from.",
  w:[
    {t:"say", l:"Pretty wiped today. Feel completely hung over for no reason. But pain is okay. Forgot the naltrexone at noon."},
    {t:"review", compact:true, ok:true, title:"Check-in", n:"Saved · Fatigue 7 · Brain fog 6 · Pain 3", go:"checkins/entry-heard"},
    {t:"review", compact:true, ok:true, title:"Naltrexon", n:"Saved · skipped today, noon", go:"protocols/deviation-heard"},
    {t:"review", compact:true, ok:true, tone:"neutral", title:"Note", n:"Saved with the check-in"},
    {t:"btn", l:"Done", go:"close"},
  ]});
