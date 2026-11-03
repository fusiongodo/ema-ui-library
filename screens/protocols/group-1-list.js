SCREENS.push({ id:"protocols/group-1-list", area:"Protocols", status:"idea", title:"Group · 1 List",
  sheet:true,
  why:"The only effortful step. Name and dose go in together, the way you'd say them; there is no separate dose step.",
  concept:[
    "<b>Input:</b> dictate the whole list (\"Taurine 500 milligrams, NAC 500 …\") or type \"Taurine 500\" + Enter. Both can be mixed; the field stays focused for the next item.",
    "<b>Units are never picked, only corrected.</b> Type just the number; the unit is suggested (dashed pill) from: 1. the glossary (last unit used for this item), 2. a built-in table of typical units (D3 → IU, B12 → mcg, most → mg), 3. the previous row's unit.",
    "<b>Tap-to-cycle:</b> tapping the unit pill cycles mg → mcg → g → IU → mL. No picker. Typical cost: 0–2 taps for a 20-item list.",
    "<b>Plausibility flag:</b> the background glossary checks dose × unit. Implausible values (D3 4000 mg) get a soft highlight with a one-tap fix (\"IU?\").",
    "<b>Typed units still work:</b> \"500mg\", \"500 mg\", \"0.5 g\" are parsed; nobody is forced to type them.",
    "<b>Editing:</b> tap a row to change the dose, swipe to delete."
  ],
  w:[
    {t:"shead", left:"‹", l:"New group", n:"1 of 2", right:"×"},
    {t:"sec", l:"Your list", act:"🎙 Dictate"},
    {t:"doselist", rows:[
      ["Taurine","500","mg"],
      ["NAC","500","mg"],
      ["Q10","300","mg"],
      ["D3","4000","mg","flag","Unusual for D3 · tap for IU"],
      ["Methylcobalamin","500","mcg"],
      ["Curcumin","150","mg","sugg"],
      ["input","Lithium Orotate 5 ⏎"]]},
    {t:"note", l:"Dashed unit = suggested. Tap any unit to cycle."},
    {t:"spacer"},
    {t:"btn", l:"Continue · 6 items"},
  ]});
