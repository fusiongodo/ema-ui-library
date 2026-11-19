/* Today with one quiet line (brief) under the greeting: three states of today/home (its widgets: TODAY_HOME_HEAD,
   TODAY_HOME_W in screens/today/home.js). Only the line and, for the trial states, the date differ. */
const TODAY_BRIEF_CONCEPT = [
  "<b>Today is the reception</b> (PRINCIPLES 11): what a good assistant would tell you, one line at a time, and nothing when nothing is due.",
  "<b>The line is white,</b> can be swiped away or opened; it is a pacing hint or a piece of information, never praise and never 'try harder'.",
  "<b>While the person keeps to the trial, the trial stays silent;</b> a milestone may speak.",
];
SCREENS.push({ id:"today/home-health", area:"Today", status:"idea", title:"Today · more active than usual",
  tabs:"idea", tab:"Today", of:"today/home", tabto:HEALTH_TABTO,
  why:"Today as it is, with one quiet line under the greeting: more steps than your usual by early afternoon. A pacing hint, not praise; it opens Steps.",
  concept: TODAY_BRIEF_CONCEPT,
  w:[TODAY_HOME_HEAD,
    {t:"brief", l:"More active than your usual today", n:"2,100 steps by 14:00. Your usual is 1,100 to 1,700 a day.", go:"health/steps"},
    ...TODAY_HOME_W.map(w=>w.t !== "row" ? w : {...w, items:w.items.map(i=>i.go === "checkins/overview-next" ? {...i, go:"checkins/overview-health"} : i)})]});   // Check-ins tile → the state with Apple Health
SCREENS.push({ id:"today/home-trial-nudge", area:"Today", status:"idea", title:"Today · about your trial",
  tabs:"idea", tab:"Today", of:"today/home", tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},
  why:"During the trial, one line when something affects the result: two evening check-ins were missed this week. A piece of information, not a reproach; it opens the trial.",
  concept: TODAY_BRIEF_CONCEPT,
  w:[{...TODAY_HOME_HEAD, n:"Friday, 27 November"},
    {t:"brief", l:"About your trial", n:"2 evening check-ins were missed this week. Each one makes the result clearer.", go:"trials/running"},
    ...TODAY_HOME_W]});
SCREENS.push({ id:"today/home-trial-week", area:"Today", status:"idea", title:"Today · trial milestone",
  tabs:"idea", tab:"Today", of:"today/home", tabto:{Protocols:"protocols/today-folds-trial", Insights:"insights/home-trial"},
  why:"A milestone may speak: week 2 of the trial is done. One line with what was kept, no praise; it opens the trial.",
  concept: TODAY_BRIEF_CONCEPT,
  w:[{...TODAY_HOME_HEAD, n:"Monday, 23 November"},
    {t:"brief", l:"Week 2 of your trial is done", n:"13 of 14 capsules, every check-in. 7 weeks to go.", go:"trials/running"},
    ...TODAY_HOME_W]});
