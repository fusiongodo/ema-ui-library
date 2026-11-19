/* Play (idea): short games that double as cognitive measures. Three sources: games inside the app, connected games from
   elsewhere (results read back with consent), our own Roblox game. Every result stands against the person's own usual,
   never as a grade; the person chooses the level freely and it is saved with the result; new games warm up first; tasks
   are generated anew every time; not playing is a data point too. Our own game names are generic ("Slingshot", "Blocks");
   third-party names appear only as labels of what can be connected. Opened from the Play section on Today. */
const PLAY_CONCEPT = [
  "<b>One game of the day,</b> the rest is free choice.",
  "<b>Each game says in one word</b> what it mainly asks of you (speed, working memory, planning …).",
  "<b>'Not today' is an answer, not a failure</b> (play/skip).",
  "<b>Connecting runs through the agent</b> (play/connect): a question and tiles, not a list of links.",
];
const PLAY_HOME_W = [
  {t:"shead", left:"‹", l:"Play", right:"", goLeft:"back"},
  {t:"note", l:"Stay within your limit. Stopping early is fine."},
  {t:"sec", l:"Today"},
  {t:"tile", tone:"white", l:"Arithmetic", r:"2 min", n:"Game of the day · Medium", chips:["Play","Not today"], go:["play/start","play/skip"]},
  {t:"sec", l:"In the app"},
  {t:"grid2", items:[
    {t:"tile", tone:"white", h:78, l:"Reaction", n:"1 min · speed"},
    {t:"tile", tone:"white", h:78, l:"Dual n-back", n:"3 min · working memory"},
    {t:"tile", tone:"white", h:78, l:"Symbol search", n:"1 min · speed"},
    {t:"tile", tone:"white", h:78, l:"Word flow", n:"1 min · spoken · association"},
    {t:"tile", tone:"white", h:78, l:"Blocks", n:"3 min · planning"},
    {t:"tile", tone:"white", h:78, l:"Slingshot", n:"3 min · aiming"}]},
  {t:"sec", l:"Connected", act:"+ Connect", go:"play/connect"},
  {t:"note", l:"Nothing connected yet. Chess, typing or our Roblox game can count too."},
  {t:"list", rows:[["How you played · 4 weeks","›"]], go:"play/results"},
];
SCREENS.push({ id:"play/home", area:"Today", status:"idea", title:"Play",
  tabs:"idea", tab:"Today",
  why:"Short games that double as cognitive measures: one game of the day on top, the games in the app below, connected games from elsewhere under them. Every result is shown against your own usual, never as a grade.",
  concept: [...PLAY_CONCEPT,
    "<b>Placeholders:</b> only Arithmetic (the game of the day) is drawn through; the other game tiles have no screen yet."],
  w: PLAY_HOME_W });
SCREENS.push({ id:"play/home-connected", area:"Today", status:"idea", title:"Play · Lichess connected",
  tabs:"idea", tab:"Today", of:"play/home",
  why:"After connecting Lichess: its puzzles stand under 'Connected' like a game in the app, with today's result against your usual.",
  concept:[
    "<b>A connected game reads like one in the app:</b> what was played today and how it stands against your usual.",
  ],
  w: PLAY_HOME_W.map(w=>w.t === "note" && /^Nothing connected/.test(w.l)
    ? {t:"tile", tone:"white", l:"Lichess puzzles", r:"connected", n:"3 puzzles today · rating 1480 · as usual"} : w) });
