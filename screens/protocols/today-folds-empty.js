SCREENS.push({ id:"protocols/today-folds-empty", area:"Protocols", status:"idea", title:"Protocols · first run",
  tabs:"idea", tab:"Protocols", sub:"Nothing planned yet",
  why:"Empty state. Setup widget with suggestion chips; disappears once the first protocol exists.",
  ref:"refs/juno-setup-widget.png",
  w:[
    {t:"head", l:"Protocols"},
    {t:"tile", tone:"lilac", h:150, l:"Set up your protocols", n:"Type, tap a suggestion, or just say it",
      chips:["+ Naltrexon","+ Magnesium","+ HBOT session","🎙 Say it"],
      go:["protocols/add-2-dose",null,null,"protocols/add-listen"]},
    {t:"sec", l:"Your protocols", act:"+ Add", go:"protocols/add-0-choose"},
    {t:"fold", l:"☀︎ Morning", m:"empty"},
    {t:"fold", l:"◐ Noon", m:"empty"},
    {t:"fold", l:"☾ Evening", m:"empty"},
  ]});
