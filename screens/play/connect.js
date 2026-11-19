/* Connecting a game from elsewhere, through the agent (play/connect): a question and tiles, sign-in on their page.
   Only Lichess is drawn through (play/connect-lichess → play/home-connected); the other tiles are placeholders. */
SCREENS.push({ id:"play/connect", area:"Today", status:"idea", title:"Play · connect a game",
  sheet:true,
  why:"The agent asks which game to sign in to, and tiles answer. Each tile names the game and what it measures; a quiet way back to the games in the app stays at the bottom.",
  concept:[
    "<b>The agent asks, tiles answer;</b> no list of links.",
    "<b>Only games that give back a result per session</b> are offered.",
    "<b>The Roblox game is our own;</b> Roblox only ever sees a pairing code, never health data.",
    "<b>Placeholders:</b> only Lichess has its next screen.",
  ],
  w:[
    {t:"shead", left:"", l:"Connect a game", right:"×", goRight:"back"},
    {t:"bud", st:"speaking", l:"Many games work with your evaluation. Which one do you want to sign in to?"},
    {t:"grid2", items:[
      {t:"tile", tone:"white", h:78, l:"Lichess", n:"Chess puzzles", go:"play/connect-lichess"},
      {t:"tile", tone:"white", h:78, l:"Monkeytype", n:"Typing"},
      {t:"tile", tone:"white", h:78, l:"Chess.com", n:"Chess games"},
      {t:"tile", tone:"white", h:78, l:"osu!", n:"Rhythm"},
      {t:"tile", tone:"white", h:78, l:"Our Roblox game", n:"Run and jump"}]},
    {t:"note", l:"You sign in on their website. Too much work? Take a game that is in the app."},
    {t:"chips", items:["Games in the app"], go:["play/home"]},
  ]});
SCREENS.push({ id:"play/connect-lichess", area:"Today", status:"idea", title:"Play · connect Lichess",
  sheet:true,
  why:"What the app may read from Lichess, in three rows, and where it stays. Sign-in happens on Lichess' own page.",
  concept:[
    "<b>Read back with consent:</b> puzzles and games with their time, nothing else.",
    "<b>Sign-in on their page</b> (not drawn); results stay on this phone.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Lichess", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"Read your puzzle and game results?"},
    {t:"list", rows:[["Solved puzzles, with time","✓"],["Games, with time","✓"],["Anything else","never"]]},
    {t:"note", l:"Lichess asks you to sign in on its own page. Results stay on this phone."},
    {t:"btn", l:"Continue to Lichess", go:"play/home-connected"},
  ]});
