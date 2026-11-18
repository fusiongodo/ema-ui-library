/* Step 4 of the trial setup. The physical story comes first (what you need, what the helper does once, what you do then),
   so the question who fills the capsules has something to stand on. `of` names the screen itself: × / "Back to your
   setup" on the helper preview (trials/peek-*) return to where this step already stands in the stack. */
SCREENS.push({ id:"trials/helper", area:"Insights", status:"idea", title:"Trial · 4 Your helper",
  sheet:true, of:"trials/helper",
  why:"Who fills the capsules, after three small pictures of what physically happens. By default the helper opens the fill plan on their own phone (a link or this QR code), so the plan never touches this phone. The same-phone way is a quiet switch behind a helper PIN. 'See what Sam will see' shows Sam's pages and comes back here.",
  concept:[
    "<b>The story before the question:</b> three points in the tone of the intro. What you need (your Magnesium, empty capsules you can't see into, rice flour as a filler, 56 numbered compartments, a pen); what Sam does once (fills them from a plan on Sam's phone, about 20 minutes); what you do then (one capsule a day, number after number, log as usual). Part of this step, not a step of its own, so the setup stays four steps.",
    "<b>Same words as Sam's plan:</b> numbered compartments, one a day. The number tells nothing.",
    "<b>Own phone by default:</b> the safest secret is one that is never on your device. Send a link or let the helper scan the code; it opens the fill plan once (flow 'Trial · helper').",
    "<b>See what Sam will see:</b> a quiet link under the code opens Sam's three pages as a preview (trials/peek-welcome → peek-plan → peek-done, drawn from the helper's own screens) and returns here. The preview shows the plan's form, not the real order.",
    "<b>Same phone, quietly:</b> for people without a helper with a smartphone. The plan then opens only with a helper PIN.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"4 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"Who fills the capsules?", n:"Someone you trust, once, before the start."},
    {t:"tl", ic:["capsule","box","pulse"], rows:[
      ["", "What you need", "Your Magnesium, empty capsules you can't see into, rice flour as a filler, 56 numbered compartments, a pen."],
      ["", "Sam fills them, once", "From a plan on Sam's phone. About 20 minutes."],
      ["", "Then you take one a day", "Number after number, and log as usual. The number tells you nothing."]]},
    {t:"field", l:"Helper", v:"Sam"},
    {t:"qr", l:"Sam scans this", n:"Opens the fill plan on Sam's phone."},
    {t:"note", l:"See what Sam will see ›", go:"trials/peek-welcome"},
    {t:"toggle", l:"Sam uses this phone instead", on:false},
    {t:"note", l:"Then the plan opens only with a helper PIN."},
    {t:"btn", l:"Send Sam the link", go:"trials/review"},
  ]});
