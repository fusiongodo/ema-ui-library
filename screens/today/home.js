/* the page, shared with its later states (screens/health/today-briefs.js: one quiet line under the head, another date) */
const TODAY_HOME_HEAD = {t:"head", l:"Good afternoon", greet:true, n:"Tuesday, 3 November", r:"🔔"};
const TODAY_HOME_W = [
  {t:"tile", tone:"lilac", cta:true, h:84, l:"Check-in now", n:"Fatigue · Wellbeing · Pain · Thirst · Brain\u00a0fog", go:"checkins/entry"},
  {t:"row", items:[
    {t:"tile", tone:"white", h:84, l:"Check-ins", n:"2 of 5\nnext 14:20", go:"checkins/overview-next"},
    {t:"tile", tone:"white", h:84, l:"Protocols", n:"As planned\nEvening next", go:"protocols/today-folds"}]},
  {t:"fold", l:"Scores · 7 days", m:"4 scores", go:"today/home-scores-closed", spark:[
    ["Fatigue",   "6", [6,7,5,6,4,5,6]],
    ["Brain fog", "4", [4,5,5,3,4,4,4]],
    ["Pain",      "3", [3,3,2,4,3,3,3]],
    ["Wellbeing", "6", [5,4,6,5,7,6,6]]]},
  {t:"sec", l:"Play", act:"All ›", go:"play/home"},
  {t:"row", items:[
    {t:"tile", tone:"white", h:84, l:"Dual n-back", n:"3 min\nGame of the day", go:"play/home"},
    {t:"tile", tone:"white", h:84, l:"Reaction", n:"1 min", go:"play/home"}]},
];
SCREENS.push({ id:"today/home", area:"Today", status:"idea", title:"Today · widget home",
  tabs:"idea", tab:"Today",
  why:"A calm start: greeting, then the one thing that wants you now ('Check-in now', the only tinted tile), two quiet status tiles that link into their tabs, how the scores moved this week (fixed 0–10 scale, so the curves compare; a fold, open by default, a tap on its heading closes it), and a slot for the cognitive games. MOTS-C lives in the Protocols tile.",
  w:[TODAY_HOME_HEAD, ...TODAY_HOME_W]});
SCREENS.push({ id:"today/home-scores-closed", area:"Today", status:"idea", title:"Today · scores closed",
  tabs:"idea", tab:"Today", of:"today/home",
  why:"The same page with the scores folded away: one heading row. The page gets short; Play and the briefing line fill it over time.",
  concept:[
    "<b>Open by default,</b> so the page does not look empty; the person can close it and it stays closed.",
    "<b>A heading row, not a card:</b> it takes one line when closed and grows with the number of scores when open.",
  ],
  w:[TODAY_HOME_HEAD, ...TODAY_HOME_W.map(w=>w.t === "fold" && w.spark ? {t:"fold", l:w.l, m:w.m, go:"today/home"} : w)]});
