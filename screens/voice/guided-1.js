SCREENS.push({ id:"voice/guided-1", area:"Voice", status:"idea", title:"Guided · 1 Energy",
  sheet:"half",
  after:[5200, "voice/guided-2"],
  why:"'Ask me instead': the agent asks, one question at a time, and reads it aloud. Below it the answer it heard as a line of transcript and the value it recognised, already on the check-in slider (correct it with a tap). Then the next question.",
  concept:[
    "<b>Conversation only when needed:</b> the default is to just speak (voice/listen); this mode is for days when a blank start is too much.",
    "<b>Eyes-closed mode:</b> the app reads every question and the summary aloud, so the whole check-in works without looking.",
    "<b>All five scores, one short question each</b> (Fatigue / energy, Overall wellbeing, Brain fog, Pain, Thirst): about half a minute in all, a short answer is enough ('about the same', 'not really').",
    "<b>Prototype:</b> moves on by itself after the answer; a tap moves on at once. With reduced motion only the tap. A tap on the dimmed page above closes the layer."
  ],
  w:[
    {t:"bud", st:"speaking", l:"How is your energy right now?"},
    {t:"say", l:"Pretty wiped today.", live:true, d:1300},
    {t:"slider", l:"Fatigue / energy", v:6, set:7, min:0, max:10, lo:"0", hi:"10", better:"low"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["1 of 5","×"], go:[null,"close"]},
  ]});
