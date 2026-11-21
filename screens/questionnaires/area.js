/* Questionnaires: pick a symptom area. One published questionnaire per area (outcome-measures app model, Entwurf 2).
   Only Fatigue links on in the prototype. */
SCREENS.push({ id:"checkins/q-area", area:"Check-ins", status:"idea", title:"Questionnaires · area",
  sheet:true,
  why:"The area comes first, the questionnaire follows from it, so nobody has to know instrument names.",
  concept:[
    "<b>Source:</b> one questionnaire per area from the outcome-measures app model (decisions/0004, Entwurf 2). Wording placeholder, design later.",
  ],
  w:[
    {t:"shead", left:"", l:"Which area?", right:"×", goRight:"close"},
    {t:"list", rows:[
      ["Fatigue", "›", "", "RAND-36 Vitality"],
      ["Crash after exertion (PEM)", "", "", "DSQ-PEM"],
      ["Thinking and concentration", "", "", "FUNCAP27 Concentration"],
      ["Pain", "", "", "RAND-36 Pain"],
      ["Circulation, standing up", "", "", "FUNCAP27 Upright position"],
      ["Mood", "", "", "RAND-36 Emotional well-being"],
      ["Anxiety", "", "", "GAD-7"],
      ["Daily life", "", "", "RAND-36 Physical functioning"],
      ["Quality of life", "", "", "RAND-36 General health"],
      ["Sleep", "", "", "No questionnaire yet"],
      ["Breathing", "", "", "No questionnaire yet"]],
      go:["checkins/q-freq", null, null, null, null, null, null, null, null, null, null]},
  ]});
