// MEjority icon lab · tab-insights: Insights tab. Our own drawing; the reference only names the idea.
export default {
  id: "tab-insights", order: 4, kind: "tab",
  title: "Insights tab", meaning: "What the data shows over time.",
  area: "insights",
  ref: "refs/tab-insights.png", refNote: "Three thin bars, the trends button on Symptoms",
  variants: [
    { key: "A", name: "Plump",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g fill="currentColor" stroke="none"><rect x="5.5" y="27" width="10" height="15" rx="4.6"/><rect x="19" y="17.5" width="10" height="24.5" rx="4.6"/><rect x="32.5" y="7" width="10" height="35" rx="4.6"/></g></svg>`,
      note: "Three fat, fully rounded bars stepping up." },
    { key: "B", name: "Cut-out",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path fill="currentColor" stroke="none" fill-rule="evenodd" d="M15.5 5h17A10.5 10.5 0 0 1 43 15.5v17A10.5 10.5 0 0 1 32.5 43h-17A10.5 10.5 0 0 1 5 32.5v-17A10.5 10.5 0 0 1 15.5 5zM15 25a2.7 2.7 0 0 1 2.7 2.7v4.2a2.7 2.7 0 0 1-5.4 0v-4.2a2.7 2.7 0 0 1 2.7-2.7zM24 18.5a2.7 2.7 0 0 1 2.7 2.7v10.7a2.7 2.7 0 0 1-5.4 0v-10.7a2.7 2.7 0 0 1 2.7-2.7zM33 12a2.7 2.7 0 0 1 2.7 2.7v17.2a2.7 2.7 0 0 1-5.4 0v-17.2a2.7 2.7 0 0 1 2.7-2.7z"/></svg>`,
      note: "A solid soft square with the three bars cut out of it." },
    { key: "C", name: "Two weights",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g fill="currentColor" stroke="none"><rect x="5.5" y="27" width="10" height="15" rx="4.6" fill-opacity="0.34"/><rect x="19" y="17.5" width="10" height="24.5" rx="4.6" fill-opacity="0.34"/><rect x="32.5" y="7" width="10" height="35" rx="4.6"/></g></svg>`,
      note: "The same bars, two of them pale and one solid: the one that stands out is the insight." },
    { key: "D", name: "Line",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><g stroke-width="3.6"><path d="M6 40.2h36"/><path d="M7.5 29.5l8.7-8.2 8 6.4L38.8 11.5"/></g></svg>`,
      note: "The same rise as one stroke over a baseline." },
    { key: "E", name: "Finding",
      svg: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 39.5c9.5 0 9-13 17-13 5.5 0 6 4.5 10.5 4.5 4 0 6.5-4.5 9.5-9.5" stroke-width="4.4"/><path d="M14 4.8q1.2 7.4 8.6 8.6-7.4 1.2-8.6 8.6-1.2-7.4-8.6-8.6 7.4-1.2 8.6-8.6z" fill="currentColor" stroke-width="1.4"/></svg>`,
      note: "Another motif: a curve with a small spark above it, a pattern found (our Cozy 'finding' sign, redrawn)." },
  ]
};
