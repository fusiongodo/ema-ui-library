/* Questionnaires: RAND-36 Vitality (public domain), one question per screen, original order.
   Every answer moves on to the next question; the last one to checkins/q-done. */
(()=>{
  const Q = ["Did you feel full of pep?", "Did you have a lot of energy?", "Did you feel worn out?", "Did you feel tired?"];
  const A = ["All of the time","Most of the time","A good bit of the time","Some of the time","A little of the time","None of the time"];
  Q.forEach((q,i)=>{
    const next = i < Q.length-1 ? `checkins/q-${i+2}` : "checkins/q-done";
    SCREENS.push({ id:`checkins/q-${i+1}`, area:"Check-ins", status:"idea", title:`Questionnaires · question ${i+1} of 4`,
      sheet:true,
      why:"One question per screen; a tap on an answer moves on, no extra Next button.",
      w:[
        {t:"shead", left:"‹", l:`Fatigue · ${i+1} of 4`, right:"×", goLeft:"back", goRight:"close"},
        {t:"note", l:"How much of the time during the past 4 weeks …"},
        {t:"big", l:q},
        {t:"list", rows:A.map(a=>[a,""]), go:next},
      ]});
  });
})();
