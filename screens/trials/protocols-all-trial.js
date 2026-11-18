/* All protocols while the trial runs: a later state of protocols/all (`of`), like protocols/today-folds-trial. Lives in
   screens/trials/ because the trial owns it. Drawn on day 19 (Fri 27 Nov), the same moment as trials/running.
   Magnesium is the trial item: one row with the "Trial" badge, tonight's capsule number and the evening slot. Its strip =
   Sat 14 … Fri 27 Nov, all trial days: capsule no. 11 skipped on Thu 19 Nov (the 6th dot), tonight's no. 19 taken.
   The other rows as on protocols/all. */
SCREENS.push({ id:"protocols/all-trial", area:"Protocols", status:"idea", title:"Protocols · All protocols with a trial running",
  tabs:"idea", tab:"Protocols", sub:"8 active · 1 ended", of:"protocols/all",
  tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},
  why:"The collection while the trial runs. Magnesium stays among the daily items, marked 'Trial', with tonight's capsule number and the same 14-day strip as the others, so a missed trial capsule shows like any missed dose.",
  concept:[
    "<b>Magnesium is the trial item:</b> one row, no separate capsule, nothing paused. It says only what isn't default: the badge, tonight's capsule number and the evening slot. No dose: the capsule may hold Magnesium or placebo.",
    "<b>Taken / skipped only:</b> every trial capsule looks alike, so every taken day is the same dot; nothing hints at which days were real. Tap: Magnesium in its trial state (protocols/item-capsule).",
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
      ["Magnesium" + TRIAL_BADGE, "capsule no. 19 today · evening", "xxxxxoxxxxxxxx", "protocols/item-capsule"]]},
    {t:"sec", l:"As needed"},
    {t:"plist", rows:[
      ["Epitalon", "5 mg · 2 days ago", ".x....x....x.."],
      ["Selank", "300 mcg · today", "...x....x....x"],
      ["Rapamycin", "6 mg · 9 days ago", "....x.........", "protocols/item-rapamycin"]]},
    {t:"plist", rows:[
      ["Ended", "1 protocol", "", null, [["Ketotifen","1 mg · ended 28 Sep"]]]]},
    {t:"note", l:"Dots: the last 14 days, today on the right. ● taken · ○ skipped · small dot = not planned."},
  ]});
