/* How you played: four weeks per game, 7 Oct … today 3 Nov (index 0 = 7 Oct), each against its usual on the level played.
   Not every game is played every day, so the lines have gaps (null = not played that day, never zero).
   Arithmetic (Medium): usual 16 to 19 solved; a dip to 12 and 13 on 19 and 20 Oct; today 14 (play/done).
   Reaction: usual 295 to 330 ms; today 312. Dual n-back (2-back): usual 72 to 84 % right; today 78.
   Lichess puzzles: rating slowly rising, usual 1460 to 1500; today 1480 (play/home-connected).
   Days not played (skipped with an answer): 6, 4 too weak, 2 no desire. Blocks: 2 of 5 warm-up sessions. */
SCREENS.push({ id:"play/results", area:"Today", status:"idea", title:"Play · how you played",
  tabs:"idea", tab:"Today",
  why:"Four weeks per game, each against your usual on the level you play, with a deviation marked. Gaps are normal here: not every game is played every day.",
  concept:[
    "<b>The same tile as Apple Health:</b> your usual, deviation marked.",
    "<b>Results are compared within one level.</b>",
    "<b>Warm-up sessions are shown, not counted</b> (Blocks: 2 of 5).",
    "<b>These measures feed patterns and trials</b> like every other score.",
  ],
  w:[
    {t:"shead", left:"‹", l:"", right:"", goLeft:"back"},
    {t:"big", l:"How you played", n:"Last four weeks · against your usual"},
    {t:"grid2", items:[
      {t:"usual", join:true, l:"Arithmetic", v:"14", sub:"solved · Medium", word:"lower than your usual", mark:true, band:[16,19],
        series:[17,null,18,16,null,19,17,18,null,16,17,null,12,13,null,17,18,null,16,19,17,null,18,17,null,16,18,14]},
      {t:"usual", join:true, l:"Reaction", v:"312", sub:"ms", word:"as usual", band:[295,330],
        series:[318,null,305,322,299,null,311,330,null,296,315,null,341,336,null,308,302,null,319,325,null,300,313,null,327,306,null,312]},
      {t:"usual", join:true, l:"Dual n-back", v:"78 %", sub:"2-back", word:"as usual", band:[72,84],
        series:[80,null,76,null,82,79,null,74,null,85,null,77,70,null,81,null,78,83,null,75,null,86,79,null,72,80,null,78]},
      {t:"usual", join:true, l:"Lichess puzzles", v:"1480", sub:"rating", word:"as usual", band:[1460,1500],
        series:[1452,1458,1455,null,1462,1460,1466,1463,1470,null,1468,1474,1471,1477,1475,null,1481,1486,1483,1490,1488,null,1493,1497,1491,1486,1484,1480]}]},
    {t:"list", rows:[["Blocks","warming up · 2 of 5"],["Days not played","6 · 4 too weak, 2 no desire"]]},
    {t:"note", l:"A new game needs a few sessions before its results count. Slow learning is taken out before a dip is called a dip."},
  ]});
