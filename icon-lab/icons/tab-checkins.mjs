// MEjority icon lab · tab-checkins: Check-ins tab. Our own drawing; the reference only names the idea.
export default {
  id: "tab-checkins", order: 2, kind: "tab",
  title: "Check-ins tab", meaning: "How you are doing: symptom check-ins and scores.",
  area: "checkins",
  ref: "refs/tab-checkins.png", refNote: "Angular pulse line, tab bar",
  variants: [
    { key: "A", name: "Plump",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 27.7h6c4.4 0 3.8-16.5 7.8-16.5 4.6 0 4.2 25.5 8.4 25.5 3.2 0 2.8-9 6.4-9H41" stroke-width="6.4"/></svg>`,
      note: "One calm beat as a fat, rounded wave: no sharp corners." },
    { key: "B", name: "Cut-out",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><mask id="tab-checkins-B-m" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48"><rect width="48" height="48" fill="#fff" stroke="none"/><path d="M12.5 22.8h4.2c3 0 2.6-7.6 5.2-7.6 3.2 0 2.8 13.4 5.8 13.4 2.4 0 2.1-5.8 4.8-5.8h3" stroke="#000" stroke-width="3.8"/></mask><path d="M24 41.5S5.5 31.5 5.5 18.6C5.5 12.6 10.2 8 16 8c3.2 0 6.1 1.5 8 3.9C25.9 9.5 28.8 8 32 8c5.8 0 10.5 4.6 10.5 10.6C42.5 31.5 24 41.5 24 41.5z" fill="currentColor" stroke-width="1.6" mask="url(#tab-checkins-B-m)"/></svg>`,
      note: "A full heart with the soft beat cut out of it." },
    { key: "C", name: "Two weights",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M24 39.8S7.5 30.6 7.5 18.9c0-5.3 4.1-9.3 9.1-9.3 3 0 5.7 1.5 7.4 3.8 1.7-2.3 4.4-3.8 7.4-3.8 5 0 9.1 4 9.1 9.3C40.5 30.6 24 39.8 24 39.8z" stroke-width="4.2" fill="currentColor" fill-opacity=".18"/><path d="M14.5 22.6h3.3c2.4 0 2.1-6 4.2-6 2.6 0 2.3 10.8 4.7 10.8 2 0 1.7-4.8 3.9-4.8h2.9" stroke-width="2.8"/></svg>`,
      note: "Heart in a heavy outline with a soft tint, the beat inside in a lighter stroke (today's Cozy glyph, refined)." },
    { key: "D", name: "Line",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 27.7h7.5c4.4 0 4-16.5 8-16.5 4.6 0 4.4 25.5 8.6 25.5 3.2 0 3-9 6.6-9H43" stroke-width="3.6"/></svg>`,
      note: "The same calm beat as one thin stroke." },
    { key: "E", name: "Heart check",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><mask id="tab-checkins-E-m" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48"><rect width="48" height="48" fill="#fff" stroke="none"/><path d="M15.8 22.6l5.8 5.8 10.8-11.4" stroke="#000" stroke-width="4.2"/></mask><path d="M24 41.5S5.5 31.5 5.5 18.6C5.5 12.6 10.2 8 16 8c3.2 0 6.1 1.5 8 3.9C25.9 9.5 28.8 8 32 8c5.8 0 10.5 4.6 10.5 10.6C42.5 31.5 24 41.5 24 41.5z" fill="currentColor" stroke-width="1.6" mask="url(#tab-checkins-E-m)"/></svg>`,
      note: "Another motif: checking in, literally: a heart with a tick." },
  ]
};
