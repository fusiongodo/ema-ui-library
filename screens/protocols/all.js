SCREENS.push({ id:"protocols/all", area:"Protocols", status:"idea", title:"Protocols · All",
  tabs:"idea", tab:"Protocols", sub:"8 active · 1 ended",
  why:"The collection behind the Today folds ('Today · All'). One row per protocol, a group is one row that unfolds. The dots on the right are the last 14 days, so a gap shows without opening anything. Tap a row for its history.",
  concept:[
    "<b>Rows say only what isn't default</b> (PRINCIPLES 3): dose and slot; 'daily' is not printed, a course shows its day ('day 4 of 14').",
    "<b>14-day strip:</b> filled = taken, ring = planned but skipped, small dot = not planned. Newest on the right (today).",
    "<b>Ended</b> protocols stay findable but folded away; their history keeps its versions (PRINCIPLES 6).",
    "<b>Placeholder links:</b> only Rapamycin and Naltrexon have their own detail screen; the other rows open the one of the same type (daily → Naltrexon, as needed → Rapamycin)."
  ],
  w:[
    {t:"head", l:"Protocols"},
    {t:"seg", items:["Today","All"], on:"All", go:["protocols/today-folds",null]},
    {t:"sec", l:"Daily", act:"+ Add", go:"protocols/add-0-choose"},
    {t:"plist", rows:[
      ["Naltrexon", "1 mg · noon", "xxxxoxxxxhoxxx", "protocols/item-naltrexon"],
      ["Morning supplements", "6 items · morning", "xxxxxxxxxxxxxx", null, [
        ["Taurine","500 mg","protocols/item-naltrexon"], ["NAC","500 mg","protocols/item-naltrexon"],
        ["Q10","300 mg","protocols/item-naltrexon"], ["D3","4000 IU","protocols/item-naltrexon"],
        ["Methylcobalamin","500 mcg","protocols/item-naltrexon"], ["Curcumin","150 mg","protocols/item-naltrexon"]]],
      ["MOTS-C", "1.5 mg · morning · day 4 of 14", "..........xxxx", "protocols/item-naltrexon"],
      ["Taurine", "500 mg · noon", "xxxxxxxxxxxxxx", "protocols/item-naltrexon"],
      ["Magnesium", "300 mg · evening", "xxxxxxxoxxxxx.", "protocols/item-naltrexon"]]},
    {t:"sec", l:"As needed"},
    {t:"plist", rows:[
      ["Epitalon", "5 mg · 2 days ago", ".x....x....x..", "protocols/item-rapamycin"],
      ["Selank", "300 mcg · today", "...x....x....x", "protocols/item-rapamycin"],
      ["Rapamycin", "6 mg · 9 days ago", "....x.........", "protocols/item-rapamycin"]]},
    {t:"plist", rows:[
      ["Ended", "1 protocol", "", null, [["Ketotifen","1 mg · ended 28 Sep","protocols/item-naltrexon"]]]]},
    {t:"note", l:"Dots: the last 14 days, today on the right. ● taken · ○ skipped · small dot = not planned."},
  ]});
