/* All protocols while the trial runs: a later state of protocols/all (`of`), like protocols/today-folds-trial. Lives in
   screens/trials/ because the trial owns it. Drawn on day 19 (Fri 27 Nov), the same moment as trials/running.
   Study capsule strip = Sat 14 … Fri 27 Nov: no. 11 skipped on Thu 19 Nov (the 6th dot), tonight's no. 19 taken.
   Magnesium paused since the trial began (Mon 9 Nov): not planned on any of the 14 days. The other rows as on protocols/all. */
SCREENS.push({ id:"protocols/all-trial", area:"Protocols", status:"idea", title:"Protocols · All protocols with a trial running",
  tabs:"idea", tab:"Protocols", sub:"8 active · 1 paused · 1 ended", of:"protocols/all",
  tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},
  why:"The collection while the trial runs. The study capsule is one of the daily items, with today's number and the same 14-day strip as the others, so a missed capsule shows like any missed dose. Magnesium stays in the list, paused for the trial.",
  concept:[
    "<b>Study capsule like any item:</b> its row says only what isn't default: today's number and the evening slot. The strip is taken / skipped only; every capsule looks alike, so nothing hints at which days were real. Tap: its detail (protocols/item-capsule).",
    "<b>Magnesium paused, not gone:</b> 'paused for the trial', its strip empty (not planned). Not tappable here: its detail would show the untouched plan; it comes back by itself when the trial ends or is stopped.",
    "<b>Tabs:</b> Protocols leads back to today in its trial state, Insights to the trial state of Insights.",
  ],
  w:[
    {t:"shead", left:"‹", l:"All protocols", right:"", goLeft:"back"},
    {t:"sec", l:"Daily", act:"+ Add", go:"protocols/add-0-choose"},
    {t:"plist", rows:[
      ["Naltrexon", "1 mg · morning, noon, evening", "xxxxoxxxxhoxxx", "protocols/item-naltrexon"],
      ["Morning supplements", "6 items · morning", "xxxxxxxxxxxxxx", null, [
        ["Taurine","500 mg"], ["NAC","500 mg"],
        ["Q10","300 mg"], ["D3","4000 IU"],
        ["Methylcobalamin","500 mcg"], ["Curcumin","150 mg"]]],
      ["MOTS-C", "1.5 mg · morning · day 4 of 14", "..........xxxx"],
      ["Taurine", "500 mg · noon", "xxxxxxxxxxxxxx"],
      ["Study capsule", "no. 19 today · evening", "xxxxxoxxxxxxxx", "protocols/item-capsule"],
      ["Magnesium", "300 mg · paused for the trial", ".............."]]},
    {t:"sec", l:"As needed"},
    {t:"plist", rows:[
      ["Epitalon", "5 mg · 2 days ago", ".x....x....x.."],
      ["Selank", "300 mcg · today", "...x....x....x"],
      ["Rapamycin", "6 mg · 9 days ago", "....x.........", "protocols/item-rapamycin"]]},
    {t:"plist", rows:[
      ["Ended", "1 protocol", "", null, [["Ketotifen","1 mg · ended 28 Sep"]]]]},
    {t:"note", l:"Dots: the last 14 days, today on the right. ● taken · ○ skipped · small dot = not planned."},
  ]});
