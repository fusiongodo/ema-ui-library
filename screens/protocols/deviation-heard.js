SCREENS.push({ id:"protocols/deviation-heard", area:"Protocols", status:"idea", title:"Deviation · filled in by voice",
  sheet:"half",
  why:"Opened from the Naltrexon card in the listening layer (voice/drafts): the full overview of one deviation, as the manual way ('Different?' on a fold) would end. Skipped is what was heard, with the words; the rest is the plan as it is.",
  concept:[
    "<b>Same card as by hand:</b> the agent fills in what it heard and marks it; nothing else changes.",
    "<b>Save is the confirmation</b> (PRINCIPLES 5) and returns to the drafts with this one ticked (voice/drafts-2); ‹ goes back to them without saving.",
    "History keeps its versions (PRINCIPLES 6): the skip is a mark on today, the plan stays."
  ],
  w:[
    {t:"shead", left:"‹", l:"Different today", right:"×", goLeft:"back", goRight:"close"},
    {t:"review", title:"Naltrexon", n:"1 mg · noon", clarity:"clear", hint:"Said clearly: forgot it at noon", rows:[
      ["Day", "Today"],
      ["Status", "Skipped", "heard", null, "forgot the naltrexone at noon"],
      ["Dose", "1 mg", "default"]]},
    {t:"spacer"},
    {t:"btn", l:"Save", go:"voice/drafts-2"},
  ]});
