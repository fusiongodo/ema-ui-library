/* Preview of Sam's last page (see peek-welcome.js), with the way back to the setup. */
SCREENS.push(trialPeek("trials/helper-done", "trials/peek-done", null, {
  why:"Sam's last page, then the way back: 'Back to your setup' returns to the helper step where the preview was opened.",
  concept:[
    "<b>Round trip:</b> helper step → Sam's three pages → back to the helper step, nothing lost.",
  ],
  end:[{t:"btn", l:"Back to your setup", go:"trials/helper"}],
}));
