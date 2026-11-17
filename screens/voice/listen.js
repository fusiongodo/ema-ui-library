SCREENS.push({ id:"voice/listen", area:"Voice", status:"idea", title:"Listening layer · hears you",
  sheet:"half",
  after:[3600, "voice/drafts"],
  why:"The mic in the tab bar opens this half-height layer over the page you are on; the page stays visible, dimmed, so you never lose your place. It starts listening at once: no greeting, no question. The companion listens with closed eyes, one line of transcript builds up as you speak. Speak first, a conversation only when needed. Supersedes voice/voice.",
  concept:[
    "<b>Speak first, talk only if needed.</b> Say anything in any order; when you pause, the agent shows what it understood as drafts (voice/drafts). 'Ask me instead' switches to one question at a time (voice/guided-1).",
    "<b>One agent, two doors.</b> Global (this mic): works out what you mean and shows draft cards here. Local ('🎙 Say it' inside a form): fills that form directly, without this layer.",
    "<b>The result is always the manual overview:</b> every draft opens the same card or sheet the manual way ends in, filled in and marked 'heard'.",
    "<b>Nothing is saved without confirmation</b> (PRINCIPLES 5).",
    "<b>Prototype:</b> moves on to the drafts after a few seconds; a tap moves on at once. With reduced motion only the tap."
  ],
  w:[
    {t:"spacer"},
    {t:"bud", st:"listening"},
    {t:"say", l:"pretty wiped today, head like cotton wool…", live:true},
    {t:"note", l:"Listening · just pause when you're done"},
    {t:"spacer"},
    {t:"chips", quiet:true, items:["Ask me instead","×"], go:["voice/guided-1","close"]},
  ]});
