SCREENS.push({ id:"protocols/all", area:"Protocols", status:"idea", title:"Protocols · All protocols",
  tabs:"idea", tab:"Protocols", sub:"9 active · 1 ended",
  why:"The collection behind the Today folds, opened from the quiet 'All protocols' card at the end of the Protocols tab; ‹ goes back to today. One row per protocol, a group is one row that unfolds. The dots on the right are the last 14 days, so a gap shows without opening anything. Tap a row for its history.",
  concept:[
    "<b>Rows say only what isn't default</b> (PRINCIPLES 3): dose and slot; 'daily' is not printed, a course shows its day ('day 4 of 14').",
    "<b>14-day strip:</b> filled = taken, ring = planned but skipped, small dot = not planned. Newest on the right (today).",
    "<b>Weekly:</b> Vitamin B12 by injection, Mondays in the evening. Its strip shows the two Mondays (26 Oct, 2 Nov) as taken, the other days as not planned; on the Today folds it appears only on a Monday (the demo day is a Tuesday).",
    "<b>Ended</b> protocols stay findable but folded away; their history keeps its versions (PRINCIPLES 6).",
    "<b>Links:</b> only Naltrexon, Magnesium and Rapamycin have their own detail screen; the other rows are not tappable in the prototype (no placeholder that opens the wrong protocol)."
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
      ["Magnesium", "300 mg · evening", "xxxxxxxoxxxxx.", "protocols/item-magnesium"]]},
    {t:"sec", l:"Weekly"},
    {t:"plist", rows:[
      ["Vitamin B12", "1000 mcg · injection · Mondays, evening", ".....x......x."]]},
    {t:"sec", l:"As needed"},
    {t:"plist", rows:[
      ["Epitalon", "5 mg · 2 days ago", ".x....x....x.."],
      ["Selank", "300 mcg · today", "...x....x....x"],
      ["Rapamycin", "6 mg · 9 days ago", "....x.........", "protocols/item-rapamycin"]]},
    {t:"plist", rows:[
      ["Ended", "1 protocol", "", null, [["Ketotifen","1 mg · ended 28 Sep"]]]]},
    {t:"note", l:"Dots: the last 14 days, today on the right. ● taken · ○ skipped · small dot = not planned."},
  ]});
