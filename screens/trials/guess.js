/* The blind check, once, at the end: a short step before the result is revealed (from insights/home-result).
   Not weekly any more: asking every week "what do you think you took?" makes the person watch themselves for an effect,
   which can feed expectation. Trials usually ask for the guess once, at the end. Demo answer: "No idea". */
SCREENS.push({ id:"trials/guess", area:"Insights", status:"idea", title:"Trial · the guess before the result",
  sheet:"half",
  why:"The result is ready, but first one question: could you tell when you were on Magnesium? Three equal answers, any of them opens the result. A moment of suspense, not a questionnaire.",
  concept:[
    "<b>Once, at the end:</b> a weekly question would make the person watch for an effect while the trial runs. At the end it costs nothing and still shows whether the secret held.",
    "<b>Before the reveal:</b> after seeing the result, nobody can guess honestly any more.",
    "<b>Three equal answers,</b> none preselected or highlighted: 'Yes, most of the time', 'Sometimes', 'No idea'. 'No idea' is a full answer; it is what a good blind feels like.",
    "<b>Not a test of the person:</b> being able to tell is not a failure; it may mean the substance did something noticeable. The result says which reading fits.",
  ],
  w:[
    {t:"shead", left:"", l:"Before you see it", right:"×", goRight:"close"},
    {t:"big", l:"Could you tell when you were on Magnesium?", n:"Your answer goes next to the result. It changes nothing."},
    {t:"list", rows:[["Yes, most of the time",""],["Sometimes",""],["No idea",""]], go:"trials/result"},
  ]});
