/* The game of the day from start to result: level (play/start), the game as a stand-in (play/game), the result against your
   usual on that level (play/done), and 'Not today' (play/skip). Demo: Arithmetic, Medium, 2 minutes; usual on Medium 16 to
   19 solved; today 14 solved, 1 mistake (as on play/results). */
SCREENS.push({ id:"play/start", area:"Today", status:"idea", title:"Play · before a game",
  sheet:"half",
  why:"One half sheet before the game: what it is, how long, and the level. The person picks the level; it is saved with the result.",
  concept:[
    "<b>The person picks the level;</b> after a few sessions most people settle on one.",
    "<b>The level is logged,</b> so results are compared within a level.",
  ],
  w:[
    {t:"shead", left:"", l:"Arithmetic", right:"×", goRight:"back"},
    {t:"hero", k:"arith"},
    {t:"big", l:"2 minutes of sums", n:"New tasks every time."},
    {t:"seg", items:["Easy","Medium","Hard"], on:"Medium"},
    {t:"note", l:"Choose freely. The level is saved with the result."},
    {t:"btn", l:"Start", go:"play/game"},
    {t:"note", l:"Stop any time. Stopping early is fine."},
  ]});
SCREENS.push({ id:"play/game", area:"Today", status:"idea", title:"Play · the game (stand-in)",
  why:"The game itself, full screen: the time left, the task large in the middle, the answers to tap. Any answer ends the stand-in.",
  concept:[
    "<b>A stand-in for any game;</b> real games run embedded without any browser frame.",
    "<b>× ends the game early</b> and still saves the result.",
  ],
  w:[
    {t:"shead", left:"×", l:"1:12", right:"", goLeft:"play/done"},
    {t:"big", c:true, l:"17 + 8", n:"8 solved"},
    {t:"pills", items:["23","25","26","27"], go:["play/done","play/done","play/done","play/done"]},
  ]});
SCREENS.push({ id:"play/done", area:"Today", status:"idea", title:"Play · result",
  tabs:"idea", tab:"Today",
  why:"A calm result: what was solved, your usual on the same level, the mistakes. One sentence says how it stands; nothing celebrates or scolds.",
  concept:[
    "<b>No score fanfare,</b> no stars, no streak.",
    "<b>The result stands against your usual on the same level.</b>",
  ],
  w:[
    {t:"shead", left:"", l:"", right:"×", goRight:"play/home"},
    {t:"big", l:"Done", n:"Arithmetic · Medium · 2 min"},
    {t:"stats", items:[["14","solved"],["16–19","your usual on Medium"],["1","mistake"]]},
    {t:"note", l:"Lower than your usual today. That is information, not a grade."},
    {t:"btn", l:"Done", go:"play/home"},
    {t:"note", l:"How you played · 4 weeks ›", go:"play/results"},
  ]});
SCREENS.push({ id:"play/skip", area:"Today", status:"idea", title:"Play · not today",
  sheet:"half",
  why:"'Not today' asks one thing, with one tap: what keeps you from playing. The answer is saved like a result.",
  concept:[
    "<b>Too weak and no desire are different data points;</b> one tap, no justification.",
  ],
  w:[
    {t:"shead", left:"", l:"Not today", right:"×", goRight:"back"},
    {t:"big", l:"What keeps you from playing?"},
    {t:"choice", items:[["Too weak today","Even a short game is too much"],["No desire","Could, but do not want to"],["No time",""]], go:["play/home","play/home","play/home"]},
    {t:"note", l:"This is saved too. A day without play says something."},
  ]});
SCREENS.push({ id:"play/nback", area:"Today", status:"idea", title:"Play · dual n-back (stand-in)",
  why:"Dual n-back inside the app, full screen: a 3×3 field with one square lit, the letter you hear, two buttons for a match. Opened from its card on play/home.",
  concept:[
    "<b>A stand-in</b> to show the game inside the app without any browser frame.",
    "<b>The grid is as calm as the cards:</b> soft squares, the lit one only a little lighter.",
    "<b>× ends the game early;</b> both buttons stay on this screen in the stand-in.",
  ],
  w:[
    {t:"shead", left:"×", l:"2-back · 1:48", right:"", goLeft:"play/home"},
    {t:"ngrid", on:4},
    {t:"big", c:true, l:"K", n:"letter you hear"},
    {t:"row", items:[{t:"btn", light:true, l:"Same position", go:"play/nback"}, {t:"btn", light:true, l:"Same letter", go:"play/nback"}]},
    {t:"note", l:"Tap when it matches two steps back."},
  ]});
