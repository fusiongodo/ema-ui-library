SCREENS.push({ id:"trials/helper", area:"Insights", status:"idea", title:"Trial · 4 Your helper",
  sheet:true,
  why:"Who fills the capsules. By default the helper opens the fill plan on their own phone (a link or this QR code), so the plan never touches this phone. The same-phone way is a quiet switch behind a helper PIN.",
  concept:[
    "<b>Own phone by default:</b> the safest secret is one that is never on your device. Send a link or let the helper scan the code; it opens the fill plan once (flow 'Trial · helper').",
    "<b>Same phone, quietly:</b> for people without a helper with a smartphone. The plan then opens only with a helper PIN.",
    "<b>Said plainly:</b> you never see the plan. The app keeps the order locked until the end.",
  ],
  w:[
    {t:"shead", left:"‹", l:"Set up a trial", n:"4 of 4", right:"×", goLeft:"back", goRight:"close"},
    {t:"big", l:"Who fills the capsules?", n:"Someone you trust. You will never see their plan."},
    {t:"field", l:"Helper", v:"Sam"},
    {t:"qr", l:"Sam scans this", n:"Opens the fill plan on Sam's phone."},
    {t:"toggle", l:"Sam uses this phone instead", on:false},
    {t:"note", l:"Then the plan opens only with a helper PIN."},
    {t:"spacer"},
    {t:"btn", l:"Send Sam the link", go:"trials/review"},
  ]});
